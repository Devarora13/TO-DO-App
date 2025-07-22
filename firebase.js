// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCJsghKaFa-qaVOifl-KzU6Bi9fu66b_zs",
  authDomain: "todo-app-ae281.firebaseapp.com",
  projectId: "todo-app-ae281",
  storageBucket: "todo-app-ae281.appspot.com", 
  messagingSenderId: "805904922637",
  appId: "1:805904922637:web:c75d8e639e553ec9a4bd44"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth
let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
} catch (error) {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

