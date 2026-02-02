# YieldAgent - Base Network x402 API

Real-time USDC yield opportunities from top Base DeFi protocols via x402 payment protocol.

## 🚀 Live Service

**Endpoint:** `https://x402-yield-base.cryptoblac.workers.dev/`

## 📊 What It Does

YieldAgent aggregates real-time yield data from the top DeFi lending protocols on Base:

- **Morpho** - 8.02% APY
- **Aave** - 7.5% APY  
- **Moonwell** - 6.8% APY
- **Seamless Protocol** - 7.2% APY
- **ExtraFi** - 9.1% APY

Get all yield opportunities in one API call. No subscriptions. No API keys. Just pay-per-use with USDC.

## 💰 Pricing

- **Cost:** 0.01 USDC per request
- **Network:** Base Mainnet
- **Payment Asset:** USDC
- **Payment Address:** `0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1`

## 🔧 How to Use

### 1. Discovery (Check Price)
```bash
curl https://x402-yield-base.cryptoblac.workers.dev/x402-info
```

Returns payment requirements:
```json
{
  "x402Version": 1,
  "accepts": [{
    "scheme": "exact",
    "network": "base",
    "maxAmountRequired": "0.01",
    "payTo": "0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1",
    "asset": "USDC"
  }]
}
```

### 2. Make Payment

Send 0.01 USDC to `0x97d794dB5F8B6569A7fdeD9DF57648f0b464d4F1` on Base network.

### 3. Access Data
```bash
curl https://x402-yield-base.cryptoblac.workers.dev/ \
  -H "X-Payment: {\"txHash\": \"0xYOUR_TX_HASH\", \"amount\": 0.01}"
```

### 4. Get Response
```json
{
  "success": true,
  "data": {
    "opportunities": [
      {
        "id": 1,
        "protocol": "Morpho (Base)",
        "apy": "8.02%",
        "risk": "Low",
        "tvl": "$45M",
        "asset": "USDC"
      },
      ...
    ],
    "network": "Base",
    "lastUpdated": "2026-02-02T19:30:00.000Z"
  }
}
```

## 🌐 Web Interface

Visit the service directly in your browser:

👉 **https://x402-yield-base.cryptoblac.workers.dev/**

Features:
- Interactive payment interface
- One-click address copy
- Real-time data display
- Mobile-friendly design

## 🛠️ For Developers

### Integration Example (JavaScript)
```javascript
async function getYieldData(txHash) {
  const response = await fetch('https://x402-yield-base.cryptoblac.workers.dev/', {
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
    return data.data.opportunities;
  } else {
    throw new Error('Payment verification failed');
  }
}
```

### Integration Example (Python)
```python
import requests
import json

def get_yield_data(tx_hash):
    headers = {
        'X-Payment': json.dumps({
            'txHash': tx_hash,
            'amount': 0.01
        })
    }
    
    response = requests.get(
        'https://x402-yield-base.cryptoblac.workers.dev/',
        headers=headers
    )
    
    if response.ok:
        return response.json()['data']['opportunities']
    else:
        raise Exception('Payment verification failed')
```

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main API (requires payment) |
| `/x402-info` | GET | Discovery endpoint (free) |
| `/.well-known/x402` | GET | x402 protocol discovery |
| `/health` | GET | Health check |

## ⚡ Response Format
```typescript
interface YieldOpportunity {
  id: number;
  protocol: string;
  apy: string;
  risk: "Low" | "Medium" | "High";
  tvl: string;
  asset: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    opportunities: YieldOpportunity[];
    network: string;
    lastUpdated: string;
  }
}
```

## 🔒 Security

- Payment verification on Base blockchain
- CORS enabled for web applications
- No personal data collection
- Open-source smart contract verification

## 📝 Protocol

This service implements the **x402 protocol** - a standard for micropayment-gated HTTP APIs.

Learn more: [x402 Protocol Specification](https://github.com/x402-protocol/spec)

## 🤝 Support

- **Issues:** Open an issue on GitHub
- **Email:** support@base402.dev
- **Discord:** [Join Base Discord](https://discord.com/invite/buildonbase)

## 📜 License

MIT License - See LICENSE file for details

---

**Built for Base • Powered by x402 Protocol**
