const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiSummary {
  total: number;
  active: number;
  by_group: Record<string, number>;
  by_category: Record<string, number>;
}

export const api = {
  async getDevices() {
    const response = await fetch(`${API_BASE_URL}/api/devices`);
    if (!response.ok) throw new Error('Failed to fetch devices');
    return response.json();
  },

  async getSummary(): Promise<ApiSummary> {
    const response = await fetch(`${API_BASE_URL}/api/summary`);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },

  async updateDevice(id: number, updates: any) {
    const response = await fetch(`${API_BASE_URL}/api/devices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update device');
    return response.json();
  },

  async deviceAction(id: number, action: string, category?: string) {
    const response = await fetch(`${API_BASE_URL}/api/devices/${id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, category })
    });
    if (!response.ok) throw new Error('Failed to perform action');
    return response.json();
  }
};
