/**
 * This module initializes Firebase and configures authentication-related utilities
 * using Firebase Authentication, Firestore, and Storage. It provides methods for 
 * email-password-based authentication and Google sign-in, along with utility functions
 * to monitor user state and manage user sessions.
 *
 * @version 1.4
 */

import { initializeApp } from 'firebase/app'; // Firebase core
import { 
  getAuth, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserSessionPersistence, 
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  EmailAuthProvider, 
  linkWithCredential, 
  sendPasswordResetEmail 
} from 'firebase/auth'; // Firebase Authentication
import { getStorage, getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Firebase Storage
import { getFirestore, doc, setDoc, updateDoc, getDoc, addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'; // Firestore

/**
 * Firebase configuration object containing project-specific credentials.
 */
const firebaseConfig = {
    apiKey: "AIzaSyAMeliB_-yntAt0Eh1UiP9dIjQipyMYvnI",
    authDomain: "imaginecup-1d93e.firebaseapp.com",
    projectId: "imaginecup-1d93e",
    storageBucket: "imaginecup-1d93e.firebasestorage.app",
    messagingSenderId: "152825784745",
    appId: "1:152825784745:web:4f0ab0b3052f2982b7bcb8",
    measurementId: "G-N3KLE7PNFZ"
  };

/** Initialize Firebase app with the provided configuration. */
const app = initializeApp(firebaseConfig);

/** Firebase services */
const auth = getAuth(app); // Firebase Authentication
const storage = getStorage(app); // Firebase Storage
const db = getFirestore(app); // Firestore Database
const googleProvider = new GoogleAuthProvider(); // Google Authentication Provider

/**
 * Set session persistence to browser session.
 * This ensures that the user's session is persisted until they close the browser tab.
 */
(async () => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    console.log('Session persistence set successfully.');
  } catch (error) {
    console.error('Error setting session persistence:', error);
  }
})();

/**
 * Monitor authentication state changes.
 * This function registers a callback to be invoked whenever the authentication state changes.
 * @param {function} callback - Callback function to handle user state.
 * @returns {function} Unsubscribe function to stop monitoring.
 */
const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Export Firebase utilities for use throughout the application.
 */
export { 
  auth, 
  googleProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  storage,
  getDownloadURL,
  uploadBytes,
  ref, 
  db, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, // Exported for fetching user data
  addDoc,
  collection,
  getDocs, // Added for fetching all documents in a collection
  deleteDoc, // Added for deleting a document
  signInWithPopup, 
  fetchSignInMethodsForEmail, 
  EmailAuthProvider, 
  linkWithCredential, 
  sendPasswordResetEmail, 
  monitorAuthState // Exported to monitor authentication state changes
};
