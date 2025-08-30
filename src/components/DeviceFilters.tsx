import { useState } from 'react';
import { Device } from '@/types/device';

interface DeviceFiltersProps {
  devices: Device[];
  onFilter: (filtered: Device[]) => void;
}

export default function DeviceFilters({ devices, onFilter }: DeviceFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const deviceTypes = [...new Set(devices.map(d => d.ai_classification.device_type))];

  const applyFilters = (status: string, search: string) => {
    let filtered = devices;

    if (status === 'active') {
      filtered = filtered.filter(d => d.is_active);
    } else if (status === 'inactive') {
      filtered = filtered.filter(d => !d.is_active);
    } else if (status !== 'all') {
      filtered = filtered.filter(d => d.ai_classification.device_type === status);
    }

    if (search) {
      filtered = filtered.filter(d => 
        d.given_name.toLowerCase().includes(search.toLowerCase()) ||
        d.hostname.toLowerCase().includes(search.toLowerCase()) ||
        d.ip.includes(search)
      );
    }

    onFilter(filtered);
  };

  const handleStatusFilter = (status: string) => {
    setActiveFilter(status);
    applyFilters(status, searchTerm);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    applyFilters(activeFilter, search);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search devices..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'inactive', ...deviceTypes].map(filter => (
            <button
              key={filter}
              onClick={() => handleStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
