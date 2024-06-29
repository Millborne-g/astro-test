// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUznSObaS0tdPifWALCUilkYvwOz3uuyI",
  authDomain: "astro-test-548c9.firebaseapp.com",
  databaseURL: "https://astro-test-548c9-default-rtdb.firebaseio.com",
  projectId: "astro-test-548c9",
  storageBucket: "astro-test-548c9.appspot.com",
  messagingSenderId: "790729644069",
  appId: "1:790729644069:web:a4f53d82c4331c623e47cc",
  measurementId: "G-V4D09MBN6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage };