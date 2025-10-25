const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * GET /api/profile
 * Get user profile for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    // Get user from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile from database
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist yet
        return res.json({ exists: false, user_id: user.id });
      }
      throw error;
    }

    res.json({ exists: true, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/profile
 * Create or update user profile
 */
router.put('/', async (req, res) => {
  try {
    // Get user from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Validate required fields
    const { age, gender, location } = req.body;
    if (!age || !gender || !location) {
      return res.status(400).json({ error: 'Missing required fields: age, gender, location' });
    }

    // Validate age
    if (age < 13 || age > 120) {
      return res.status(400).json({ error: 'Age must be between 13 and 120' });
    }

    // Validate gender
    const validGenders = ['male', 'female', 'non-binary', 'prefer-not-to-say'];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender value' });
    }

    // Validate mobility level if provided
    if (req.body.mobility_level) {
      const validMobility = ['independent', 'needs-assistance', 'wheelchair', 'limited-mobility'];
      if (!validMobility.includes(req.body.mobility_level)) {
        return res.status(400).json({ error: 'Invalid mobility_level value' });
      }
    }

    // Prepare profile data
    const profileData = {
      user_id: user.id,
      age,
      gender,
      location,
      health_conditions: req.body.health_conditions || [],
      medications: req.body.medications || [],
      mobility_level: req.body.mobility_level || 'independent',
      preferred_language: req.body.preferred_language || 'taglish',
      emergency_contact_name: req.body.emergency_contact_name || null,
      emergency_contact_phone: req.body.emergency_contact_phone || null,
      has_pwd_id: req.body.has_pwd_id || false,
      has_senior_id: req.body.has_senior_id || false,
      preferred_transport: req.body.preferred_transport || null
    };

    // Upsert profile (insert or update)
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ success: true, profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/profile
 * Delete user profile (soft delete by setting active = false)
 */
router.delete('/', async (req, res) => {
  try {
    // Get user from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Delete profile
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    res.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
