import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

const TaskContext = createContext({});

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchPriorityTasks();
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('tasks')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` },
          handleTaskChange
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const handleTaskChange = (payload) => {
    console.log('Task changed:', payload);
    
    if (payload.eventType === 'INSERT') {
      setTasks(prev => [...prev, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      setTasks(prev => prev.map(task => 
        task.id === payload.new.id ? payload.new : task
      ));
    } else if (payload.eventType === 'DELETE') {
      setTasks(prev => prev.filter(task => task.id !== payload.old.id));
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTasks(user.id);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPriorityTasks = async () => {
    try {
      const data = await apiService.getPriorityTasks(user.id);
      setPriorityTasks(data);
    } catch (error) {
      console.error('Error fetching priority tasks:', error);
    }
  };

  const createTask = async (taskData) => {
    try {
      const task = await apiService.createTask({
        ...taskData,
        user_id: user.id,
      });
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const task = await apiService.updateTask(id, updates);
      return task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const completeTask = async (id) => {
    try {
      const task = await apiService.markTaskComplete(id);
      return task;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const value = {
    tasks,
    priorityTasks,
    loading,
    fetchTasks,
    fetchPriorityTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  return useContext(TaskContext);
};
