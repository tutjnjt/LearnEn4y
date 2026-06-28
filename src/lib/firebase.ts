import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuARYILqii2dwujB77v-sxeED2eRLAVEs",
  authDomain: "eng4bun.firebaseapp.com",
  projectId: "eng4bun",
  storageBucket: "eng4bun.firebasestorage.app",
  messagingSenderId: "61038787359",
  appId: "1:61038787359:web:73a202525c3d74dcde0e2a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
