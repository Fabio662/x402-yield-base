/**
 * Base x402 Yield Agent
 * Pay 0.01 USDC → unlock yields
 */

const CONFIG = {
  PAYMENT_ADDRESS: '0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1',
  PAYMENT_AMOUNT: '0.01',
  PAYMENT_ASSET: 'USDC',
  NETWORK: 'base',
  TIMEOUT_SECONDS: 3600,
  API_DESCRIPTION: 'Live yields: Pendle, Aerodrome, Compound, Aave, Morpho, Moonwell',
  API_VERSION: 1
};

const YIELD_DATA = {
  success: true,
  data: {
    opportunities: [
      { id: 1, protocol: "Pendle",         apy: "11.3%",  risk: "Low",    tvl: "$210M", asset: "USDC" },
      { id: 2, protocol: "Aerodrome",      apy: "8.4%",   risk: "Low",    tvl: "$85M",  asset: "USDC" },
      { id: 3, protocol: "Compound",       apy: "6.9%",   risk: "Low",    tvl: "$180M", asset: "USDC" },
      { id: 4, protocol: "Aave",           apy: "7.5%",   risk: "Low",    tvl: "$120M", asset: "USDC" },
      { id: 5, protocol: "Morpho",         apy: "8.02%",  risk: "Low",    tvl: "$45M",  asset: "USDC" },
      { id: 6, protocol: "Moonwell",       apy: "6.8%",   risk: "Low",    tvl: "$85M",  asset: "USDC" }
    ],
    network: "Base",
    lastUpdated: new Date().toISOString()
  }
};

const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YieldAgent - Base</title>
  <style>
    body {
      background: #0a0e1a;
      color: white;
      font-family: -apple-system, sans-serif;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: rgba(255,255,255,0.05);
      border: 1px solid #0052FF;
      border-radius: 20px;
      padding: 40px;
      max-width: 700px;
      width: 100%;
    }
    .logo { font-size: 80px; margin-bottom: 20px; color: #0052FF; }
    h1 { font-size: 48px; margin: 8px 0; }
    .subtitle { font-size: 20px; color: #0052FF88; }
    .yields {
      margin: 20px 0;
      text-align: center;
      font-size: 16px;
      color: #0052FFaa;
    }
    .yield-item {
      margin: 8px 0;
      opacity: 0.9;
    }
    .apy { color: #0052FF; font-weight: 600; }
    .payment { text-align: center; margin-top: 30px; }
    .cost { font-size: 36px; color: #0052FF; font-weight: 700; margin: 10px 0; }
    .address { font-family: monospace; word-break: break-all; margin: 10px 0; }
    .copy-btn {
      background: #0052FF; color: #fff; border: none;
      padding: 12px 24px; border-radius: 8px; font-weight: 600;
      cursor: pointer; margin-top: 8px;
    }
    .try-btn {
      background: #0052FF; color: #fff; border: none;
      padding: 16px 40px; font-size: 18px; border-radius: 12px;
      cursor: pointer; font-weight: 700; margin-top: 25px; width: 100%;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🔵</div>
    <h1>YieldAgent</h1>
    <p class="subtitle">Live on Base</p>

    <div class="yields">
      <div class="yield-item">Pendle: <strong class="apy">11.3%</strong></div>
      <div class="yield-item">Aerodrome: <strong class="apy">8.4%</strong></div>
      <div class="yield-item">Compound: <strong class="apy">6.9%</strong></div>
      <div class="yield-item">Aave: <strong class="apy">7.5%</strong></div>
      <div class="yield-item">Morpho: <strong class="apy">8.02%</strong></div>
      <div class="yield-item">Moonwell: <strong class="apy">6.8%</strong></div>
    </div>

    <div class="payment">
      <div class="cost">0.01 USDC</div>
      <div class="address">${CONFIG.PAYMENT_ADDRESS}</div>
      <button class="copy-btn">📋 Copy</button>
    </div>

    <button class="try-btn" onclick="tryAgent()">🚀 Try Agent</button>

    <script>
      function copyAddress() {
        navigator.clipboard.writeText('${CONFIG.PAYMENT_ADDRESS}');
        this.textContent = '✅ Copied';
        setTimeout(() => this.textContent = '📋 Copy', 2000);
      }
      document.querySelector('.copy-btn').onclick = copyAddress;

      async function tryAgent() {
        const hash = prompt('Enter your Base USDC tx hash:');
        if (!hash) return;
        const res = await fetch('/', {
          headers: { 'X-Payment': JSON.stringify({ txHash: hash, amount: 0.01 }) }
        });
        if (res.ok) {
          const data = await res.json();
          const out = data.data.opportunities.map(o => 
            \`<div class="yield-item"><strong>\${o.protocol}</strong>: \${o.apy} (TVL: \${o.tvl})</div>\`
          ).join('');
          document.body.innerHTML += \`<div style="margin-top:20px">\${out}</div>\`;
        } else {
          alert('Payment not verified.');
        }
      }
    </script>
  </div>
</body>
</html>
`;

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const path = url.pathname;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Payment'
    };

    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    if (path === '/x402-info') {
      return new Response(JSON.stringify({
        x402Version: 1,
        accepts: [{
          scheme: 'exact',
          network: 'base',
          maxAmountRequired: '0.01',
          asset: 'USDC',
          payTo: CONFIG.PAYMENT_ADDRESS,
          resource: '/',
          description: CONFIG.API_DESCRIPTION,
          mimeType: 'application/json'
        }]
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    if (path === '/') {
      const pay = req.headers.get('X-Payment');
      if (!pay) {
        return new Response(HTML_PAGE, {
          headers: { ...cors, 'Content-Type': 'text/html' }
        });
      }
      try {
  
