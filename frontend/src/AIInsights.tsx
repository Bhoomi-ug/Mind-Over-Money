import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function AIInsights() {
  const [searchParams] = useSearchParams();

  const [symbol, setSymbol] = useState(
    searchParams.get("symbol") || "TCS"
  );

  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStock = async (stockSymbol: string) => {
    setLoading(true);
    setError("");
    setStock(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:5050/api/stock/${stockSymbol.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error("Stock could not be loaded");
      }

      const data = await response.json();

      setStock(data);
    } catch (err) {
      setError(
        "Unable to connect to the AI analysis service. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock(symbol);
  }, []);

  const handleSearch = () => {
    if (!symbol.trim()) return;

    loadStock(symbol.trim().toUpperCase());
  };

  const isRise = stock?.ai_signal === "Likely to Rise";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #06101d 0%, #0a1929 50%, #07111f 100%)",
        color: "white",
        paddingBottom: "60px",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "40px 30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "38px",
                margin: 0,
                fontWeight: 700,
              }}
            >
              AI Insights 🤖
            </h1>

            <p
              style={{
                color: "#9fb2c8",
                fontSize: "17px",
                marginTop: "10px",
              }}
            >
              Understand the AI behind your stock analysis.
            </p>
          </div>

          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#67e8f9",
              border: "1px solid #1e4d65",
              padding: "10px 18px",
              borderRadius: "10px",
            }}
          >
            ← Dashboard
          </Link>
        </div>

        {/* Stock Search */}
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "16px",
            background: "#0d2034",
            border: "1px solid #1d3b54",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Enter NSE stock symbol"
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "13px 15px",
                borderRadius: "10px",
                border: "1px solid #31516a",
                background: "#071522",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
            />

            <button
              onClick={handleSearch}
              style={{
                padding: "13px 24px",
                borderRadius: "10px",
                border: "none",
                background: "#4ade80",
                color: "#06101d",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Analyze Stock
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              marginTop: "30px",
              padding: "40px",
              textAlign: "center",
              borderRadius: "18px",
              background: "#0d2034",
              border: "1px solid #1d3b54",
            }}
          >
            <h2>🤖 AI is analyzing {symbol}...</h2>

            <p style={{ color: "#9fb2c8" }}>
              Studying recent price patterns and technical indicators.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            style={{
              marginTop: "30px",
              padding: "30px",
              borderRadius: "18px",
              background: "#24151a",
              border: "1px solid #6b2937",
            }}
          >
            <h2>⚠️ Analysis unavailable</h2>

            <p style={{ color: "#fca5a5" }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && stock && (
          <>
            {/* Stock heading */}
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#7f9ab5",
                    fontSize: "14px",
                  }}
                >
                  NSE STOCK
                </p>

                <h2
                  style={{
                    margin: "5px 0",
                    fontSize: "30px",
                  }}
                >
                  {stock.symbol}
                </h2>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    margin: 0,
                    color: "#7f9ab5",
                    fontSize: "14px",
                  }}
                >
                  CURRENT PRICE
                </p>

                <h2
                  style={{
                    margin: "5px 0",
                    fontSize: "28px",
                  }}
                >
                  ₹
                  {Number(stock.price).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h2>
              </div>
            </div>

            {/* Main AI Prediction */}
            <div
              style={{
                marginTop: "25px",
                padding: "32px",
                borderRadius: "22px",
                background:
                  "linear-gradient(135deg, #102a3b 0%, #102238 100%)",
                border: "1px solid #26516a",
                boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#8fa6bd",
                  fontSize: "15px",
                }}
              >
                🤖 AI MARKET OUTLOOK
              </p>

              <h2
                style={{
                  fontSize: "38px",
                  margin: "12px 0",
                  color: isRise ? "#4ade80" : "#f87171",
                }}
              >
                {isRise
                  ? "📈 Likely to Rise"
                  : "📉 Likely to Fall"}
              </h2>

              <p
                style={{
                  color: "#c5d2df",
                  fontSize: "16px",
                  lineHeight: "1.6",
                }}
              >
                Our machine-learning model detects a{" "}
                <strong>
                  {isRise ? "positive" : "negative"}
                </strong>{" "}
                probability signal based on recent market patterns.
              </p>

              {/* Confidence bar */}
              <div style={{ marginTop: "25px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#9fb2c8" }}>
                    Model confidence
                  </span>

                  <strong>{stock.confidence}%</strong>
                </div>

                <div
                  style={{
                    height: "10px",
                    background: "#183247",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(stock.confidence, 100)}%`,
                      height: "100%",
                      background: isRise
                        ? "#4ade80"
                        : "#f87171",
                      borderRadius: "20px",
                    }}
                  />
                </div>
              </div>

              <p
                style={{
                  marginTop: "20px",
                  color: "#8299ae",
                  fontSize: "13px",
                }}
              >
                ⚠️ AI predictions are probability estimates, not guarantees
                of future stock performance.
              </p>
            </div>

            {/* Two cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
                marginTop: "22px",
              }}
            >
              {/* Risk */}
              <div
                style={{
                  padding: "25px",
                  borderRadius: "18px",
                  background: "#0d2034",
                  border: "1px solid #1d3b54",
                }}
              >
                <p style={{ color: "#8fa6bd" }}>
                  🛡️ RISK ASSESSMENT
                </p>

                <h2
                  style={{
                    fontSize: "30px",
                    margin: "10px 0",
                  }}
                >
                  {stock.risk}
                </h2>

                <p
                  style={{
                    color: "#a8b9c9",
                    lineHeight: "1.6",
                  }}
                >
                  Risk is estimated using recent price volatility.
                  Higher volatility means the stock has experienced
                  larger price movements.
                </p>
              </div>

              {/* Model */}
              <div
                style={{
                  padding: "25px",
                  borderRadius: "18px",
                  background: "#0d2034",
                  border: "1px solid #1d3b54",
                }}
              >
                <p style={{ color: "#8fa6bd" }}>
                  🧠 ML MODEL
                </p>

                <h2
                  style={{
                    fontSize: "25px",
                    margin: "10px 0",
                  }}
                >
                  {stock.ml_model || "GradientBoosting"}
                </h2>

                <p
                  style={{
                    color: "#a8b9c9",
                    lineHeight: "1.6",
                  }}
                >
                  The model combines multiple technical indicators
                  to classify meaningful potential price movement.
                </p>
              </div>
            </div>

            {/* Why AI thinks this */}
            <div
              style={{
                marginTop: "22px",
                padding: "28px",
                borderRadius: "18px",
                background: "#0d2034",
                border: "1px solid #1d3b54",
              }}
            >
              <h2>🧠 Why does the AI think this?</h2>

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div>
                  <strong>📊 Price trends</strong>

                  <p style={{ color: "#9fb2c8" }}>
                    The model studies recent historical price behavior
                    to identify patterns.
                  </p>
                </div>

                <div>
                  <strong>📈 Moving averages</strong>

                  <p style={{ color: "#9fb2c8" }}>
                    Moving averages help the model understand whether
                    the recent trend is strengthening or weakening.
                  </p>
                </div>

                <div>
                  <strong>⚡ Momentum</strong>

                  <p style={{ color: "#9fb2c8" }}>
                    Momentum indicators measure the strength of recent
                    price movement.
                  </p>
                </div>

                <div>
                  <strong>📉 Volatility</strong>

                  <p style={{ color: "#9fb2c8" }}>
                    Volatility helps estimate how sharply the stock has
                    been moving.
                  </p>
                </div>

                <div>
                  <strong>🔗 Multiple signals</strong>

                  <p style={{ color: "#9fb2c8" }}>
                    The Gradient Boosting model combines these signals
                    rather than relying on one indicator alone.
                  </p>
                </div>
              </div>
            </div>

            {/* Beginner explanation */}
            <div
              style={{
                marginTop: "22px",
                padding: "28px",
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg, #10283a, #0d2034)",
                border: "1px solid #24516a",
              }}
            >
              <h2>🎓 What does this mean for a beginner?</h2>

              <p
                style={{
                  color: "#c1cfdb",
                  lineHeight: "1.8",
                }}
              >
                Think of our AI as a pattern detector. It looks at
                historical market information and technical indicators
                and estimates which direction has the stronger signal.
              </p>

              <p
                style={{
                  color: "#c1cfdb",
                  lineHeight: "1.8",
                }}
              >
                <strong>Likely to Rise</strong> means the model currently
                sees a stronger upward signal.{" "}
                <strong>Likely to Fall</strong> means it sees a stronger
                downward signal.
              </p>

              <p
                style={{
                  color: "#c1cfdb",
                  lineHeight: "1.8",
                }}
              >
                This should be used as an educational decision-support
                tool, not as a promise about what the market will do.
              </p>
            </div>

            {/* Bottom actions */}
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to={`/simulator?symbol=${stock.symbol}`}
                style={{
                  textDecoration: "none",
                  padding: "13px 20px",
                  borderRadius: "10px",
                  background: "#4ade80",
                  color: "#06101d",
                  fontWeight: 700,
                }}
              >
                🎮 Try in Simulator
              </Link>

              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  padding: "13px 20px",
                  borderRadius: "10px",
                  border: "1px solid #31516a",
                  color: "#b9c9d8",
                }}
              >
                View Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AIInsights;