// Placeholder for data
let players = {};
let matches = [];

// Load data from localStorage
function loadData() {
  const savedPlayers = localStorage.getItem("players");
  const savedMatches = localStorage.getItem("matches");

  if (savedPlayers) players = JSON.parse(savedPlayers);
  if (savedMatches) matches = JSON.parse(savedMatches);

  renderPlayers();
  renderRankings();
  populateTeamSelectors();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("matches", JSON.stringify(matches));
}

// Handle adding new player
document.getElementById("addPlayerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nameInput = document.getElementById("newPlayerName");
  const name = nameInput.value.trim();

  if (name === "" || players[name]) {
    alert("Ingrese un nombre único.");
    return;
  }

  // Add player with default stats
  players[name] = { wins: 0, games: 0 };
  nameInput.value = "";
  saveData();
  renderPlayers();
  renderRankings();
  populateTeamSelectors();
});

  // Populate team selectors
function populateTeamSelectors() {
  const teamA = document.getElementById("teamA");
  const teamB = document.getElementById("teamB");
  teamA.innerHTML = "";
  teamB.innerHTML = "";

  const createSelect = (teamId) => {
    const container = document.createElement("div");

    for (let i = 0; i < 5; i++) {
      const select = document.createElement("select");
      select.name = `${teamId}-player-${i}`;
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Select player";
      select.appendChild(defaultOption);

      for (const name in players) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      }

      container.appendChild(select);
    }

    return container;
  };

  teamA.appendChild(createSelect("teamA"));
  teamB.appendChild(createSelect("teamB"));
}

function getSelectedPlayers(teamId) {
  const teamDiv = document.getElementById(teamId);
  const selects = teamDiv.getElementsByTagName("select");
  const selected = [];

  for (let select of selects) {
    if (select.value) selected.push(select.value);
  }

  return selected;
}


// Add new match
document.getElementById("matchInput").addEventListener("submit", function (e) {
  e.preventDefault();

  const teamA = getSelectedPlayers("teamA");
  const teamB = getSelectedPlayers("teamB");
  const winner = document.getElementById("winner").value;

  if (teamA.length !== 5 || teamB.length !== 5 || !winner) {
    alert("Both teams must have 5 players and a winner must be selected.");
    return;
  }

  matches.push({ teamA, teamB, winner });
  updatePlayerStats(teamA, teamB, winner);
  saveData();
  renderPlayers();
  renderRankings();
  document.getElementById("matchInput").reset();
  populateTeamSelectors();
});

// Helpers (to implement next)
function getSelectedPlayers(teamId) {}
function updatePlayerStats(teamA, teamB, winner) {}
function renderPlayers() {}
function renderRankings() {}
function populateTeamSelectors() {}

const allPlayers = [...teamA, ...teamB];
const uniquePlayers = new Set(allPlayers);
if (uniquePlayers.size < 10) {
  alert("No debe haber jugadores repetidos en los equipos.");
  return;
}



loadData();
