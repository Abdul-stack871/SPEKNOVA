from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import users, sessions, rooms
from app.websocket import websocket_manager

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(sessions.router, prefix=f"{settings.API_V1_STR}/sessions", tags=["sessions"])
app.include_router(rooms.router, prefix=f"{settings.API_V1_STR}/rooms", tags=["rooms"])
app.include_router(websocket_manager.router, tags=["websockets"])

@app.get("/")
def read_root():
    return {"message": "Welcome to SpekNova API. Navigate to /docs for API documentation."}

@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0"
    }
