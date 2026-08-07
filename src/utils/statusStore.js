const STORAGE_KEY = 'jorgius_system_status_v1';

export const DEFAULT_STATUS_DATA = {
  status: 'All Systems Operational',
  statusCode: 'operational', // 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime: '100%',
  creationDate: '2026-07-01',
  lastUpdated: new Date().toISOString(),
  incidents: [
    {
      id: 1,
      date: 'July 1, 2026',
      title: 'System Officially Launched',
      message: 'Jorgius iMessage Assistant officially launched on July 1, 2026. All systems operational.',
      type: 'operational',
    },
  ],
};

export const getSystemStatus = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading status from localStorage:', e);
  }
  return DEFAULT_STATUS_DATA;
};

export const saveSystemStatus = (newStatusData) => {
  try {
    const updated = {
      ...newStatusData,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('status-update'));
    return true;
  } catch (e) {
    console.error('Error saving status to localStorage:', e);
    return false;
  }
};
