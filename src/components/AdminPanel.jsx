import React, { useState } from 'react';
import { getSystemStatus, saveSystemStatus, DEFAULT_STATUS_DATA, getAppVersion, saveAppVersion } from '../utils/statusStore';
import CustomSelect from './CustomSelect';
import { Save, RefreshCw, Plus, Trash2, ArrowLeft, CheckCircle2, Tag } from 'lucide-react';

export default function AdminPanel({ onBack, embedded = false }) {
  const [statusData, setStatusData] = useState(getSystemStatus());
  const [appVersion, setAppVersion] = useState(getAppVersion());
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

  const handleSaveVersion = (e) => {
    e.preventDefault();
    saveAppVersion(appVersion);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    setStatusData(DEFAULT_STATUS_DATA);
    saveSystemStatus(DEFAULT_STATUS_DATA);
    setAppVersion('v2.5.1');
    saveAppVersion('v2.5.1');
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

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            fontSize: '0.88rem',
          }}
        >
          <CheckCircle2 size={18} color="#fff" />
          <span>Settings & version updated! Live site view is now updated.</span>
        </div>
      )}

      {/* App Version Configuration Card */}
      <div
        style={{
          background: 'rgba(18, 22, 34, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag size={16} color="#fff" /> System Version Configuration
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Update the global software version number displayed across the platform and home page.
        </p>

        <form onSubmit={handleSaveVersion} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              App Version (e.g., v2.5.1)
            </label>
            <input
              type="text"
              value={appVersion}
              onChange={(e) => setAppVersion(e.target.value)}
              className="form-input"
              style={{ width: '100%', fontSize: '0.9rem' }}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.82rem', gap: '6px', marginTop: '22px' }}>
            <Save size={14} /> Update Version
          </button>
        </form>
      </div>

      {/* Global Status Controls Card */}
      <div
        style={{
          background: 'rgba(18, 22, 34, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff' }}>
              System Availability & Incidents
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Control live system availability badges and post maintenance announcements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleReset} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
              <RefreshCw size={14} /> Reset Defaults
            </button>

            <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
              <Save size={14} /> Save & Publish
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Status Preset
            </label>
            <CustomSelect
              value={statusData.statusCode}
              onChange={(val) => {
                let label = 'All Systems Operational';
                if (val === 'degraded') label = 'Degraded Performance';
                if (val === 'outage') label = 'System Outage';
                if (val === 'maintenance') label = 'Under Maintenance';
                setStatusData({ ...statusData, statusCode: val, status: label });
              }}
              options={[
                { value: 'operational', label: 'All Systems Operational' },
                { value: 'degraded', label: 'Degraded Performance' },
                { value: 'outage', label: 'System Outage' },
                { value: 'maintenance', label: 'Under Maintenance' },
              ]}
            />
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
              Status Active Date / Retro Date
            </label>
            <input
              type="text"
              placeholder="e.g. 2026-08-18 or August 18, 2026"
              value={statusData.retroDate || statusData.creationDate || statusData.lastUpdatedDisplay || ''}
              onChange={(e) => setStatusData({ 
                ...statusData, 
                retroDate: e.target.value,
                creationDate: e.target.value, 
                lastUpdatedDisplay: e.target.value 
              })}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Component Status Grid */}
        <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          Infrastructure Services Status
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {statusData.components &&
            statusData.components.map((comp, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: '#fff' }}>{comp.name}</div>
                <CustomSelect
                  value={comp.status}
                  onChange={(val) => {
                    const newComps = [...statusData.components];
                    newComps[idx].status = val;
                    setStatusData({ ...statusData, components: newComps });
                  }}
                  options={[
                    { value: 'operational', label: 'Operational' },
                    { value: 'degraded', label: 'Degraded' },
                    { value: 'outage', label: 'Outage' },
                  ]}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Add New Incident Announcement Card */}
      <div
        style={{
          background: 'rgba(18, 22, 34, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
          Post Incident Announcement
        </h3>

        <form onSubmit={handleAddIncident} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Incident Title
              </label>
              <input
                type="text"
                placeholder="e.g. Scheduled System Maintenance"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Incident Date / Retro Date (e.g. July 15, 2026)
              </label>
              <input
                type="text"
                placeholder="e.g. August 23, 2026 or July 1, 2026"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="form-input"
                style={{ width: '100%', fontSize: '0.85rem' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Detailed Notice Message
            </label>
            <textarea
              placeholder="Describe the maintenance window or event..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="form-input"
              style={{ width: '100%', minHeight: '70px', fontSize: '0.85rem', resize: 'vertical' }}
              required
            />
          </div>

          <button type="submit" className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.82rem', gap: '6px' }}>
            <Plus size={14} /> Add Incident Log
          </button>
        </form>

        {/* Existing Incident Logs */}
        <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', marginTop: '24px', marginBottom: '12px' }}>
          Live Published Logs ({statusData.incidents ? statusData.incidents.length : 0})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {statusData.incidents && statusData.incidents.length > 0 ? (
            statusData.incidents.map((inc) => (
              <div
                key={inc.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>{inc.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{inc.date}</div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{inc.message}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={inc.date}
                    onChange={(e) => {
                      const updatedIncidents = statusData.incidents.map((it) => (it.id === inc.id ? { ...it, date: e.target.value } : it));
                      setStatusData({ ...statusData, incidents: updatedIncidents });
                    }}
                    className="form-input"
                    title="Edit date of this log"
                    style={{ fontSize: '0.74rem', padding: '3px 8px', width: '130px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteIncident(inc.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
                    title="Delete this incident"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '12px', textAlign: 'center' }}>
              No incidents posted.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050608', color: '#fff', padding: '40px 20px', zIndex: 150, position: 'relative' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <button onClick={onBack} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to Main Site
          </button>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            Jorgius Status Admin Portal
          </h1>
        </div>
        {content}
      </div>
    </div>
  );
}
