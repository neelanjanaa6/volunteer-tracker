import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAh5RRo7tMGGLps9wFr9gikcsluPrn2_Go",
  authDomain: "volunteer-tracker-b79eb.firebaseapp.com",
  projectId: "volunteer-tracker-b79eb",
  storageBucket: "volunteer-tracker-b79eb.firebasestorage.app",
  messagingSenderId: "426351799428",
  appId: "1:426351799428:web:a0380a96145ce23c6626d1"
};

const app = initializeApp(firebaseConfig);

// services we will use
export const auth = getAuth(app);
export const db = getFirestore(app);