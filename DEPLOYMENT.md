# 🚀 Deployment Guide

Complete guide to deploying the Filipino Mobile Assistant to production.

## 📋 Pre-Deployment Checklist

- [x] Git repository initialized
- [x] Backend configured with Supabase
- [x] Gemini API key configured
- [x] Local Whisper integrated
- [ ] Supabase anon/service keys added
- [ ] Weather/Traffic API keys added (optional)
- [ ] Database schema deployed
- [ ] Environment variables secured

## 🌐 Backend Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Pros:** Free tier, automatic deployments, PostgreSQL included
**Cost:** Free for 500 hours/month, then $5/month

1. **Sign up:** https://railway.app/
2. **New Project** → **Deploy from GitHub**
3. **Environment Variables:**
   ```
   SUPABASE_URL=https://zjpgqjbdoqajacibnsih.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   DATABASE_URL=your_supabase_connection_string
   GEMINI_API_KEY=AIzaSyD0c1mkTnge1x7QQaXlO-c52bjMaIkKRf0
   WHISPER_PATH=/app/whisper
   OPENWEATHERMAP_API_KEY=your_key
   TOMTOM_API_KEY=your_key
   NODE_ENV=production
   PORT=3000
   ```
4. **Deploy!**

**Note:** Railway doesn't support local Whisper. You'll need to either:
- Deploy Whisper container separately, OR
- Use OpenAI Whisper API instead (requires API key)

### Option 2: Render

**Pros:** Free tier, easy setup
**Cost:** Free tier available

1. **Sign up:** https://render.com/
2. **New Web Service** → Connect GitHub repo
3. **Build Command:** `cd backend && npm install`
4. **Start Command:** `cd backend && npm start`
5. **Add environment variables** (same as Railway)
6. **Deploy!**

### Option 3: Heroku

**Pros:** Mature platform, lots of addons
**Cost:** ~$7/month (no free tier anymore)

1. **Install Heroku CLI:** https://devcenter.heroku.com/articles/heroku-cli
2. **Commands:**
   ```bash
   cd backend
   heroku create filipino-mobile-assistant
   heroku config:set SUPABASE_URL=your_url
   heroku config:set GEMINI_API_KEY=your_key
   # ... add all env vars
   git push heroku master
   ```

### Option 4: DigitalOcean Droplet (Full Control)

**Pros:** Full control, can run Whisper
**Cost:** $5/month

1. **Create droplet** (Ubuntu 22.04)
2. **SSH into droplet:**
   ```bash
   ssh root@your_droplet_ip
   ```
3. **Setup Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   ```
4. **Clone repo:**
   ```bash
   git clone https://github.com/yourusername/filipino-mobile-assistant.git
   cd filipino-mobile-assistant/backend
   npm install
   ```
5. **Setup environment:**
   ```bash
   nano .env
   # Paste your environment variables
   ```
6. **Install PM2:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name mobile-assistant
   pm2 startup
   pm2 save
   ```
7. **Setup Nginx reverse proxy:**
   ```bash
   apt install nginx
   nano /etc/nginx/sites-available/default
   ```
   ```nginx
   server {
       listen 80;
       server_name your_domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   ```bash
   systemctl restart nginx
   ```

8. **Install Whisper (optional):**
   ```bash
   apt install python3-pip ffmpeg
   pip3 install openai-whisper
   ```

## 📱 Mobile App Deployment

### Option 1: Expo EAS Build (Recommended)

**Build APK/IPA for app stores**

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   cd mobile-app
   eas login
   ```

3. **Configure build:**
   ```bash
   eas build:configure
   ```

4. **Build for Android:**
   ```bash
   eas build --platform android --profile production
   ```

5. **Build for iOS:**
   ```bash
   eas build --platform ios --profile production
   ```

### Option 2: Expo Go (Development Only)

**For testing without building**

1. **Publish to Expo:**
   ```bash
   cd mobile-app
   expo publish
   ```

2. **Share link** with testers who have Expo Go app

### Option 3: Build Locally

**Android APK:**
```bash
cd mobile-app
expo build:android
```

**iOS (Mac only):**
```bash
expo build:ios
```

## 🗄️ Database Deployment

### Supabase (Already Set Up!)

Your database is already configured at Supabase. Just need to:

1. **Run schema:**
   - Go to: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/sql
   - Copy `backend/supabase-schema.sql`
   - Execute

2. **Enable RLS:**
   - Policies are in the schema
   - Already configured ✓

3. **Get API keys:**
   - https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/settings/api
   - Copy anon key and service key

