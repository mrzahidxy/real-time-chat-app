// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz1bl3d0dmuHFLuMch6JYNPOeuUxnId2w",
  authDomain: "chat-app-72fec.firebaseapp.com",
  projectId: "chat-app-72fec",
  storageBucket: "chat-app-72fec.appspot.com",
  messagingSenderId: "781278695644",
  appId: "1:781278695644:web:f0042d67bc32e6db1ae419",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
