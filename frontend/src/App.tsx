import { useState } from "react";
import "./App.css";

function App() {
  const [symbol, setSymbol] = useState("TCS");
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchStock = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5050/api/stock/${symbol}`
      );

      if (!response.ok) {
        throw new Error("Stock not found");
      }

      const data = await response.json();
      setStock(data);
    } catch (err) {
      setError("Unable to fetch stock data");
      setStock(null);
    }

    setLoading(false);
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">◈ Mind Over Money</div>

        <div className="nav-links">
          <span>Dashboard</span>
          <span>AI Insights</span>
          <span>Simulator</span>
          <span>Learn</span>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">

        <div>
          <div className="badge">
            ✦ AI-powered investing for beginners
          </div>

          <h1 className="hero-title">
            Invest smarter.
            <br />
            <span>Understand better.</span>
          </h1>

          <p className="hero-text">
            Mind Over Money transforms complicated stock-market data
            into simple, understandable insights so first-time investors
            can make more confident decisions.
          </p>

          <div className="search-box">
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter NSE stock e.g. TCS"
            />

            <button onClick={searchStock}>
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {error && (
            <p style={{ color: "#ff6b6b", marginTop: "12px" }}>
              {error}
            </p>
          )}
        </div>

        {/* STOCK CARD */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <div className="stock-name">
                {stock?.symbol || "TCS"}
              </div>

              <div className="stock-symbol">
                NSE • AI Analysis
              </div>
            </div>

            <div className="badge">
              AI
            </div>
          </div>

          <div className="price">
            ₹{stock?.price?.toLocaleString("en-IN") || "2,200.80"}
          </div>

          <div className="positive">
            ● Live market data
          </div>

          <div className="chart"></div>

          <div className="metrics">

            <div className="metric">
              <div className="metric-label">
                Risk
              </div>
              <div className="metric-value">
                Medium
              </div>
            </div>

            <div className="metric">
              <div className="metric-label">
                AI Signal
              </div>
              <div className="metric-value positive">
                Bullish
              </div>
            </div>

            <div className="metric">
              <div className="metric-label">
                Confidence
              </div>
              <div className="metric-value">
                74.9%
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">

        <h2 className="section-title">
          Everything a first-time investor needs
        </h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Stock Analysis</h3>
            <p>
              Machine-learning models analyze market patterns and
              generate understandable stock insights.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Simple Explanations</h3>
            <p>
              Confused by P/E, volatility or MACD? Our AI explains
              financial concepts in beginner-friendly language.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Risk Assessment</h3>
            <p>
              Understand whether an investment is low, medium or
              high risk before making a decision.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Smart Recommendations</h3>
            <p>
              Personalized investment suggestions based on risk
              tolerance and investor preferences.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Investment Simulator</h3>
            <p>
              Practice investing with virtual money and learn from
              your decisions without risking real capital.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Learn & Earn Badges</h3>
            <p>
              Gamified learning helps beginners build financial
              knowledge while progressing through challenges.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        Mind Over Money • Making investing understandable
      </footer>

    </div>
  );
}

export default App;