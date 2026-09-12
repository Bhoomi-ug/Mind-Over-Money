function AIInsights() {
  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>AI Insights 🤖</h1>

      <p>
        Understand why our AI is making a particular stock prediction.
      </p>

      <div style={{ marginTop: "30px" }}>
        <h2>📈 AI Prediction</h2>
        <h1>Bullish</h1>
        <p>Confidence: 69%</p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>🛡️ Risk Assessment</h2>
        <h1>Medium</h1>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>🧠 Why the AI thinks this</h2>

        <p>• Short-term trend is positive</p>
        <p>• Moving averages support the trend</p>
        <p>• Momentum is improving</p>
        <p>• Volatility is moderate</p>
      </div>
    </div>
  );
}

export default AIInsights;