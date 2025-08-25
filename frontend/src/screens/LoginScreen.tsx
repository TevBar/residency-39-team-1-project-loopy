import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';

const loginLoader = require('../../assets/lottie/login-loader.json');



export default function LoginScreen() {
  const { signInWithGoogle, signInAsGuest, isLoading, error, user } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [userMetadata, setUserMetadata] = useState<any>(null);

  const handleGoogleSignIn = async () => {
    setLocalLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Error in handleGoogleSignIn:', err);
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLocalLoading(true);
    try {
      await signInAsGuest();
    } catch (err) {
      console.error('Error in handleGuestSignIn:', err);
      Alert.alert('Sign In Failed', 'Unable to sign in as guest. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.uid) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            setUserMetadata(doc.data());
          }
        },
        err => {
          console.error('Failed to fetch user metadata:', err);
        }
      );

    return () => unsubscribe();
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={loginLoader} // ✅ No casting needed
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
          speed={0.5}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>LOOPY</Text>
          <Text style={styles.subtitle}>Neurodivergent-Friendly Productivity</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.googleButton, localLoading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            disabled={localLoading}
          >
            {localLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.guestButton, localLoading && styles.disabledButton]}
            onPress={handleGuestSignIn}
            disabled={localLoading}
          >
            {localLoading ? (
              <ActivityIndicator color="#333" />
            ) : (
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.disclaimer}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
  buttonContainer: { marginBottom: 24 },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  googleButton: { backgroundColor: '#4285F4' },
  googleButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  guestButton: { backgroundColor: '#e0e0e0' },
  guestButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
  disabledButton: { opacity: 0.6 },
  errorContainer: { marginTop: 12 },
  errorText: { color: '#ff5252', textAlign: 'center', fontSize: 14 },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
});
