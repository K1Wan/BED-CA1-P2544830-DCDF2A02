const API = "http://localhost:3000";
let currentUser = null;

// ===== INIT =====
function init() {
  const user = localStorage.getItem("currentUser");
  if (user) {
    currentUser = JSON.parse(user);
  }
}

function updateNavbar() {
  const userInfo = document.getElementById("user-info");
  const logoutBtn = document.getElementById("logout-btn");
  const navLinks = document.getElementById("nav-links");

  if (currentUser) {
    if (userInfo) userInfo.textContent = `🎮 ${currentUser.username}`;
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (navLinks) navLinks.classList.remove("hidden");
  } else {
    if (userInfo) userInfo.textContent = "";
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (navLinks) navLinks.classList.add("hidden");
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

// ===== AUTH =====
async function loginUser(username, password) {
  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();

  if (res.ok) {
    currentUser = data;
    localStorage.setItem("currentUser", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    updateNavbar();
    return { success: true };
  } else {
    return { success: false, error: data.error };
  }
}

async function registerUser(username, password) {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();

  if (res.ok) {
    currentUser = data;
    localStorage.setItem("currentUser", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    updateNavbar();
    return { success: true };
  } else {
    return { success: false, error: data.error };
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// ===== DASHBOARD =====
async function loadDashboard() {
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const res = await fetch(`${API}/users?username=${currentUser.username}`);
  const data = await res.json();
  currentUser = data;
  localStorage.setItem("currentUser", JSON.stringify(data));

  document.getElementById("m-quartz").textContent = data.saint_quartz;
  document.getElementById("m-servants").textContent = data.totalServants;
  document.getElementById("m-name").textContent = data.username;
}

async function claimDailyBonus() {
  const res = await fetch(`${API}/users/bonus?username=${currentUser.username}`, { method: "POST" });
  const data = await res.json();

  const msgDiv = document.getElementById("bonus-msg");
  if (res.ok) {
    msgDiv.innerHTML = `<div class="success-msg">${data.message}</div>`;
    loadDashboard();
  } else {
    msgDiv.innerHTML = `<div class="error-msg">${data.error}</div>`;
  }
}

// ===== SUMMONS =====
async function singleSummon() {
  const resultDiv = document.getElementById("summon-result");
  if (!resultDiv) return;
  resultDiv.innerHTML = '<div class="loading">Summoning...</div>';

  const res = await fetch(`${API}/users/summon?username=${currentUser.username}`, { method: "POST" });
  const data = await res.json();

  if (res.ok) {
    resultDiv.innerHTML = servantCard(data.servant);
    resultDiv.classList.add("summon-animation");
    setTimeout(() => resultDiv.classList.remove("summon-animation"), 500);
    updateQuartzDisplay(data.remainingQuartz);
  } else {
    resultDiv.innerHTML = `<div class="error-msg">${data.error}</div>`;
  }
}

async function multiSummon() {
  const resultDiv = document.getElementById("summon-result");
  if (!resultDiv) return;
  resultDiv.innerHTML = '<div class="loading">Summoning 11 servants...</div>';

  const res = await fetch(`${API}/users/multi-summon?username=${currentUser.username}`, { method: "POST" });
  const data = await res.json();

  if (res.ok) {
    resultDiv.innerHTML = '<div class="grid">' + data.servants.map(s => servantCard(s)).join("") + '</div>';
    resultDiv.classList.add("summon-animation");
    setTimeout(() => resultDiv.classList.remove("summon-animation"), 500);
    updateQuartzDisplay(data.remainingQuartz);
  } else {
    resultDiv.innerHTML = `<div class="error-msg">${data.error}</div>`;
  }
}

function servantCard(servant) {
  return `
    <div class="servant-card rarity-${servant.rarity}">
      <div class="stars">${"⭐".repeat(servant.rarity)}</div>
      <div class="name">${servant.name}</div>
      <div class="class">${servant.class}</div>
      <div class="np">${servant.noble_phantasm}</div>
    </div>
  `;
}

function updateQuartzDisplay(quartz) {
  const el = document.getElementById("summon-quartz");
  if (el) el.textContent = quartz;
}

// ===== COLLECTION =====
async function loadCollection() {
  const classFilter = document.getElementById("filter-class")?.value || "";
  const rarityFilter = document.getElementById("filter-rarity")?.value || "";

  let url = `${API}/users/servants?username=${currentUser.username}`;
  if (classFilter) url += `&class=${classFilter}`;
  if (rarityFilter) url += `&rarity=${rarityFilter}`;

  const res = await fetch(url);
  const data = await res.json();

  const grid = document.getElementById("collection-grid");
  const total = document.getElementById("collection-total");

  if (!grid) return;

  if (data.collection.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;">No servants yet. Go summon some!</p>';
    if (total) total.textContent = "0";
    return;
  }

  // Group by servant_id to remove duplicates, count occurrences
  const grouped = {};
  data.collection.forEach(s => {
    if (!grouped[s.servant_id]) {
      grouped[s.servant_id] = { ...s, count: 1 };
    } else {
      grouped[s.servant_id].count++;
    }
  });

  const uniqueServants = Object.values(grouped);
  const totalCount = data.collection.length;

  if (total) total.textContent = totalCount;

  grid.innerHTML = uniqueServants.map(s => `
    <div class="servant-card rarity-${s.rarity}">
      <div class="stars">${"⭐".repeat(s.rarity)}</div>
      <div class="name">${s.name}</div>
      <div class="class">${s.class}</div>
      <div class="np">${s.noble_phantasm}</div>
      ${s.count > 1 ? `<div style="color:#c9a84c;font-size:0.75rem;margin-top:3px;">x${s.count} owned</div>` : ''}
    </div>
  `).join("");
}

// ===== MISSIONS =====
async function loadMissions() {
  if (!currentUser) return;

  const res = await fetch(`${API}/users/missions?username=${currentUser.username}`);
  const data = await res.json();

  const activeDiv = document.getElementById("active-missions");
  const completedDiv = document.getElementById("completed-missions");

  const active = data.missions.filter(m => m.status === "active" && !m.readyToClaim);
  const ready = data.missions.filter(m => m.readyToClaim);

  if (activeDiv) {
    activeDiv.innerHTML = active.length === 0
      ? '<p style="color:#888;">No active missions.</p>'
      : active.map(m => missionCard(m, false)).join("");
  }

  if (completedDiv) {
    completedDiv.innerHTML = ready.length === 0
      ? '<p style="color:#888;">No missions ready to claim.</p>'
      : ready.map(m => missionCard(m, true)).join("");
  }
}

function missionCard(mission, ready) {
  const timeLeft = ready ? "Ready!" : getTimeLeft(mission.completed_at);
  return `
    <div class="mission-card">
      <div class="mission-info">
        <strong>${mission.servant_name}</strong> — ${mission.mission_type}<br>
        <small>💎 ${mission.reward_quartz} quartz | ${timeLeft}</small>
      </div>
      ${ready ? `<button class="btn-small" onclick="claimMission('${mission.mission_id}')">Claim</button>` : ""}
    </div>
  `;
}

function getTimeLeft(completedAt) {
  const diff = Math.ceil((new Date(completedAt) - new Date()) / 1000);
  if (diff <= 0) return "Ready!";
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

async function claimMission(missionId) {
  const res = await fetch(`${API}/users/missions/claim?username=${currentUser.username}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ missionId }),
  });
  const data = await res.json();

  if (res.ok) {
    alert(`${data.message}\nQuartz: +${data.quartzEarned}${data.bonusServant ? "\nServant: " + data.bonusServant : ""}`);
    loadMissions();
  } else {
    alert(data.error);
  }
}

// Auto-refresh missions every 10 seconds
setInterval(() => {
  if (currentUser && window.location.pathname.includes("missions")) {
    loadMissions();
  }
}, 10000);

// ===== INIT ON LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  init();
  updateNavbar();
});