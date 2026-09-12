import { Link } from "react-router-dom";
import "./App.css";

function Help() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          ◈ Mind Over Money
        </div>

        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/ai-insights">AI Insights</Link>
          <Link to="/simulator">Simulator</Link>
          <span>Learn</span>
        </div>
      </nav>

      {/* HEADER */}
      <section className="hero-section">
        <div>
          <div className="badge">
            📚 Beginner Learning Center
          </div>

          <h1 className="hero-title">
            Learn before you
            <br />
            <span>invest.</span>
          </h1>

          <p className="hero-text">
            New to the stock market? Don't worry.
            Mind Over Money explains important investing
            concepts in simple language so you can understand
            what you're actually investing in.
          </p>
        </div>

        <div className="dashboard-card">
          <h2>🎯 Your learning journey</h2>

          <p style={{ marginTop: "20px" }}>
            1️⃣ Understand the basics
          </p>

          <p>
            2️⃣ Learn how stocks are analyzed
          </p>

          <p>
            3️⃣ Understand risk
          </p>

          <p>
            4️⃣ Practice with virtual money
          </p>

          <p>
            5️⃣ Make smarter decisions
          </p>
        </div>
      </section>

      {/* BASIC CONCEPTS */}
      <section className="features">

        <h2 className="section-title">
          Stock market basics
        </h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">📈</div>

            <h3>What is a stock?</h3>

            <p>
              A stock represents a small ownership share
              in a company. When you buy a stock, you become
              a shareholder of that company.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>

            <h3>What is a stock price?</h3>

            <p>
              A stock price is the current market value
              at which buyers and sellers are trading a
              company's shares.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚠️</div>

            <h3>What is risk?</h3>

            <p>
              Risk is the possibility that an investment
              may lose value. Higher potential returns
              often come with higher uncertainty.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>

            <h3>What is volatility?</h3>

            <p>
              Volatility measures how much a stock's price
              tends to move over time. More movement generally
              means more uncertainty.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔢</div>

            <h3>What is P/E ratio?</h3>

            <p>
              P/E compares a company's share price with
              its earnings per share. It is commonly used
              to understand how expensive a stock may be
              relative to its earnings.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💵</div>

            <h3>What is dividend yield?</h3>

            <p>
              Dividend yield shows the annual dividend
              paid by a company relative to its stock price.
              It can help investors understand income from
              dividend-paying stocks.
            </p>
          </div>

        </div>

      </section>

      {/* HOW MIND OVER MONEY WORKS */}
      <section className="features">

        <h2 className="section-title">
          How Mind Over Money helps you
        </h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🔍</div>

            <h3>1. Analyze a stock</h3>

            <p>
              Search for an NSE stock and view its current
              market information and historical price movement.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>

            <h3>2. Understand the AI analysis</h3>

            <p>
              Our machine-learning system analyzes market
              features and provides an easy-to-understand
              directional signal.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>

            <h3>3. Check the risk</h3>

            <p>
              Review the stock's volatility-based risk level
              before making a decision.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎮</div>

            <h3>4. Practice investing</h3>

            <p>
              Use the simulator to buy and sell stocks using
              virtual money without risking real capital.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="features">

        <div className="dashboard-card" style={{ textAlign: "center" }}>

          <h2>
            Ready to practice? 🚀
          </h2>

          <p style={{ marginTop: "15px" }}>
            Head to the simulator and test your investment
            decisions using virtual money.
          </p>

          <Link to="/simulator">
            <button style={{ marginTop: "20px" }}>
              Start Simulator
            </button>
          </Link>

        </div>

      </section>

      <footer className="footer">
        Mind Over Money • Learn • Understand • Practice
      </footer>

    </div>
  );
}

export default Help;