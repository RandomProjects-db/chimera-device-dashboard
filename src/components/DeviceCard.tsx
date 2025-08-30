import { Device } from '@/types/device';
import { useState } from 'react';

interface DeviceCardProps {
  device: Device;
  onAction: (deviceId: number, action: string, category?: string) => void;
}

export default function DeviceCard({ device, onAction }: DeviceCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (isActive: boolean) => 
    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAction = (action: string, category?: string) => {
    onAction(device.id, action, category);
    setShowActions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {device.given_name}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.is_active)}`}>
          {device.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div><strong>IP:</strong> {device.ip}</div>
        <div><strong>MAC:</strong> {device.mac}</div>
        <div><strong>Vendor:</strong> {device.vendor}</div>
        <div><strong>OS:</strong> {device.os_name}</div>
        <div><strong>Group:</strong> {device.group.name}</div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {device.ai_classification.device_type}
          </span>
          <span className={`text-sm font-medium ${getConfidenceColor(device.ai_classification.confidence)}`}>
            {Math.round(device.ai_classification.confidence * 100)}%
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {device.ai_classification.device_category}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {!showActions ? (
          <button
            onClick={() => setShowActions(true)}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Actions
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleAction('isolate')}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                Isolate
              </button>
              <button
                onClick={() => handleAction('release')}
                className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Release
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <button
                onClick={() => handleAction('toggle_block', 'social_media')}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Social Media
              </button>
              <button
                onClick={() => handleAction('toggle_block', 'streaming')}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Streaming
              </button>
              <button
                onClick={() => handleAction('toggle_block', 'gaming')}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Gaming
              </button>
              <button
                onClick={() => handleAction('toggle_block', 'youtube')}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                YouTube
              </button>
            </div>
            <button
              onClick={() => setShowActions(false)}
              className="w-full px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
