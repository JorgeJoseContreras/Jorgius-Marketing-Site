import React, { useRef, useState } from 'react';

export default function TiltCard({ children, className = '', maxTilt = 15 }) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease',
  });
  const [lightOverlay, setLightOverlay] = useState({
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });

    const posXPercent = ((x / rect.width) * 100).toFixed(1);
    const posYPercent = ((y / rect.height) * 100).toFixed(1);

    setLightOverlay({
      background: `radial-gradient(circle at ${posXPercent}% ${posYPercent}%, rgba(139, 92, 246, 0.22) 0%, rgba(6, 182, 212, 0.1) 40%, transparent 70%)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  return (
    <div className={`tilt-card-container ${className}`}>
      <div
        ref={cardRef}
        className="tilt-card-inner"
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="tilt-light-overlay" style={lightOverlay} />
        <div style={{ position: 'relative', zIndex: 3 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
