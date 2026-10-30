import React, { useEffect, useRef } from 'react';

export default function SakuraBackground({ theme = 'light' }) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Petal configuration
    const PETAL_COUNT = width > 768 ? 32 : 18;
    const petals = [];

    const isDark = theme === 'dark';
    const petalColors = isDark
      ? ['rgba(215, 122, 182, 0.45)', 'rgba(168, 138, 224, 0.4)', 'rgba(238, 175, 218, 0.5)']
      : ['rgba(233, 166, 196, 0.65)', 'rgba(244, 197, 216, 0.7)', 'rgba(215, 168, 198, 0.6)'];

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 5 + 4, // size
        vx: Math.random() * 1.2 - 0.3, // horizontal drift
        vy: Math.random() * 1.4 + 0.8, // vertical fall speed
        angle: Math.random() * Math.PI * 2,
        angularSpeed: Math.random() * 0.02 - 0.01,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(1, Math.cos(p.flip));

      ctx.beginPath();
      ctx.fillStyle = p.color;
      // Draw a sakura petal shape: bezier curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.r * 1.2, -p.r * 0.8, -p.r * 1.5, p.r * 1.2, 0, p.r * 2);
      ctx.bezierCurveTo(p.r * 1.5, p.r * 1.2, p.r * 1.2, -p.r * 0.8, 0, 0);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.vx + Math.sin(p.angle) * 0.4;
        p.y += p.vy;
        p.angle += p.angularSpeed;
        p.flip += p.flipSpeed;

        // Reset if off bottom or off right/left
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(p);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="sakura-canvas"
      aria-hidden="true"
    />
  );
}
