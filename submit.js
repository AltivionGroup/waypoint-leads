// submit.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
