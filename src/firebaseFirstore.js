// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDUznSObaS0tdPifWALCUilkYvwOz3uuyI",
    authDomain: "astro-test-548c9.firebaseapp.com",
    databaseURL: "https://astro-test-548c9-default-rtdb.firebaseio.com",
    projectId: "astro-test-548c9",
    storageBucket: "astro-test-548c9.appspot.com",
    messagingSenderId: "790729644069",
    appId: "1:790729644069:web:a4f53d82c4331c623e47cc",
    measurementId: "G-V4D09MBN6K",
};

initializeApp(firebaseConfig);
const dbFirestore = getFirestore();
export { dbFirestore };

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyDUznSObaS0tdPifWALCUilkYvwOz3uuyI",
//     authDomain: "astro-test-548c9.firebaseapp.com",
//     databaseURL: "https://astro-test-548c9-default-rtdb.firebaseio.com",
//     projectId: "astro-test-548c9",
//     storageBucket: "astro-test-548c9.appspot.com",
//     messagingSenderId: "790729644069",
//     appId: "1:790729644069:web:a4f53d82c4331c623e47cc",
//     measurementId: "G-V4D09MBN6K",
// };

// initializeApp(firebaseConfig);
// const db = getFirestore();

// const colRef = collection(db, "todo");

// getDocs(colRef).then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//         console.log(doc.id, doc.data());
//     })
// });
