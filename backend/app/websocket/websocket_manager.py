from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Maps room code string to active WebSocket instances
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_code: str):
        await websocket.accept()
        if room_code not in self.active_connections:
            self.active_connections[room_code] = []
        self.active_connections[room_code].append(websocket)

    def disconnect(self, websocket: WebSocket, room_code: str):
        if room_code in self.active_connections:
            if websocket in self.active_connections[room_code]:
                self.active_connections[room_code].remove(websocket)
            if not self.active_connections[room_code]:
                del self.active_connections[room_code]

    async def broadcast(self, message: str, room_code: str):
        if room_code in self.active_connections:
            for connection in self.active_connections[room_code]:
                try:
                    await connection.send_text(message)
                except Exception:
                    # Ignore failed transmissions on broken connections
                    pass

manager = ConnectionManager()

@router.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    room_code = room_code.upper()
    await manager.connect(websocket, room_code)
    try:
        # Notify joining
        await manager.broadcast(json.dumps({
            "event": "participant_joined",
            "message": "A peer has joined the room."
        }), room_code)
        
        while True:
            # Listen to incoming event streams
            data = await websocket.receive_text()
            event_payload = json.loads(data)
            
            # Re-broadcast payload (speech, start, end, ai responses) to all active channels
            await manager.broadcast(json.dumps(event_payload), room_code)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_code)
        await manager.broadcast(json.dumps({
            "event": "participant_left",
            "message": "A participant has disconnected."
        }), room_code)
