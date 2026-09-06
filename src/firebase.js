import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBixfapnaDioWaHCnyv75n2J13G2v8Krho",
  authDomain: "careerx-ai-571c1.firebaseapp.com",
  projectId: "careerx-ai-571c1",
  storageBucket: "careerx-ai-571c1.firebasestorage.app",
  messagingSenderId: "838431673719",
  appId: "1:838431673719:web:6b2f86d2b32149aa956572",
  measurementId: "G-CY06Z811LE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;