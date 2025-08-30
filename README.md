# Chimera Device Dashboard

A visualization-first dashboard for managing network devices with real-time actions and insights.

## Features

- **Device Visualization**: Interactive cards showing device status, classification, and metadata
- **Real-time Actions**: Isolate, release, and toggle blocklist categories
- **Smart Filtering**: Search and filter by device type, status, and properties
- **Live Statistics**: Real-time device counts and categorization
- **API Integration**: Full REST API for device management

## Quick Start

### 1. Start the Python API

```bash
cd api
pip install -r requirements.txt
python main.py
```

The API will run on `http://localhost:8000`

### 2. Start the React App

```bash
npm install
npm run dev
```

The web app will run on `http://localhost:3000`

## API Endpoints

- `GET /api/devices` - Get all devices
- `GET /api/summary` - Get device statistics
- `PATCH /api/devices/{id}` - Update device properties
- `POST /api/devices/{id}/actions` - Perform device actions

## Device Actions

- **Isolate**: Block all categories except safesearch
- **Release**: Unblock all categories (keep safesearch)
- **Toggle Block**: Toggle specific blocklist categories

## Configuration

Set the API URL in your environment:
```bash
export NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: Next.js + React + TypeScript
- **Styling**: Tailwind CSS
- **Data**: Local JSON storage
