const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const weatherService = require('../services/weather.service');
const trafficService = require('../services/traffic.service');
const geminiService = require('../services/gemini.service');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Get all tasks for a user
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Get task by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Create a new task
router.post('/', async (req, res, next) => {
  try {
    const taskData = req.body;

    // Calculate priority score
    const priorityScore = calculatePriorityScore(taskData);

    // Get weather and traffic data
    const weather = await weatherService.getForecast(
      taskData.location || 'Quezon City,PH',
      taskData.due_date
    );

    const traffic = await trafficService.getTrafficByLocation(
      taskData.location || 'Quezon City, Manila'
    );

    // Generate recommendation
    const recommendation = await geminiService.generateRecommendation(
      taskData,
      weather,
      traffic
    );

    // Insert task
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        priority_score: priorityScore,
        weather_data: weather,
        traffic_data: traffic,
        recommendation: recommendation
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

// Update a task
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Recalculate priority if relevant fields changed
    if (updates.due_date || updates.category) {
      updates.priority_score = calculatePriorityScore(updates);
    }

    // Update timestamp
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get priority tasks (score > 70)
router.get('/priority/high', async (req, res, next) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .gt('priority_score', 70)
      .eq('is_completed', false)
      .order('priority_score', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Mark task as complete
router.patch('/:id/complete', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        is_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * Calculate priority score for a task
 * @param {Object} task - Task data
 * @returns {number} Priority score (0-100)
 */
function calculatePriorityScore(task) {
  let score = 0;

  // Time urgency (0-50 points)
  const daysUntil = getDaysUntil(task.due_date);
  if (daysUntil < 1) score += 50;
  else if (daysUntil <= 3) score += 35;
  else if (daysUntil <= 7) score += 20;
  else score += 10;

  // Task type importance (0-30 points)
  const typeScores = {
    bill: 30,
    benefit: 25,
    appointment: 20,
    reminder: 10,
    other: 5
  };
  score += typeScores[task.category] || 5;

  // Weather impact (0-10 points)
  if (task.weather_data) {
    const rainChance = task.weather_data.rain_chance || 0;
    if (rainChance > 70) score += 10;
    else if (rainChance > 40) score += 5;
  }

  // Traffic impact (0-10 points)
  if (task.traffic_data) {
    const delay = task.traffic_data.delay_minutes || 0;
    if (delay > 30) score += 10;
    else if (delay > 15) score += 5;
  }

  return Math.min(score, 100);
}

function getDaysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

module.exports = router;
