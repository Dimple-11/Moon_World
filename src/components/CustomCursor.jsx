import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const followerRef = useRef(null);
  const sparkleIdRef = useRef(0);
  const targetRef = useRef({ x: -100, y: -100 });
  const trailingRef = useRef({ x: -100, y: -100 });
  const hoveredRef = useRef(false);

  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  // Only enable on real pointer devices, and never when motion is reduced.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => {
      const shouldEnable = pointerQuery.matches && !motionQuery.matches;
      setEnabled(shouldEnable);
      document.documentElement.classList.toggle('has-custom-cursor', shouldEnable);
    };

    update();
    pointerQuery.addEventListener?.('change', update);
    motionQuery.addEventListener?.('change', update);

    return () => {
      pointerQuery.removeEventListener?.('change', update);
      motionQuery.removeEventListener?.('change', update);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  // Listeners and the animation loop are created exactly once while enabled.
  useEffect(() => {
    if (!enabled) return undefined;

    let rafId = null;

    const isInteractiveTarget = (target) => {
      if (!target || !target.closest) return false;
      return Boolean(
        target.closest('a, button, input, textarea, select, label, [role="button"], .clickable, .project-showcase-card')
      );
    };

    const onMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      const nextHovered = isInteractiveTarget(e.target);
      if (nextHovered !== hoveredRef.current) {
        hoveredRef.current = nextHovered;
        setIsHovered(nextHovered);
      }
    };

    const onMouseDown = (e) => {
      setIsClicking(true);
      const id = (sparkleIdRef.current += 1);
      const sparkle = { id, x: e.clientX, y: e.clientY };
      setSparkles((prev) => [...prev.slice(-4), sparkle]);
    };

    const onMouseUp = () => setIsClicking(false);

    const render = () => {
      const { x, y } = targetRef.current;
      const trailing = trailingRef.current;

      trailing.x += (x - trailing.x) * 0.18;
      trailing.y += (y - trailing.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${trailing.x}px, ${trailing.y}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Small lavender inner cursor dot */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isClicking ? 'is-clicking' : ''}`}
        aria-hidden="true"
      />

      {/* Trailing soft aura circle */}
      <div
        ref={followerRef}
        className={`custom-cursor-follower ${isHovered ? 'is-hovered' : ''} ${isClicking ? 'is-clicking' : ''}`}
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
