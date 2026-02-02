<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BASE402 — Pay-Per-Use APIs on Base</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --base-blue: #0052FF;
      --base-blue-light: #0A84FF;
      --base-blue-dark: #003DB8;
      --bg-dark: #0A0A0F;
      --card-bg: #111116;
      --border: #222228;
      --text-primary: #FFFFFF;
      --text-secondary: #9CA3AF;
      --success: #10B981;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg-dark);
      color: var(--text-primary);
      line-height: 1.6;
    }

    nav {
      position: fixed;
      top: 0;
      width: 100%;
      background: rgba(10, 10, 15, 0.9);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      padding: 1rem 0;
      z-index: 100;
    }

    nav .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    nav a {
      color: var(--text-secondary);
      text-decoration: none;
      margin-left: 2rem;
      transition: color 0.3s;
    }

    nav a:hover {
      color: var(--base-blue-light);
    }

    .hero {
      max-width: 1200px;
      margin: 0 auto;
      padding: 8rem 2rem 4rem;
      text-align: center;
    }

    .badge {
      display: inline-block;
      background: rgba(0, 82, 255, 0.1);
      border: 1px solid var(--base-blue);
      color: var(--base-blue-light);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 3rem;
      line-height: 1.8;
    }

    .highlight {
      color: var(--base-blue-light);
      font-weight: 600;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 900px;
      margin: 3rem auto;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--base-blue-light);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .section-intro {
      color: var(--text-secondary);
      margin-bottom: 3rem;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .service-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 2rem;
      transition: all 0.3s;
    }

    .service-card:hover {
      border-color: var(--base-blue);
      box-shadow: 0 8px 32px rgba(0, 82, 255, 0.2);
      transform: translateY(-4px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .service-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .verified-badge {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid var(--success);
    }

    .coming-soon-badge {
      background: rgba(156, 163, 175, 0.1);
      color: var(--text-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid var(--text-secondary);
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .service-description {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .service-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      color: var(--text-secondary);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .meta-value {
      color: var(--text-primary);
      font-weight: 600;
    }

    .btn {
      display: inline-block;
      background: linear-gradient(135deg, var(--base-blue) 0%, var(--base-blue-dark) 100%);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 82, 255, 0.4);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--base-blue);
      color: var(--base-blue-light);
    }

    .btn-outline:hover {
      background: rgba(0, 82, 255, 0.1);
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 3rem;
    }

    .step {
      text-align: center;
      padding: 2rem;
    }

    .step-number {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, var(--base-blue) 0%, var(--base-blue-dark) 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
      margin: 0 auto 1rem;
    }

    .step h4 {
      margin-bottom: 0.5rem;
    }

    .step p {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .cta-section {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 3rem;
      text-align: center;
      margin: 4rem 0;
    }

    footer {
      border-top: 1px solid var(--border);
      padding: 3rem 2rem;
      text-align: center;
      color: var(--text-secondary);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 1rem;
    }

    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-links a:hover {
      color: var(--base-blue-light);
    }

    @media (max-width: 768px) {
      nav .container {
        flex-direction: column;
        gap: 1rem;
      }

      nav a {
        margin-left: 1rem;
      }

      .hero {
        padding: 6rem 1rem 2rem;
      }

      h1 {
        font-size: 2rem;
      }

      .stats {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <div class="logo">
        <span class="logo-icon">🔵</span>
        <span>BASE402</span>
      </div>
      <div>
        <a href="#services">Services</a>
        <a href="#about">How It Works</a>
        <a href="#submit">Submit</a>
      </div>
    </div>
  </nav>

  <div class="hero">
    <div class="badge">1 service live on Base</div>
    <h1>Pay-per-use APIs on Base</h1>
    <p class="subtitle">
      No subscriptions. No API keys. Just <span class="highlight">USDC micro-payments</span>. Browse and use x402 services on Base, Ethereum's leading L2.
    </p>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">1</div>
        <div class="stat-label">Live Service</div>
      </div>
      <div class="stat">
        <div class="stat-value">0.01</div>
        <div class="stat-label">Avg USDC / Call</div>
      </div>
      <div class="stat">
        <div class="stat-value">100%</div>
        <div class="stat-label">Uptime</div>
      </div>
      <div class="stat">
        <div class="stat-value">300+</div>
        <div class="stat-label">Edge Locations</div>
      </div>
    </div>
  </div>

  <section id="services">
    <h2>Services</h2>
    <p class="section-intro">
      All services verified on Base mainnet
      <a href="#submit" style="color: var(--base-blue-light); margin-left: 1rem;">Submit yours →</a>
    </p>

    <div class="services-grid">
      <div class="service-card">
        <div class="card-header">
          <div class="service-icon">🤖</div>
          <span class="verified-badge">✓ Verified</span>
        </div>
        <h3>YieldAgent</h3>
        <p class="service-description">
          Real-time USDC yield intelligence from Morpho, Aave, Moonwell, Seamless, and ExtraFi. One call, all the data.
        </p>
        <div class="service-meta">
          <div class="meta-item">
            <div class="meta-label">Cost</div>
            <div class="meta-value">0.01 USDC</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Type</div>
            <div class="meta-value">DeFi</div>
          </div>
        </div>
        <a href="https://x402-yield-base.cryptoblac.workers.dev/" class="btn">Try YieldAgent →</a>
      </div>

      <div class="service-card">
        <div class="card-header">
          <div class="service-icon">🎯</div>
          <span class="coming-soon-badge">Coming Soon</span>
        </div>
        <h3>Base NFT Analytics</h3>
        <p class="service-description">
          Real-time NFT floor prices, sales volume, and market trends for Base collections.
        </p>
        <div class="service-meta">
          <div class="meta-item">
            <div class="meta-label">Cost</div>
            <div class="meta-value">0.01 USDC</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Type</div>
            <div class="meta-value">NFT</div>
          </div>
        </div>
        <button class="btn btn-outline" disabled>Launching Soon</button>
      </div>
    </div>
  </section>

  <section id="about">
    <h2>How It Works</h2>
    <p class="section-intro">
      x402 is a simple protocol. Services request micro-payments via HTTP 402. You pay with USDC. You get data. That's it.
    </p>

    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <h4>Browse</h4>
        <p>Find an x402 service you need on BASE402</p>
      </div>
      <div class="step">
        <div class="step-number">2</div>
        <h4>Discover</h4>
        <p>Check payment details via the x402 discovery endpoint</p>
      </div>
      <div class="step">
        <div class="step-number">3</div>
        <h4>Pay</h4>
        <p>Send a tiny USDC payment to the service address</p>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        <h4>Access</h4>
        <p>Include your tx proof and get instant data back</p>
      </div>
    </div>
  </section>

  <section id="submit">
    <div class="cta-section">
      <h2>Built an x402 service?</h2>
      <p style="color: var(--text-secondary); margin: 1rem 0 2rem;">
        Get listed on BASE402 and reach developers building on Base. Free listing, no strings attached.
      </p>
      <a href="mailto:submit@base402.dev" class="btn">Submit Your Service →</a>
    </div>
  </section>

  <footer>
    <div class="footer-content">
      <p>© 2026 BASE402. Built for the Base community.</p>
      <div class="footer-links">
        <a href="https://docs.base.org" target="_blank">Base Docs</a>
        <a href="https://discord.com/invite/buildonbase" target="_blank">Discord</a>
        <a href="#services">Services</a>
      </div>
    </div>
  </footer>
</body>
</html>
