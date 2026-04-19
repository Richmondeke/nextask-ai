import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBMhmHYoplZZFIsID1v0vpiY4Kqn6n8bvQ",
    authDomain: "nextask-ai-4779835c.firebaseapp.com",
    projectId: "nextask-ai-4779835c",
    storageBucket: "nextask-ai-4779835c.firebasestorage.app",
    messagingSenderId: "71052787212",
    appId: "1:71052787212:web:42831076aaa5a6ca3b7829"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
