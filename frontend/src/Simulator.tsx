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

  const buyStock = () => {
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
  setBalance(balance - totalCost);
  setDecision("BUY");
  setMessage(
    `You bought ${quantity} shares of ${selectedSymbol}.`
  );
};

    if (quantity > 0) {
        setDecision("BUY");
      setShares(quantity);
      setBalance(balance - quantity * stockPrice);
      setMessage(`You bought ${quantity} shares of ${selectedSymbol}.`);
    }
  };

  const sellStock = () => {
    setDecision("SELL");
    if (shares > 0) {
      setBalance(balance + shares * stockPrice);
      setMessage(`You sold ${shares} shares of ${selectedSymbol}.`);
      setShares(0);
    }
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Investment Simulator 🎮</h1>
      <div style={{ marginTop: "20px" }}>
  <h2>💰 Virtual Balance</h2>
  <h2>₹{balance.toFixed(2)}</h2>
</div>

      <p>
        Practice investing with virtual money — no real money at risk.
      </p>

      <div style={{ marginTop: "30px" }}>
  <h2>🤖 AI Analysis</h2>

  <p>
    AI Signal: <strong>{aiSignal || "Analyzing..."}</strong>
  </p>

  <p>
    Confidence: <strong>{confidence ? `${confidence}%` : "—"}</strong>
  </p>

  <p>
    Risk: <strong>{risk || "—"}</strong>
  </p>
</div>
{decision && (
  <div style={{ marginTop: "30px" }}>
    <h2>🎯 Your Decision</h2>
    <h2>{decision}</h2>
  </div>
)}

      <div style={{ marginTop: "30px" }}>
        <h2>📈 {selectedSymbol}</h2>
        <h2>₹{stockPrice.toLocaleString("en-IN")}</h2>
        <div style={{ marginTop: "20px" }}>
  <label>How many shares do you want to buy?</label>

  <br />

  <input
    type="number"
    min="1"
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
    style={{
      marginTop: "10px",
      padding: "10px",
      fontSize: "16px",
      width: "150px",
    }}
  />
</div>
      </div>
      <div
  style={{
    marginTop: "30px",
    width: "100%",
    height: "300px",
  }}
>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={visiblePrices}>
      <XAxis dataKey="day" />
      <YAxis domain={["auto", "auto"]} />
      <Tooltip
        formatter={(value) =>
          `₹${Number(value).toLocaleString("en-IN")}`
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

      <div style={{ marginTop: "30px" }}>
        <h2>Choose your action</h2>

        <button onClick={buyStock}>BUY</button>

        <button
          onClick={() => {
  setDecision("HOLD");
  setMessage("HOLD decision recorded.");
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

      <div style={{ marginTop: "30px" }}>
        <h2>📦 Your Position</h2>
        <p>Shares owned: {shares}</p>
      </div>

      {message && (
        <p style={{ marginTop: "20px", color: "#4ade80" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Simulator;