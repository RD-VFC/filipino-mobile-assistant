# Mobile Assistant Backend API

Filipino Mobile Daily Assistant - Backend API built with Node.js, Express, Google Gemini AI, and Supabase.

## Features

- ✅ Voice input parsing with Gemini AI
- ✅ Smart task recommendations (weather + traffic aware)
- ✅ Priority scoring algorithm
- ✅ Real-time weather forecasts (OpenWeatherMap)
- ✅ Traffic data integration (TomTom API)
- ✅ Supabase database with Row Level Security
- ✅ Automatic notification generation
- ✅ 30-minute caching for weather/traffic data

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **AI:** Google Gemini 2.0 Flash (FREE tier)
- **Database:** Supabase (PostgreSQL)
- **APIs:** OpenWeatherMap, TomTom Traffic
- **Caching:** node-cache

## Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required API keys:
- **Gemini API:** Get from [Google AI Studio](https://makersuite.google.com/app/apikey) - FREE
- **OpenWeather API:** Get from [OpenWeatherMap](https://openweathermap.org/api) - FREE tier
- **TomTom API:** Get from [TomTom Developer](https://developer.tomtom.com/) - FREE tier
- **Supabase:** Create project at [supabase.com](https://supabase.com)

### 3. Setup Supabase Database

1. Create a new Supabase project
2. Go to SQL Editor
3. Run the `supabase-schema.sql` file
4. Copy your project URL and anon key to `.env`

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Gemini AI Endpoints

#### Parse Voice Input
```http
POST /api/gemini/parse-task
Content-Type: application/json

{
  "transcript": "Remind me to pay electricity bill on October 30"
}
```

Response:
```json
{
  "task": "Pay electricity bill",
  "date": "2025-10-30",
  "time": null,
  "category": "bill",
  "location": null,
  "confidence": 0.95
}
```

#### Generate Recommendation
```http
POST /api/gemini/recommendation
Content-Type: application/json

{
  "task": {
    "title": "Pay Meralco bill",
    "due_date": "2025-10-30",
    "category": "bill",
    "location": "Meralco Business Center"
  },
  "weather": {
    "condition": "rain",
    "rain_chance": 80
  },
  "traffic": {
    "delay_minutes": 45,
    "congestion_level": "high"
  }
}
```

#### Explain Priority
```http
POST /api/gemini/explain-priority
Content-Type: application/json

{
  "task": {...},
  "priority_score": 85,
  "conflicts": []
}
```

#### Generate Notification
```http
POST /api/gemini/notification
Content-Type: application/json

{
  "task": {...},
  "days_until": 3,
  "weather": {...},
  "traffic": {...}
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks?userId={userId}
```

#### Get Task by ID
```http
GET /api/tasks/:id
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "user_id": "uuid",
  "title": "Pay water bill",
  "due_date": "2025-10-28",
  "category": "bill",
  "location": "Maynilad Office"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "is_completed": true
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
```

#### Get Priority Tasks
```http
GET /api/tasks/priority/high?userId={userId}
```

#### Mark Task Complete
```http
PATCH /api/tasks/:id/complete
```

### Weather Endpoints

#### Get Current Weather
```http
GET /api/weather/current?location=Quezon City,PH
```

#### Get Weather Forecast
```http
GET /api/weather/forecast?location=Quezon City,PH&date=2025-10-30
```

### Traffic Endpoints

#### Get Traffic by Route
```http
GET /api/traffic/route?originLat=14.6760&originLon=121.0437&destLat=14.5547&destLon=121.0244
```

#### Get Traffic by Location
```http
GET /api/traffic/location?location=Quezon City, Manila
```

## Priority Scoring Algorithm

Tasks are scored 0-100 based on:

1. **Time Urgency (0-50 points)**
   - <24 hours: 50 points
   - 24-72 hours: 35 points
   - 3-7 days: 20 points
   - 7+ days: 10 points

2. **Task Type (0-30 points)**
   - Bill: 30 points
   - Benefit: 25 points
   - Appointment: 20 points
   - Reminder: 10 points
   - Other: 5 points

3. **Weather Impact (0-10 points)**
   - Rain >70%: +10 points
   - Rain >40%: +5 points

4. **Traffic Impact (0-10 points)**
   - Delay >30 min: +10 points
   - Delay >15 min: +5 points

## Caching Strategy

- **Weather data:** Cached for 30 minutes
- **Traffic data:** Cached for 15 minutes
- Automatic cache invalidation
- Fallback data when APIs fail

## Error Handling

The API uses centralized error handling:

```javascript
{
  "error": "Error message",
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limits

**Gemini 2.0 Flash FREE tier:**
- 1,500 requests/day
- ~60 requests/hour

**Optimization strategies:**
- Cache recommendations for 30 minutes
- Batch process tasks
- Prioritize voice parsing (user-facing)

## Development

### Project Structure

```
backend/
├── routes/
│   ├── index.js           # Route aggregator
│   ├── gemini.routes.js   # AI endpoints
│   ├── task.routes.js     # Task management
│   ├── weather.routes.js  # Weather API
│   └── traffic.routes.js  # Traffic API
├── services/
│   ├── gemini.service.js  # Gemini AI integration
│   ├── weather.service.js # Weather API service
│   └── traffic.service.js # Traffic API service
├── server.js              # Express server
├── package.json
├── .env.example
└── supabase-schema.sql    # Database schema
```

### Adding New Features

1. Create service in `services/`
2. Create route in `routes/`
3. Add route to `routes/index.js`
4. Update documentation

## Deployment

### Recommended Platforms

- **Render:** Free tier, auto-deploy from Git
- **Railway:** Free tier with $5 credit
- **Fly.io:** Free tier available
- **Heroku:** Eco plan ($5/month)

### Environment Variables for Production

Make sure to set all variables from `.env.example` in your hosting platform.

## Monitoring

Check server health:
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-25T12:00:00.000Z",
  "timezone": "Asia/Manila"
}
```

## Troubleshooting

### Gemini API Errors
- Verify API key is correct
- Check rate limits (1,500/day)
- Ensure JSON response parsing is working

### Supabase Connection Issues
- Verify URL and keys in `.env`
- Check Row Level Security policies
- Ensure user authentication is working

### Weather/Traffic API Failures
- Check API keys
- Verify location format
- System uses fallback data automatically

## License

MIT

## Support

For issues or questions, please check the documentation in `mobile_assistant_prompt.md`.
