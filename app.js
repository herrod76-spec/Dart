const app = document.getElementById('app');

const App = {
  screen: 'setup', // setup | game | report
  device: window.innerWidth >= 900 ? 'tablet' : 'phone',
  gameMode: '501',
  training: 'none',
  players: 2,
  scores: [],
  active: 0,
  round: 1,
  history: []
};

// Render App
function render() {
  document.body.className = App.device;
  if (App.screen === 'setup') renderSetup();
  if (App.screen === 'game') renderGame();
  if (App.screen === 'report') renderReport();
}

// Setup-Screen
function renderSetup() {
  app.innerHTML = `
    <div class="screen">
      <h1>DART SESSION SETUP</h1>

      <h3>Spielmodus</h3>
      <button onclick="App.gameMode='301'; render()">301</button>
      <button onclick="App.gameMode='501'; render()">501</button>

      <h3>Training</h3>
      <button onclick="App.training='fokus'; render()">Fokus</button>
      <button onclick="App.training='sicherheit'; render()">Sicherheit</button>

      <h3>Spieler: ${App.players}</h3>
      <button onclick="App.players = Math.max(1, App.players-1); render()">-</button>
      <button onclick="App.players++; render()">+</button>

      <br><br>
      <button onclick="startGame()">START SESSION</button>
    </div>
  `;
}

// Start Game
function startGame() {
  App.scores = Array(App.players).fill(App.gameMode === '501' ? 501 : 301);
  App.active = 0;
  App.round = 1;
  App.history = [];
  App.screen = 'game';
  render();
}

// Game Screen
function renderGame() {
  const activeScore = App.scores[App.active];
  app.innerHTML = `
    <div class="screen">
      <h2>Spieler ${App.active + 1}</h2>
      <h1>${activeScore}</h1>
      <p>Runde ${App.round}</p>

      <h3>Wurf</h3>
      <button onclick="hit(20)">20</button>
      <button onclick="hit(19)">19</button>
      <button onclick="hit(18)">18</button>
      <button onclick="hit(0)">MISS</button>

      <div class="stats">
        <h4>Statistik</h4>
        <p>Spielmodus: ${App.gameMode}</p>
        <p>Training: ${App.training}</p>
        <p>Aktive Spieler: ${App.players}</p>
      </div>
    </div>
  `;
}

// Log Hit
function hit(val) {
  // Speichern für Undo
  App.history.push({active: App.active, val, prev: App.scores[App.active]});

  // Score anpassen
  App.scores[App.active] -= val;

  // Nächster Spieler / Runde
  App.active++;
  if (App.active >= App.players) {
    App.active = 0;
    App.round++;
  }

  // Check Ende
  if (App.scores.some(s => s <= 0)) {
    App.screen = 'report';
  }

  render();
}

// Report Screen
function renderReport() {
  app.innerHTML = `
    <div class="screen">
      <h1>SESSION BEENDET</h1>
      <p>Runden gespielt: ${App.round}</p>
      <p>Spielmodus: ${App.gameMode}</p>
      <p>Training: ${App.training}</p>

      <h3>Spieler Statistik</h3>
      ${App.scores.map((s,i)=>`
        <div class="stats">
          <p>Spieler ${i+1}</p>
          <p>Endpunktzahl: ${s}</p>
        </div>
      `).join('')}

      <br>
      <button onclick="location.reload()">Neue Session</button>
    </div>
  `;
}

render();