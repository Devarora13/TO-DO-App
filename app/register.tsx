import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    // Check Firebase connection
  }, []);

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    
    // Basic password validation
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          username: "",
          photoBase64: "",
          createdAt: new Date(),
        });
      } catch (firestoreError) {
        // Continue with navigation even if user doc creation fails
      }
      
      router.replace("/");
      
    } catch (authError: any) {
      console.error('Registration error:', authError);
      console.error('Error code:', authError.code);
      
      let errorMessage = "Registration failed. Please try again.";
      
      switch (authError.code) {
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please use a different email or try logging in.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please use a stronger password.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your internet connection.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = `Registration failed: ${authError.message}`;
      }
      
      Alert.alert("Registration Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="person-add" size={64} color="#333" />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up for a new To-Do account</Text>

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

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        placeholder="Confirm your password"
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  subtitle: { color: "#666", marginBottom: 20 },
  label: { alignSelf: "flex-start", marginLeft: 8, marginTop: 10 },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0a0a23",
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#333", marginTop: 20 },
});
