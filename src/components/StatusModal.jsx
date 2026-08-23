import React, { useState, useEffect } from 'react';
import { getSystemStatus, formatStatusDate, parseAnyDate, isSameDay } from '../utils/statusStore';
import { CheckCircle, AlertTriangle, XCircle, Wrench, X, ShieldCheck } from 'lucide-react';

export default function StatusModal({ isOpen, onClose }) {
  const [statusData, setStatusData] = useState(getSystemStatus());
  const [hoveredBar, setHoveredBar] = useState(null);

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
        return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: <AlertTriangle size={20} color="#f59e0b" />, label: 'Minor Outage / Degraded' };
      case 'outage':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: <XCircle size={20} color="#ef4444" />, label: 'Major Outage' };
      case 'maintenance':
        return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: <Wrench size={20} color="#3b82f6" />, label: 'Under Maintenance' };
      default:
        return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)', icon: <CheckCircle size={20} color="#22c55e" />, label: 'All Systems Operational' };
    }
  };

  const badge = getStatusBadge(statusData.statusCode);

  // Parse active/retro date
  const retroDateObj = parseAnyDate(statusData.retroDate || statusData.creationDate);
  const formattedRetro = formatStatusDate(statusData.retroDate || statusData.creationDate);

  // Generate 30 daily bars with exact dates ending today
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const timelineBars = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (29 - i));
    d.setHours(0, 0, 0, 0);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Default to green 100% operational
    let statusType = 'operational';
    let color = '#22c55e'; // Green
    let statusText = '100% Operational • No Incidents';

    // 1. Check if there are specific incident logs on this date
    if (statusData.incidents && statusData.incidents.length > 0) {
      const matchingInc = statusData.incidents.find((inc) => isSameDay(inc.date, d));
      if (matchingInc) {
        statusType = matchingInc.type || 'degraded';
        if (statusType === 'degraded') {
          color = '#f59e0b';
          statusText = `Degraded • ${matchingInc.title}`;
        } else if (statusType === 'outage') {
          color = '#ef4444';
          statusText = `Outage • ${matchingInc.title}`;
        } else if (statusType === 'maintenance') {
          color = '#3b82f6';
          statusText = `Maintenance • ${matchingInc.title}`;
        } else {
          color = '#22c55e';
          statusText = `Operational • ${matchingInc.title}`;
        }
      }
    }

    // 2. Check if the active global status is non-operational and applies to this date
    if (statusData.statusCode && statusData.statusCode !== 'operational') {
      const isRetroDate = retroDateObj && isSameDay(retroDateObj, d);
      const isOngoingFromRetro = retroDateObj && (d >= new Date(retroDateObj.getFullYear(), retroDateObj.getMonth(), retroDateObj.getDate()));
      const isToday = (i === 29);

      if (isRetroDate || isOngoingFromRetro || isToday) {
        statusType = statusData.statusCode;
        if (statusType === 'degraded') {
          color = '#f59e0b';
          statusText = `Degraded • ${statusData.status || 'Minor Outage'}`;
        } else if (statusType === 'outage') {
          color = '#ef4444';
          statusText = `Outage • ${statusData.status || 'Major Outage'}`;
        } else if (statusType === 'maintenance') {
          color = '#3b82f6';
          statusText = `Maintenance • ${statusData.status || 'Under Maintenance'}`;
        }
      }
    }

    return {
      index: i,
      dateStr,
      statusType,
      color,
      statusText,
    };
  });

  const totalDays = timelineBars.length;
  const operationalDays = timelineBars.filter((b) => b.statusType === 'operational').length;
  const calculatedUptime = ((operationalDays / totalDays) * 100).toFixed(1) + '%';

  const subtitleText = statusData.statusCode === 'operational'
    ? `No active incidents reported • System operational as of ${formattedRetro}`
    : `System notice active since ${formattedRetro}`;

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

        {/* Operational Status Banner */}
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
                {subtitleText}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff' }}>
              {statusData.uptime && statusData.uptime !== '100%' ? statusData.uptime : calculatedUptime}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Overall Uptime</div>
          </div>
        </div>

        {/* 30-Day Timeline Bar Container (NO static dates below, NO legend) */}
        <div style={{ marginBottom: '28px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <span>Past 30 Days Uptime</span>
            <span style={{ color: operationalDays === totalDays ? '#22c55e' : '#f59e0b', fontWeight: '600' }}>
              {calculatedUptime} Operational
            </span>
          </div>

          {/* Custom Mini Hover Tooltip Popup */}
          {hoveredBar && (
            <div
              style={{
                position: 'absolute',
                top: '0px',
                left: `${Math.min(Math.max((hoveredBar.index / 29) * 100, 15), 85)}%`,
                transform: 'translate(-50%, -100%)',
                background: '#1a1d26',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                color: '#fff',
                whiteSpace: 'nowrap',
                boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontWeight: '700', color: '#ffffff' }}>{hoveredBar.dateStr}</div>
              <div style={{ color: hoveredBar.color, fontSize: '0.7rem', marginTop: '2px' }}>
                {hoveredBar.statusText}
              </div>
            </div>
          )}

          {/* 30 Green Daily Bars */}
          <div style={{ display: 'flex', gap: '4px', height: '36px', alignItems: 'center' }}>
            {timelineBars.map((bar) => (
              <div
                key={bar.index}
                onMouseEnter={() => setHoveredBar(bar)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{
                  flex: 1,
                  height: '100%',
                  background: bar.color, // Green 100%
                  borderRadius: '3px',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  cursor: 'pointer',
                  opacity: hoveredBar?.index === bar.index ? 1 : 0.85,
                  transform: hoveredBar?.index === bar.index ? 'scaleY(1.1)' : 'scaleY(1)',
                }}
              />
            ))}
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
                No incidents reported since creation on 07/01/2026.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
