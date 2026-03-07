// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth }  from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdMrfVYx9L0afPTqbuB_JJuO4xwYy_dD0",
  authDomain: "studyos-2405c.firebaseapp.com",
  projectId: "studyos-2405c",
  storageBucket: "studyos-2405c.firebasestorage.app",
  messagingSenderId: "684045094854",
  appId: "1:684045094854:web:da6df69ab18f913e7c6cc7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);