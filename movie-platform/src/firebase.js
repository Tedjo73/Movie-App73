import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// Get these values from Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDg5tcGCunrLE7_DGebICygTddRJE-lTUw",
  authDomain: "movie-app-d9449.firebaseapp.com",
  projectId: "movie-app-d9449",
  storageBucket: "movie-app-d9449.firebasestorage.app",
  messagingSenderId: "72130204907",
  appId: "1:72130204907:web:668bb5e9e42186f9355aae",
  measurementId: "G-6RF51KJCFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Export the app as default
export default app;