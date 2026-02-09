// Firebase configuration
// Replace with your Firebase project configuration
export const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};

// Initialize Firebase
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const isConfigPlaceholder = firebaseConfig.apiKey === "YOUR_API_KEY";

const initializeFirebaseInstance = () => {
    try {
        if (isConfigPlaceholder) {
            console.warn("Firebase configuration is placeholder. Functional features requiring Firebase will be disabled.");
            return { app: null, auth: null, db: null };
        }

        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        const auth = getAuth(app);
        const db = getFirestore(app);
        return { app, auth, db };
    } catch (error) {
        console.error("Failed to initialize Firebase:", error);
        return { app: null, auth: null, db: null };
    }
};

const instances = initializeFirebaseInstance();

export const app = instances.app;
export const auth = instances.auth;
export const db = instances.db;

export const initializeFirebase = async () => {
    return instances;
};
