# ⚡ DEPLOY NOW - 3 Steps (15 Minutes)

## 🎯 What You're About to Deploy

✅ **Backend API** - Node.js + Express + Gemini AI  
✅ **Database** - Supabase PostgreSQL (already configured!)  
✅ **Mobile App** - React Native with Expo  
✅ **AI Features** - Feasibility validation, user profiles, accessibility  

---

## STEP 1: Create GitHub Repository (2 minutes)

### 1.1 Create Repo
👉 **Go to:** https://github.com/new

**Fill in:**
- Repository name: `filipino-mobile-assistant`
- Description: `AI-powered Filipino mobile task assistant with feasibility validation`
- Visibility: **Public** (or Private if you prefer)
- ❌ **DO NOT** check "Add a README file"
- ❌ **DO NOT** check "Add .gitignore"
- ❌ **DO NOT** choose a license yet

**Click:** "Create repository"

### 1.2 Push Your Code

GitHub will show you commands. **Run these in your terminal:**

```bash
cd "d:\UserProfile\Documents\AI HIVE 2025\mobile-assistant"

# Set your GitHub repo URL (replace YOUR_USERNAME)
git remote set-url origin https://github.com/YOUR_USERNAME/filipino-mobile-assistant.git

# Push!
git push -u origin main
```

**✅ Verify:** Refresh GitHub page - you should see 46 files uploaded

---

## STEP 2: Deploy Backend to Railway (5 minutes)

### 2.1 Sign Up for Railway
👉 **Go to:** https://railway.app/

- Click **"Start a New Project"** (or "Login with GitHub")
- Authorize Railway to access your GitHub

### 2.2 Create New Project
- Click **"New Project"**
- Select **"Deploy from GitHub repo"**
- Choose **`filipino-mobile-assistant`**
- Railway will auto-detect it's a Node.js app ✅

### 2.3 Add Environment Variables

Click on your project → **"Variables"** tab → **"Raw Editor"**

**Paste this** (get Supabase keys first - see below):

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://zjpgqjbdoqajacibnsih.supabase.co
SUPABASE_ANON_KEY=your_anon_key_from_supabase
SUPABASE_SERVICE_KEY=your_service_key_from_supabase
DATABASE_URL=postgresql://postgres.zjpgqjbdoqajacibnsih:3YUuQ!6#t9j-9ch@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true
GEMINI_API_KEY=AIzaSyD0c1mkTnge1x7QQaXlO-c52bjMaIkKRf0
CACHE_TTL_SECONDS=300
```

**🔑 Get Supabase Keys:**

1. Open: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/settings/api
2. Find **"Project API keys"** section
3. Copy **"anon public"** key → Replace `your_anon_key_from_supabase`
4. Copy **"service_role"** key → Replace `your_service_key_from_supabase`
5. Click **"Save"** in Railway

### 2.4 Deploy!

Railway will automatically build and deploy. Watch the logs!

**⏱️ Wait ~2-3 minutes** for build to complete

### 2.5 Get Your API URL

- Go to **"Settings"** tab in Railway
- Under **"Domains"**, you'll see: `https://your-app-name.up.railway.app`
- **Copy this URL!** You'll need it for the mobile app

### 2.6 Test Your Deployment

```bash
# Replace with your actual Railway URL
curl https://your-app-name.up.railway.app/api/voice/status
```

**✅ Expected Response:**
```json
{
  "available": false,
  "whisper_path": "...",
  "model": "base",
  "available_models": ["tiny", "base", "small", "medium", "large"],
  "max_file_size": "25MB"
}
```

**Note:** `available: false` is OK - Whisper isn't on Railway (use OpenAI API for voice, or just test other features)

---

## STEP 3: Initialize Database (3 minutes)

### 3.1 Open Supabase SQL Editor
👉 **Go to:** https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/sql/new

### 3.2 Run Database Schema

1. **Open file:** `backend/supabase-schema.sql` on your computer
2. **Copy ALL contents** (entire file, ~400 lines)
3. **Paste into Supabase SQL Editor**
4. **Click "Run"** (bottom right)

**✅ Expected:** "Success. No rows returned"

### 3.3 Verify Tables Created

Go to: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/editor

**You should see these tables:**
- ✅ `tasks`
- ✅ `user_profiles`
- ✅ Other tables

---

## STEP 4: Test Backend API (2 minutes)

### Test Task Parsing

```bash
# Replace YOUR_RAILWAY_URL with your actual Railway URL
curl -X POST https://YOUR_RAILWAY_URL/api/gemini/parse-task \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Bayad kuryente bukas sa Meralco"}'
```

