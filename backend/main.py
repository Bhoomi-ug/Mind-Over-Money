from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
def create_features(df):
    df = df.copy()

    df["MA_5"] = df["Close"].rolling(5).mean()
    df["MA_10"] = df["Close"].rolling(10).mean()
    df["MA_20"] = df["Close"].rolling(20).mean()
    df["MA_50"] = df["Close"].rolling(50).mean()

    df["Price_vs_MA50"] = df["Close"] / df["MA_50"] - 1

    df["Volatility_20"] = (
        df["Close"].pct_change().rolling(20).std() * np.sqrt(252)
    )

    delta = df["Close"].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()

    rs = gain / loss
    df["RSI"] = 100 - (100 / (1 + rs))

    ema12 = df["Close"].ewm(span=12, adjust=False).mean()
    ema26 = df["Close"].ewm(span=26, adjust=False).mean()

    df["MACD"] = ema12 - ema26
    df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()
    df["MACD_Difference"] = df["MACD"] - df["MACD_Signal"]

    df["Momentum"] = df["Close"].pct_change(10)

    return df
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
        period="1y",
        auto_adjust=True,
        progress=False
    )

    if data.empty:
        return jsonify({
            "error": "Stock not found"
        }), 404

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    close = data["Close"]

    features = create_features(data)

    latest_features = features.dropna().iloc[-1]

    feature_columns = [
        "MA_5",
        "MA_10",
        "MA_20",
        "MA_50",
        "Price_vs_MA50",
        "Volatility_20",
        "RSI",
        "MACD",
        "MACD_Signal",
        "MACD_Difference",
        "Momentum"
    ]

    X_latest = latest_features[feature_columns].values.reshape(1, -1)

    prediction = model.predict(X_latest)[0]

    probabilities = model.predict_proba(X_latest)[0]

    confidence = float(max(probabilities) * 100)

    ai_signal = (
        "Likely to Rise"
        if prediction == 1
        else "Likely to Fall"
    )

    latest_price = float(close.iloc[-1])

    return jsonify({
        "symbol": symbol,
        "price": round(latest_price, 2),
        "prices": [
            round(float(price), 2)
            for price in close.tolist()
        ],
        "risk": "Medium",
        "ai_signal": ai_signal,
        "confidence": round(confidence, 2),
        "ml_model": "GradientBoosting"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5050,
        debug=True
    )