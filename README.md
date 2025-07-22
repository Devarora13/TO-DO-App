# React Native Todo App with Firebase

A full-stack mobile application built with React Native, Expo, and Firebase. Features user authentication, real-time task management, and profile customization with image uploads.

## � Features

- **User Authentication**: Secure login and registration with Firebase Auth
- **Real-time Todo Management**: Create, read, update, and delete tasks
- **Profile Management**: Customizable user profiles with image uploads
- **Cross-platform**: Works on iOS, Android, and Web
- **Real-time Sync**: Tasks sync across devices in real-time
- **Offline Support**: AsyncStorage integration for mobile persistence

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase (Authentication + Firestore Database)
- **Storage**: Firebase Storage for profile images
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Expo Vector Icons
- **Image Handling**: Expo Image Picker
- **TypeScript**: Full TypeScript support

## 📁 Project Structure

```
react-native-todo-firebase/
├── app/                          # App screens (Expo Router)
│   ├── tabs/                     # Tab-based screens
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── todo.tsx             # Main todo screen
│   │   └── profile.tsx          # User profile screen
│   ├── index.tsx                # Auth state handler
│   ├── login.tsx                # Login screen
│   └── register.tsx             # Registration screen
├── assets/                       # Static assets
│   ├── images/                  # App icons and images
│   └── fonts/                   # Custom fonts
├── components/                   # Reusable components
├── constants/                    # App constants and themes
├── firebase.js                  # Firebase configuration
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── package.json                 # Dependencies and scripts
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase account
- Mobile device or emulator for testing

### 1. Clone the Repository

```bash
git clone https://github.com/Devarora13/TO-DO-App.git
cd TO-DO-App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password provider)
4. Create Firestore database
5. Enable Storage for profile images

#### Configure Firebase Security Rules

**Firestore Rules** (`/firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks are private to each user
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Storage Rules** (`/storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Environment Variables

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in your Firebase configuration in `.env`:
```properties
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

You can find these values in:
- Firebase Console → Project Settings → General → Your apps → Web app

## 🚀 Running the Project

### Development Mode

Start the Expo development server:

```bash
npm start
# or
npx expo start
```

### Platform-specific Commands

```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web

# Run with tunnel (for physical device testing)
npx expo start --tunnel
```

### Clear Cache (if needed)

```bash
npx expo start --clear
```

## 📱 Testing the Application

### 1. Authentication Flow
- Register a new account with email/password
- Login with existing credentials
- Test error handling (wrong credentials, weak passwords)

### 2. Todo Functionality
- Add new tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Verify real-time sync across devices

### 3. Profile Management
- Upload profile photo
- Edit username
- View email (read-only)
- Test logout functionality

## 🔒 Security Features

- **Environment Variables**: Sensitive Firebase config secured
- **Authentication Required**: All data operations require login
- **User Isolation**: Users can only access their own data
- **Input Validation**: Form validation and error handling
- **Secure Rules**: Firestore security rules prevent unauthorized access

## 📦 Key Dependencies

```json
{
  "expo": "~53.0.20",
  "firebase": "^12.0.0",
  "expo-router": "~5.1.4",
  "expo-image-picker": "~16.1.4",
  "@react-native-async-storage/async-storage": "^2.1.2",
  "react-native": "0.79.5",
  "typescript": "~5.8.3"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   ```bash
   npx expo start --clear
   ```

2. **Firebase Connection Issues**
   - Verify Firebase configuration in `.env`
   - Check Firebase console for project status
   - Ensure authentication is enabled

3. **Build Errors**
   ```bash
   npm install
   npx expo install --fix
   ```

4. **Metro Bundle Issues**
   ```bash
   npx expo start --clear --reset-cache
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Devarora13**
- GitHub: [@Devarora13](https://github.com/Devarora13)

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Firebase](https://firebase.google.com/) for backend services
- [React Native](https://reactnative.dev/) for cross-platform mobile development

---

**Happy Coding! 🚀**

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
