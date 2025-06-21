import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8yS_NQjqKLjFTAA2YbrD6ACj_pi0CPHo",
  authDomain: "cyebersecproject.firebaseapp.com",
  databaseURL: "https://cyebersecproject-default-rtdb.firebaseio.com",
  projectId: "cyebersecproject",
  storageBucket: "cyebersecproject.firebasestorage.app",
  messagingSenderId: "891274483555",
  appId: "1:891274483555:web:00cba5384e23bcf7e52556",
  measurementId: "G-1V544CRKMX"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);





















