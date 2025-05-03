import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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

const tableBody = document.querySelector("#leadsTable tbody");
const filter = document.getElementById("filterType");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");

let allLeads = [];

async function loadLeads() {
  tableBody.innerHTML = "";
  allLeads = [];
  const querySnapshot = await getDocs(collection(db, "leads"));
  querySnapshot.forEach((docSnap) => {
    const lead = docSnap.data();
    lead.id = docSnap.id;
    allLeads.push(lead);
  });
  displayLeads(allLeads);
}

function displayLeads(leads) {
  tableBody.innerHTML = "";
  const filtered = leads.filter((lead) => {
    const matchType = filter.value === "All" || lead.type === filter.value;
    const matchSearch =
      lead.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      (lead.location && lead.location.toLowerCase().includes(searchInput.value.toLowerCase()));
    return matchType && matchSearch;
  });

  filtered.forEach((lead) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
      <td>${lead.type}</td>
      <td>${lead.name}</td>
      <td>${lead.contact}</td>
      <td>${lead.location}</td>
      <td>${lead.source}</td>
      <td>${lead.notes}</td>
      <td>
        <select data-id="${lead.id}" class="status-select">
          <option ${lead.status === "New" ? "selected" : ""}>New</option>
          <option ${lead.status === "Contacted" ? "selected" : ""}>Contacted</option>
          <option ${lead.status === "Closed" ? "selected" : ""}>Closed</option>
        </select>
      </td>
      <td>${new Date(lead.timestamp.toDate()).toLocaleString()}</td>
    `;
  });

  document.querySelectorAll(".status-select").forEach((dropdown) => {
    dropdown.addEventListener("change", async (e) => {
      const docRef = doc(db, "leads", e.target.dataset.id);
      await updateDoc(docRef, { status: e.target.value });
    });
  });
}

function exportCSV() {
  let csv = "Type,Name,Contact,Location,Source,Notes,Status,Time\n";
  allLeads.forEach((lead) => {
    csv += `"${lead.type}","${lead.name}","${lead.contact}","${lead.location}","${lead.source}","${lead.notes}","${lead.status || ""}","${new Date(lead.timestamp.toDate()).toLocaleString()}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "waypoint_leads.csv");
  link.click();
}

// Listeners
filter.addEventListener("change", () => displayLeads(allLeads));
searchInput.addEventListener("input", () => displayLeads(allLeads));
exportBtn.addEventListener("click", exportCSV);

loadLeads();
