from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Mind Over Money API is running"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    })


@app.route("/api/stock/<symbol>")
def stock_info(symbol):
    ticker = symbol.upper() + ".NS"

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
        "symbol": symbol.upper(),
        "price": round(latest_price, 2)
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5050,
        debug=True
    )