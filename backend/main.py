from fastapi import FastAPI

app = FastAPI(title="Mind Over Money API")


@app.get("/")
def home():
    return {
        "message": "Mind Over Money API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }