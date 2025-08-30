from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import json
import os

app = FastAPI(title="Chimera Device API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage
DATA_FILE = "devices.json"

def load_devices():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_devices(devices):
    with open(DATA_FILE, 'w') as f:
        json.dump(devices, f, indent=2)

class DeviceUpdate(BaseModel):
    given_name: str = None
    group: Dict[str, Any] = None

class DeviceAction(BaseModel):
    action: str
    category: str = None

@app.get("/api/devices")
def get_devices():
    return load_devices()

@app.get("/api/summary")
def get_summary():
    devices = load_devices()
    
    total = len(devices)
    active = sum(1 for d in devices if d.get('is_active', False))
    
    by_group = {}
    by_category = {}
    
    for device in devices:
        # Group counts
        group_name = device.get('group', {}).get('name', 'Unknown')
        by_group[group_name] = by_group.get(group_name, 0) + 1
        
        # Category counts
        category = device.get('ai_classification', {}).get('device_category', 'Unknown')
        by_category[category] = by_category.get(category, 0) + 1
    
    return {
        "total": total,
        "active": active,
        "by_group": by_group,
        "by_category": by_category
    }

@app.patch("/api/devices/{device_id}")
def update_device(device_id: int, update: DeviceUpdate):
    devices = load_devices()
    
    device = next((d for d in devices if d['id'] == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    if update.given_name is not None:
        device['given_name'] = update.given_name
    
    if update.group is not None:
        device['group']['id'] = update.group.get('id', device['group']['id'])
        # In a real app, you'd look up group name from ID
        device['group']['name'] = update.group.get('name', device['group']['name'])
    
    save_devices(devices)
    return device

@app.post("/api/devices/{device_id}/actions")
def device_action(device_id: int, action: DeviceAction):
    devices = load_devices()
    
    device = next((d for d in devices if d['id'] == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    blocklist = device.get('blocklist', {})
    
    if action.action == "isolate":
        # Set all blocklist items to true
        for key in blocklist:
            if key != 'safesearch':
                blocklist[key] = True
        device['has_custom_blocklist'] = True
        
    elif action.action == "release":
        # Set all blocklist items to false except safesearch
        for key in blocklist:
            if key != 'safesearch':
                blocklist[key] = False
            else:
                blocklist[key] = True
        device['has_custom_blocklist'] = True
        
    elif action.action == "toggle_block":
        if not action.category or action.category not in blocklist:
            raise HTTPException(status_code=400, detail="Invalid category")
        blocklist[action.category] = not blocklist[action.category]
        device['has_custom_blocklist'] = True
    
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    save_devices(devices)
    return device

@app.get("/")
def root():
    return {"message": "Chimera Device API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
