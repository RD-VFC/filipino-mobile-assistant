# 🚀 Quick Setup Guide - Filipino Mobile Assistant

Follow these steps to get your app up and running in 30 minutes!

## ⚡ Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access
- [ ] Active internet connection

## 📝 Step 1: Get Free API Keys (15 minutes)

### 1.1 Google Gemini API (Required)
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key → Save it as `GEMINI_API_KEY`
5. ✅ Free tier: 1,500 requests/day

### 1.2 Supabase (Required)
1. Visit: https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Create new project:
   - Name: "mobile-assistant"
   - Database Password: (create a strong password)
   - Region: Choose closest to you
5. Wait 2-3 minutes for project to initialize
6. Go to Settings → API
7. Copy these values:
   - Project URL → `SUPABASE_URL`
   - `anon` `public` key → `SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`
8. ✅ Free tier: 500MB database, unlimited API

### 1.3 OpenWeatherMap (Required)
1. Visit: https://openweathermap.org/api
2. Click "Sign Up"
3. Verify email
4. Go to API Keys section
5. Copy default key → `OPENWEATHER_API_KEY`
6. ✅ Free tier: 1,000 calls/day

### 1.4 TomTom Traffic API (Required)
1. Visit: https://developer.tomtom.com/
2. Click "Get started for free"
3. Register account
4. Go to Dashboard
5. Click "Create API Key"
6. Copy key → `TOMTOM_API_KEY`
7. ✅ Free tier: 2,500 requests/day

### 1.5 OpenAI API (Required for voice)
1. Visit: https://platform.openai.com/
2. Sign up / Log in
3. Go to API Keys
4. Click "Create new secret key"
5. Copy key → `OPENAI_API_KEY`
6. Add $5-10 credit (Whisper is very cheap, ~$0.006/minute)

**💾 Save all these keys in a text file - you'll need them soon!**

## 🗄️ Step 2: Setup Supabase Database (5 minutes)

1. In your Supabase project, click **SQL Editor** in the left menu
2. Click **New Query**
3. Open the file: `backend/supabase-schema.sql`
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **Run** (bottom right)
7. You should see: "Success. No rows returned"
8. ✅ Database is ready!

## 🔧 Step 3: Setup Backend (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Now edit the `.env` file with your API keys:

```bash
# Windows
notepad .env

# macOS/Linux
nano .env
```

Fill in ALL the values from Step 1:

```env
PORT=3000
NODE_ENV=development

GEMINI_API_KEY=your_actual_gemini_key_here
OPENAI_API_KEY=your_actual_openai_key_here
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
OPENWEATHER_API_KEY=your_actual_openweather_key_here
TOMTOM_API_KEY=your_actual_tomtom_key_here
FCM_SERVER_KEY=optional_for_now

DEFAULT_LOCATION=Quezon City, Metro Manila, Philippines
DEFAULT_TIMEZONE=Asia/Manila
```

Save the file and test the backend:

```bash
npm run dev
```

You should see:
```
🚀 Mobile Assistant API running on port 3000
📍 Environment: development
🌏 Timezone: Asia/Manila
```

✅ Backend is running! Keep this terminal open.

## 📱 Step 4: Setup Mobile App (5 minutes)

Open a **NEW terminal** window:

```bash
# Navigate to mobile app folder
cd mobile-app

# Install dependencies
npm install

# Install Expo CLI globally (if not installed)
npm install -g expo-cli

# Create environment file
cp .env.example .env
```

Edit the mobile `.env` file:

```bash
# Windows
notepad .env

# macOS/Linux
nano .env
```

**Important:** For testing on physical device, use your computer's IP address, not localhost!

Find your IP address:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

Look for something like `192.168.1.100`

Now update `.env`:

```env
# If testing on same computer/emulator:
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# If testing on physical device:
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api

# Supabase (same as backend)
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# OpenAI (same as backend)
EXPO_PUBLIC_OPENAI_API_KEY=your_actual_openai_key_here
```

Start the mobile app:

```bash
npm start
```

This will open Expo DevTools in your browser.

## 🎯 Step 5: Run the App

### Option A: Physical Device (Recommended)

1. Install **Expo Go** app:
   - iOS: App Store
   - Android: Play Store

