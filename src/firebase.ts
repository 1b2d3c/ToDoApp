// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAom-TCsvFl3icx_gfpXqW51dRP8-P2Bsc",
  authDomain: "todoapp-be697.firebaseapp.com",
  projectId: "todoapp-be697",
  storageBucket: "todoapp-be697.firebasestorage.app",
  messagingSenderId: "902361774681",
  appId: "1:902361774681:web:cbfc909c874cb2992acf48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Export the app instance for other Firebase services
export default app;