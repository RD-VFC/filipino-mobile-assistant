# Mobile Assistant Backend - Setup Guide

Filipino-English (Taglish) voice-powered daily task assistant with AI-driven recommendations, feasibility validation, and accessibility support.

## ✅ Your Configuration (Already Set Up!)

### Supabase Database
- **Host:** `db.zjpgqjbdoqajacibnsih.supabase.co`
- **Database:** `postgres`
- **User:** `postgres`
- **Password:** `3YUuQ!6#t9j-9ch`
- **Connection String:** Already in `.env` file ✓

### Google Gemini AI
- **API Key:** `AIzaSyD0c1mkTnge1x7QQaXlO-c52bjMaIkKRf0` ✓
- **Model:** Gemini 2.0 Flash (FREE)

### Local Whisper
- **Path:** `D:\UserProfile\Documents\@ VFC\whisper` ✓
- **Model:** `base` (configurable)

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd backend
setup.bat
```

### Step 2: Add Supabase Keys to .env

Visit: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/settings/api

Copy these two keys into your `.env` file:
- **anon / public** → `SUPABASE_ANON_KEY`
- **service_role / secret** → `SUPABASE_SERVICE_KEY`

### Step 3: Initialize Database

Visit: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/sql/new

Copy and run the entire `supabase-schema.sql` file.

### Start Server
```bash
npm run dev
```

Server runs at: **http://localhost:3000**

## 🎯 API Endpoints

### 🎤 Voice (Local Whisper)
```
POST /api/voice/transcribe
- Upload audio file (MP3, M4A, WAV, WebM)
- Returns transcribed text in Filipino/English
- Max size: 25MB

GET /api/voice/status
- Check if Whisper service is available
```

### 👤 User Profile
```
GET /api/profile?user_id=xxx
- Get user profile data

PUT /api/profile
- Create or update user profile
- Fields: age, gender, location, mobility_level, health_conditions, etc.

DELETE /api/profile?user_id=xxx
- Delete user profile
```

### 🤖 AI (Gemini)
```
POST /api/gemini/parse-task
- Parse voice input into structured task
- Performs feasibility validation (weekends, holidays, business hours)
- Returns: task details + feasibility_check object

POST /api/gemini/recommendation
- Generate personalized task recommendation
- Adapts to user age, mobility, health conditions

POST /api/gemini/explain-priority
- Explain why task has specific priority score

POST /api/gemini/notification
- Generate notification message adapted to user profile
```

### 📋 Tasks
```
GET /api/tasks?user_id=xxx
- List all tasks for user

POST /api/tasks
- Create new task with feasibility validation

GET /api/tasks/:id
- Get specific task details

PUT /api/tasks/:id
- Update existing task

DELETE /api/tasks/:id
- Delete task
```

### 🌦️ External Data
```
GET /api/weather/:location
- Get weather forecast (cached 30 min)

GET /api/traffic/:location
- Get traffic conditions (cached 30 min)
```

## 📝 Example API Calls

### Transcribe Voice
```bash
curl -X POST http://localhost:3000/api/voice/transcribe \
  -F "audio=@recording.m4a" \
  -F "language=fil"
```

### Parse Task with User Profile
```bash
curl -X POST http://localhost:3000/api/gemini/parse-task \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Bayad kuryente bukas sa Meralco",
    "userProfile": {
      "age": 65,
      "mobility_level": "needs-assistance",
      "location": "Quezon City"
    },
    "userLocation": "Quezon City"
  }'
```

Response includes feasibility validation:
```json
{
  "task": "Pay electricity bill at Meralco",
  "date": "2025-10-26",
  "time": "10:00",
  "category": "bill",
  "location": "Meralco",
  "confidence": 0.95,
  "feasibility_check": {
    "is_feasible": false,
    "warnings": ["Rush hour traffic 5-8 PM"],
    "recommendations": ["Go during off-peak hours 10 AM - 3 PM"],
    "blocking_issues": ["Task scheduled on Sunday - Meralco offices CLOSED"]
  }
}
```

### Create User Profile
```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "age": 67,
    "gender": "female",
    "location": "Quezon City",
    "mobility_level": "needs-assistance",
    "health_conditions": ["hypertension", "diabetes"],
    "medications": ["Metformin 500mg 2x daily"],
    "emergency_contact_name": "Maria Santos",
    "emergency_contact_phone": "+639171234567",
    "has_pwd_id": true,
    "has_senior_id": true,
    "preferred_language": "fil"
  }'
