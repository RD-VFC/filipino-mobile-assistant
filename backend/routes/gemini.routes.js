const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini.service');

// Parse voice input into structured task
router.post('/parse-task', async (req, res, next) => {
  try {
    const { transcript, userProfile, userLocation } = req.body;
    
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const taskData = await geminiService.parseVoiceInput(
      transcript,
      userProfile || {},
      userLocation || 'Quezon City'
    );
    res.json(taskData);
  } catch (error) {
    next(error);
  }
});

// Generate recommendation for a task
router.post('/recommendation', async (req, res, next) => {
  try {
    const { task, weather, traffic, userProfile } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task data is required' });
    }

    const recommendation = await geminiService.generateRecommendation(
      task,
      weather,
      traffic,
      userProfile || {}
    );
    res.json({ recommendation });
  } catch (error) {
    next(error);
  }
});

// Explain task priority
router.post('/explain-priority', async (req, res, next) => {
  try {
    const { task, priority_score, conflicts, userProfile } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task data is required' });
    }

    const explanation = await geminiService.explainPriority(
      task,
      priority_score,
      conflicts,
      userProfile || {}
    );
    res.json({ explanation });
  } catch (error) {
    next(error);
  }
});

// Generate notification message
router.post('/notification', async (req, res, next) => {
  try {
    const { task, days_until, weather, traffic, userProfile } = req.body;
    
    if (!task) {
      return res.status(400).json({ error: 'Task data is required' });
    }

    const notification = await geminiService.generateNotification(
      task,
      days_until,
      weather,
      traffic,
      userProfile || {}
    );
    res.json(notification);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