**✅ Expected Response:**
```json
{
  "task": "Pay electricity bill at Meralco",
  "date": "2025-10-26",
  "category": "bill",
  "location": "Meralco",
  "confidence": 0.95,
  "feasibility_check": {
    "is_feasible": true,
    "warnings": [],
    "recommendations": ["..."],
    "blocking_issues": []
  }
}
```

### Test User Profile

```bash
curl -X PUT https://YOUR_RAILWAY_URL/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-123",
    "age": 65,
    "mobility_level": "independent",
    "location": "Quezon City"
  }'
```

**✅ Expected:** `{"message": "Profile saved successfully"}`

---

## STEP 5: Run Mobile App (3 minutes)

### 5.1 Update API URL

**Edit:** `mobile-app/src/services/api.js`

**Find this line:**
```javascript
const API_URL = 'http://localhost:3000/api';
```

**Change to:** (use your Railway URL!)
```javascript
const API_URL = 'https://your-app-name.up.railway.app/api';
```

**Save the file**

### 5.2 Update Supabase Config

**Edit:** `mobile-app/src/lib/supabase.js`

**Find these lines:**
```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
```

**Change to:**
```javascript
const supabaseUrl = 'https://zjpgqjbdoqajacibnsih.supabase.co';
const supabaseAnonKey = 'your_anon_key_from_step_2';
```

**Save the file**

### 5.3 Start Mobile App

```bash
cd mobile-app
npm install
npm start
```

**Scan QR code** with Expo Go app on your phone!

---

## ✅ DEPLOYMENT COMPLETE!

### 🎉 What's Now Live:

✅ **Backend API:** `https://your-app-name.up.railway.app`  
✅ **Database:** Supabase (PostgreSQL with RLS)  
✅ **Mobile App:** Running in Expo Go  
✅ **AI Features:** Gemini 2.0 Flash (FREE)  

### 📱 Test Features:

1. **Login** - Use Google OAuth
2. **Dashboard** - View tasks
3. **Voice Input** - (Needs OpenAI Whisper API or skip for now)
4. **Add Task** - Create tasks manually
5. **View Details** - See recommendations

---

## 🚨 Troubleshooting

### "Cannot connect to backend"
- ✅ Check Railway deployment is running (green status)
- ✅ Verify API_URL in `mobile-app/src/services/api.js`
- ✅ Test backend with curl command above

### "Database connection error"
- ✅ Run database schema in Supabase SQL Editor
- ✅ Check Supabase keys in Railway environment variables
- ✅ Verify DATABASE_URL is correct

### "Gemini API error"
- ✅ Check API key: `AIzaSyD0c1mkTnge1x7QQaXlO-c52bjMaIkKRf0`
- ✅ Verify free tier limit (15 requests/minute)
- ✅ Check Railway logs for errors

### Voice transcription doesn't work
**Expected!** Railway doesn't support local Whisper.

**Options:**
1. **Add OpenAI Whisper API key** (paid: $0.006/min)
2. **Skip voice input** for now - use manual task creation
3. **Deploy to DigitalOcean** instead (see DEPLOYMENT.md)

---

## 📊 Free Tier Limits

- **Railway:** 500 hours/month, then $5/month
- **Supabase:** 500MB database, 50k requests/month (plenty!)
- **Gemini API:** 15 requests/minute, 1500/day (FREE forever)
- **Expo:** Unlimited development

**Your app will be FREE unless you get huge traffic!** 🎉

---

## 🔄 Making Updates

```bash
# Edit your code
git add .
git commit -m "Add new feature"
git push origin main

# Railway auto-deploys! ✅
```

---

## 📞 Next Steps

### Optional Enhancements:

1. **Build APK:**
   ```bash
   cd mobile-app
   npm install -g eas-cli
   eas build --platform android
   ```

2. **Add Weather/Traffic APIs:**
   - Get keys from OpenWeatherMap and TomTom
   - Add to Railway environment variables

3. **Add Voice (OpenAI Whisper):**
   ```bash
   # Add to Railway:
   OPENAI_API_KEY=your_key
   ```

4. **Custom Domain:**
   - Railway Settings → Domains → Add custom domain

---

## 🎯 Your Deployment URLs

**Fill these in after deployment:**

- **GitHub Repo:** `https://github.com/YOUR_USERNAME/filipino-mobile-assistant`
- **Backend API:** `https://_____________.up.railway.app`
- **Supabase Dashboard:** `https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih`
- **Railway Dashboard:** `https://railway.app/project/____________`

---

**🚀 Ready to deploy? Start with STEP 1!**

**Questions?** Check:
- `QUICK_DEPLOY.md` - This guide
- `DEPLOYMENT.md` - Detailed deployment options
- `BACKEND_SETUP.md` - Backend configuration
- `mobile-app/README.md` - Mobile app guide
