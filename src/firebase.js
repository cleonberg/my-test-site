// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASaRiykF8Hpcn2ssQ2wfNRGKb6UPMeHRU",
  authDomain: "option-dashboard-data.firebaseapp.com",
  projectId: "option-dashboard-data",
  storageBucket: "option-dashboard-data.firebasestorage.app",
  messagingSenderId: "653555280833",
  appId: "1:653555280833:web:b4c741b22aa2943a28dd40"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log("Firebase initialized for project:", firebaseConfig.projectId);
