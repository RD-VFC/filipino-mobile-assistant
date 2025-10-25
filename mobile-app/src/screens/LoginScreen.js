import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signInWithGoogle, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigation.replace('Dashboard');
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Mobile Assistant</Text>
          <Text style={styles.subtitle}>
            Your Filipino Daily Task Manager
          </Text>
          <Text style={styles.tagline}>
            Voice-powered • Weather-aware • Traffic-smart
          </Text>
        </View>

        <View style={styles.features}>
          <FeatureItem 
            emoji="🎤" 
            text="Voice input for quick task creation"
          />
          <FeatureItem 
            emoji="🌦️" 
            text="Weather-aware recommendations"
          />
          <FeatureItem 
            emoji="🚗" 
            text="Real-time traffic updates"
          />
          <FeatureItem 
            emoji="📱" 
            text="Smart notifications & reminders"
          />
        </View>

        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
        >
          <Text style={styles.googleButtonText}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Free to use • Your data is secure
        </Text>
      </View>
    </SafeAreaView>
  );
}

const FeatureItem = ({ emoji, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E7FF',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#C7D2FE',
  },
  features: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  googleButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    color: '#4F46E5',
    fontSize: 18,
    fontWeight: '600',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#C7D2FE',
    fontSize: 12,
    marginTop: 16,
  },
});
