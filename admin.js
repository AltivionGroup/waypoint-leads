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
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
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
