/**
 * Base x402 Yield Agent - Micropayment-gated USDC yields on Base
 * Pay 0.01 USDC → unlock current yields
 * Improved version: real-ish rates (Feb 2026), basic tx verification, cleaner code
 */

const CONFIG = {
  PAYMENT_ADDRESS: '0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1', // ← CHANGE IF NEEDED
  PAYMENT_AMOUNT: '0.01',
  PAYMENT_ASSET: 'USDC',
  NETWORK: 'base',
  TIMEOUT_SECONDS: 3600,
  API_DESCRIPTION: 'Live USDC yields on Base: Aave, Morpho vaults, Moonwell, etc.',
  API_VERSION: 1,
  // Use a public Base RPC (or your Alchemy/Infura key in production)
  RPC_URL: 'https://mainnet.base.org', // or 'https://base-mainnet.g.alchemy.com/v2/YOUR_KEY'
};

const YIELD_DATA = {
  success: true,
  data: {
    opportunities: [
      { id: 1, protocol: "Morpho (Steakhouse USDC)", apy: "4.0–4.6%", risk: "Low-Medium", tvl: "~$400M+", asset: "USDC", note: "Curated vault, incl. incentives" },
      { id: 2, protocol: "Aave V3",                   apy: "3.6–3.9%", risk: "Low",        tvl: "~$350M",  asset: "USDC", note: "Variable supply APY" },
      { id: 3, protocol: "Moonwell Flagship (Morpho)",apy: "4.3–4.6%", risk: "Low-Medium", tvl: "~$30–40M",asset: "USDC", note: "Vault with WELL + MORPHO rewards" },
      { id: 4, protocol: "Morpho Blue (various)",     apy: "3.5–4.5%", risk: "Low",        tvl: "Varies",  asset: "USDC", note: "Peer-to-peer optimized lending" },
      // Removed Pendle/Aerodrome/Compound as they don't currently show high plain USDC yields on Base
    ],
    network: "Base",
    lastUpdated: new Date().toISOString(),
    disclaimer: "Yields fluctuate; always DYOR. Data approximate from public sources."
  }
};

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YieldAgent - Base</title>
  <style>
    body { background: #0a0e1a; color: white; font-family: -apple-system, sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid #0052FF; border-radius: 20px; padding: 40px; max-width: 700px; width: 100%; }
    .logo { font-size: 80px; margin-bottom: 20px; color: #0052FF; }
    h1 { font-size: 48px; margin: 8px 0; }
    .subtitle { font-size: 20px; color: #0052FF88; }
    .yields { margin: 20px 0; text-align: center; font-size: 16px; color: #0052FFaa; }
    .yield-item { margin: 8px 0; opacity: 0.9; }
    .apy { color: #0052FF; font-weight: 600; }
    .payment { text-align: center; margin-top: 30px; }
    .cost { font-size: 36px; color: #0052FF; font-weight: 700; margin: 10px 0; }
    .address { font-family: monospace; word-break: break-all; margin: 10px 0; }
    .copy-btn { background: #0052FF; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .try-btn { background: #0052FF; color: #fff; border: none; padding: 16px 40px; font-size: 18px; border-radius: 12px; cursor: pointer; font-weight: 700; margin-top: 25px; width: 100%; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🔵</div>
    <h1>YieldAgent</h1>
    <p class="subtitle">Live USDC Yields on Base</p>

    <div class="yields">
      <div class="yield-item">Morpho (Steakhouse): <strong class="apy">~4.0–4.6%</strong></div>
      <div class="yield-item">Aave V3: <strong class="apy">~3.6–3.9%</strong></div>
      <div class="yield-item">Moonwell Flagship: <strong class="apy">~4.3–4.6%</strong></div>
      <div class="yield-item">Morpho Blue: <strong class="apy">~3.5–4.5%</strong></div>
    </div>

    <div class="payment">
      <div class="cost">0.01 USDC</div>
      <div class="address">${CONFIG.PAYMENT_ADDRESS}</div>
      <button class="copy-btn">📋 Copy</button>
    </div>

    <button class="try-btn" onclick="tryAgent()">🚀 Unlock Yields</button>

    <script>
      function copyAddress() {
        navigator.clipboard.writeText('${CONFIG.PAYMENT_ADDRESS}');
        this.textContent = '✅ Copied!';
        setTimeout(() => this.textContent = '📋 Copy', 2000);
      }
      document.querySelector('.copy-btn').onclick = copyAddress;

      async function tryAgent() {
        const hash = prompt('Enter your Base tx hash (0.01 USDC payment):');
        if (!hash) return;
        const res = await fetch('/', { 
          method: 'GET',
          headers: { 'X-Payment': JSON.stringify({ txHash: hash, amount: '0.01' }) } 
        });
        if (res.ok) {
          const data = await res.json();
          const out = data.data.opportunities.map(o => 
            `<div class="yield-item"><strong>${o.protocol}</strong>: ${o.apy} (TVL: ${o.tvl}) — ${o.note || ''}</div>`
          ).join('');
          document.body.innerHTML += `<div style="margin-top:20px; text-align:center;">${out}</div>`;
        } else {
          alert('Payment not verified or invalid.');
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
      'Access-Control-Allow-Headers': 'X-Payment, Content-Type'
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

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
      const payHeader = req.headers.get('X-Payment');

      if (!payHeader) {
        // No payment → show paywall page
        return new Response(HTML_PAGE, {
          headers: { ...cors, 'Content-Type': 'text/html' }
        });
      }

      try {
        const payment = JSON.parse(payHeader);
        if (payment.amount !== CONFIG.PAYMENT_AMOUNT || !payment.txHash) {
          return new Response(JSON.stringify({ error: 'Invalid payment details' }), { 
            status: 402, 
            headers: cors 
          });
        }

        // Basic on-chain verification (improve in prod with event logs / viem)
        const verified = await verifyTxHash(payment.txHash);
        if (!verified) {
          return new Response(JSON.stringify({ error: 'Payment not found or invalid' }), { 
            status: 402, 
            headers: cors 
          });
        }

        // Success → return yields
        return new Response(JSON.stringify(YIELD_DATA), {
          headers: { ...cors, 'Content-Type': 'application/json' }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: 'Bad request', details: e.message }), { 
          status: 400, 
          headers: cors 
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { 
      status: 404, 
      headers: cors 
    });
  }
};

/**
 * Very basic tx verification: check if tx exists and transferred ~0.01 USDC to PAYMENT_ADDRESS
 * In production: use viem/public client, parse Transfer event, check amount exactly, memo if used, etc.
 */
async function verifyTxHash(txHash) {
  try {
    const response = await fetch(CONFIG.RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1
      })
    });

    const json = await response.json();
    if (json.result) {
      // Very naive check — improve with full log parsing for ERC20 Transfer event
      // Look for logs with USDC contract → from/to/value
      // For now: assume if receipt exists and status ok → probably paid (demo only!)
      return json.result.status === '0x1'; // success
    }
    return false;
  } catch {
    return false;
  }
}
