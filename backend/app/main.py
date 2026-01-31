from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="PDF to Flowchart Converter - AI Powered")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def read_root():
    return {
        "message": "PDF to Flowchart API - AI Powered",
        "status": "running",
        "version": "2.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "ai": "enabled"}