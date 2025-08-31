# Chimera Device Dashboard

A visualization-first dashboard for managing network devices with real-time actions and insights.

## 🎥 Demo Video

**[Watch Live Demo](https://www.youtube.com/watch?v=jQ8hHeGImWo)** - See the dashboard in action with all visualizations and device management features.

## 🎯 Challenge Solution

This project implements the **Chimera Device Viz Challenge 2** with:
- **Python FastAPI backend** with all required endpoints
- **React web app** with advanced visualizations (Network Graph, Radial Clusters, Heatmap)
- **Real-time device actions** (isolate, release, toggle blocklist)
- **Visual-first interface** designed for non-technical users

## 🚀 Quick Start

### 1. Start the Python API

```bash
cd api
pip install -r requirements.txt
python main.py
```

The API runs on `http://localhost:8000`

### 2. Start the React Web App

```bash
npm install
npm run dev
```

The web app runs on `http://localhost:3000`

## 📡 API Endpoints

- `GET /api/devices` - Get all devices
- `GET /api/summary` - Get device statistics  
- `PATCH /api/devices/{id}` - Update device properties
- `POST /api/devices/{id}/actions` - Perform device actions

## 🎮 Device Actions

- **Isolate**: Block all categories except safesearch
- **Release**: Unblock all categories (keep safesearch)  
- **Toggle Block**: Toggle specific blocklist categories

## 🎨 Visualizations

1. **🌐 Network Graph** - Interactive force-directed layout showing device relationships
2. **🎯 Radial Clusters** - Devices grouped by category in radial formation
3. **🔥 Heatmap** - Group vs Category distribution matrix
4. **📱 Device Cards** - Detailed device information and actions

## ⚙️ Configuration

Set the API URL (if different from default):
```bash
export NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📁 Project Structure

```
/api/                 # Python FastAPI backend
  main.py            # FastAPI application
  devices.json       # Local device data
  requirements.txt   # Python dependencies
  
/src/                 # React web application
  app/               # Next.js app directory
  components/        # React components
  services/          # API service layer
  types/             # TypeScript definitions
  
devices.sample.json   # Sample device data
README.md            # This file
```

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js + React + TypeScript
- **Visualizations**: D3.js
- **Styling**: Tailwind CSS
- **Data**: Local JSON storage

## 🎯 Challenge Requirements Met

✅ Python API with all required endpoints  
✅ Visualization-first React client  
✅ Bold visual ideas (graphs, clusters, heatmaps)  
✅ Quick device actions from visualizations  
✅ Visual encodings for non-technical users  
✅ Search and filtering capabilities  
✅ Local JSON storage (no external services)  
✅ Complete device schema compliance
