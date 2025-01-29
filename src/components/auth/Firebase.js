// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";  // For authentication
import { getFirestore } from "firebase/firestore";  // For Firestore
import { getStorage } from "firebase/storage";  // For Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);  // Save the initialized app to a variable

// Initialize services
const auth = getAuth(firebaseApp);  // For Authentication
const db = getFirestore(firebaseApp);  // For Firestore
const storage = getStorage(firebaseApp);  // Initialize Firebase Storage

// Set persistence for authentication (ensures the user remains logged in across sessions)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    onAuthStateChanged(auth, (currentUser) => {
      // Here you can manage user state based on authentication status
      if (currentUser) {
        console.log("User is logged in:", currentUser);
      } else {
        console.log("No user logged in.");
      }
    });
  })
  .catch((error) => {
    console.log("Error setting persistence:", error.message);
  });

// Export services to use in other components
export { firebaseApp, auth, db, storage };
