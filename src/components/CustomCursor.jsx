import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [enabled, setEnabled] = useState(true);

  const requestRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches || 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnabled(false);
      return;
    }

    const onMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if target is interactive
      const target = e.target;
      const isInteractive = target && (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable') ||
        target.classList.contains('project-showcase-card')
      );
      setIsHovered(!!isInteractive);
    };

    const onMouseDown = (e) => {
      setIsClicking(true);
      // Spawn subtle sparkle
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setSparkles((prev) => [...prev.slice(-4), newSparkle]);
    };

    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Smooth trailing lerp loop
    const animateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18
      }));
      requestRef.current = requestAnimationFrame(animateTrailing);
    };
    requestRef.current = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [pos.x, pos.y]);

  if (!enabled) return null;

  return (
    <>
      {/* Small lavender inner cursor dot */}
      <div
        className={`custom-cursor-dot ${isClicking ? 'is-clicking' : ''}`}
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
        aria-hidden="true"
      />

      {/* Trailing soft aura circle */}
      <div
        className={`custom-cursor-follower ${isHovered ? 'is-hovered' : ''} ${isClicking ? 'is-clicking' : ''}`}
        style={{ transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)` }}
        aria-hidden="true"
      />

      {/* Click Sparkles */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="cursor-sparkle"
          style={{ left: s.x, top: s.y }}
          onAnimationEnd={() => setSparkles((prev) => prev.filter((p) => p.id !== s.id))}
          aria-hidden="true"
        >
          ✦
        </span>
      ))}
    </>
  );
}
