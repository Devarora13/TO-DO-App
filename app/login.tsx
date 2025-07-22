import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/tabs');
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-done-circle" size={64} color="#333" />
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your To-Do account</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don't have an account? Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  subtitle: { color: '#666', marginBottom: 20 },
  label: { alignSelf: 'flex-start', marginLeft: 8, marginTop: 10 },
  input: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0a0a23',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#333', marginTop: 20 },
});
