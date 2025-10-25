const express = require('express');
const router = express.Router();
const weatherService = require('../services/weather.service');

// Get current weather
router.get('/current', async (req, res, next) => {
  try {
    const { location } = req.query;
    const weather = await weatherService.getCurrentWeather(location);
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

// Get weather forecast for a specific date
router.get('/forecast', async (req, res, next) => {
  try {
    const { location, date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    
    const forecast = await weatherService.getForecast(location, date);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
