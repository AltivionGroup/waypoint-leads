import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Redirect to login if not signed in
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadLeads(); // Load only if authenticated
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

const leadsTable = document.querySelector("#leadsTable tbody");
const filterType = document.getElementById("filterType");

function renderRow(doc) {
  const data = doc.data();
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.type}</td>
    <td>${data.name}</td>
    <td>${data.contact}</td>
    <td>${data.location || ""}</td>
    <td>${data.source || ""}</td>
    <td>${data.notes || ""}</td>
    <td>${new Date(data.timestamp?.toDate()).toLocaleString()}</td>
  `;
  leadsTable.appendChild(row);
}

async function loadLeads() {
  leadsTable.innerHTML = ""; // clear table
  const snapshot = await getDocs(collection(db, "leads"));
  snapshot.forEach((doc) => {
    if (!filterType.value || doc.data().type === filterType.value) {
      renderRow(doc);
    }
  });
}

filterType.addEventListener("change", loadLeads);

// Initial load
loadLeads();

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    alert("Error logging out: " + error.message);
  });
});


