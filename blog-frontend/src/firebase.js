import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-df335.firebaseapp.com",
  projectId: "mern-blog-df335",
  storageBucket: "mern-blog-df335.appspot.com",
  messagingSenderId: "847392017660",
  appId: "1:847392017660:web:f441f938a80ed954ad1b79",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
