import React, { useState } from 'react';

export default function TiltCard({ children, className = '', maxTilt = 8 }) {
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'rotateX(0deg) rotateY(0deg)',
  });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    // Crucial: Use currentTarget so outer wrapper bounding rect stays static and fixed
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`,
    });

    setLightPos({
      x: ((x / rect.width) * 100).toFixed(1),
      y: ((y / rect.height) * 100).toFixed(1),
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    });
    setLightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        width: '100%',
      }}
      className={className}
    >
      <div
        className="tilt-card-inner"
        style={{
          ...tiltStyle,
          transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease',
          willChange: 'transform',
          position: 'relative',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            opacity: lightPos.opacity,
            background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)`,
            transition: 'opacity 0.3s ease',
            zIndex: 2,
          }}
        />
        <div style={{ position: 'relative', zIndex: 3 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
