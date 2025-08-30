import { Device } from '@/types/device';

interface DeviceStatsProps {
  devices: Device[];
}

export default function DeviceStats({ devices }: DeviceStatsProps) {
  const activeDevices = devices.filter(d => d.is_active).length;
  const deviceTypes = [...new Set(devices.map(d => d.ai_classification.device_type))];
  const avgConfidence = devices.reduce((acc, d) => acc + d.ai_classification.confidence, 0) / devices.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-2xl font-bold text-blue-600">{devices.length}</div>
        <div className="text-gray-600">Total Devices</div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-2xl font-bold text-green-600">{activeDevices}</div>
        <div className="text-gray-600">Active Devices</div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-2xl font-bold text-purple-600">{deviceTypes.length}</div>
        <div className="text-gray-600">Device Types</div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-2xl font-bold text-orange-600">
          {Math.round(avgConfidence * 100)}%
        </div>
        <div className="text-gray-600">Avg Confidence</div>
      </div>
    </div>
  );
}
