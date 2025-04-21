let teamRankChart;
let teamStats = {};
let teamRanks = {};

function updateTeamRankChart(teamId) {
  const team = teamData.find(t => t.TEAM_ID === teamId);
  if (!team) return;

  const gamesPlayed = parseFloat(team.GP);

  const ranks = {
    Assists: parseFloat(team.AST) / gamesPlayed,
    Rebounds: parseFloat(team.REB) / gamesPlayed,
    Points: parseFloat(team.PTS) / gamesPlayed
  };

  const rankStats = {
    Assists: team.AST_RANK,
    Rebounds: team.REB_RANK,
    Points: team.PTS_RANK
  };

  const ctx = document.getElementById('team-rank-chart').getContext('2d');

  if (teamRankChart) {
    teamRankChart.data.datasets[0].data = Object.values(ranks);
    teamRankChart.data.datasets[0].rankData = rankStats;
    teamRankChart.update();
  } else {
    teamRankChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(ranks),
        datasets: [{
          label: 'Team Per-Game Stats',
          data: Object.values(ranks),
          backgroundColor: ['#4e79a7', '#f28e2c', '#e15759'],
          rankData: rankStats // custom rank info
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Stat Value'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label;
                const value = context.raw;
                const rank = context.dataset.rankData[label];

                return `${label}: ${value.toFixed(2)} (Rank: ${rank})`;
              }
            }
          }
        }
      }
    });
  }
}