let playerRadarChart;

function updatePlayerRadarChart(player) {
    const games = parseFloat(player.GP);
    const stats = {
        Points: parseFloat(player.PTS) / games,
        Rebounds: parseFloat(player.REB) / games,
        Assists: parseFloat(player.AST) / games,
   
  };

  const ctx = document.getElementById('player-stat-chart').getContext('2d');

  if (playerRadarChart) {
    playerRadarChart.data.datasets[0].data = Object.values(stats);
    playerRadarChart.data.datasets[0].label = player.PLAYER_NAME;
    playerRadarChart.update();
  } else {
    playerRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: Object.keys(stats),
          datasets: [{
            label: player.PLAYER_NAME,
            data: Object.values(stats),
            backgroundColor: 'rgba(255, 255, 255, 0.15)', // transparent white fill
            borderColor: '#ffffff', // white outline
            pointBackgroundColor: '#ffffff', // white dots
            pointBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#0a2342', // navy on hover
            pointHoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: {
              color: '#aaa' // light grid lines
            },
            grid: {
              color: '#888' // radar circles
            },
            pointLabels: {
              color: '#ffffff', // white stat labels
              font: {
                family: 'Roboto',
                size: 12
              }
            },
            ticks: {
              color: '#ffffff',
              beginAtZero: true,
              max: 50,
                backdropColor: 'transparent'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
            }
          }
        }
      }
    })}};