# Filipino Mobile Daily Assistant

A complete, production-ready mobile task management application with AI-powered voice input, weather awareness, and traffic-smart recommendations designed for Filipino users.

## 🚀 Project Overview

This is a full-stack mobile application that helps users manage daily tasks (bills, appointments, government benefits, reminders) with intelligent, context-aware recommendations based on:
- Voice input processing (natural language)
- Weather forecasts
- Real-time traffic conditions
- Task urgency and priority

## 📁 Project Structure

```
mobile-assistant/
├── backend/                 # Node.js/Express API server
│   ├── routes/             # API routes
│   ├── services/           # Business logic (Gemini AI, Weather, Traffic)
│   ├── server.js           # Express server
│   ├── package.json
│   ├── .env.example
│   ├── supabase-schema.sql # Database schema
│   └── README.md           # Backend documentation
│
├── mobile-app/             # React Native (Expo) mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── context/       # State management
│   │   ├── services/      # API integration
│   │   └── lib/           # Utilities
│   ├── App.js             # Main app component
│   ├── package.json
│   ├── .env.example
│   └── README.md          # Mobile app documentation
│
└── README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **AI:** Google Gemini 2.0 Flash (FREE tier)
- **Database:** Supabase (PostgreSQL + Real-time)
- **APIs:** 
  - OpenWeatherMap (weather)
  - TomTom Traffic API
  - OpenAI Whisper (voice transcription)
- **Caching:** node-cache

### Mobile App
- **Framework:** React Native with Expo
- **Navigation:** React Navigation
- **State:** React Context API
- **Auth:** Supabase Auth (Google OAuth)
- **Voice:** expo-av + Whisper API
- **Notifications:** Expo Notifications
- **Location:** expo-location

## 🎯 Key Features

### For Users
✅ **Voice-Powered Task Creation** - Speak naturally to create tasks
✅ **Smart Recommendations** - AI suggests best times to complete tasks
✅ **Weather-Aware Planning** - Know when rain might affect your plans
✅ **Traffic Intelligence** - Get real-time traffic updates and alternative routes
✅ **Priority Scoring** - Automatically ranks tasks by urgency
✅ **Real-time Sync** - Changes sync instantly across all devices
✅ **Push Notifications** - 3-day advance reminders
✅ **Filipino-English Support** - Natural Taglish recommendations

### For Developers
✅ **100% FREE** - All APIs have generous free tiers
✅ **Production Ready** - Complete error handling and caching
✅ **Well Documented** - Comprehensive READMEs and comments
✅ **Modern Stack** - Latest React Native and Node.js patterns
✅ **Secure** - Row Level Security (RLS) in Supabase
✅ **Scalable** - Optimized for performance

## 🚦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (free)
- API keys (all free tiers):
  - Google Gemini API
  - OpenWeatherMap API
  - TomTom Traffic API
  - OpenAI API (for Whisper)

### 1. Clone the Repository

```bash
cd "d:\UserProfile\Documents\AI HIVE 2025\mobile-assistant"
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your API keys
# nano .env  (or use your favorite editor)

# Setup Supabase database
# - Create a Supabase project at https://supabase.com
# - Go to SQL Editor
# - Run the supabase-schema.sql file

# Start the server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Setup Mobile App

```bash
cd ../mobile-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your backend URL and Supabase credentials
# nano .env

# Start Expo
npm start
```

Scan the QR code with Expo Go app or press:
- `i` for iOS Simulator (macOS only)
- `a` for Android Emulator

## 📖 Detailed Documentation

- **Backend API:** See [backend/README.md](backend/README.md)
- **Mobile App:** See [mobile-app/README.md](mobile-app/README.md)
- **System Prompt:** See [mobile_assistant_prompt.md](../mobile_assistant_prompt.md)

## 🔑 API Keys Setup

### 1. Google Gemini API (FREE)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy key to `.env` → `GEMINI_API_KEY`
4. Free tier: 1,500 requests/day

### 2. OpenWeatherMap API (FREE)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get API key from dashboard
3. Copy to `.env` → `OPENWEATHER_API_KEY`
4. Free tier: 1,000 calls/day

