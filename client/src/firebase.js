// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-7452f.firebaseapp.com",
  projectId: "mern-real-estate-7452f",
  storageBucket: "mern-real-estate-7452f.appspot.com",
  messagingSenderId: "740836707706",
  appId: "1:740836707706:web:b577092e2d4d4c5d9c5ac3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);