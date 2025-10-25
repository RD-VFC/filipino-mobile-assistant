# Mobile Assistant - React Native App

Filipino Mobile Daily Assistant - A smart task management app with voice input, weather awareness, and traffic integration.

## Features

- ✅ Voice-powered task creation
- ✅ Smart AI recommendations (Gemini 2.0 Flash)
- ✅ Weather-aware task planning
- ✅ Real-time traffic updates
- ✅ Priority-based task sorting
- ✅ Real-time sync across devices (Supabase)
- ✅ Push notifications
- ✅ Google OAuth authentication
- ✅ Taglish (Filipino-English) support

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation
- **State Management:** React Context API
- **Backend:** Supabase (PostgreSQL + Real-time)
- **Authentication:** Supabase Auth with Google OAuth
- **Voice:** expo-av + OpenAI Whisper API
- **Notifications:** Expo Notifications
- **Location:** expo-location

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator
- Expo Go app on your phone (for testing)

## Installation

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Backend API URL (your deployed backend or localhost)
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI for Whisper (voice transcription)
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

### 3. Configure Supabase Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable **Google** provider
4. Add your OAuth client ID and secret
5. Add redirect URLs for your app

### 4. Start the Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

## Running the App

### On iOS Simulator (macOS only)

```bash
npm run ios
```

### On Android Emulator

```bash
npm run android
```

### On Physical Device

1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code from Expo DevTools
3. App will load on your device

## Project Structure

```
mobile-app/
├── src/
│   ├── screens/           # App screens
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── TaskDetailScreen.js
│   │   ├── VoiceInputScreen.js
│   │   └── AddTaskScreen.js
│   ├── context/           # React Context providers
│   │   ├── AuthContext.js
│   │   └── TaskContext.js
│   ├── services/          # API services
│   │   └── api.js
│   └── lib/              # Utilities
│       └── supabase.js
├── App.js                # Main app component
├── app.json              # Expo configuration
├── package.json
└── .env.example
```

## App Screens

### 1. Login Screen
- Google OAuth authentication
- Beautiful onboarding UI
- Feature highlights

### 2. Dashboard
- Priority tasks section (score > 70)
- Upcoming tasks list
- Voice input button (floating)
- Manual add task button
- Pull-to-refresh

### 3. Voice Input
- Press-and-hold to record
- Real-time recording indicator
- AI-powered task parsing
- Confirmation dialog before saving

### 4. Add Task (Manual)
- Form-based task creation
- Category selection with emojis
- Date/time pickers
- Location input

### 5. Task Detail
- Complete task information
- Weather forecast
- Traffic conditions
- Smart recommendations
- Complete/Delete actions

## Key Features Explained

### Voice Input Flow

1. User presses mic button
2. Records audio using expo-av
3. Sends to OpenAI Whisper API for transcription
4. Transcript sent to backend Gemini API
5. Returns structured JSON:
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
6. Shows confirmation dialog
7. Creates task on confirmation

### Real-time Sync

Uses Supabase real-time subscriptions:

```javascript
supabase
  .channel('tasks')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tasks' },
    handleTaskChange
  )
  .subscribe();
```

Changes on one device instantly appear on all devices.

### Smart Recommendations

Tasks automatically get recommendations based on:
- Due date urgency
- Weather forecast
- Traffic conditions
- Task category

Example:
```
"Para sa Meralco payment mo bukas, suggest ko pumunta ka ng 8-9 AM 
para iwas rush hour. May 80% chance of heavy rain, so dala ng payong 
at waterproof bag. EDSA has +45 min delay, consider C5 or Ortigas routes."
```

### Priority Scoring

Automatic priority calculation (0-100):
- **Time urgency (0-50):** How soon it's due
- **Task type (0-30):** Bill > Benefit > Appointment > Reminder
- **Weather (0-10):** Rain increases priority
- **Traffic (0-10):** Heavy traffic increases priority

## API Integration

All API calls go through `src/services/api.js`:

```javascript
import apiService from '../services/api';

// Parse voice input
const taskData = await apiService.parseVoiceInput(transcript);

// Get weather forecast
const weather = await apiService.getWeatherForecast('Quezon City,PH', '2025-10-30');

// Create task
const task = await apiService.createTask(taskData);
```

## State Management

### AuthContext

Manages user authentication state:
- `user` - Current user object
- `signInWithGoogle()` - Google OAuth login
- `signOut()` - Logout

### TaskContext

Manages task state:
- `tasks` - All user tasks
- `priorityTasks` - High priority tasks (score > 70)
- `createTask()` - Create new task
- `updateTask()` - Update existing task
- `deleteTask()` - Delete task
- `completeTask()` - Mark as complete

## Notifications Setup

### 1. Get Expo Push Token

```javascript
import * as Notifications from 'expo-notifications';

const token = await Notifications.getExpoPushTokenAsync();
// Send this token to your backend
```

### 2. Handle Incoming Notifications

```javascript
Notifications.addNotificationReceivedListener(notification => {
  console.log('Notification received:', notification);
});

Notifications.addNotificationResponseReceivedListener(response => {
  // User tapped notification
  navigation.navigate('TaskDetail', { 
    taskId: response.notification.request.content.data.taskId 
  });
});
```

## Building for Production

### iOS (requires macOS and Apple Developer account)

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

### Using EAS Build (Recommended)

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Troubleshooting

### "Network request failed"

- Make sure backend API is running
- Check `EXPO_PUBLIC_API_URL` in `.env`
- If testing on physical device, use your computer's IP instead of `localhost`:
  ```
  EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
  ```

### Voice recording not working

- Check microphone permissions
- On iOS simulator, voice recording is limited
- Test on physical device for best results

### Google Sign-In issues

- Verify Supabase Google OAuth is configured
- Check redirect URLs match your app scheme
- Clear app data and try again

### Real-time sync not working

- Verify Supabase URL and anon key
- Check network connection
- Ensure RLS policies are set correctly

## Performance Tips

1. **Caching:** API responses are cached (weather: 30min, traffic: 15min)
2. **Lazy Loading:** Tasks are loaded on demand
3. **Optimistic Updates:** UI updates immediately, syncs in background
4. **Image Optimization:** Use optimized assets
5. **Code Splitting:** Use dynamic imports for large screens

## Security Notes

- Never commit `.env` file
- Use Supabase Row Level Security (RLS)
- Validate all user inputs
- Keep API keys secure
- Use HTTPS for all API calls

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT

## Support

For issues and questions:
- Check the main documentation in `mobile_assistant_prompt.md`
- Review backend API docs in `backend/README.md`
- Open an issue on GitHub

---

Built with ❤️ for the Filipino community
