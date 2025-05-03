import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDE8iN10DbsxYO4ZRU-bBTm8zK5f8eQj48",
  authDomain: "waypoint-leads-13d86.firebaseapp.com",
  projectId: "waypoint-leads-13d86",
  storageBucket: "waypoint-leads-13d86.firebasestorage.app",
  messagingSenderId: "391230201087",
  appId: "1:391230201087:web:fa32b736de9a53c6e5c0ca",
  measurementId: "G-XM1D685V3J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const loginBtn = document.getElementById("loginBtn");

loginBtn.disabled = true;
loginBtn.textContent = "Logging in...";

// then after login success or failure
loginBtn.disabled = false;
loginBtn.textContent = "Login";

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "admin.html"; // go to dashboard
    })
    .catch((error) => {
      document.getElementById("error").textContent = error.message;
    });
});
