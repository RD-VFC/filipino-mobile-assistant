const axios = require('axios');
const NodeCache = require('node-cache');

// Cache traffic data for 15 minutes
const trafficCache = new NodeCache({ stdTTL: 900 });

class TrafficService {
  constructor() {
    this.apiKey = process.env.TOMTOM_API_KEY;
    this.baseUrl = 'https://api.tomtom.com/traffic/services/4';
  }

  /**
   * Get traffic information between two points
   * @param {Object} origin - {lat, lon}
   * @param {Object} destination - {lat, lon}
   * @returns {Object} Traffic data
   */
  async getTrafficInfo(origin, destination) {
    const cacheKey = `traffic_${origin.lat}_${origin.lon}_${destination.lat}_${destination.lon}`;
    const cached = trafficCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // TomTom Traffic Flow API
      const response = await axios.get(
        `${this.baseUrl}/flowSegmentData/absolute/10/json`,
        {
          params: {
            key: this.apiKey,
            point: `${destination.lat},${destination.lon}`
          }
        }
      );

      const data = response.data.flowSegmentData;
      
      const trafficData = {
        delay_minutes: this.calculateDelay(data.currentSpeed, data.freeFlowSpeed),
        congestion_level: this.getCongestionLevel(data.currentSpeed, data.freeFlowSpeed),
        current_speed: data.currentSpeed,
        free_flow_speed: data.freeFlowSpeed,
        confidence: data.confidence,
        alternative_routes: this.getAlternativeRoutes(origin, destination)
      };

      trafficCache.set(cacheKey, trafficData);
      return trafficData;
    } catch (error) {
      console.error('Traffic API error:', error.message);
      return this.getFallbackTraffic();
    }
  }

  /**
   * Get traffic based on location name
   * @param {string} location - Location name
   * @returns {Object} Traffic data
   */
  async getTrafficByLocation(location = 'Quezon City, Manila') {
    const cacheKey = `traffic_location_${location}`;
    const cached = trafficCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // For demo purposes, use typical Manila traffic patterns
      const hour = new Date().getHours();
      const trafficData = this.getTrafficByTimeOfDay(hour, location);
      
      trafficCache.set(cacheKey, trafficData);
      return trafficData;
    } catch (error) {
      console.error('Traffic location error:', error.message);
      return this.getFallbackTraffic();
    }
  }

  /**
   * Estimate traffic based on time of day (Manila patterns)
   * @param {number} hour - Hour of day (0-23)
   * @param {string} location - Location name
   * @returns {Object} Traffic estimate
   */
  getTrafficByTimeOfDay(hour, location) {
    // Manila rush hour patterns
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    const isMidRushHour = (hour >= 11 && hour <= 16);
    
    if (isRushHour) {
      return {
        delay_minutes: 45,
        congestion_level: 'severe',
        current_speed: 15,
        free_flow_speed: 60,
        confidence: 0.85,
        alternative_routes: ['C5', 'Ortigas Avenue', 'SLEX'],
        location: location
      };
    } else if (isMidRushHour) {
      return {
        delay_minutes: 20,
        congestion_level: 'medium',
        current_speed: 35,
        free_flow_speed: 60,
        confidence: 0.80,
        alternative_routes: ['C5', 'Ortigas Avenue'],
        location: location
      };
    } else {
      return {
        delay_minutes: 5,
        congestion_level: 'low',
        current_speed: 50,
        free_flow_speed: 60,
        confidence: 0.90,
        alternative_routes: [],
        location: location
      };
    }
  }

  calculateDelay(currentSpeed, freeFlowSpeed) {
    if (!currentSpeed || !freeFlowSpeed) return 0;
    
    // Estimate delay based on speed difference
    const speedRatio = currentSpeed / freeFlowSpeed;
    
    if (speedRatio > 0.8) return 5;
    if (speedRatio > 0.6) return 15;
    if (speedRatio > 0.4) return 30;
    return 45;
  }

  getCongestionLevel(currentSpeed, freeFlowSpeed) {
    if (!currentSpeed || !freeFlowSpeed) return 'low';
    
    const speedRatio = currentSpeed / freeFlowSpeed;
    
    if (speedRatio > 0.8) return 'low';
    if (speedRatio > 0.6) return 'medium';
    if (speedRatio > 0.4) return 'high';
    return 'severe';
  }

  getAlternativeRoutes(origin, destination) {
    // Common Manila alternative routes
    return ['C5', 'Ortigas Avenue', 'EDSA', 'Commonwealth Avenue'];
  }

  getFallbackTraffic() {
    // Fallback when API fails - assume moderate traffic
    const hour = new Date().getHours();
    return this.getTrafficByTimeOfDay(hour, 'Metro Manila');
  }
}

module.exports = new TrafficService();
