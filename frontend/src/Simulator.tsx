import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Simulator() {
  const [searchParams] = useSearchParams();

  const selectedSymbol = searchParams.get("symbol") || "TCS";

  const [balance, setBalance] = useState(100000);
  const [shares, setShares] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState("");

  const [stockPrice, setStockPrice] = useState(0);

  const [priceHistory, setPriceHistory] = useState<
    { day: number; price: number }[]
  >([]);

  const [visiblePrices, setVisiblePrices] = useState<
    { day: number; price: number }[]
  >([]);

  const [aiSignal, setAiSignal] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [risk, setRisk] = useState("");

  // Fetch stock data
  useEffect(() => {
    fetch(`http://127.0.0.1:5050/api/stock/${selectedSymbol}`)
      .then((response) => response.json())
      .then((data) => {
        setStockPrice(data.price);
        setAiSignal(data.ai_signal);
        setConfidence(data.confidence);
        setRisk(data.risk);

        const history = data.prices.map(
          (price: number, index: number) => ({
            day: index + 1,
            price,
          })
        );

        setPriceHistory(history);
        setVisiblePrices([]);
      })
      .catch(() => {
        console.log("Unable to fetch stock price");
      });
  }, [selectedSymbol]);

  // Animate historical graph
  useEffect(() => {
    if (priceHistory.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      setVisiblePrices((current) => {
        if (index >= priceHistory.length) {
          clearInterval(interval);
          return current;
        }

        const next = [...current, priceHistory[index]];

        index++;

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [priceHistory]);

  // Update simulator price as graph moves
  useEffect(() => {
    if (visiblePrices.length === 0) return;

    const latestPrice =
      visiblePrices[visiblePrices.length - 1].price;

    setStockPrice(latestPrice);
  }, [visiblePrices]);

  // BUY
  const buyStock = () => {
    const totalCost = quantity * stockPrice;

    if (quantity <= 0) {
      setMessage("Please enter a valid number of shares.");
      return;
    }

    if (totalCost > balance) {
      setMessage("Not enough virtual balance.");
      return;
    }

    setShares(quantity);
    setBuyPrice(stockPrice);
    setBalance(balance - totalCost);
    setDecision("BUY");

    setMessage(
      `You bought ${quantity} shares of ${selectedSymbol}.`
    );
  };

  // SELL
  const sellStock = () => {
    if (shares <= 0) {
      setMessage("You do not own any shares.");
      return;
    }

    const sellValue = shares * stockPrice;

    const profitLoss =
      (stockPrice - buyPrice) * shares;

    setBalance(balance + sellValue);
    setShares(0);
    setDecision("SELL");

    if (profitLoss > 0) {
      setMessage(
        `You made a profit of ₹${profitLoss.toFixed(
          2
        )} on ${selectedSymbol}.`
      );
    } else if (profitLoss < 0) {
      setMessage(
        `You made a loss of ₹${Math.abs(
          profitLoss
        ).toFixed(2)} on ${selectedSymbol}.`
      );
    } else {
      setMessage(
        `You broke even on ${selectedSymbol}.`
      );
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
      }}
    >
      <h1>Investment Simulator 🎮</h1>

      {/* Virtual Balance */}
      <div style={{ marginTop: "20px" }}>
        <h2>💰 Virtual Balance</h2>

        <h2>
          ₹{balance.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>
      </div>

      <p>
        Practice investing with virtual money — no real
        money at risk.
      </p>

      {/* AI Analysis */}
      <div style={{ marginTop: "30px" }}>
        <h2>🤖 AI Analysis</h2>

        <p>
          AI Signal:{" "}
          <strong>
            {aiSignal || "Analyzing..."}
          </strong>
        </p>

        <p>
          Confidence:{" "}
          <strong>
            {confidence
              ? `${confidence}%`
              : "—"}
          </strong>
        </p>

        <p>
          Risk:{" "}
          <strong>
            {risk || "—"}
          </strong>
        </p>
      </div>

      {/* Decision */}
      {decision && (
        <div style={{ marginTop: "30px" }}>
          <h2>🎯 Your Decision</h2>
          <h2>{decision}</h2>
        </div>
      )}

      {/* Stock */}
      <div style={{ marginTop: "30px" }}>
        <h2>📈 {selectedSymbol}</h2>

        <h2>
          ₹{stockPrice.toLocaleString("en-IN")}
        </h2>

        {/* Quantity */}
        <div style={{ marginTop: "20px" }}>
          <label>
            How many shares do you want to buy?
          </label>

          <br />

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Number(e.target.value))
            }
            style={{
              marginTop: "10px",
              padding: "10px",
              fontSize: "16px",
              width: "150px",
            }}
          />
        </div>
      </div>

      {/* Price Chart */}
      <div
        style={{
          marginTop: "30px",
          width: "100%",
          height: "300px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={visiblePrices}>
            <XAxis dataKey="day" />

            <YAxis
              domain={["auto", "auto"]}
            />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString(
                  "en-IN"
                )}`
              }
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#4ade80"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Actions */}
      <div style={{ marginTop: "30px" }}>
        <h2>Choose your action</h2>

        <button onClick={buyStock}>
          BUY
        </button>

        <button
          onClick={() => {
            setDecision("HOLD");
            setMessage(
              "HOLD decision recorded."
            );
          }}
          style={{ marginLeft: "10px" }}
        >
          HOLD
        </button>

        <button
          onClick={sellStock}
          style={{ marginLeft: "10px" }}
        >
          SELL
        </button>
      </div>

      {/* Position */}
      <div style={{ marginTop: "30px" }}>
        <h2>📦 Your Position</h2>

        <p>
          Shares owned: {shares}
        </p>

        {buyPrice > 0 && shares > 0 && (
          <p>
            Buy price: ₹
            {buyPrice.toLocaleString(
              "en-IN"
            )}
          </p>
        )}
      </div>

      {/* Message */}
      {message && (
        <p
          style={{
            marginTop: "20px",
            color: "#4ade80",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Simulator;