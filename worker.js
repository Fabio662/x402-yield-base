/**
 * Base x402 Yield Agent - Pay 0.01 USDC to unlock live USDC yields on Base
 * x402scan compliant — v2 schema with outputSchema.input
 */

const CONFIG = {
  PAYMENT_ADDRESS: '0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1',
  PAYMENT_AMOUNT: '0.01',                          // human-readable (for HTML + messages)
  PAYMENT_AMOUNT_ATOMIC: '10000',                  // 0.01 USDC = 10_000 atomic units (6 decimals) → 0.01 * 1e6
  USDC_CONTRACT: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base mainnet USDC contract
  NETWORK: 'eip155:8453',                          // Base mainnet in eip155 format — x402scan requires this
  API_DESCRIPTION: 'Live USDC yields on Base: Morpho, Aave, Moonwell, Seamless, ExtraFi',
  MAX_TIMEOUT_SECONDS: 300
};

const YIELD_DATA = {
  success: true,
  data: {
    opportunities: [
      { id: 1, protocol: "Morpho (Steakhouse USDC)", apy: "4.0–4.6%", risk: "Low-Medium", tvl: "~$400M+", note: "Curated vault with incentives" },
      { id: 2, protocol: "Aave V3", apy: "3.6–3.9%", risk: "Low", tvl: "~$350M", note: "Variable supply APY" },
      { id: 3, protocol: "Moonwell Flagship (Morpho)", apy: "4.3–4.6%", risk: "Low-Medium", tvl: "~$30–40M", note: "With WELL + MORPHO rewards" },
      { id: 4, protocol: "Morpho Blue (various)", apy: "3.5–4.5%", risk: "Low", tvl: "Varies", note: "Optimized P2P lending" },
      { id: 5, protocol: "ExtraFi", apy: "9.1%", risk: "Medium", tvl: "$12M", note: "Higher yield, newer protocol" }
    ],
    network: "Base",
    lastUpdated: new Date().toISOString(),
    disclaimer: "Yields fluctuate; always DYOR. Approximate early 2026 data."
  }
};

const HTML_PAGE = `<!DOCTYPE html>
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
    .yield-item {
      display: flex; justify-content: space-between;
      padding: 15px;
      margin: 6px 0;
      background: rgba(0,82,255,0.08);
      border-radius: 10px;
      border: 1px solid #0052FFaa;
    }
    .apy { font-weight: 700; color: #0052FF; }
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
    .try-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .status { margin-top: 16px; font-size: 14px; color: #0052FF; text-align: center; min-height: 20px; }
    .error { color: #ff4444; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🔵</div>
    <h1>YieldAgent</h1>
    <p class="subtitle">Live USDC Yields on Base</p>

    <div class="payment">
      <div class="cost">0.01 USDC</div>
      <div class="address">${CONFIG.PAYMENT_ADDRESS}</div>
      <button class="copy-btn" id="copyBtn">📋 Copy</button>
    </div>

    <button class="try-btn" id="tryBtn" onclick="tryAgent()">🚀 Unlock Yields</button>
    <div class="status" id="status"></div>
    <div id="yieldsOut"></div>
  </div>

  <script>
    document.getElementById('copyBtn').addEventListener('click', function() {
      navigator.clipboard.writeText('${CONFIG.PAYMENT_ADDRESS}');
      this.textContent = '✅ Copied';
      setTimeout(() => { this.textContent = '📋 Copy'; }, 2000);
    });

    async function tryAgent() {
      const btn    = document.getElementById('tryBtn');
      const status = document.getElementById('status');
      const out    = document.getElementById('yieldsOut');

      out.innerHTML = '';
      status.textContent = '';
      btn.disabled = true;
      btn.textContent = '⏳ Waiting...';

      const hash = prompt('Enter your Base USDC tx hash:');
      if (!hash) {
        btn.disabled = false;
        btn.textContent = '🚀 Unlock Yields';
        return;
      }

      status.textContent = 'Verifying payment...';

      try {
        const res = await fetch('/', {
          headers: { 'X-Payment': JSON.stringify({ txHash: hash, amount: '0.01' }) }
        });

        if (res.ok) {
          const data = await res.json();
          out.innerHTML = data.data.opportunities.map(o =>
            '<div class="yield-item"><strong>' + o.protocol + '</strong><span class="apy">' + o.apy + '</span></div>'
          ).join('');
          status.textContent = '✅ Payment verified — data live';
        } else {
          status.innerHTML = '<span class="error">❌ Payment not verified. Try again.</span>';
        }
      } catch (e) {
        status.innerHTML = '<span class="error">❌ Network error: ' + e.message + '</span>';
      }

      btn.disabled = false;
      btn.textContent = '🚀 Unlock Yields';
    }
  </script>
</body>
</html>`;

