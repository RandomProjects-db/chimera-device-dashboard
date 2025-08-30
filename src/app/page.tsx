'use client';

import { useState, useEffect } from 'react';
import { Device } from '@/types/device';
import { api } from '@/services/api';
import DeviceCard from '@/components/DeviceCard';
import DeviceStats from '@/components/DeviceStats';
import DeviceFilters from '@/components/DeviceFilters';

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDevices = async () => {
    try {
      const data = await api.getDevices();
      setDevices(data);
      setFilteredDevices(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load devices. Make sure the API is running on http://localhost:8000');
      setLoading(false);
    }
  };

  const handleDeviceAction = async (deviceId: number, action: string, category?: string) => {
    try {
      const updatedDevice = await api.deviceAction(deviceId, action, category);
      
      // Update devices in state
      const newDevices = devices.map(d => d.id === deviceId ? updatedDevice : d);
      setDevices(newDevices);
      setFilteredDevices(prev => prev.map(d => d.id === deviceId ? updatedDevice : d));
    } catch (err) {
      alert('Failed to perform action');
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading devices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={loadDevices}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Chimera Device Dashboard
        </h1>
        
        <DeviceStats devices={filteredDevices} />
        
        <DeviceFilters 
          devices={devices} 
          onFilter={setFilteredDevices} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map(device => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              onAction={handleDeviceAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
