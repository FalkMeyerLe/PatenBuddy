// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJyj9kkkik1uMTBcidHD0f1xwNGEBYfmM",
    authDomain: "patenbuddy.firebaseapp.com",
    projectId: "patenbuddy",
    storageBucket: "patenbuddy.firebasestorage.app",
    messagingSenderId: "461458892348",
    appId: "1:461458892348:web:0edbe7d78d3dd7e6e9c539",
    measurementId: "G-4MBFYCHWZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);