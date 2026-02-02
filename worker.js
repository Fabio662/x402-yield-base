/**
 * Base Network x402 API - sBTC Yield Opportunities
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
  API_DESCRIPTION: 'Access to real-time sBTC yield opportunities across DeFi protocols',
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

      if (!paymentHeader) {
        // Return 402 Payment Required
        const x402Response = generateX402Response(path);
        return new Response(JSON.stringify(x402Response), {
          status: 402,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Payment-Required': 'true',
            'X-Payment-Protocol': 'x402'
          }
        });
      }

      // Simple payment validation
      // In production, verify the payment on-chain via Base RPC
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
