import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export default function DashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { tasks, priorityTasks, loading, fetchTasks, fetchPriorityTasks } = useTasks();

  useEffect(() => {
    fetchTasks();
    fetchPriorityTasks();
  }, []);

  const handleRefresh = () => {
    fetchTasks();
    fetchPriorityTasks();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const upcomingTasks = tasks
    .filter(task => !task.is_completed)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 10);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Kumusta,</Text>
            <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}!</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Tasks */}
        {priorityTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Priority Tasks</Text>
            {priorityTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
                isPriority
              />
            ))}
          </View>
        )}

        {/* Upcoming Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Upcoming Tasks</Text>
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No upcoming tasks</Text>
              <Text style={styles.emptySubtext}>Add a task to get started!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, styles.fabSecondary]}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={styles.fabText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.fabPrimary]}
          onPress={() => navigation.navigate('VoiceInput')}
        >
          <Text style={styles.fabText}>🎤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const TaskCard = ({ task, onPress, isPriority = false }) => {
  const getCategoryColor = (category) => {
    const colors = {
      bill: '#EF4444',
      benefit: '#3B82F6',
      appointment: '#8B5CF6',
      reminder: '#10B981',
      other: '#6B7280',
    };
    return colors[category] || colors.other;
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
    
    if (diff < 0) return 'Overdue';
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days`;
  };

  return (
    <TouchableOpacity
      style={[styles.taskCard, isPriority && styles.taskCardPriority]}
      onPress={onPress}
    >
      <View style={styles.taskCardHeader}>
        <View style={styles.taskCategoryBadge}>
          <Text style={styles.categoryEmoji}>{getCategoryEmoji(task.category)}</Text>
        </View>
        <View style={styles.taskCardTitle}>
          <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
          <Text style={styles.taskCategory}>{task.category}</Text>
        </View>
        <View style={styles.taskDueBadge}>
          <Text style={[styles.taskDueText, getDaysUntil(task.due_date) === 'Today' && styles.taskDueUrgent]}>
            {getDaysUntil(task.due_date)}
          </Text>
        </View>
      </View>
      {task.recommendation && (
        <Text style={styles.taskRecommendation} numberOfLines={2}>
          {task.recommendation}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#E0E7FF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskCardPriority: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCategoryBadge: {
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  taskCardTitle: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  taskCategory: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  taskDueBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskDueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  taskDueUrgent: {
    color: '#EF4444',
  },
  taskRecommendation: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'column',
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabPrimary: {
    backgroundColor: '#4F46E5',
  },
  fabSecondary: {
    backgroundColor: '#10B981',
  },
  fabText: {
    fontSize: 24,
  },
});
