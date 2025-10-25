# 🎯 Filipino Mobile Assistant - Quick Reference

## 📱 What You Got

A complete, production-ready mobile task management app with AI features!

```
┌─────────────────────────────────────────┐
│     Filipino Mobile Assistant           │
│  Voice • Weather • Traffic • AI Smart   │
└─────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
┌───▼────┐         ┌────▼─────┐
│Backend │         │Mobile App│
│Node.js │         │React Natv│
└───┬────┘         └────┬─────┘
    │                   │
    │  ┌───────────────┐│
    │  │   Supabase    ││
    │  │   Database    ││
    │  └───────────────┘│
    │                   │
┌───▼───────────────────▼───┐
│     External APIs         │
│ Gemini • Weather • Traffic│
└───────────────────────────┘
```

## 🚀 Quick Commands

### First Time Setup
```bash
# Windows
install.bat

# Mac/Linux
chmod +x install.sh
./install.sh
```

### Start Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Mobile App:**
```bash
cd mobile-app
npm start
```

Then:
- Press `i` for iOS
- Press `a` for Android
- Scan QR code with Expo Go app

## 📂 File Structure

```
mobile-assistant/
│
├── 📖 README.md              ← Start here!
├── 📖 SETUP_GUIDE.md         ← 30-min setup
├── 📖 PROJECT_SUMMARY.md     ← Complete overview
├── 🔧 install.bat/sh         ← Auto-installer
├── 🚫 .gitignore             ← Git ignore rules
│
├── 🖥️ backend/
│   ├── routes/               ← API endpoints
│   │   ├── gemini.routes.js  ← AI features
│   │   ├── task.routes.js    ← Task CRUD
│   │   ├── weather.routes.js ← Weather API
│   │   └── traffic.routes.js ← Traffic API
│   ├── services/             ← Business logic
│   │   ├── gemini.service.js ← Gemini AI
│   │   ├── weather.service.js← Weather service
│   │   └── traffic.service.js← Traffic service
│   ├── server.js             ← Express server
│   ├── package.json          ← Dependencies
│   ├── .env.example          ← Config template
│   ├── supabase-schema.sql   ← Database schema
│   └── README.md             ← Backend docs
│
└── 📱 mobile-app/
    ├── src/
    │   ├── screens/          ← App screens
    │   │   ├── LoginScreen.js
    │   │   ├── DashboardScreen.js
    │   │   ├── TaskDetailScreen.js
    │   │   ├── VoiceInputScreen.js
    │   │   └── AddTaskScreen.js
    │   ├── context/          ← State mgmt
    │   │   ├── AuthContext.js
    │   │   └── TaskContext.js
    │   ├── services/         ← API calls
    │   │   └── api.js
    │   └── lib/              ← Utils
    │       └── supabase.js
    ├── App.js                ← Main app
    ├── package.json          ← Dependencies
    ├── .env.example          ← Config template
    └── README.md             ← Mobile docs
```

## 🔑 Required API Keys

