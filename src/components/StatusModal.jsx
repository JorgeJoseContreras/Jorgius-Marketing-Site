import React, { useState, useEffect } from 'react';
import { getSystemStatus } from '../utils/statusStore';
import { CheckCircle, AlertTriangle, XCircle, Wrench, X, ShieldCheck } from 'lucide-react';

export default function StatusModal({ isOpen, onClose }) {
  const [statusData, setStatusData] = useState(getSystemStatus());

  useEffect(() => {
    const handleUpdate = () => {
      setStatusData(getSystemStatus());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('status-update', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('status-update', handleUpdate);
    };
  }, []);

  if (!isOpen) return null;

  const getStatusBadge = (code) => {
    switch (code) {
      case 'degraded':
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: <AlertTriangle size={20} color="#f59e0b" />, label: 'Degraded Performance' };
      case 'outage':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: <XCircle size={20} color="#ef4444" />, label: 'System Outage' };
      case 'maintenance':
        return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: <Wrench size={20} color="#3b82f6" />, label: 'Under Maintenance' };
      default:
        return { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)', icon: <CheckCircle size={20} color="#ffffff" />, label: 'All Systems Operational' };
    }
  };

  const badge = getStatusBadge(statusData.statusCode);

  // Generate days since creation date 7/24/2026
  const creationDate = new Date('2026-07-24');
  const today = new Date();
  const daysDiff = Math.max(1, Math.floor((today - creationDate) / (1000 * 60 * 60 * 24)) + 1);

  // Generate 30 timeline bars
  const timelineBars = Array.from({ length: 30 }).map((_, i) => ({
    dayNum: 30 - i,
    isOperational: true,
  }));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 5, 8, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: '#0d0f14',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '20px',
          padding: '28px 24px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <ShieldCheck size={24} color="#ffffff" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            Jorgius System Status
          </h2>
        </div>

        {/* Operational Status Card */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: badge.bg,
            border: `1px solid ${badge.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {badge.icon}
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>
                {statusData.status || badge.label}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                No incidents reported since creation on 07/24/2026
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>
              {statusData.uptime || '100%'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Overall Uptime</div>
          </div>
        </div>

        {/* Uptime History Timeline Bars */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Daily Uptime History (Since Creation 07/24/2026)</span>
            <span style={{ color: '#fff', fontWeight: '600' }}>{statusData.uptime || '100%'} Uptime</span>
          </div>

          <div style={{ display: 'flex', gap: '4px', height: '32px', alignItems: 'center' }}>
            {timelineBars.map((bar, idx) => (
              <div
                key={idx}
                title={`Day ${bar.dayNum}: 100% Operational`}
                style={{
                  flex: 1,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: '3px',
                  transition: 'opacity 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>30 Days Ago</span>
            <span>Creation: 7/24/2026</span>
            <span>Today</span>
          </div>
        </div>

        {/* Incidents & Maintenance Log */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px', color: '#fff' }}>
            Incident History
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {statusData.incidents && statusData.incidents.length > 0 ? (
              statusData.incidents.map((inc) => (
                <div
                  key={inc.id || inc.date}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>{inc.title}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inc.date}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {inc.message}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '12px', textAlign: 'center' }}>
                No incidents reported since creation on 07/24/2026.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
