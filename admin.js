// 🔌 Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// ✅ Your actual config here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let allLeads = [];

// 🛡️ Auth Guard
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadLeads();
  }
});

// 🔁 Load leads from Firestore into memory
async function loadLeads() {
  const querySnapshot = await getDocs(collection(db, "leads"));
  allLeads = [];
  querySnapshot.forEach((docSnap) => {
    const lead = docSnap.data();
    lead.id = docSnap.id;
    allLeads.push(lead);
  });
  // Do not display until query button is clicked
}

// 📊 Render filtered leads
function displayLeads(leads) {
  const tableBody = document.querySelector("#leadsTable tbody");
  tableBody.innerHTML = "";

  leads.forEach((lead) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${lead.type}</td>
      <td>${lead.name}</td>
      <td>${lead.contact}</td>
      <td>${lead.location || ""}</td>
      <td>${lead.source || ""}</td>
      <td>${lead.notes || ""}</td>
      <td>
        <select data-id="${lead.id}" class="status-select">
          <option ${lead.status === "New" ? "selected" : ""}>New</option>
          <option ${lead.status === "Contacted" ? "selected" : ""}>Contacted</option>
          <option ${lead.status === "Closed" ? "selected" : ""}>Closed</option>
        </select>
      </td>
      <td>${lead.timestamp ? new Date(lead.timestamp.toDate()).toLocaleString() : ""}</td>
    `;
  });

  // 🎯 Status update live-save
  document.querySelectorAll(".status-select").forEach((dropdown) => {
    dropdown.addEventListener("change", async (e) => {
      const docRef = doc(db, "leads", e.target.dataset.id);
      await updateDoc(docRef, { status: e.target.value });
    });
  });
}

// 🎯 Filter + Query Button
document.getElementById("queryBtn").addEventListener("click", () => {
  const type = document.getElementById("filterType").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allLeads.filter((lead) => {
    const matchType = type === "All" || lead.type === type;
    const matchSearch =
      lead.name.toLowerCase().includes(search) ||
      (lead.location && lead.location.toLowerCase().includes(search));
    return matchType && matchSearch;
  });

  displayLeads(filtered);
});

// 📁 Export Button
document.getElementById("exportBtn").addEventListener("click", () => {
  let csv = "Type,Name,Contact,Location,Source,Notes,Status,Time\n";
  allLeads.forEach((lead) => {
    csv += `"${lead.type}","${lead.name}","${lead.contact}","${lead.location || ""}","${lead.source || ""}","${lead.notes || ""}","${lead.status || ""}","${lead.timestamp ? new Date(lead.timestamp.toDate()).toLocaleString() : ""}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "waypoint_leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// 🔓 Logout Button
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  }).catch((error) => {
    alert("Logout failed: " + error.message);
  });
});
