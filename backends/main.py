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
        return {"error": str(e)}

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

@app.get("/api/v1/connect")
async def connect() -> Dict[str, str]:
    return {
        "message": f"Connected to api server on port {PORT_API}. Refer to 'http://localhost:{PORT_API}/docs' for api sssdo đcs.",
    }

@app.post("/api/v1/text/inference/load")
async def load_inference(data: Dict[str, str]) -> Dict[str, str]:
    try:
        model_id = data["modelId"]
        return {"message": f"AI model [{model_id}] loaded."}
    except KeyError:
        raise HTTPException(
            status_code=400, 
            detail="Invalid JSON format: 'modelId' key not found"
        )

@app.post("/api/v1/text/inference/completions")
async def run_completion(data: Dict[str, Any]) -> Dict[str, Any]:
    print("endpoint: /completions")
    return infer_text_api.completions(data)

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
