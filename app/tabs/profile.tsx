import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebase';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(false);

      if (!user?.uid) {
        setEmail('');
        setUsername('');
        setPhotoBase64('');
        return;
      }

      setEmail(user.email || '');

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || '');
          setPhotoBase64(data.photoBase64 || '');
        }
      } catch (error) {
        console.log("Firestore error:", (error as Error).message);
      }
    });

    return unsubscribe;
  }, []);

  const pickAndSaveBase64Image = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Data = result.assets[0].base64;
      setPhotoBase64(base64Data);

      const user = auth.currentUser;
      if (!user?.uid) return;

      await updateDoc(doc(db, 'users', user.uid), {
        photoBase64: base64Data,
      });
    }
  };

  const updateUsername = async () => {
    const user = auth.currentUser;
    if (!user?.uid) return;

    await updateDoc(doc(db, 'users', user.uid), {
      username,
    });
    Alert.alert("Username updated!");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {photoBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${photoBase64}` }}
          style={styles.avatar}
        />
      ) : (
        <Ionicons name="person-circle" size={100} color="#ccc" />
      )}

      <TouchableOpacity onPress={pickAndSaveBase64Image}>
        <Text style={styles.uploadBtn}>Upload New Profile Photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Username</Text>
      <View style={styles.editRow}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TouchableOpacity onPress={updateUsername}>
          <Ionicons name="pencil" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={isLoading ? 'Loading...' : (email || 'No email found')}
        editable={false}
        style={styles.emailField}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 20, marginBottom: 5 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  uploadBtn: {
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    color: '#333',
    borderColor: '#ccc',
  },
  emailField: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutBtn: {
    backgroundColor: '#0a0a23',
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 40,
  },
});
