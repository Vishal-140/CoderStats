// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";  // For authentication
import { getFirestore } from "firebase/firestore";  // For Firestore
import { getStorage } from "firebase/storage";  // For Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1XAZ4RfujTMjNYljJZIyRw1TmUW3MpOY",
  authDomain: "coderstats-a4b51.firebaseapp.com",
  projectId: "coderstats-a4b51",
  storageBucket: "coderstats-a4b51.firebasestorage.app",
  messagingSenderId: "911050688326",
  appId: "1:911050688326:web:1104e3b3fb8cf779cf8747",
  measurementId: "G-VP4SR97KN1"
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
