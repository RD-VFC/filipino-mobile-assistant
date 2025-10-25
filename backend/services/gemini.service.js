const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Philippine public holidays 2025
const PHILIPPINE_HOLIDAYS_2025 = [
  '2025-01-01', // New Year
  '2025-04-17', // Maundy Thursday
  '2025-04-18', // Good Friday
  '2025-04-19', // Black Saturday
  '2025-04-09', // Araw ng Kagitingan
  '2025-05-01', // Labor Day
  '2025-06-12', // Independence Day
  '2025-08-21', // Ninoy Aquino Day
  '2025-08-25', // National Heroes Day (Last Monday of August)
  '2025-11-30', // Bonifacio Day
  '2025-12-25', // Christmas
  '2025-12-30', // Rizal Day
  '2025-12-31', // New Year's Eve (half day)
];

// Government office keywords
const GOVERNMENT_KEYWORDS = [
  'SSS', 'PhilHealth', 'GSIS', 'City Hall', 'Municipal', 'Barangay Hall',
  'LTO', 'DFA', 'NBI', 'PAG-IBIG', 'BIR', 'Pag-IBIG'
];

// System prompt loaded from the updated markdown file
const SYSTEM_PROMPT = `You are a helpful, proactive Filipino virtual assistant for a mobile daily task management app.

CORE CAPABILITIES:
1. Parse natural language into structured task JSON with FEASIBILITY VALIDATION
2. Generate context-aware recommendations adapted to user profiles
3. Explain task priorities
4. Create notification messages
5. VALIDATE tasks for weekends, holidays, business hours, travel time

CRITICAL VALIDATION RULES:
- Government offices CLOSED on weekends and holidays
- Check business hours for all locations
- Calculate travel time with user mobility factor
- Consider weather + user age/health for safety
- Block impossible schedules immediately

COMMUNICATION STYLE:
- Warm, conversational Filipino-English (Taglish)
- Concise and actionable (2-3 sentences max)
- Empathetic and supportive, especially for elderly and PWD users
- Use "po" for users 60+
- Proactive about weather, traffic, deadlines, and user safety

USER PROFILE AWARENESS:
- Elderly (60+): Extra travel time, suggest companions, mention senior lanes
- PWD/Limited mobility: Check accessibility, suggest assistance, allow more time
- Health conditions: Consider medication times, energy levels, heat sensitivity
- Always prioritize user safety over task urgency

CURRENT CONTEXT:
- Date: ${new Date().toISOString().split('T')[0]}
- Time: ${new Date().toTimeString().split(' ')[0]}
- Location: Quezon City, Metro Manila, Philippines
- Timezone: Asia/Manila (UTC+8)`;

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  /**
   * Parse voice input into structured task JSON with feasibility validation
   * @param {string} transcript - Voice transcription
   * @param {Object} userProfile - User profile data
   * @param {string} userLocation - Current user location
   * @returns {Object} Task data with confidence score and feasibility check
   */
  async parseVoiceInput(transcript, userProfile = {}, userLocation = 'Quezon City') {
    const currentDate = new Date();
    const currentTime = currentDate.toTimeString().split(' ')[0];
    
    const prompt = `${SYSTEM_PROMPT}

TASK: Parse the following voice input into a structured task with FEASIBILITY VALIDATION.

VOICE INPUT: "${transcript}"

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

USER LOCATION: ${userLocation}
CURRENT DATE: ${currentDate.toISOString().split('T')[0]}
CURRENT TIME: ${currentTime}

PHILIPPINE HOLIDAYS 2025: ${JSON.stringify(PHILIPPINE_HOLIDAYS_2025)}

OUTPUT FORMAT (valid JSON only):
{
  "task": "brief, clear task description",
  "date": "YYYY-MM-DD",
  "time": "HH:MM" or null,
  "category": "bill|benefit|appointment|reminder|other",
  "location": "specific location" or null,
  "confidence": 0.0-1.0,
  "feasibility_check": {
    "is_feasible": boolean,
    "warnings": ["array of warning messages"],
    "recommendations": ["array of suggestions"],
    "blocking_issues": ["array of critical problems"]
  }
}

VALIDATION CHECKS YOU MUST PERFORM:

1. **Weekend Government Office Check:**
   IF category == "benefit" OR location contains government keywords
   AND day_of_week(date) IN ["Saturday", "Sunday"]
   THEN: is_feasible = false, blocking_issues = ["Government offices CLOSED on weekends"]

2. **Holiday Check:**
   IF date IN PHILIPPINE_HOLIDAYS AND category == "benefit"
   THEN: is_feasible = false, blocking_issues = ["Government offices CLOSED for holiday"]

3. **Business Hours:**
   - Government: Mon-Fri 8AM-5PM
   - Banks: Mon-Fri 9AM-3PM
   - Most businesses: 8AM-5PM or 9AM-6PM

4. **Travel Time Check:**
   Calculate if user has enough time to travel and complete task
   Factor in user age and mobility level (60+: 1.3x time, needs-assistance: 1.5x, limited-mobility: 1.8x)

5. **Rush Hour Warning:**
   Manila rush: 7-10 AM, 5-8 PM
   Add warnings if task during rush hour

6. **Weather + User Safety:**
   IF heavy rain AND (user age > 65 OR mobility issues)
   THEN: warn about safety, suggest alternatives

Return ONLY valid JSON, no additional text.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON from Gemini response');
      }
      
      const taskData = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!taskData.task || !taskData.date || !taskData.category) {
        throw new Error('Missing required task fields');
      }
      
      // Ensure feasibility_check exists
      if (!taskData.feasibility_check) {
        taskData.feasibility_check = {
          is_feasible: true,
          warnings: [],
          recommendations: [],
          blocking_issues: []
        };
      }
      
      // Additional server-side validation
      this.performServerSideValidation(taskData, userProfile);
      
      return taskData;
    } catch (error) {
      console.error('Gemini parse error:', error);
      throw new Error('Failed to parse voice input: ' + error.message);
    }
  }

  /**
   * Perform server-side feasibility validation as backup
   */
  performServerSideValidation(taskData, userProfile) {
    const taskDate = new Date(taskData.date);
    const dayOfWeek = taskDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if weekend
    if ((dayOfWeek === 0 || dayOfWeek === 6) && taskData.category === 'benefit') {
      const isGovernment = GOVERNMENT_KEYWORDS.some(keyword => 
        taskData.location?.includes(keyword) || taskData.task?.includes(keyword)
      );
      
      if (isGovernment) {
        taskData.feasibility_check.is_feasible = false;
        if (!taskData.feasibility_check.blocking_issues.some(issue => issue.includes('weekend'))) {
          taskData.feasibility_check.blocking_issues.push(
            'Government offices are CLOSED on weekends'
          );
          taskData.feasibility_check.recommendations.push(
            `Reschedule to weekday (Monday-Friday)`
          );
        }
      }
    }
    
    // Check if holiday
    if (PHILIPPINE_HOLIDAYS_2025.includes(taskData.date) && taskData.category === 'benefit') {
      taskData.feasibility_check.is_feasible = false;
      if (!taskData.feasibility_check.blocking_issues.some(issue => issue.includes('holiday'))) {
        taskData.feasibility_check.blocking_issues.push(
          'Government offices CLOSED for public holiday'
        );
      }
    }
  }

  /**
   * Generate smart recommendation based on task context and user profile
   */
  async generateRecommendation(task, weather, traffic, userProfile = {}) {
    const contextData = {
      task: {
        title: task.title,
        due_date: task.due_date,
        due_time: task.due_time,
        category: task.category,
        location: task.location,
        days_until_due: this.getDaysUntil(task.due_date)
      },
      weather: weather || { condition: 'unknown', rain_chance: 0 },
      traffic: traffic || { delay_minutes: 0, congestion_level: 'low' },
      user_location: 'Quezon City',
      user_profile: userProfile
    };

    const isElderly = userProfile.age >= 60;
    const needsAssistance = userProfile.mobility_level !== 'independent';

    const prompt = `${SYSTEM_PROMPT}

TASK: Generate a smart recommendation for this task ADAPTED TO USER PROFILE.

CONTEXT DATA:
${JSON.stringify(contextData, null, 2)}

USER PROFILE ADAPTATIONS:

**For Elderly Users (Age 60+):**
- Suggest off-peak hours (10 AM - 3 PM)
- Recommend bringing companion
- Allow extra travel time (30-45 min buffer)
- Mention senior citizen lanes/priority
- Use "po" respectfully
- Suggest online alternatives

**For Users with Mobility Issues:**
- Check wheelchair accessibility
- Recommend accessible transport (Grab Assist)
- Mention elevators, ramps, PWD lanes
- Allow significantly more travel time

**For Users with Health Conditions:**
- Avoid extreme weather if respiratory issues
- Consider medication schedules
- Factor in energy levels
- Recommend breaks for long tasks

RECOMMENDATION RULES:
- 2-3 sentences maximum
- Include: best time, what to prepare, travel tips
- Use Taglish naturally
- Show empathy for limitations
- Prioritize safety over urgency

${isElderly ? 'Use respectful language with "po"' : ''}
${needsAssistance ? 'ALWAYS suggest bringing companion' : ''}

Return natural language recommendation only (no JSON).`;

    try {
      const result = await this.model.generateContent(prompt);
      const recommendation = result.response.text().trim();
      return recommendation;
    } catch (error) {
      console.error('Gemini recommendation error:', error);
      // Fallback recommendation adapted to user profile
      let fallback = `Task scheduled for ${task.due_date}.`;
      if (isElderly) {
        fallback += ` Suggest ko po na magdala ng kasama for assistance.`;
      }
      if (needsAssistance) {
        fallback += ` Consider accessible transport options.`;
      }
      return fallback;
    }
  }

  /**
   * Explain task priority with user context
   */
  async explainPriority(task, priority_score, conflicts = [], userProfile = {}) {
    const prompt = `${SYSTEM_PROMPT}

TASK: Explain why this task has the given priority score, considering USER PROFILE.

TASK: ${task.title}
DUE DATE: ${task.due_date}
CATEGORY: ${task.category}
PRIORITY SCORE: ${priority_score}/100

USER PROFILE: ${JSON.stringify(userProfile)}
CONFLICTS: ${conflicts.length > 0 ? JSON.stringify(conflicts) : 'None'}

PRIORITY SCORING:
- Time Urgency (0-50): <24h=50, 24-72h=35, 3-7d=20, 7+d=10
- Task Type (0-30): bill=30, benefit=25, appointment=20, reminder=10
- Weather Impact (0-10): rain>70%=10, rain>40%=5
- Traffic Impact (0-10): delay>30min=10, delay>15min=5

Explain in 2-3 sentences why this task has this priority. If there are conflicts, suggest resolution.
Consider user's age and capabilities in your explanation.
Use Filipino-English naturally. ${userProfile.age >= 60 ? 'Use "po" respectfully.' : ''}

Return explanation only (no JSON).`;

    try {
      const result = await this.model.generateContent(prompt);
      const explanation = result.response.text().trim();
      return explanation;
    } catch (error) {
      console.error('Gemini explain priority error:', error);
      return `This task has a priority score of ${priority_score} based on its deadline and type.`;
    }
  }

  /**
   * Generate notification message adapted to user profile
   */
  async generateNotification(task, days_until, weather, traffic, userProfile = {}) {
    const prompt = `${SYSTEM_PROMPT}

TASK: Generate a notification message for this task ADAPTED TO USER.

TASK: ${task.title}
DUE DATE: ${task.due_date}
CATEGORY: ${task.category}
DAYS UNTIL DUE: ${days_until}
WEATHER: ${weather ? JSON.stringify(weather) : 'Unknown'}
TRAFFIC: ${traffic ? JSON.stringify(traffic) : 'Unknown'}
USER PROFILE: ${JSON.stringify(userProfile)}

FORMAT:
Title: [Emoji] [Task Title]
Body: [Brief recommendation with urgency + weather + traffic + user adaptations]

EMOJIS:
- bill: ⚠️
- benefit: 📋
- appointment: 🗓️
- reminder: 🔔
- other: 📌

Keep body under 100 characters. Use Taglish.
${userProfile.age >= 60 ? 'Add "po" and mention senior benefits if relevant.' : ''}
${userProfile.mobility_level !== 'independent' ? 'Mention accessibility considerations.' : ''}

Return in this format:
Title: [title]
Body: [body]`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text().trim();
      
      const titleMatch = response.match(/Title:\s*(.+)/);
      const bodyMatch = response.match(/Body:\s*(.+)/);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : `⚠️ ${task.title}`,
        body: bodyMatch ? bodyMatch[1].trim() : `Due in ${days_until} days!`
      };
    } catch (error) {
      console.error('Gemini notification error:', error);
      return {
        title: `⚠️ ${task.title}`,
        body: `Due in ${days_until} days on ${task.due_date}`
      };
    }
  }

  // Helper methods
  getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  getDaysUntil(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

module.exports = new GeminiService();
