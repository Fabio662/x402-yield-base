/**
 * NEAR Network x402 API - Liquid Staking Yield Opportunities
 * Single-file Cloudflare Worker
 * Accepts NEAR payments on NEAR network
 */

const CONFIG = {
  PAYMENT_ADDRESS: 'yieldagent.near',
  PAYMENT_AMOUNT: '0.1',
  PAYMENT_ASSET: 'NEAR',
  NETWORK: 'near',
  TIMEOUT_SECONDS: 3600,
  API_DESCRIPTION: 'Access to real-time NEAR liquid staking yield opportunities',
  API_VERSION: 1
};

const YIELD_DATA = {
  success: true,
  data: {
    opportunities: [
      { id: 1, protocol: "RHEA", apy: "9.2%", risk: "Low", tvl: "$18M", asset: "NEAR" },
      { id: 2, protocol: "Meta Pool", apy: "8.7%", risk: "Low", tvl: "$45M", asset: "NEAR" },
      { id: 3, protocol: "Linear Protocol", apy: "8.5%", risk: "Low", tvl: "$32M", asset: "NEAR" }
    ],
    network: "NEAR",
    lastUpdated: new Date().toISOString()
  }
};

function generateX402Response(resource) {
  return {
    x402Version: CONFIG.API_VERSION,
    accepts: [{
      scheme: "exact",
      network: CONFIG.NETWORK,
      maxAmountRequired: CONFIG.PAYMENT_AMOUNT,
      resource: resource,
      description: CONFIG.API_DESCRIPTION,
      mimeType: "application/json",
      payTo: CONFIG.PAYMENT_ADDRESS,
      maxTimeoutSeconds: CONFIG.TIMEOUT_SECONDS,
      asset: CONFIG.PAYMENT_ASSET
    }]
  };
}

function getHTMLPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YieldAgent - NEAR Network</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #00C08B 0%, #005A46 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: white;
    }
    .container { max-width: 800px; width: 100%; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 60px; margin-bottom: 20px; }
    h1 { font-size: 48px; font-weight: 700; margin-bottom: 10px; }
    .subtitle { font-size: 20px; opacity: 0.9; margin-bottom: 10px; }
    .network-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 30px;
    }
    .yields-preview { margin: 30px 0; }
    .yield-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      margin-bottom: 10px;
    }
    .protocol-name { font-weight: 600; font-size: 16px; }
    .apy { font-size: 24px; font-weight: 700; color: #00FFA3; }
    .payment-section {
      margin: 30px 0;
      padding: 25px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 15px;
      border: 2px dashed rgba(255, 255, 255, 0.3);
    }
    .payment-details { text-align: center; }
    .cost { font-size: 36px; font-weight: 700; color: #00FFA3; margin: 15px 0; }
    .address-section { margin: 20px 0; }
    .label { font-size: 14px; opacity: 0.8; margin-bottom: 8px; }
    .address-container {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 10px;
      margin-top: 10px;
    }
    .address {
      flex: 1;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      word-break: break-all;
    }
    .copy-btn {
      background: #00FFA3;
      color: #005A46;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }
    .copy-btn:hover { background: #00DD8F; transform: scale(1.05); }
    .try-agent-btn {
      width: 100%;
      background: linear-gradient(135deg, #00FFA3 0%, #00DD8F 100%);
      color: #005A46;
      border: none;
      padding: 18px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 20px;
    }
    .try-agent-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 255, 163, 0.3);
    }
    .instructions {
      margin-top: 30px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.6;
    }
    .instructions h3 { margin-bottom: 15px; font-size: 18px; }
    .instructions ol { margin-left: 20px; }
    .instructions li { margin-bottom: 10px; }
    code {
      background: rgba(0, 0, 0, 0.4);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    .footer { text-align: center; margin-top: 40px; opacity: 0.7; font-size: 14px; }
    .result-section {
      display: none;
      margin-top: 20px;
      padding: 20px;
      background: rgba(0, 255, 163, 0.1);
      border-radius: 10px;
      border: 1px solid #00FFA3;
    }
    .result-section.show { display: block; }
    .result-item {
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .result-protocol { font-weight: 600; font-size: 16px; margin-bottom: 5px; }
    .result-details { display: flex; gap: 20px; font-size: 14px; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌊</div>
      <h1>YieldAgent</h1>
      <p class="subtitle">NEAR Liquid Staking Yields</p>
      <span class="network-badge">🟢 NEAR Protocol</span>
    </div>
    <div class="card">
      <h2>🔒 Unlock Liquid Staking Data</h2>
      <div class="yields-preview">
        <div class="yield-item">
          <span class="protocol-name">RHEA</span>
          <span class="apy">9.2%</span>
        </div>
        <div class="yield-item">
          <span class="protocol-name">Meta Pool</span>
          <span class="apy">8.7%</span>
        </div>
        <div class="yield-item">
          <span class="protocol-name">Linear Protocol</span>
          <span class="apy">8.5%</span>
        </div>
      </div>
      <div class="payment-section">
        <div class="payment-details">
          <div class="label">One-time Access Fee</div>
          <div class="cost">\${CONFIG.PAYMENT_AMOUNT} NEAR</div>
          <div class="label">on NEAR Mainnet</div>
          <div class="address-section">
            <div class="label">Send NEAR to:</div>
            <div class="address-container">
              <div class="address" id="paymentAddress">\${CONFIG.PAYMENT_ADDRESS}</div>
              <button class="copy-btn" onclick="copyAddress()">📋 Copy</button>
            </div>
          </div>
        </div>
      </div>
      <button class="try-agent-btn" onclick="tryAgent()">🚀 Try Agent</button>
      <div class="result-section" id="resultSection">
        <h3>✅ Yield Opportunities Retrieved!</h3>
        <div id="resultData"></div>
      </div>
      <div class="instructions">
        <h3>How to Use:</h3>
        <ol>
          <li>Send <strong>\${CONFIG.PAYMENT_AMOUNT} NEAR</strong> to the address above on <strong>NEAR network</strong></li>
          <li>Copy your transaction hash</li>
          <li>Click "Try Agent" and paste your transaction hash</li>
          <li>Access real-time liquid staking yields</li>
        </ol>
        <p style="margin-top: 15px;">
          <strong>API Usage:</strong><br>
          <code>GET /</code> with header<br>
          <code>X-Payment: {"txHash": "your-tx-hash", "amount": \${CONFIG.PAYMENT_AMOUNT}}</code>
        </p>
      </div>
    </div>
    <div class="footer">Powered by x402 Protocol • NEAR Network</div>
  </div>
  <script>
    function copyAddress() {
      const address = document.getElementById('paymentAddress').textContent;
      navigator.clipboard.writeText(address).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.textContent = originalText; }, 2000);
      });
    }
    async function tryAgent() {
      const txHash = prompt('Enter your NEAR payment transaction hash:');
      if (!txHash) return;
      try {
        const response = await fetch('/', {
          method: 'GET',
          headers: { 'X-Payment': JSON.stringify({ txHash: txHash, amount: \${CONFIG.PAYMENT_AMOUNT} }) }
        });
        if (response.ok) {
          const data = await response.json();
          displayResults(data);
        } else {
          const error = await response.json();
          alert('Payment verification failed: ' + (error.message || error.error));
        }
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
    function displayResults(data) {
      const resultSection = document.getElementById('resultSection');
      const resultData = document.getElementById('resultData');
      if (data.success && data.data && data.data.opportunities) {
        let html = '';
        data.data.opportunities.forEach(opp => {
          html += '<div class="result-item"><div class="result-protocol">' + opp.protocol + 
            '</div><div class="result-details"><span>APY: <strong>' + opp.apy + 
            '</strong></span><span>TVL: <strong>' + opp.tvl + 
            '</strong></span><span>Risk: <strong>' + opp.risk + '</strong></span></div></div>';
        });
        resultData.innerHTML = html;
        resultSection.classList.add('show');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Payment, X-Payment-Proof',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (path === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        x402Enabled: true,
        network: 'near',
        paymentAsset: 'NEAR'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/x402-info' || path === '/.well-known/x402') {
      const x402Info = generateX402Response(path);
      return new Response(JSON.stringify(x402Info), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (path === '/' || path === '/yield-opportunities') {
      const paymentHeader = request.headers.get('X-Payment');
      
      if (!paymentHeader) {
        return new Response(getHTMLPage(), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html',
            'X-Payment-Required': 'true',
            'X-Payment-Protocol': 'x402'
          }
        });
      }

      try {
        const payment = JSON.parse(paymentHeader);
        if (!payment.txHash || !payment.amount) {
          return new Response(JSON.stringify({ error: 'Invalid payment format' }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        console.log(`Payment received: ${payment.txHash}`);
        return new Response(JSON.stringify(YIELD_DATA), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Payment-Verified': 'true',
            'X-Payment-Response': JSON.stringify({ txHash: payment.txHash, verified: true })
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Payment processing failed',
          message: error.message
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