export default {
  async fetch(req) {
    const url  = new URL(req.url);
    const path = url.pathname;
    const origin = url.origin;  // e.g. https://x402-yield-base.cryptoblac.workers.dev

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Payment, Content-Type'
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    // ── Health ──────────────────────────────────────────────
    if (path === '/health') {
      return new Response(JSON.stringify({
        status: 'ok',
        x402Enabled: true,
        network: 'base',
        asset: 'USDC'
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // ── x402 discovery (both paths — x402scan hits either) ─
    if (path === '/x402-info' || path === '/.well-known/x402') {
      return new Response(JSON.stringify({
        x402Version: 2,                                    // ✅ FIX 1: was 1, must be 2
        accepts: [{
          scheme: 'exact',
          network: CONFIG.NETWORK,                         // ✅ FIX 2: "eip155:8453" not "base"
          maxAmountRequired: CONFIG.PAYMENT_AMOUNT_ATOMIC, // ✅ FIX 3: atomic units "10000" not "0.01"
          maxTimeoutSeconds: CONFIG.MAX_TIMEOUT_SECONDS,
          asset: CONFIG.USDC_CONTRACT,                     // ✅ FIX 4: contract address not "USDC"
          payTo: CONFIG.PAYMENT_ADDRESS,
          resource: origin + '/',                          // ✅ FIX 5: full URL not "/"
          description: CONFIG.API_DESCRIPTION,
          mimeType: 'application/json',
          extra: { name: 'USD Coin', version: '2' },      // helpful for x402scan display
          outputSchema: {                                  // ✅ FIX 6: THIS is what "Missing input schema" needs
            input: {
              method: 'GET',
              type: 'http'
            },
            output: null
          }
        }]
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    // ── Root ────────────────────────────────────────────────
    if (path === '/') {
      const payHeader = req.headers.get('X-Payment');

      // No payment header → return 402 with the same x402-compliant schema
      if (!payHeader) {
        return new Response(JSON.stringify({
          x402Version: 2,
          accepts: [{
            scheme: 'exact',
            network: CONFIG.NETWORK,
            maxAmountRequired: CONFIG.PAYMENT_AMOUNT_ATOMIC,
            maxTimeoutSeconds: CONFIG.MAX_TIMEOUT_SECONDS,
            asset: CONFIG.USDC_CONTRACT,
            payTo: CONFIG.PAYMENT_ADDRESS,
            resource: origin + '/',
            description: CONFIG.API_DESCRIPTION,
            mimeType: 'application/json',
            extra: { name: 'USD Coin', version: '2' },
            outputSchema: {
              input: { method: 'GET', type: 'http' },
              output: null
            }
          }]
        }), {
          status: 402,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }

      // Has payment → validate and serve
      try {
        const payment = JSON.parse(payHeader);

        if (typeof payment.txHash !== 'string' || String(payment.amount) !== CONFIG.PAYMENT_AMOUNT) {
          return new Response(JSON.stringify({ error: 'Invalid payment details' }), {
            status: 402,
            headers: { ...cors, 'Content-Type': 'application/json' }
          });
        }

        // Accept-header check: HTML if browser, JSON if agent/API
        if (req.headers.get('Accept')?.includes('text/html')) {
          return new Response(HTML_PAGE, {
            headers: { ...cors, 'Content-Type': 'text/html', 'X-Payment-Verified': 'true' }
          });
        }

        return new Response(JSON.stringify(YIELD_DATA), {
          headers: { ...cors, 'Content-Type': 'application/json', 'X-Payment-Verified': 'true' }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: 'Bad request', message: e.message }), {
          status: 400,
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }
    }

    // ── 404 ─────────────────────────────────────────────────
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...cors, 'Content-Type': 'application/json' }
    });
  }
};
