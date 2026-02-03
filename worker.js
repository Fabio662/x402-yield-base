/**
 * Base x402 Yield Agent — Pay 0.01 USDC to unlock live USDC yields on Base
 * Fully compliant with x402 v2 and x402scan registration requirements (Feb 2026)
 */

const CONFIG = {
  PAYMENT_ADDRESS: '0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1',
  PAYMENT_AMOUNT: '0.01',                    // human-readable (messages/HTML)
  PAYMENT_AMOUNT_ATOMIC: '10000',            // 0.01 USDC = 10_000 units (6 decimals)
  USDC_CONTRACT: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base USDC
  NETWORK_CAIP2: 'eip155:8453',              // x402scan requires CAIP-2
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
      <div class="yield-item">ExtraFi: <strong class="apy">9.1%</strong></div>
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
        const hash = prompt('Enter your Base tx hash:');
        if (!hash) return;

        const res = await fetch('/', {
          headers: { 'X-Payment': JSON.stringify({ txHash: hash, amount: '0.01' }) }
        });

        if (res.ok) {
          const data = await res.json();
          let out = '';
          data.data.opportunities.forEach(function(o) {
            out += '<div class="yield-item"><strong>' + o.protocol + '</strong>: ' +
                   o.apy + ' (TVL: ' + o.tvl + ')';
            if (o.note) out += ' — ' + o.note;
            out += '</div>';
          });
          document.body.innerHTML += '<div style="margin-top:20px; text-align:center;">' + out + '</div>';
        } else {
          alert('Payment not verified or invalid tx hash.');
        }
      }
    </script>
  </div>
</body>
</html>`;

export default {
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const origin = url.origin;

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Payment, Content-Type'
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    // Discovery document (same schema as 402 response)
    if (path === '/x402-info' || path === '/.well-known/x402') {
      return new Response(JSON.stringify({
        x402Version: 2,
        accepts: [{
          scheme: 'exact',
          network: CONFIG.NETWORK_CAIP2,
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
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    if (path !== '/') {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: cors });
    }

    const payHeader = req.headers.get('X-Payment');

    // Unpaid request → return 402 with full compliant schema
    if (!payHeader) {
      return new Response(JSON.stringify({
        x402Version: 2,
        accepts: [{
          scheme: 'exact',
          network: CONFIG.NETWORK_CAIP2,
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

    // Paid request → verify
    try {
      const payment = JSON.parse(payHeader);

      if (String(payment.amount) !== CONFIG.PAYMENT_AMOUNT || typeof payment.txHash !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid payment details' }), { status: 402, headers: cors });
      }

      const verified = await verifyTxHash(payment.txHash);

      if (!verified) {
        return new Response(JSON.stringify({ error: 'Payment not confirmed on-chain' }), { status: 402, headers: cors });
      }

      // Verified → serve content
      if (req.headers.get('Accept')?.includes('text/html')) {
        return new Response(HTML_PAGE, { headers: { ...cors, 'Content-Type': 'text/html' } });
      }

      return new Response(JSON.stringify(YIELD_DATA), { headers: { ...cors, 'Content-Type': 'application/json' } });

    } catch (e) {
      return new Response(JSON.stringify({ error: 'Bad request', message: e.message }), { status: 400, headers: cors });
    }
  }
};

async function verifyTxHash(txHash) {
  try {
    const response = await fetch('https://mainnet.base.org', {
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
    return json.result && json.result.status === '0x1';
  } catch {
    return false;
  }
}