2. Scan the QR code from Expo DevTools:
   - iOS: Use Camera app
   - Android: Use Expo Go app

3. App will load on your device!

### Option B: Emulator

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Android Emulator:**
1. Install Android Studio
2. Create virtual device (AVD)
3. Start emulator
4. Run:
```bash
npm run android
```

## 🧪 Step 6: Test the App

### Test 1: Login
1. App opens to login screen
2. Click "Continue with Google"
3. Complete Google sign-in
4. You should see Dashboard

### Test 2: Add Manual Task
1. Click the green ✏️ button
2. Fill in:
   - Title: "Pay water bill"
   - Category: Bill
   - Due Date: (tomorrow's date in YYYY-MM-DD format)
3. Click "Create Task"
4. Task appears on dashboard

### Test 3: Voice Input
1. Click the purple 🎤 button
2. Press and HOLD the mic button
3. Say clearly: "Remind me to buy groceries tomorrow"
4. Release button
5. Wait for AI to process
6. Confirm the task details
7. Task should be created

### Test 4: Task Details
1. Tap any task on dashboard
2. You should see:
   - Task information
   - Weather forecast
   - Traffic conditions
   - AI recommendation in Taglish
3. Try completing or deleting the task

## ✅ Success Checklist

You've successfully set up the app when:

- [ ] Backend server is running (http://localhost:3000)
- [ ] Mobile app loads without errors
- [ ] You can log in with Google
- [ ] You can create tasks manually
- [ ] Voice input works and parses correctly
- [ ] Tasks show weather and traffic data
- [ ] Recommendations appear in Taglish
- [ ] Real-time sync works (test with 2 devices)

## 🐛 Common Issues & Fixes

### Issue: "Network request failed"
**Fix:** 
- Check backend is running
- Use IP address instead of localhost in mobile `.env`
- Disable VPN/firewall temporarily

### Issue: "Invalid API key" errors
**Fix:**
- Double-check all API keys are correct
- Make sure no extra spaces in `.env` file
- Restart backend after changing `.env`

### Issue: Google Sign-In doesn't work
**Fix:**
1. Go to Supabase → Authentication → Providers
2. Enable Google
3. Add OAuth credentials
4. Add redirect URLs

### Issue: Voice recording doesn't work
**Fix:**
- Test on physical device (not simulator)
- Grant microphone permissions
- Check OpenAI API key and credits

### Issue: No weather/traffic data
**Fix:**
- Verify OpenWeatherMap and TomTom API keys
- Check if free tier limits reached
- App will use fallback data if APIs fail

## 📚 Next Steps

Now that your app is running:

1. **Read the Documentation**
   - `README.md` - Project overview
   - `backend/README.md` - API documentation
   - `mobile-app/README.md` - Mobile app guide

2. **Customize**
   - Change color scheme in mobile app
   - Modify AI prompts in backend
   - Add new task categories

3. **Deploy**
   - Backend: Render, Railway, or Fly.io
   - Mobile: Build with EAS and submit to app stores

4. **Test Thoroughly**
   - Try different voice commands
   - Test edge cases
   - Check real-time sync with multiple devices

## 🎉 Congratulations!

You now have a fully functional AI-powered task management app!

**Share your experience:**
- Report bugs
- Suggest features
- Contribute improvements

## 💡 Pro Tips

1. **Daily Usage Limits (Free Tiers)**
   - Gemini: 1,500 requests
   - OpenWeather: 1,000 calls
   - TomTom: 2,500 requests
   - Supabase: Unlimited API calls

2. **Save Money on Whisper**
   - Keep voice recordings under 1 minute
   - Use clear speech to avoid re-recordings
   - Cost: ~$0.006/minute (very cheap!)

3. **Optimize Performance**
   - Backend caches weather (30 min) and traffic (15 min)
   - Mobile app caches API responses
   - Real-time sync only for current user's tasks

4. **Keep Data Safe**
   - Never commit `.env` files
   - Use Row Level Security (RLS) in Supabase
   - Regularly backup your database

## 📞 Need Help?

- Check README files for detailed docs
- Review system prompt for design decisions
- Open GitHub issues for bugs
- Search Stack Overflow for common errors

---

**Happy task managing! 🎯**

Built with ❤️ for the Filipino community
