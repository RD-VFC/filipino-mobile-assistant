import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import apiService from '../services/api';
import { useTasks } from '../context/TaskContext';

export default function VoiceInputScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createTask } = useTasks();

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      // Here you would send the audio to Whisper API for transcription
      // For demo, we'll use a mock transcript
      const mockTranscript = "Remind me to pay electricity bill on October 30";
      await processTranscript(mockTranscript);

      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to process recording');
      setIsProcessing(false);
    }
  };

  const processTranscript = async (transcript) => {
    try {
      // Parse voice input with Gemini
      const taskData = await apiService.parseVoiceInput(transcript);

      // Show confirmation dialog
      Alert.alert(
        'Confirm Task',
        `Task: ${taskData.task}\nDate: ${taskData.date}\nTime: ${taskData.time || 'Not specified'}\nCategory: ${taskData.category}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setIsProcessing(false);
            },
          },
          {
            text: 'Save',
            onPress: async () => {
              try {
                await createTask({
                  title: taskData.task,
                  due_date: taskData.date,
                  due_time: taskData.time,
                  category: taskData.category,
                  location: taskData.location,
                });

                Alert.alert('Success', 'Task created successfully!', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              } catch (error) {
                Alert.alert('Error', 'Failed to create task');
              } finally {
                setIsProcessing(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to process transcript:', error);
      Alert.alert('Error', 'Failed to understand voice input. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Voice Input</Text>
        <Text style={styles.subtitle}>
          Press and hold to record your task
        </Text>

        <View style={styles.micContainer}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.micIcon}>🎤</Text>
            )}
          </TouchableOpacity>
          
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording...</Text>
            </View>
          )}
          
          {isProcessing && (
            <Text style={styles.processingText}>Processing...</Text>
          )}
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Tips for best results:</Text>
          <Text style={styles.tipText}>• Speak clearly and naturally</Text>
          <Text style={styles.tipText}>• Mention the task and date</Text>
          <Text style={styles.tipText}>• Include time if specific</Text>
          <Text style={styles.tipText}>
            • Examples: "Pay Meralco bill on Friday", "Doctor appointment tomorrow at 2 PM"
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
  },
  micContainer: {
    alignItems: 'center',
    marginVertical: 60,
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: '#EF4444',
    transform: [{ scale: 1.1 }],
  },
  micIcon: {
    fontSize: 48,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 20,
  },
  tips: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
