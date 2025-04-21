const teamSelect = document.getElementById('team-select');
const playerSelect = document.getElementById('player-select');
const visualsContainer = document.getElementById('player-visuals');

let playersData = [];
let teamData = [];

Promise.all([
  fetch('./player.json').then(res => res.json()),
  fetch('./team.json').then(res => res.json())
]).then(([players, teams]) => {
  playersData = players;
  teamData = teams;

  // Map team_id to team_name
  const teamMap = new Map();
  teamData.forEach(team => {
    teamMap.set(team.TEAM_ID, team.TEAM_NAME);
  });

  populateTeamDropdown(teamMap); // pass teamMap to use team names
}).catch(err => console.error('Error loading data:', err));

// Populate team dropdown with team names
function populateTeamDropdown(teamMap) {
  const uniqueTeams = [...new Set(playersData.map(p => p.TEAM_ID))];
  
  uniqueTeams.forEach(teamId => {
    const teamName = teamMap.get(teamId);
    const option = document.createElement('option');
    option.value = teamId; // use team_id as value
    option.textContent = teamName; // show team_name
    teamSelect.appendChild(option);
  });
}

teamSelect.addEventListener('change', () => {
  const selectedTeamId = teamSelect.value;
  playerSelect.innerHTML = '<option value="">Select a player</option>';

  if (!selectedTeamId) {
    playerSelect.disabled = true;
    visualsContainer.innerHTML = '';
    return;
  }

  const players = playersData
  .filter(p => p.TEAM_ID === selectedTeamId)
  .sort((a, b) => parseFloat(b.MIN) - parseFloat(a.MIN));
  
  players.forEach(player => {
    const option = document.createElement('option');
    option.value = player.PLAYER_ID;
    option.textContent = player.PLAYER_NAME;
    playerSelect.appendChild(option);
  });

  playerSelect.disabled = false;
  visualsContainer.innerHTML = '';

  if (selectedTeamId && typeof updateTeamRankChart === 'function') {
    updateTeamRankChart(selectedTeamId); // pass team_id to update chart
  }
});

playerSelect.addEventListener('change', () => {
    const selectedPlayer = playersData.find(p => p.PLAYER_ID === playerSelect.value);
  
    if (selectedPlayer) {
      visualsContainer.innerHTML = `
        <h3>${selectedPlayer.PLAYER_NAME} (${selectedPlayer.TEAM_ABBREVIATION})</h3>
        <p><strong>Age:</strong> ${selectedPlayer.AGE}</p>
        <p><strong>Games Played:</strong> ${selectedPlayer.GP}</p>
        <p><strong>Minutes:</strong> ${Math.round(selectedPlayer.MIN)}</p>
        <p><strong>Points:</strong> ${selectedPlayer.PTS}</p>
        <p><strong>Rebounds:</strong> ${selectedPlayer.REB}</p>
        <p><strong>Assists:</strong> ${selectedPlayer.AST}</p>
        <p><strong>Plus/Minus:</strong> ${selectedPlayer.PLUS_MINUS}</p>
        <p><strong>Fantasy Rank:</strong> ${selectedPlayer.NBA_FANTASY_PTS_RANK}</p>
      `;
  
      // ✅ Call the radar chart update function if it exists
      if (typeof updatePlayerRadarChart === 'function') {
        updatePlayerRadarChart(selectedPlayer);
      }
    }
  });

  // Minor change to trigger Git