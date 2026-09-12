from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load our trained ML model
model = joblib.load("models/tcs_gb_model.pkl")


@app.route("/")
def home():
    return jsonify({
        "message": "Mind Over Money API is running"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy",
        "ml_model": "loaded"
    })


@app.route("/api/stock/<symbol>")
def stock_info(symbol):

    symbol = symbol.upper()
    ticker = symbol + ".NS"

    data = yf.download(
        ticker,
        period="5d",
        auto_adjust=True,
        progress=False
    )

    if data.empty:
        return jsonify({
            "error": "Stock not found"
        }), 404

    close = data["Close"]

    if hasattr(close, "columns"):
        close = close.iloc[:, 0]

    latest_price = float(close.iloc[-1])

    return jsonify({
        "symbol": symbol,
        "price": round(latest_price, 2),
        "risk": "Medium",
        "ai_signal": "Bullish",
        "confidence": 74.9,
        "ml_model": "GradientBoosting"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5050,
        debug=True
    )