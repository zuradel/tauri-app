from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from inference import infer_text_api
import uvicorn
import asyncio
import uiautomator2 as u2
from typing import List, Dict, Any

PORT_API = 8008

app = FastAPI(
    title="API server",
    version="1.0.0",
)

# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_clients: List[WebSocket] = []

async def execute_adb_command(command: str) -> Dict[str, Any]:
    """Execute ADB command and return result"""
    print(command)
    try:
        d = u2.connect()
        if command == "status":
            return {"status": "connected", "device": d.info}
        elif command == "devices":
            return {"devices": d.devices()}
        elif command == "screen":
            return {"screen": d.info.get("displaySize")}
        elif command == "appinfo":
            return {"current_app": d.app_current()}
        else:
            return {"error": "Unknown command"}
    except Exception as e:
        return {"error": str(e), "command": command, "data": None}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            command = await websocket.receive_text()
            result = await execute_adb_command(command)
            await websocket.send_json(result)
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
    finally:
        connected_clients.remove(websocket)

async def broadcast_update(data: Dict[str, Any]) -> None:
    """Broadcast data to all connected clients"""
    for client in connected_clients:
        try:
            await client.send_json(data)
        except Exception as e:
            print(f"Broadcast error: {str(e)}")

def start_api_server() -> bool:
    try:
        print("Starting API server...")
        uvicorn.run(app, host="0.0.0.0", port=PORT_API, log_level="info")
        return True
    except Exception as e:
        print(f"Failed to start API server: {str(e)}")
        return False

if __name__ == "__main__":
    start_api_server()
