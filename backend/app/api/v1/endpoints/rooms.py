from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, List
import random
import string
from app.core.auth import get_current_user

router = APIRouter()

# In-memory multiplayer rooms database
ROOMS_DB: Dict[str, dict] = {}

class RoomCreateSchema(BaseModel):
    topic: str

def generate_room_code() -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.post("/")
def create_room(payload: RoomCreateSchema, current_user: dict = Depends(get_current_user)):
    """
    Creates a new multiplayer discussion room with a unique join code.
    """
    code = generate_room_code()
    room_data = {
        "room_code": code,
        "host_id": current_user.get("sub"),
        "topic": payload.topic,
        "status": "LOBBY",
        "participants": [
            {
                "user_id": current_user.get("sub"),
                "email": current_user.get("email"),
                "name": current_user.get("user_metadata", {}).get("full_name", "Host Participant")
            }
        ]
    }
    ROOMS_DB[code] = room_data
    return room_data

@router.get("/{code}")
def get_room_details(code: str, current_user: dict = Depends(get_current_user)):
    """
    Checks if a room exists and returns details/status.
    """
    code = code.upper()
    if code not in ROOMS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Multiplayer room code not found"
        )
    return ROOMS_DB[code]
