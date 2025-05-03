// submit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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

document.getElementById('leadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = {
    type: form.type.value,
    name: form.name.value,
    contact: form.contact.value,
    location: form.location.value,
    source: form.source.value,
    notes: form.notes.value,
    timestamp: new Date()
  };

  try {
    await addDoc(collection(db, "leads"), data);
    alert("✅ Lead submitted successfully!");
    form.reset();
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
});
