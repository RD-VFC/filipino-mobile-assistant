-- Filipino Mobile Daily Assistant - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table (NEW - for user onboarding)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  age INTEGER CHECK (age >= 13 AND age <= 120),
  gender VARCHAR(20),
  location TEXT NOT NULL,
  barangay TEXT,
  city TEXT,
  health_conditions TEXT[], -- Array of conditions
  mobility_level VARCHAR(30) CHECK (mobility_level IN ('independent', 'needs-assistance', 'limited-mobility', 'wheelchair-user')),
  preferred_language VARCHAR(10) DEFAULT 'taglish',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  has_pwd_id BOOLEAN DEFAULT FALSE,
  has_senior_id BOOLEAN DEFAULT FALSE,
  medical_notes TEXT,
  preferred_travel_time VARCHAR(20), -- 'morning', 'afternoon', 'evening'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('Asia/Manila', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('Asia/Manila', NOW())
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time TIME,
  category VARCHAR(50) CHECK (category IN ('bill', 'benefit', 'appointment', 'reminder', 'other')) NOT NULL,
  location TEXT,
  priority_score INTEGER DEFAULT 0 CHECK (priority_score >= 0 AND priority_score <= 100),
  weather_data JSONB,
  traffic_data JSONB,
  recommendation TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  requires_assistance BOOLEAN DEFAULT FALSE,
  companion_needed BOOLEAN DEFAULT FALSE,
  accessibility_notes TEXT,
  feasibility_check JSONB, -- NEW: stores validation results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('Asia/Manila', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('Asia/Manila', NOW())
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  notification_date TIMESTAMP WITH TIME ZONE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('Asia/Manila', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority_score ON tasks(priority_score DESC);
CREATE INDEX idx_tasks_is_completed ON tasks(is_completed);
CREATE INDEX idx_notifications_task_id ON notifications(task_id);
CREATE INDEX idx_notifications_is_sent ON notifications(is_sent);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_age ON user_profiles(age);
CREATE INDEX idx_user_profiles_mobility_level ON user_profiles(mobility_level);

-- Row Level Security (RLS) Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Tasks Policies
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Notifications Policies
CREATE POLICY "Users can view notifications for their tasks"
  ON notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = notifications.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert notifications for their tasks"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks 
      WHERE tasks.id = notifications.task_id 
      AND tasks.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('Asia/Manila', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on tasks table
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on user_profiles table
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notifications 3 days before due date
CREATE OR REPLACE FUNCTION create_task_notification()
RETURNS TRIGGER AS $$
DECLARE
  notification_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate notification time (3 days before due date at 9 AM Manila time)
  notification_time := (NEW.due_date - INTERVAL '3 days')::timestamp AT TIME ZONE 'Asia/Manila' + TIME '09:00:00';
  
  -- Only create notification if it's in the future
  IF notification_time > NOW() THEN
    INSERT INTO notifications (task_id, notification_date, title, message)
    VALUES (
      NEW.id,
      notification_time,
      '⚠️ ' || NEW.title,
      'Due in 3 days on ' || NEW.due_date::text || '. Check your task for recommendations!'
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-create notifications when task is created
CREATE TRIGGER auto_create_notification AFTER INSERT ON tasks
  FOR EACH ROW EXECUTE FUNCTION create_task_notification();

-- Sample data (optional - for testing)
-- Replace 'YOUR_USER_ID' with actual user ID from auth.users
/*
INSERT INTO tasks (user_id, title, description, due_date, due_time, category, location, priority_score)
VALUES 
  ('YOUR_USER_ID', 'Pay Meralco bill', 'Monthly electricity payment', '2025-10-30', NULL, 'bill', 'Meralco Business Center', 80),
  ('YOUR_USER_ID', 'SSS benefits claim', 'Claim quarterly benefits', '2025-11-05', '10:00', 'benefit', 'SSS Office Quezon City', 75),
  ('YOUR_USER_ID', 'Dentist appointment', 'Regular checkup', '2025-11-10', '14:00', 'appointment', 'Makati Medical Center', 60);
*/

-- View to get upcoming tasks with days until due
CREATE OR REPLACE VIEW upcoming_tasks AS
SELECT 
  t.*,
  (t.due_date - CURRENT_DATE) AS days_until_due,
  CASE 
    WHEN (t.due_date - CURRENT_DATE) < 1 THEN 'urgent'
    WHEN (t.due_date - CURRENT_DATE) <= 3 THEN 'soon'
    WHEN (t.due_date - CURRENT_DATE) <= 7 THEN 'upcoming'
    ELSE 'future'
  END AS urgency_level
FROM tasks t
WHERE t.is_completed = FALSE
ORDER BY t.priority_score DESC, t.due_date ASC;

-- View to get pending notifications
CREATE OR REPLACE VIEW pending_notifications AS
SELECT 
  n.*,
  t.title AS task_title,
  t.due_date,
  t.category
FROM notifications n
JOIN tasks t ON n.task_id = t.id
WHERE n.is_sent = FALSE
  AND n.notification_date <= NOW()
ORDER BY n.notification_date ASC;
