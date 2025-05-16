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

loadData();
