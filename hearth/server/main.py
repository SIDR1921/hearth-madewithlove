import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from .routes import listener, coaching, forge, translate, profile, tts, service_care, incubator, departure

app = FastAPI(
    title="Hearth — Cultural Operating System API",
    description="Gemini-powered multi-agent backend for People-First workplace transformation",
    version="4.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(listener.router)
app.include_router(coaching.router)
app.include_router(service_care.router)
app.include_router(forge.router)
app.include_router(translate.router)
app.include_router(profile.router)
app.include_router(tts.router)
app.include_router(incubator.router)
app.include_router(departure.router)

@app.get("/")
async def root():
    return {
        "name": "Hearth API",
        "version": "4.0.0",
        "engine": "Gemini 2.5 Flash",
        "persona": "Aria",
        "agents": ["Introspection", "Inclusion Scout", "Metabolism Monitor", "Pathfinder"],
        "features": ["Active Listener", "GitHub Analyzer", "Humane Layoff", "Learning Path", "Departure Legacy"],
        "status": "🔥 Love as a Strategy"
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "agents": 4, "model": "gemini-3-flash-preview", "persona": "Aria"}

if __name__ == "__main__":
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)


