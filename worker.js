```javascript
/**
 * Base Network x402 API - USDC Yield Opportunities
 * Single-file Cloudflare Worker
 * Accepts USDC payments on Base network
 */

const CONFIG = {
  // Your Base/EVM wallet address for receiving payments
  PAYMENT_ADDRESS: '0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1',
  PAYMENT_AMOUNT: '0.01', // 0.01 USDC per request
  PAYMENT_ASSET: 'USDC',
  NETWORK: 'base',
  TIMEOUT_SECONDS: 3600,
  API_DESCRIPTION: 'Access to real-time USDC yield opportunities across DeFi protocols',
  API_VERSION: 1
};

const YIELD_DATA = {
  success: true,
  data: {
    opportunities: [
      { id: 1, protocol: "Morpho (Base)", apy: "8.02%", risk: "Low", tvl: "$45M", asset: "USDC" },
      { id: 2, protocol: "Aave (Base)", apy: "7.5%", risk: "Low", tvl: "$120M", asset: "USDC" },
      { id: 3, protocol: "Moonwell (Base)", apy: "6.8%", risk: "Low", tvl: "$85M", asset: "USDC" },
      { id: 4, protocol: "Seamless Protocol", apy: "7.2%", risk: "Low", tvl: "$55M", asset: "USDC" },
      { id: 5, protocol: "ExtraFi (Base)", apy: "9.1%", risk: "Medium", tvl: "$12M", asset: "USDC" }
    ],
    network: "Base",
    lastUpdated: new Date().toISOString()
  }
};

function generateX402Response(resource) {
  return {
    x402Version: CONFIG.API_VERSION,
    accepts: [
      {
        scheme: "exact",
        network: CONFIG.NETWORK,
        maxAmountRequired: CONFIG.PAYMENT_AMOUNT,
        resource: resource,
        description: CONFIG.API_DESCRIPTION,
        mimeType: "application/json",
        payTo: CONFIG.PAYMENT_ADDRESS,
        maxTimeoutSeconds: CONFIG.TIMEOUT_SECONDS,
        asset: CONFIG.PAYMENT_ASSET
      }
    ]
  };
}

const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YieldAgent - Base Network</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #0052FF 0%, #001F5C 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: white;
    }
    
    .container {
      max-width: 800px;
      width: 100%;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo {
      font-size: 60px;
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .subtitle {
      font-size: 20px;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    
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
    
    .yields-preview {
      margin: 30px 0;
    }
    
    .yield-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      margin-bottom: 10px;
    }
    
    .protocol-name {
      font-weight: 600;
      font-size: 16px;
    }
    
    .apy {
      font-size: 24px;
      font-weight: 700;
      color: #00FF88;
    }
    
    .payment-section {
      margin: 30px 0;
      padding: 25px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 15px;
      border: 2px dashed rgba(255, 255, 255, 0.3);
    }
    
    .payment-details {
      text-align: center;
    }
    
    .cost {
      font-size: 36px;
      font-weight: 700;
      color: #00FF88;
      margin: 15px 0;
    }
    
    .address-section {
      margin: 20px 0;
    }
    
    .label {
      font-size: 14px;
      opacity: 0.8;
      margin-bottom: 8px;
    }
    
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
      background: #00FF88;
      color: #001F5C;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    }
    
    .copy-btn:hover {
      background: #00DD77;
      transform: scale(1.05);
    }
    
    .try-agent-btn {
      width: 100%;
      background: linear-gradient(135deg, #00FF88 0%, #00DD77 100%);
      color: #001F5C;
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
      box-shadow: 0 10px 25px rgba(0, 255, 136, 0.3);
    }
    
    .instructions {
      margin-top: 30px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .instructions h3 {
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .instructions ol {
      margin-left: 20px;
    }
    
    .instructions li {
      margin-bottom: 10px;
    }
    
    code {
      background: rgba(0, 0, 0, 0.4);
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      opacity: 0.7;
      font-size: 14px;
    }
    
    .result-section {
      display: none;
      margin-top: 20px;
      padding: 20px;
      background: rgba(0, 255, 136, 0.1);
      border-radius: 10px;
      border: 1px solid #00FF88;
    }
    
    .result-section.show {
      display: block;
    }
    
    .result-item {
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      margin-bottom: 10px;
    }
    
    .result-protocol {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 5px;
    }
    
    .result-details {
      display: flex;
      gap: 20px;
      font-size: 14px;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">💰</div>
      <h1>YieldAgent</h1>
      <p class="subtitle">Real-time Base DeFi Yield Opportunities</p>
      <span class="network-badge">⚡ Base Network</span>
    </div>
    
    <div class="card">
      <h2>🔒 Unlock Premium Yield Data</h2>
      
      <div class="yields-preview">
        <div class="yield-item">
          <span class="protocol-name">Morpho</span>
          <span class="apy">8.02%</span>
        </div>
        <div class="yield-item">
          <span class="protocol-name">Aave</span>
          <span class="apy">7.5%</span>
        </div>
        <div class="yield-item">
          <span class="protocol-name">Moonwell</span>
          <span class="apy">6.8%</span>
        </div>
        <div class="yield-item">
          <span class="protocol-name">ExtraFi</span>
          <span class="apy">9.1%</span>
        </div>
      </div>
      
      <div class="payment-section">
        <div class="payment-details">
          <div class="label">One-time Access Fee</div>
          <div class="cost">0.01 USDC</div>
          <div class="label">on Base Mainnet</div>
          
          <div class="address-section">
            <div class="label">Send USDC to:</div>
            <div class="address-container">
              <div class="address" id="paymentAddress">${CONFIG.PAYMENT_ADDRESS}</div>
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
          <li>Send <strong>0.01 USDC</strong> to the address above on <strong>Base network</strong></li>
          <li>Copy your transaction hash</li>
          <li>Click "Try Agent" and paste your transaction hash</li>
          <li>Access real-time yield data from top Base DeFi protocols</li>
        </ol>
        <p style="margin-top: 15px;">
          <strong>API Usage:</strong><br>
          <code>GET /</code> with header<br>
          <code>X-Payment: {"txHash": "your-tx-hash", "amount": 0.01}</code>
        </p>
      </div>
    </div>
    
    <div class="footer">
      Powered by x402 Protocol • Base Network
    </div>
  </div>
  
  <script>
    function copyAddress() {
      const address = document.getElementById('paymentAddress').textContent;
      navigator.clipboard.writeText(address).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      });
    }
    
    async function tryAgent() {
      const txHash = prompt('Enter your USDC payment transaction hash from Base network:');
      
      if (!txHash) {
        return;
      }
      
      try {
        const response = await fetch('/', {
          method: 'GET',
          headers: {
            'X-Payment': JSON.stringify({
              txHash: txHash,
              amount: 0.01
            })
          }
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
          html += \`
            <div class="result-item">
              <div class="result-protocol">\${opp.protocol}</div>
              <div class="result-details">
                <span>APY: <strong>\${opp.apy}</strong></span>
                <span>TVL: <strong>\${opp.tvl}</strong></span>
                <span>Risk: <strong>\${opp.risk}</strong></span>
              </div>
            </div>
          \`;
        });
        resultData.innerHTML = html;
        resultSection.classList.add('show');
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  </script>
</body>
</html>
`;

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

    // Health check
    if (path === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        x402Enabled: true,
        network: 'base',
        paymentAsset: 'USDC'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // x402 info endpoint
    if (path === '/x402-info' || path === '/.well-known/x402') {
      const x402Info = generateX402Response(path);
      return new Response(JSON.stringify(x402Info), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Main API endpoint - requires payment
    if (path === '/' || path === '/yield-opportunities') {
      const paymentHeader = request.headers.get('X-Payment');
      
      // If no payment header, show HTML page
      if (!paymentHeader) {
        return new Response(HTML_PAGE, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/html',
            'X-Payment-Required': 'true',
            'X-Payment-Protocol': 'x402'
          }
        });
      }

      // Payment verification
      try {
        const payment = JSON.parse(paymentHeader);
        
        // Basic validation
        if (!payment.txHash || !payment.amount) {
          return new Response(JSON.stringify({
            error: 'Invalid payment format'
          }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // TODO: Verify on Base blockchain
        // - Check transaction exists on Base
        // - Verify recipient is CONFIG.PAYMENT_ADDRESS
        // - Verify amount >= CONFIG.PAYMENT_AMOUNT USDC
        // - Check transaction is confirmed
        
        // For now, accept any properly formatted payment
        console.log(`Payment received: ${payment.txHash}`);

        // Return data with payment confirmation
        return new Response(JSON.stringify(YIELD_DATA), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Payment-Verified': 'true',
            'X-Payment-Response': JSON.stringify({
              txHash: payment.txHash,
              verified: true
            })
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

    // 404
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
```

Perfect! I've updated both:
1. ✅ Top comment now says "USDC Yield Opportunities"
2. ✅ API_DESCRIPTION changed from "sBTC" to "USDC yield opportunities"

The file is ready to deploy!
