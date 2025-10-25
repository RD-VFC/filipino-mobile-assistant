# 🚀 Quick Deploy Guide

## 📋 Before You Start

You need to create a GitHub repository first:

1. **Go to:** https://github.com/new
2. **Repository name:** `filipino-mobile-assistant`
3. **Description:** `AI-powered Filipino mobile task assistant`
4. **Public or Private:** Your choice
5. **DO NOT** initialize with README (we already have one)
6. **Click "Create repository"**

## 🔄 Push to GitHub

After creating the repository, run these commands:

```bash
cd "d:\UserProfile\Documents\AI HIVE 2025\mobile-assistant"

# If the remote doesn't exist yet, add it (replace USERNAME)
git remote set-url origin https://github.com/YOUR_USERNAME/filipino-mobile-assistant.git

# Push to GitHub
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username!

## 🚂 Deploy Backend to Railway (FREE)

### 1. Sign Up for Railway
- Go to: https://railway.app/
- Click "Login with GitHub"
- Authorize Railway

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `filipino-mobile-assistant`
- Railway will auto-detect Node.js

### 3. Add Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3000

# Supabase (REQUIRED)
SUPABASE_URL=https://zjpgqjbdoqajacibnsih.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
DATABASE_URL=postgresql://postgres.zjpgqjbdoqajacibnsih:3YUuQ!6#t9j-9ch@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true

# Gemini AI (REQUIRED)
GEMINI_API_KEY=AIzaSyD0c1mkTnge1x7QQaXlO-c52bjMaIkKRf0

# Optional - Weather/Traffic
OPENWEATHERMAP_API_KEY=your_key_here
TOMTOM_API_KEY=your_key_here

# Cache
CACHE_TTL_SECONDS=300
```

**Get Supabase Keys:**
1. Visit: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/settings/api
2. Copy **anon / public** → `SUPABASE_ANON_KEY`
3. Copy **service_role** → `SUPABASE_SERVICE_KEY`

### 4. Configure Build Settings

Railway should auto-detect, but if needed:
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Root Directory:** `/`

### 5. Deploy!

Click **Deploy** and wait ~2 minutes.

Your API will be live at: `https://your-app-name.up.railway.app`

### 6. Test Deployment

```bash
# Health check
curl https://your-app-name.up.railway.app/api/voice/status

# Test task parsing
curl -X POST https://your-app-name.up.railway.app/api/gemini/parse-task \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Bayad kuryente bukas"}'
```

## 📱 Deploy Mobile App (Expo)

### Option 1: Expo Go (For Testing)

```bash
cd mobile-app

# Update API URL in src/services/api.js
# Change to: const API_URL = 'https://your-app-name.up.railway.app/api';

npm start
```

Scan QR code with Expo Go app on your phone!

### Option 2: Build APK (For Production)

```bash
cd mobile-app

# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build Android APK
eas build --platform android --profile production
```

Download APK link will be provided when build completes (~10 minutes).

## 🗄️ Initialize Database

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/sql/new

2. **Copy entire file:** `backend/supabase-schema.sql`

3. **Paste and Run**

This creates all tables, RLS policies, and triggers.

## ⚠️ Important Notes

### Whisper Voice Transcription
Railway doesn't support local Whisper. You have 2 options:

**Option A: Use OpenAI Whisper API** (Recommended for Railway)
```bash
# Add to Railway environment variables:
OPENAI_API_KEY=your_openai_key
WHISPER_SERVICE=openai  # Use cloud Whisper
```

Get key from: https://platform.openai.com/api-keys
Cost: $0.006 per minute of audio (~$0.36 per hour)

**Option B: Deploy Whisper Separately**
- Use a separate Whisper API service
- Update `WHISPER_PATH` to point to the service URL

### For Full Local Whisper Support
Deploy to DigitalOcean or your own server instead (see DEPLOYMENT.md)

## 📊 Monitor Your Deployment

### Railway Dashboard
- **Logs:** See real-time logs
- **Metrics:** CPU, memory, requests
- **Deployments:** History and rollback

### Supabase Dashboard
- **Database:** https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih
- **SQL Editor:** Run queries
- **Table Editor:** View data
- **Logs:** API requests

### API Usage
- **Gemini:** https://aistudio.google.com/app/apikey (15 req/min free)
- **OpenAI:** https://platform.openai.com/usage (if using Whisper API)

## 🔧 Troubleshooting

### Build fails on Railway
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check Railway logs for errors

### App can't connect to backend
- Update API_URL in `mobile-app/src/services/api.js`
- Check Railway deployment is running
- Verify environment variables are set

### Database errors
- Ensure schema is deployed
- Check Supabase connection string
- Verify RLS policies allow access

### Gemini API errors
- Check API key is valid
- Verify quota not exceeded (free: 15/min)
- Check request format

## 💰 Cost Estimate

**Free Tier (Perfect for MVP):**
- Railway: FREE for 500 hours/month
- Supabase: FREE (500MB, 50k requests/month)
- Gemini API: FREE (15 req/min, 1500 req/day)
- Expo: FREE
- **Total: $0/month** ✅

**If you exceed free tier:**
- Railway: $5/month (after 500 hours)
- Supabase Pro: $25/month (if you need more)
- OpenAI Whisper: ~$0.006/minute of audio
- **Estimate: $5-30/month**

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Railway project connected to GitHub
- [ ] Environment variables added to Railway
- [ ] Supabase keys obtained
- [ ] Database schema deployed
- [ ] Backend deployed and running
- [ ] Backend health check passes
- [ ] Mobile app API URL updated
- [ ] Mobile app tested with Expo Go
- [ ] (Optional) APK built with EAS

## 🎉 You're Live!

Once deployed:

1. **Backend API:** `https://your-app-name.up.railway.app`
2. **Mobile App:** Expo Go or built APK
3. **Database:** Supabase dashboard

**Share your app:**
- Expo Go QR code (for testing)
- APK download link (for production)
- GitHub repo (for developers)

## 🔄 Making Updates

```bash
# Make changes to code
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys on push! 🚀
# Mobile app: run `eas update` for OTA updates
```

---

**Need help?** Check the detailed guides:
- Full deployment: `DEPLOYMENT.md`
- Backend setup: `BACKEND_SETUP.md`
- Mobile app: `mobile-app/README.md`
