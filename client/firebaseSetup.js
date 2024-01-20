import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCDuZdP0MzNoCoJ6cM35bQK7JCF78qmzb0",
  authDomain: "cassandrarecipes-3eca5.firebaseapp.com",
  projectId: "cassandrarecipes-3eca5",
  storageBucket: "cassandrarecipes-3eca5.appspot.com",
  messagingSenderId: "58353070797",
  appId: "1:58353070797:web:f724f3ec9144395b876f84",
  measurementId: "G-GHBLGDQQLT",
});

const storage = getStorage(app);
export default storage;
