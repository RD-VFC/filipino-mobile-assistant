const express = require('express');
const router = express.Router();

const geminiRoutes = require('./gemini.routes');
const taskRoutes = require('./task.routes');
const weatherRoutes = require('./weather.routes');
const trafficRoutes = require('./traffic.routes');
const profileRoutes = require('./profile.routes');
const voiceRoutes = require('./voice.routes');

// Mount routes
router.use('/gemini', geminiRoutes);
router.use('/tasks', taskRoutes);
router.use('/weather', weatherRoutes);
router.use('/traffic', trafficRoutes);
router.use('/profile', profileRoutes);
router.use('/voice', voiceRoutes);

module.exports = router;
