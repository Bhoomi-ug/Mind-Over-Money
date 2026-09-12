import { useEffect, useState } from "react";

function Simulator() {
  const [balance, setBalance] = useState(100000);
  const [shares, setShares] = useState(0);
  const [message, setMessage] = useState("");

  const [stockPrice, setStockPrice] = useState(0);
  useEffect(() => {
  fetch("http://127.0.0.1:5050/api/stock/TCS")
    .then((response) => response.json())
    .then((data) => {
      setStockPrice(data.price);
    })
    .catch(() => {
      console.log("Unable to fetch stock price");
    });
}, []);

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
        <h2>💰 Virtual Balance</h2>
        <h1>₹{balance.toLocaleString("en-IN")}</h1>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>📈 TCS</h2>
        <h2>₹{stockPrice.toLocaleString("en-IN")}</h2>
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