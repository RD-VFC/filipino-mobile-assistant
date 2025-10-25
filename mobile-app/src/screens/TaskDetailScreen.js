import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import apiService from '../services/api';

export default function TaskDetailScreen({ route, navigation }) {
  const { taskId } = route.params;
  const { completeTask, deleteTask } = useTasks();
  const [task, setTask] = useState(null);
  const [weather, setWeather] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaskDetails();
  }, [taskId]);

  const loadTaskDetails = async () => {
    try {
      setLoading(true);
      const taskData = await apiService.getTask(taskId);
      setTask(taskData);
      
      // Load weather and traffic if not cached
      if (!taskData.weather_data) {
        const weatherData = await apiService.getWeatherForecast(
          taskData.location || 'Quezon City,PH',
          taskData.due_date
        );
        setWeather(weatherData);
      } else {
        setWeather(taskData.weather_data);
      }
      
      if (!taskData.traffic_data) {
        const trafficData = await apiService.getTrafficByLocation(
          taskData.location || 'Quezon City, Manila'
        );
        setTraffic(trafficData);
      } else {
        setTraffic(taskData.traffic_data);
      }
    } catch (error) {
      console.error('Error loading task:', error);
      Alert.alert('Error', 'Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    Alert.alert(
      'Complete Task',
      'Mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await completeTask(taskId);
              Alert.alert('Success', 'Task completed!', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to complete task');
            }
          },
        },
      ]
    );
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              Alert.alert('Success', 'Task deleted!', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      bill: '⚠️',
      benefit: '📋',
      appointment: '🗓️',
      reminder: '🔔',
      other: '📌',
    };
    return emojis[category] || emojis.other;
  };

  const getDaysUntil = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return `${Math.abs(diff)} days overdue`;
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    return `Due in ${diff} days`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Task not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Task Header */}
        <View style={styles.header}>
          <Text style={styles.categoryEmoji}>{getCategoryEmoji(task.category)}</Text>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.category}>{task.category}</Text>
        </View>

        {/* Due Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Due Date</Text>
          <View style={styles.card}>
            <Text style={styles.dueDate}>
              {new Date(task.due_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {task.due_time && (
              <Text style={styles.dueTime}>at {task.due_time}</Text>
            )}
            <Text style={styles.daysUntil}>{getDaysUntil(task.due_date)}</Text>
          </View>
        </View>

        {/* Location */}
        {task.location && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Location</Text>
            <View style={styles.card}>
              <Text style={styles.locationText}>{task.location}</Text>
            </View>
          </View>
        )}

        {/* Recommendation */}
        {task.recommendation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Smart Recommendation</Text>
            <View style={styles.card}>
              <Text style={styles.recommendationText}>{task.recommendation}</Text>
            </View>
          </View>
        )}

        {/* Weather */}
        {weather && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌦️ Weather Forecast</Text>
            <View style={styles.card}>
              <View style={styles.weatherRow}>
                <Text style={styles.weatherLabel}>Condition:</Text>
                <Text style={styles.weatherValue}>{weather.description}</Text>
              </View>
              <View style={styles.weatherRow}>
                <Text style={styles.weatherLabel}>Temperature:</Text>
                <Text style={styles.weatherValue}>{Math.round(weather.temperature)}°C</Text>
              </View>
              <View style={styles.weatherRow}>
                <Text style={styles.weatherLabel}>Rain Chance:</Text>
                <Text style={styles.weatherValue}>{weather.rain_chance}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Traffic */}
        {traffic && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚗 Traffic Info</Text>
            <View style={styles.card}>
              <View style={styles.trafficRow}>
                <Text style={styles.trafficLabel}>Congestion:</Text>
                <Text style={[styles.trafficValue, styles[`traffic_${traffic.congestion_level}`]]}>
                  {traffic.congestion_level}
                </Text>
              </View>
              <View style={styles.trafficRow}>
                <Text style={styles.trafficLabel}>Expected Delay:</Text>
                <Text style={styles.trafficValue}>{traffic.delay_minutes} min</Text>
              </View>
              {traffic.alternative_routes && traffic.alternative_routes.length > 0 && (
                <View style={styles.trafficRow}>
                  <Text style={styles.trafficLabel}>Alternative Routes:</Text>
                  <Text style={styles.trafficValue}>
                    {traffic.alternative_routes.join(', ')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Priority Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Priority Score</Text>
          <View style={styles.card}>
            <View style={styles.priorityBar}>
              <View 
                style={[styles.priorityFill, { width: `${task.priority_score}%` }]}
              />
            </View>
            <Text style={styles.priorityText}>{task.priority_score}/100</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {!task.is_completed && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={handleComplete}
          >
            <Text style={styles.actionButtonText}>Complete</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 24,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#E0E7FF',
    textTransform: 'capitalize',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dueDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  dueTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  daysUntil: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  locationText: {
    fontSize: 16,
    color: '#1F2937',
  },
  recommendationText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1F2937',
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weatherLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  trafficRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trafficLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  trafficValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  traffic_low: {
    color: '#10B981',
  },
  traffic_medium: {
    color: '#F59E0B',
  },
  traffic_high: {
    color: '#EF4444',
  },
  traffic_severe: {
    color: '#DC2626',
  },
  priorityBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  priorityFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  completeButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
