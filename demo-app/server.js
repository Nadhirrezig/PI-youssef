const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const TUNNEL_TYPE = process.env.TUNNEL_TYPE || 'none';

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from DevContainer',
    timestamp: new Date().toISOString(),
    tunnel: TUNNEL_TYPE
  });
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo DevContainer Tunneling</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      max-width: 600px;
    }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .badge.none { background: #555; }
    .badge.cloudflare { background: #f48120; }
    .badge.tailscale { background: #2b5797; }
    #result {
      background: rgba(0,0,0,0.3);
      padding: 1rem;
      border-radius: 8px;
      font-family: monospace;
      text-align: left;
      white-space: pre-wrap;
      min-height: 80px;
    }
    button {
      margin-top: 1rem;
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: #6c63ff;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #5a52d5; }
  </style>
</head>
<body>
  <div class="container">
    <h1>DevContainer Tunneling Demo</h1>
    <span class="badge ${TUNNEL_TYPE}" id="tunnel-badge">Tunnel : ${TUNNEL_TYPE}</span>
    <div id="result">Cliquez sur le bouton pour tester l'API...</div>
    <button onclick="testApi()">Tester /api/hello</button>
  </div>
  <script>
    async function testApi() {
      const el = document.getElementById('result');
      el.textContent = 'Chargement...';
      try {
        const res = await fetch('/api/hello');
        const data = await res.json();
        el.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        el.textContent = 'Erreur : ' + err.message;
      }
    }
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Type de tunnel : ${TUNNEL_TYPE}`);
});