### 3. TomTom Traffic API (FREE)
1. Sign up at [TomTom Developer](https://developer.tomtom.com/)
2. Create API key
3. Copy to `.env` → `TOMTOM_API_KEY`
4. Free tier: 2,500 requests/day

### 4. OpenAI API (Whisper)
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Create API key
3. Copy to `.env` → `OPENAI_API_KEY`
4. Pay-as-you-go (very cheap for Whisper)

### 5. Supabase (FREE)
1. Create project at [Supabase](https://supabase.com)
2. Get URL and anon key from Settings → API
3. Copy to both backend and mobile `.env` files
4. Free tier: 500MB database, unlimited API requests

## 🧪 Testing the App

### 1. Test Voice Input

1. Open app and log in with Google
2. Tap the microphone button (🎤)
3. Press and hold to record
4. Say: "Remind me to pay electricity bill on October 30"
5. Release and wait for AI to parse
6. Confirm the task details
7. Task should appear on dashboard

### 2. Test Smart Recommendations

1. Create a task due in 1-2 days
2. Open task details
3. You should see:
   - Weather forecast
   - Traffic information
   - AI-generated recommendation in Taglish

### 3. Test Real-time Sync

1. Open app on two devices
2. Create a task on device 1
3. Task should appear instantly on device 2
4. Complete task on device 2
5. Should update on device 1

## 📱 Screenshots

### Login Screen
- Google OAuth
- Feature highlights
- Clean, modern UI

### Dashboard
- Priority tasks (high urgency)
- Upcoming tasks
- Floating action buttons
- Pull-to-refresh

### Task Detail
- Full task information
- Weather forecast card
- Traffic conditions
- Smart recommendations
- Complete/Delete buttons

### Voice Input
- Mic button with recording indicator
- Processing animation
- Confirmation dialog
- Tips for better results

## 🔒 Security Features

- ✅ Row Level Security (RLS) in Supabase
- ✅ JWT-based authentication
- ✅ API keys in environment variables
- ✅ HTTPS for all API calls
- ✅ Input validation on all forms
- ✅ OAuth 2.0 for Google login

## 📊 Performance Optimizations

- **Caching:** Weather (30min), Traffic (15min), Recommendations (30min)
- **Real-time Updates:** Only for current user's tasks
- **Lazy Loading:** Tasks loaded on demand
- **Optimistic UI:** Instant feedback, background sync
- **Code Splitting:** Screens loaded as needed

## 🌐 Deployment

### Backend (Recommended: Render)

1. Push code to GitHub
2. Connect Render to your repo
3. Add environment variables
4. Deploy (free tier available)

### Mobile App (Expo)

```bash
# Build for Android
eas build --platform android

# Build for iOS (requires Apple Developer account)
eas build --platform ios

# Submit to app stores
eas submit
```

## 🐛 Troubleshooting

### Backend won't start
- Check all API keys in `.env`
- Ensure port 3000 is free
- Run `npm install` again

### Mobile app network errors
- Update `EXPO_PUBLIC_API_URL` with your IP (not localhost) when testing on phone
- Ensure backend is running
- Check firewall settings

### Voice input not working
- Grant microphone permission
- Test on physical device (not simulator)
- Check OpenAI API key

### Supabase connection fails
- Verify URL and anon key
- Check if project is paused (free tier sleeps after inactivity)
- Run database schema again

## 📈 Future Enhancements

- [ ] Offline mode with local storage
- [ ] Calendar integration
- [ ] Recurring tasks
- [ ] Task sharing with family
- [ ] Dark mode
- [ ] Multiple language support
- [ ] Siri/Google Assistant integration
- [ ] Apple Watch / Wear OS companion app

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👏 Credits

- Built based on the comprehensive system prompt in `mobile_assistant_prompt.md`
- Designed for the Filipino community
- Uses free tier APIs to make it accessible to everyone

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation in respective README files
- Review the system prompt for design decisions

---

**Built with ❤️ for the Filipino community**

Made possible by:
- Google Gemini 2.0 Flash (AI)
- Supabase (Database + Auth)
- React Native + Expo (Mobile)
- OpenWeatherMap (Weather)
- TomTom (Traffic)
