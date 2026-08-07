import React, { useState } from 'react';
import { getSystemStatus, saveSystemStatus, DEFAULT_STATUS_DATA } from '../utils/statusStore';
import { Save, RefreshCw, Plus, Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AdminPanel({ onBack }) {
  const [statusData, setStatusData] = useState(getSystemStatus());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New incident fields
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newDate, setNewDate] = useState(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

  const handleSave = () => {
    saveSystemStatus(statusData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    setStatusData(DEFAULT_STATUS_DATA);
    saveSystemStatus(DEFAULT_STATUS_DATA);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddIncident = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newInc = {
      id: Date.now(),
      title: newTitle,
      message: newMessage,
      date: newDate,
      type: statusData.statusCode,
    };

    const updatedIncidents = [newInc, ...(statusData.incidents || [])];
    const updated = { ...statusData, incidents: updatedIncidents };
    setStatusData(updated);

    setNewTitle('');
    setNewMessage('');
  };

  const handleDeleteIncident = (id) => {
    const updatedIncidents = statusData.incidents.filter((inc) => inc.id !== id);
    setStatusData({ ...statusData, incidents: updatedIncidents });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050608', color: '#fff', padding: '40px 20px', zIndex: 150, position: 'relative' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <button
            onClick={onBack}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={14} /> Back to Main Site
          </button>

          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            Jorgius Status Admin Portal
          </h1>
        </div>

        {/* Saved Toast */}
        {savedSuccess && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              fontSize: '0.88rem',
            }}
          >
            <CheckCircle2 size={18} color="#fff" />
            <span>Status updated and published! Main site status viewer is now updated.</span>
          </div>
        )}

        {/* Global Status Controls Card */}
        <div
          style={{
            background: 'rgba(18, 22, 34, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>System Status Controls</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Status Preset
              </label>
              <select
                value={statusData.statusCode}
                onChange={(e) => {
                  const val = e.target.value;
                  let label = 'All Systems Operational';
                  if (val === 'degraded') label = 'Degraded Performance';
                  if (val === 'outage') label = 'System Outage';
                  if (val === 'maintenance') label = 'Under Maintenance';
                  setStatusData({ ...statusData, statusCode: val, status: label });
                }}
                className="form-input"
                style={{ width: '100%', userSelect: 'auto' }}
              >
                <option value="operational">All Systems Operational</option>
                <option value="degraded">Degraded Performance</option>
                <option value="outage">System Outage</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Status Title Text
              </label>
              <input
                type="text"
                value={statusData.status}
                onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Overall Uptime Percentage
              </label>
              <input
                type="text"
                value={statusData.uptime}
                onChange={(e) => setStatusData({ ...statusData, uptime: e.target.value })}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                System Creation Date
              </label>
              <input
                type="text"
                value={statusData.creationDate}
                onChange={(e) => setStatusData({ ...statusData, creationDate: e.target.value })}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              <RefreshCw size={14} /> Reset 100% Defaults
            </button>
            <button onClick={handleSave} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Save size={14} /> Save & Publish Status
            </button>
          </div>
        </div>

        {/* Add Incident Form */}
        <div
          style={{
            background: 'rgba(18, 22, 34, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Add Incident or Maintenance Note</h2>

          <form onSubmit={handleAddIncident} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <input
                type="text"
                placeholder="Incident Title (e.g., Scheduled Maintenance Complete)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-input"
                required
              />
              <input
                type="text"
                placeholder="Date (e.g., August 6, 2026)"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <textarea
              placeholder="Incident details / note message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="form-input"
              rows={3}
              style={{ resize: 'vertical' }}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem' }}>
                <Plus size={14} /> Add Incident Log
              </button>
            </div>
          </form>
        </div>

        {/* Existing Incident Logs */}
        <div
          style={{
            background: 'rgba(18, 22, 34, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>Active Incident Logs</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {statusData.incidents && statusData.incidents.length > 0 ? (
              statusData.incidents.map((inc) => (
                <div
                  key={inc.id || inc.date}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>{inc.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{inc.date}</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{inc.message}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteIncident(inc.id)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5',
                      borderRadius: '6px',
                      padding: '6px',
                      cursor: 'pointer',
                    }}
                    title="Delete log"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No incident logs recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
