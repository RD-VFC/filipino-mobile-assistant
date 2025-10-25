const axios = require('axios');
const NodeCache = require('node-cache');

// Cache weather data for 30 minutes
const weatherCache = new NodeCache({ stdTTL: 1800 });

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  /**
   * Get current weather for a location
   * @param {string} location - City name or coordinates
   * @returns {Object} Weather data
   */
  async getCurrentWeather(location = 'Quezon City,PH') {
    const cacheKey = `weather_${location}`;
    const cached = weatherCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      const weatherData = {
        condition: data.weather[0].main.toLowerCase(),
        description: data.weather[0].description,
        temperature: data.main.temp,
        rain_chance: this.getRainChance(data),
        wind_speed: data.wind.speed,
        humidity: data.main.humidity,
        location: data.name
      };

      weatherCache.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error.message);
      return this.getFallbackWeather();
    }
  }

  /**
   * Get weather forecast for a specific date
   * @param {string} location - City name
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Object} Weather forecast
   */
  async getForecast(location = 'Quezon City,PH', date) {
    const cacheKey = `forecast_${location}_${date}`;
    const cached = weatherCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      // Find forecast closest to the target date
      const targetDate = new Date(date);
      const forecasts = response.data.list;
      
      let closestForecast = forecasts[0];
      let minDiff = Math.abs(new Date(forecasts[0].dt * 1000) - targetDate);

      for (const forecast of forecasts) {
        const forecastDate = new Date(forecast.dt * 1000);
        const diff = Math.abs(forecastDate - targetDate);
        
        if (diff < minDiff) {
          minDiff = diff;
          closestForecast = forecast;
        }
      }

      const weatherData = {
        condition: closestForecast.weather[0].main.toLowerCase(),
        description: closestForecast.weather[0].description,
        temperature: closestForecast.main.temp,
        rain_chance: this.getRainChanceFromForecast(closestForecast),
        wind_speed: closestForecast.wind.speed,
        humidity: closestForecast.main.humidity,
        date: date,
        location: location
      };

      weatherCache.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather forecast API error:', error.message);
      return this.getFallbackWeather();
    }
  }

  getRainChance(data) {
    // Estimate rain chance based on weather condition
    const condition = data.weather[0].main.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return data.rain?.['1h'] ? Math.min(data.rain['1h'] * 10, 100) : 70;
    }
    if (condition.includes('thunderstorm')) {
      return 90;
    }
    if (condition.includes('cloud')) {
      return 30;
    }
    return 10;
  }

  getRainChanceFromForecast(forecast) {
    const condition = forecast.weather[0].main.toLowerCase();
    const pop = forecast.pop ? forecast.pop * 100 : 0; // Probability of precipitation
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return Math.max(pop, 70);
    }
    if (condition.includes('thunderstorm')) {
      return Math.max(pop, 90);
    }
    return pop;
  }

  getFallbackWeather() {
    // Fallback weather when API fails
    return {
      condition: 'unknown',
      description: 'Weather data unavailable',
      temperature: 28,
      rain_chance: 30, // Assume moderate chance during rainy season
      wind_speed: 5,
      humidity: 70,
      location: 'Quezon City'
    };
  }
}

module.exports = new WeatherService();
