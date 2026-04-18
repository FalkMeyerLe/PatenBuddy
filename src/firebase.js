import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAJyj9kkkik1uMTBcidHD0f1xwNGEBYfmM",
    authDomain: "patenbuddy.firebaseapp.com",
    projectId: "patenbuddy",
    storageBucket: "patenbuddy.firebasestorage.app",
    messagingSenderId: "461458892348",
    appId: "1:461458892348:web:0edbe7d78d3dd7e6e9c539",
    measurementId: "G-4MBFYCHWZM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);