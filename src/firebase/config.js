import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWkBVach5jwf0fTKnweP3TWXowQwK_bsM",
  authDomain: "reading-app-94c32.firebaseapp.com",
  projectId: "reading-app-94c32",
  storageBucket: "reading-app-94c32.firebasestorage.app",
  messagingSenderId: "60945039078",
  appId: "1:60945039078:web:a60fd0e9244300a3f9c527"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);