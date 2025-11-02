// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);