## 🔐 Environment Variables Checklist

### Backend Production
```env
# Required
SUPABASE_URL=https://zjpgqjbdoqajacibnsih.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
DATABASE_URL=your_supabase_connection_string
GEMINI_API_KEY=AIzaSyD0c1mkTnge1x7QQaXlO-c52bjMaIkKRf0
NODE_ENV=production
PORT=3000

# Optional (enhanced features)
OPENWEATHERMAP_API_KEY=your_key
TOMTOM_API_KEY=your_key

# Whisper (if running on own server)
WHISPER_PATH=/app/whisper
WHISPER_MODEL=base
```

### Mobile App Production
Update `mobile-app/src/services/api.js`:
```javascript
const API_URL = 'https://your-backend-url.com/api';
```

Update `mobile-app/src/lib/supabase.js`:
```javascript
const supabaseUrl = 'https://zjpgqjbdoqajacibnsih.supabase.co';
const supabaseAnonKey = 'your_anon_key';
```

## 📦 GitHub Actions (Optional CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend
          npm install
      
      - name: Deploy to Railway
        run: |
          # Add your Railway deployment script
```

## 🧪 Testing Production

### Backend Health Check
```bash
curl https://your-backend-url.com/api/voice/status
```

### Test Voice Transcription
```bash
curl -X POST https://your-backend-url.com/api/voice/transcribe \
  -F "audio=@test.m4a" \
  -F "language=fil"
```

### Test Task Parsing
```bash
curl -X POST https://your-backend-url.com/api/gemini/parse-task \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Bayad kuryente bukas"}'
```

## 📊 Monitoring

### Backend Logs
- **Railway:** Dashboard → Deployments → Logs
- **Render:** Dashboard → Logs tab
- **DigitalOcean:** `pm2 logs mobile-assistant`

### Database Metrics
- **Supabase:** https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/settings/database

### API Usage
- **Gemini:** https://aistudio.google.com/app/apikey
- **OpenWeather:** Dashboard at openweathermap.org
- **TomTom:** Dashboard at developer.tomtom.com

## 🚨 Troubleshooting

### Backend not starting
- Check environment variables are set
- Verify Node.js version (18+)
- Check PORT is available

### Database connection error
- Verify Supabase URL and keys
- Check connection string format
- Test with `psql` command

### Whisper not working
- Use OpenAI Whisper API instead for cloud deployments
- Or deploy dedicated Whisper container

### Mobile app can't connect
- Check API_URL in `api.js`
- Verify backend is running
- Check CORS settings in backend

## 🎯 Post-Deployment

1. **Test all features:**
   - Voice transcription
   - Task creation
   - User profiles
   - Feasibility validation

2. **Monitor performance:**
   - Response times
   - Error rates
   - API quotas

3. **Security audit:**
   - API keys secured
   - RLS policies active
   - HTTPS enabled

4. **Documentation:**
   - Update README with production URLs
   - Document deployment process
   - Create runbooks for common issues

## 📱 App Store Submission (Future)

### Google Play Store
1. Build production APK with EAS
2. Create developer account ($25 one-time)
3. Prepare store listing
4. Upload APK
5. Submit for review

### Apple App Store
1. Build production IPA with EAS (requires Mac)
2. Create developer account ($99/year)
3. Prepare store listing
4. Upload via App Store Connect
5. Submit for review

## 💰 Cost Estimate

**Minimal Setup (Recommended for MVP):**
- Supabase: FREE (500MB, 50k requests/month)
- Gemini API: FREE (15 req/min, 1500 req/day)
- Railway/Render: FREE tier
- **Total: $0/month**

**Production Setup:**
- Supabase Pro: $25/month (8GB, 500k requests)
- DigitalOcean Droplet: $5/month (for Whisper)
- Domain: $12/year
- **Total: ~$30/month**

**Enterprise Setup:**
- Supabase Enterprise: Custom pricing
- Dedicated server: $20-50/month
- CDN: $10/month
- Monitoring: $20/month
- **Total: $50-100/month**

## 🔄 Update Strategy

```bash
# Pull latest changes
git pull origin main

# Backend
cd backend
npm install
pm2 restart mobile-assistant

# Mobile app
cd mobile-app
npm install
eas update  # For OTA updates
```

## 📞 Support Checklist

- [ ] Deployment successful
- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Health checks passing
- [ ] Mobile app connecting
- [ ] Voice transcription working
- [ ] Feasibility validation active
- [ ] Monitoring configured

---

**Ready to deploy!** Choose your platform and follow the guide above.
