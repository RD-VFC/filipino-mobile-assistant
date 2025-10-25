import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Gemini AI endpoints
  async parseVoiceInput(transcript) {
    const response = await this.client.post('/gemini/parse-task', { transcript });
    return response.data;
  }

  async generateRecommendation(task, weather, traffic) {
    const response = await this.client.post('/gemini/recommendation', {
      task,
      weather,
      traffic,
    });
    return response.data;
  }

  async explainPriority(task, priority_score, conflicts = []) {
    const response = await this.client.post('/gemini/explain-priority', {
      task,
      priority_score,
      conflicts,
    });
    return response.data;
  }

  async generateNotification(task, days_until, weather, traffic) {
    const response = await this.client.post('/gemini/notification', {
      task,
      days_until,
      weather,
      traffic,
    });
    return response.data;
  }

  // Weather endpoints
  async getCurrentWeather(location = 'Quezon City,PH') {
    const response = await this.client.get('/weather/current', {
      params: { location },
    });
    return response.data;
  }

  async getWeatherForecast(location, date) {
    const response = await this.client.get('/weather/forecast', {
      params: { location, date },
    });
    return response.data;
  }

  // Traffic endpoints
  async getTrafficByLocation(location = 'Quezon City, Manila') {
    const response = await this.client.get('/traffic/location', {
      params: { location },
    });
    return response.data;
  }

  // Task endpoints
  async getTasks(userId) {
    const response = await this.client.get('/tasks', {
      params: { userId },
    });
    return response.data;
  }

  async getTask(id) {
    const response = await this.client.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(taskData) {
    const response = await this.client.post('/tasks', taskData);
    return response.data;
  }

  async updateTask(id, updates) {
    const response = await this.client.put(`/tasks/${id}`, updates);
    return response.data;
  }

  async deleteTask(id) {
    const response = await this.client.delete(`/tasks/${id}`);
    return response.data;
  }

  async getPriorityTasks(userId) {
    const response = await this.client.get('/tasks/priority/high', {
      params: { userId },
    });
    return response.data;
  }

  async markTaskComplete(id) {
    const response = await this.client.patch(`/tasks/${id}/complete`);
    return response.data;
  }
}

export default new ApiService();
