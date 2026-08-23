const STORAGE_KEY = 'jorgius_system_status_v1';
const VERSION_KEY = 'jorgius_app_version_v1';

export const parseAnyDate = (str) => {
  if (!str) return null;
  if (str instanceof Date) return isNaN(str.getTime()) ? null : str;
  if (typeof str === 'string') {
    const trimmed = str.trim();
    if (!trimmed) return null;
    // Check YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    // Check MM/DD/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
      const [m, d, y] = trimmed.split('/').map(Number);
      return new Date(y, m - 1, d);
    }
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

export const formatStatusDate = (str) => {
  const d = parseAnyDate(str);
  if (!d) return str || 'Recently';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  const date1 = parseAnyDate(d1);
  const date2 = parseAnyDate(d2);
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const DEFAULT_STATUS_DATA = {
  status: 'All Systems Operational',
  statusCode: 'operational', // 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime: '100%',
  version: 'v2.5.1',
  creationDate: '2026-07-01',
  retroDate: '2026-07-01',
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
    const effectiveRetroDate = newStatusData.retroDate || newStatusData.creationDate || newStatusData.lastUpdatedDisplay;
    const updated = {
      ...newStatusData,
      retroDate: effectiveRetroDate,
      creationDate: effectiveRetroDate,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('status-update'));

    // Asynchronously sync to backend DB
    fetch('https://notification-assistant.onrender.com/api/system-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: updated })
    }).catch((err) => console.warn('Status cloud sync note:', err));

    return true;
  } catch (e) {
    console.error('Error saving status to localStorage:', e);
    return false;
  }
};

export const fetchRemoteStatus = async () => {
  try {
    const res = await fetch('https://notification-assistant.onrender.com/api/system-status');
    if (res.ok) {
      const data = await res.json();
      if (data.ok && data.status) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.status));
        if (data.status.version) {
          localStorage.setItem(VERSION_KEY, data.status.version);
          window.dispatchEvent(new Event('version-update'));
        }
        window.dispatchEvent(new Event('status-update'));
        return data.status;
      }
    }
  } catch (e) {
    console.warn('Unable to reach status cloud API:', e);
  }
  return null;
};

// Initial background sync
if (typeof window !== 'undefined') {
  fetchRemoteStatus();
}

export const getAppVersion = () => {
  try {
    const v = localStorage.getItem(VERSION_KEY);
    if (v) return v;
  } catch (e) {}
  return 'v2.5.1';
};

export const saveAppVersion = (newVersion) => {
  try {
    localStorage.setItem(VERSION_KEY, newVersion);
    window.dispatchEvent(new Event('version-update'));

    // Also sync to backend status
    const cur = getSystemStatus();
    saveSystemStatus({ ...cur, version: newVersion });
    return true;
  } catch (e) {
    return false;
  }
};
