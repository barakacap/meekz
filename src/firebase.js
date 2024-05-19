// Import the functions you need from the SDKs you need

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


const firebaseConfig = {
    apiKey: "AIzaSyBJhVW2F85Zs3944uCUK8JkW52jixrqP-I",
    authDomain: "ape-poo-club.firebaseapp.com",
    projectId: "ape-poo-club",
    storageBucket: "ape-poo-club.appspot.com",
    messagingSenderId: "163619172035",
    appId: "1:163619172035:web:b2e1712aedd42e2f763c76",
    measurementId: "G-BWB5GZNKW7"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();


export { app, db};