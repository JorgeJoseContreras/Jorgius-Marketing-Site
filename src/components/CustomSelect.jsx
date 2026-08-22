import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options = [], placeholder = 'Select an option', style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', userSelect: 'none', zIndex: isOpen ? 1000 : 1, ...style }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-input"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: isOpen ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '10px 14px',
          color: selectedOption ? '#ffffff' : 'var(--text-secondary)',
          fontSize: '0.88rem',
          fontWeight: '500',
          cursor: 'pointer',
          textAlign: 'left',
          boxShadow: isOpen ? '0 0 12px rgba(255, 255, 255, 0.1)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          color="var(--text-secondary)"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Floating Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 99999,
            background: '#0e1017',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.75), 0 0 15px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            maxHeight: '240px',
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#ffffff' : 'var(--text-primary)',
                  background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  marginBottom: '2px',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} color="#ffffff" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
