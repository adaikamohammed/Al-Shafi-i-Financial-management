// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAfel3GwFws31b8_sWtzeCDmqFki6uRW54",
  authDomain: "al-shafii-financial-hub.firebaseapp.com",
  projectId: "al-shafii-financial-hub",
  storageBucket: "al-shafii-financial-hub.appspot.com",
  messagingSenderId: "117564625011",
  appId: "1:117564625011:web:3b22d1d68f513f1caf5a06"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