```

## 🔧 Whisper Configuration

Your local Whisper at `D:\UserProfile\Documents\@ VFC\whisper` should have:
- `main.exe` or `whisper.exe`
- Model file (e.g., `ggml-base.bin`)

**Check Whisper status:**
```bash
curl http://localhost:3000/api/voice/status
```

**Change model** (edit `.env`):
```env
WHISPER_MODEL=small    # Options: tiny, base, small, medium, large
```

## 🎨 Key Features

### 1. Feasibility Validation ✅
- **Weekend Check:** Blocks government office tasks on Sat/Sun
- **Holiday Check:** Philippine public holidays 2025 database
- **Business Hours:** Mon-Fri 8AM-5PM for government, 9AM-3PM for banks
- **Travel Time:** Adjusted for user mobility (elderly: 1.3x, wheelchair: 1.8x)
- **Rush Hour:** Manila rush hours 7-10 AM, 5-8 PM

### 2. User Profile Adaptations ✅
- **Elderly (60+)**
  - Respectful "po" language
  - Suggest senior citizen lanes
  - Extra 30-45 min travel buffer
  - Off-peak hours (10 AM - 3 PM)
  
- **PWD / Limited Mobility**
  - Wheelchair accessibility checks
  - Companion suggestions
  - Accessible transport (Grab Assist)
  - Mention elevators, ramps, PWD lanes
  
- **Health Conditions**
  - Weather warnings for respiratory issues
  - Medication schedule considerations
  - Energy level adjustments

### 3. Philippine Context ✅
- Government keywords: SSS, PhilHealth, LTO, DFA, NBI, PAG-IBIG, etc.
- Public holidays 2025: Araw ng Kagitingan, Independence Day, etc.
- Taglish communication style
- Manila traffic patterns

## 📊 Database Schema

Tables created by `supabase-schema.sql`:

### `user_profiles`
- `user_id`, `age`, `gender`, `location`
- `mobility_level` (independent | needs-assistance | wheelchair | limited-mobility)
- `health_conditions[]`, `medications[]`
- `emergency_contact_name`, `emergency_contact_phone`
- `has_pwd_id`, `has_senior_id`
- `preferred_language`, `preferred_transport`

### `tasks`
- Standard task fields (title, due_date, category, etc.)
- `feasibility_check` JSONB - Validation results
- `requires_assistance`, `companion_needed`
- `accessibility_notes`
- Full RLS policies

## 🐛 Troubleshooting

**"Whisper service not available"**
- Check path exists: `D:\UserProfile\Documents\@ VFC\whisper`
- Verify `main.exe` or `whisper.exe` is present
- Test: `curl http://localhost:3000/api/voice/status`

**Database connection error**
- Verify Supabase project is active
- Check password in `.env` matches: `3YUuQ!6#t9j-9ch`
- Test connection at: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih

**Gemini API errors**
- Verify key: `AIzaSyD0c1mkTnge1x7QQaXlO-c52bjMaIkKRf0`
- Check quota: https://aistudio.google.com/app/apikey
- Free tier: 15 requests/minute, 1500 requests/day

**Missing Supabase keys**
- Get from: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/settings/api
- Add to `.env`: `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_KEY`

## 📦 Dependencies

```json
{
  "@google/generative-ai": "^0.2.1",   // Gemini AI
  "@supabase/supabase-js": "^2.39.0",  // Database
  "express": "^4.18.2",                 // Web framework
  "multer": "^1.4.5",                   // File uploads
  "node-cache": "^5.1.2",               // Caching
  "axios": "^1.6.2",                    // HTTP client
  "cors": "^2.8.5",                     // CORS
  "helmet": "^7.1.0",                   // Security
  "dotenv": "^16.3.1"                   // Environment
}
```

## 🔒 Security

- **.env contains sensitive data** - Never commit to Git
- `SUPABASE_SERVICE_KEY` grants admin access - Keep secure
- Database password in connection strings - Rotate if exposed
- API keys have rate limits - Monitor usage

## 📚 Tech Stack

- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web framework
- **Google Gemini 2.0 Flash** - AI (FREE)
- **Supabase** - PostgreSQL + Auth
- **Local Whisper** - Voice transcription (Offline!)
- **Multer** - File upload handling
- **Node-cache** - Response caching

## 🎯 Development

```bash
# Install dependencies
npm install

# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

## 📖 Related Files

- `supabase-schema.sql` - Database schema
- `.env.example` - Environment template
- `server.js` - Express server
- `routes/` - API route handlers
- `services/` - Business logic (Gemini, Whisper, Weather, Traffic)

## ✨ What's Different from OpenAI Whisper?

**Before (OpenAI API):**
- Required API key and internet
- Charged per minute of audio
- Network latency

**Now (Local Whisper):**
- ✅ Completely offline
- ✅ No usage costs
- ✅ Faster (no network delay)
- ✅ Privacy (audio stays local)
- ✅ Works without internet

Your Whisper setup at `D:\UserProfile\Documents\@ VFC\whisper` is ready to use!

---

**Need help?** Check the main project README or setup guides.