| Service | Cost | Link | Purpose |
|---------|------|------|---------|
| Google Gemini | FREE | [Get Key](https://makersuite.google.com/app/apikey) | AI parsing & recommendations |
| Supabase | FREE | [Sign Up](https://supabase.com) | Database + Auth |
| OpenWeather | FREE | [Get Key](https://openweathermap.org/api) | Weather forecasts |
| TomTom | FREE | [Get Key](https://developer.tomtom.com/) | Traffic data |
| OpenAI | ~$1/mo | [Get Key](https://platform.openai.com/) | Voice transcription |

## 📋 Setup Checklist

### Day 1: Get API Keys (15 min)
- [ ] Google Gemini API key
- [ ] Supabase project created
- [ ] OpenWeather API key
- [ ] TomTom API key
- [ ] OpenAI API key

### Day 1: Setup Database (5 min)
- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Verify tables created

### Day 1: Configure Backend (5 min)
- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Fill in all API keys
- [ ] Run `npm install` in backend folder
- [ ] Test: `npm run dev` (should start without errors)

### Day 1: Configure Mobile (5 min)
- [ ] Copy `mobile-app/.env.example` to `mobile-app/.env`
- [ ] Update API URL (use IP for physical device)
- [ ] Add Supabase credentials
- [ ] Run `npm install` in mobile-app folder
- [ ] Test: `npm start` (should open Expo)

### Day 2: Test Features
- [ ] Login with Google works
- [ ] Can create task manually
- [ ] Voice input records and parses
- [ ] Tasks show weather data
- [ ] Tasks show traffic data
- [ ] Recommendations appear in Taglish
- [ ] Can complete/delete tasks
- [ ] Real-time sync works (2 devices)

## 🎨 App Features Overview

### 🎤 Voice Input
**How it works:**
1. Press mic button
2. Hold and speak
3. AI parses into structured data
4. Confirm and save

**Example:**
```
Say: "Remind me to pay Meralco bill on October 30"

Gets:
✓ Task: Pay Meralco bill
✓ Date: 2025-10-30
✓ Category: bill
```

### 🤖 Smart Recommendations
**Context used:**
- Due date urgency
- Weather forecast
- Traffic conditions
- Task category

**Example output:**
```
"Para sa Meralco payment mo bukas, suggest ko 
pumunta ka ng 8-9 AM para iwas rush hour. 
May 85% chance of heavy rain, so dala ng payong. 
EDSA has +45 min delay—consider C5 route."
```

### ⭐ Priority Scoring
**Automatic calculation (0-100):**
- Time urgency: 0-50 points
- Task type: 0-30 points
- Weather impact: 0-10 points
- Traffic impact: 0-10 points

**High priority (>70):**
- Shows in red alert section
- Appears at top of list
- Gets early notifications

## 📱 Mobile App Screens

### 1️⃣ Login
- Google OAuth
- Feature highlights
- Clean UI

### 2️⃣ Dashboard
- Priority tasks (red section)
- Upcoming tasks
- Two FABs:
  - 🎤 Voice input
  - ✏️ Manual add

### 3️⃣ Voice Input
- Press & hold mic
- Real-time recording
- AI parsing
- Confirmation dialog

### 4️⃣ Task Detail
- Full information
- Weather widget
- Traffic widget
- Smart recommendation
- Complete/Delete buttons

### 5️⃣ Add Task
- Form-based creation
- Category selector
- Date/time inputs
- Location field

## 🔧 Common Commands

### Backend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Start production
npm start
```

### Mobile App
```bash
# Install dependencies
npm install

# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🐛 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "Network request failed" | Use IP instead of localhost in mobile `.env` |
| Backend won't start | Check all API keys in `.env` |
| Voice not working | Test on physical device, grant mic permission |
| No weather data | Verify OpenWeather API key |
| Google login fails | Configure OAuth in Supabase dashboard |
| Database errors | Re-run `supabase-schema.sql` |

## 📊 API Rate Limits (Free Tiers)

| Service | Daily Limit | Your Usage | Buffer |
|---------|-------------|------------|--------|
| Gemini | 1,500 req | ~200 | ✅ 7.5x |
| OpenWeather | 1,000 calls | ~100 | ✅ 10x |
| TomTom | 2,500 req | ~100 | ✅ 25x |
| Supabase | Unlimited | Any | ✅ ∞ |

**Result:** Can handle ~50-100 active users on free tiers!

## 🎯 Next Steps After Setup

### For Testing
1. Create 5 test tasks
2. Try different voice commands
3. Check weather accuracy
4. Test on 2 devices for sync
5. Complete/delete tasks

### For Production
1. Deploy backend (Render/Railway)
2. Update mobile app API URL
3. Build with EAS Build
4. Submit to app stores
5. Monitor usage

### For Learning
1. Read all README files
2. Explore code comments
3. Modify UI colors
4. Add new features
5. Contribute back!

## 💡 Pro Tips

1. **Save API Keys Safely**
   - Use password manager
   - Never commit `.env` files
   - Keep backup of keys

2. **Test Incrementally**
   - Backend first
   - Then mobile app
   - One feature at a time

3. **Use Caching**
   - Weather cached 30 min
   - Traffic cached 15 min
   - Saves API calls

4. **Monitor Limits**
   - Check API usage daily
   - Set up alerts
   - Upgrade if needed

5. **Keep Updated**
   - Update dependencies monthly
   - Check for security patches
   - Follow best practices

## 📚 Documentation Links

- **Main Docs:** `README.md`
- **Setup Guide:** `SETUP_GUIDE.md`
- **Project Summary:** `PROJECT_SUMMARY.md`
- **Backend API:** `backend/README.md`
- **Mobile App:** `mobile-app/README.md`

## 🆘 Need Help?

1. Check the README files
2. Review SETUP_GUIDE.md
3. Search error messages
4. Open GitHub issue
5. Check Stack Overflow

## 🎉 You're Ready!

Follow these steps:

```bash
# 1. Run installer
install.bat  # or ./install.sh

# 2. Get API keys (see SETUP_GUIDE.md)

# 3. Setup database (run SQL in Supabase)

# 4. Configure .env files

# 5. Start backend
cd backend && npm run dev

# 6. Start mobile (new terminal)
cd mobile-app && npm start

# 7. Test the app!
```

**Built with ❤️ for the Filipino community**

---

Happy coding! 🚀
