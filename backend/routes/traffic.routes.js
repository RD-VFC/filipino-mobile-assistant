const express = require('express');
const router = express.Router();
const trafficService = require('../services/traffic.service');

// Get traffic info by coordinates
router.get('/route', async (req, res, next) => {
  try {
    const { originLat, originLon, destLat, destLon } = req.query;
    
    if (!originLat || !originLon || !destLat || !destLon) {
      return res.status(400).json({ 
        error: 'Origin and destination coordinates required' 
      });
    }
    
    const origin = { lat: parseFloat(originLat), lon: parseFloat(originLon) };
    const destination = { lat: parseFloat(destLat), lon: parseFloat(destLon) };
    
    const traffic = await trafficService.getTrafficInfo(origin, destination);
    res.json(traffic);
  } catch (error) {
    next(error);
  }
});

// Get traffic info by location name
router.get('/location', async (req, res, next) => {
  try {
    const { location } = req.query;
    const traffic = await trafficService.getTrafficByLocation(location);
    res.json(traffic);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
