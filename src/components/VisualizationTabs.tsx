'use client';

import { useState } from 'react';
import { Device } from '@/types/device';
import NetworkGraph from './NetworkGraph';
import RadialCluster from './RadialCluster';
import DeviceHeatmap from './DeviceHeatmap';
import DeviceCard from './DeviceCard';

interface VisualizationTabsProps {
  devices: Device[];
  onDeviceAction: (deviceId: number, action: string, category?: string) => void;
}

export default function VisualizationTabs({ devices, onDeviceAction }: VisualizationTabsProps) {
  const [activeTab, setActiveTab] = useState('network');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const tabs = [
    { id: 'network', label: 'Network Graph', icon: '🌐' },
    { id: 'radial', label: 'Radial Clusters', icon: '🎯' },
    { id: 'heatmap', label: 'Heatmap', icon: '🔥' },
    { id: 'cards', label: 'Device Cards', icon: '📱' }
  ];

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visualization Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'network' && (
            <NetworkGraph devices={devices} onDeviceClick={handleDeviceClick} />
          )}
          {activeTab === 'radial' && (
            <RadialCluster devices={devices} onDeviceClick={handleDeviceClick} />
          )}
          {activeTab === 'heatmap' && (
            <DeviceHeatmap devices={devices} onDeviceClick={handleDeviceClick} />
          )}
          {activeTab === 'cards' && (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Device Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {devices.map(device => (
                  <DeviceCard 
                    key={device.id} 
                    device={device} 
                    onAction={onDeviceAction}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Device Details Panel */}
        <div className="lg:col-span-1">
          {selectedDevice ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Device Details</h3>
              <DeviceCard device={selectedDevice} onAction={onDeviceAction} />
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Blocklist Status</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedDevice.blocklist).map(([key, value]) => (
                      <div key={key} className={`p-2 rounded ${value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        <div className="font-medium">{key.replace('_', ' ')}</div>
                        <div>{value ? 'Blocked' : 'Allowed'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">AI Classification</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {selectedDevice.ai_classification.device_type}</div>
                    <div><strong>Category:</strong> {selectedDevice.ai_classification.device_category}</div>
                    <div><strong>Confidence:</strong> {Math.round(selectedDevice.ai_classification.confidence * 100)}%</div>
                    <div><strong>Reasoning:</strong> {selectedDevice.ai_classification.reasoning}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Network Info</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Hostname:</strong> {selectedDevice.hostname}</div>
                    <div><strong>MAC:</strong> {selectedDevice.mac}</div>
                    <div><strong>OS:</strong> {selectedDevice.os_name} ({selectedDevice.os_accuracy}% accuracy)</div>
                    <div><strong>First Seen:</strong> {new Date(selectedDevice.first_seen).toLocaleDateString()}</div>
                    <div><strong>Last Seen:</strong> {new Date(selectedDevice.last_seen).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Device Details</h3>
              <p className="text-gray-500 text-center py-8">
                Click on a device in the visualization to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
