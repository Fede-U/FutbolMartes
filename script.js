let players = {};
let matches = [];

function loadData() {
  const savedPlayers = localStorage.getItem("players");
  const savedMatches = localStorage.getItem("matches");

  if (savedPlayers) players = JSON.parse(savedPlayers);
  if (savedMatches) matches = JSON.parse(savedMatches);

  renderPlayers();
  renderRankings();
  populateTeamSelectors();
}

function saveData() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("matches", JSON.stringify(matches));
}

document.getElementById("addPlayerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nameInput = document.getElementById("newPlayerName");
  const name = nameInput.value.trim();

  if (name === "" || players[name]) {
    alert("Enter a unique, non-empty player name.");
    return;
  }

  players[name] = { wins: 0, games: 0 };
  nameInput.value = "";
  saveData();
  renderPlayers();
  renderRankings();
  populateTeamSelectors();
});

document.getElementById("matchInput").addEventListener("submit", function (e) {
  e.preventDefault();

  const teamA = getSelectedPlayers("teamA");
  const teamB = getSelectedPlayers("teamB");
  const winner = document.getElementById("winner").value;

  if (teamA.length !== 5 || teamB.length !== 5 || !winner) {
    alert("Both teams must have 5 players and a winner must be selected.");
    return;
  }

  const allPlayers = [...teamA, ...teamB];
  const uniquePlayers = new Set(allPlayers);
  if (uniquePlayers.size < 10) {
    alert("Players must be unique across both teams.");
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

function getSelectedPlayers(teamId) {
  const teamDiv = document.getElementById(teamId);
  const selects = teamDiv.getElementsByTagName("select");
  const selected = [];

  for (let select of selects) {
    if (select.value) selected.push(select.value);
  }

  return selected;
}

function updatePlayerStats(teamA, teamB, winner) {
  [...teamA, ...teamB].forEach(player => {
    players[player].games += 1;
  });

  const winningTeam = winner === "A" ? teamA : teamB;
  winningTeam.forEach(player => {
    players[player].wins += 1;
  });
}

function getPlayerStats(name) {
  const { wins, games } = players[name];
  const winPct = games === 0 ? 0 : Math.round((wins / games) * 100);
  let category = "C";
  if (winPct > 70) category = "A";
  else if (winPct > 30) category = "B";
  return { wins, games, winPct, category };
}

function renderPlayers() {
  const container = document.getElementById("players-container");
  container.innerHTML = "";

  for (const name in players) {
    const { wins, games, winPct, category } = getPlayerStats(name);
    const div = document.createElement("div");
    div.textContent = `${name} — ${wins}W / ${games}G (${winPct}%) — Category ${category}`;
    container.appendChild(div);
  }
}

function renderRankings() {
  const container = document.getElementById("ranking-container");
  container.innerHTML = "";

  const ranked = Object.keys(players).map(name => {
    return { name, ...getPlayerStats(name) };
  });

  ranked.sort((a, b) => b.winPct - a.winPct);

  ranked.forEach(player => {
    const div = document.createElement("div");
    div.textContent = `${player.name}: ${player.winPct}% (${player.wins}/${player.games}) — Category ${player.category}`;
    container.appendChild(div);
  });
}

function populateTeamSelectors() {
  const teamA = document.getElementById("teamA");
  const teamB = document.getElementById("teamB");
  teamA.innerHTML = "";
  teamB.innerHTML = "";

  const createSelects = (teamId) => {
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

  teamA.appendChild(createSelects("teamA"));
  teamB.appendChild(createSelects("teamB"));
}

loadData();
