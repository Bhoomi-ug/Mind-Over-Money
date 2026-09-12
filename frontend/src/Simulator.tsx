import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Simulator() {
  const [balance, setBalance] = useState(100000);
  const [shares, setShares] = useState(0);
  const [message, setMessage] = useState("");

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
  fetch("http://127.0.0.1:5050/api/stock/TCS")
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
}, []);
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
    const quantity = Math.floor(balance / stockPrice);

    if (quantity > 0) {
      setShares(quantity);
      setBalance(balance - quantity * stockPrice);
      setMessage(`You bought ${quantity} shares of TCS.`);
    }
  };

  const sellStock = () => {
    if (shares > 0) {
      setBalance(balance + shares * stockPrice);
      setMessage(`You sold ${shares} shares of TCS.`);
      setShares(0);
    }
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Investment Simulator 🎮</h1>

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

      <div style={{ marginTop: "30px" }}>
        <h2>📈 TCS</h2>
        <h2>₹{stockPrice.toLocaleString("en-IN")}</h2>
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
          onClick={() => setMessage("HOLD decision recorded.")}
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