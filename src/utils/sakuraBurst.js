import { githubUrl } from '../data/links';

/**
 * sakuraBurst.js - Playful Easter Egg & Console Greeting for Dimplverse
 */

export function triggerSakuraBurst(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = 48;
  const petals = [];
  const colors = ['#FFAFCB', '#FFD6E5', '#E9A6C4', '#C18AAE', '#9276C9', '#FCEEF2'];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const speed = Math.random() * 7 + 4;
    petals.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: Math.random() * 6 + 5,
      rot: Math.random() * Math.PI * 2,
      vrot: Math.random() * 0.08 - 0.04,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.012 + 0.008
    });
  }

  let animId;
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    for (let p of petals) {
      if (p.alpha <= 0) continue;
      activeCount++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gentle gravity
      p.vx *= 0.98; // air friction
      p.rot += p.vrot;
      p.alpha -= p.decay;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.r * 1.2, -p.r * 0.8, -p.r * 1.5, p.r * 1.2, 0, p.r * 2);
      ctx.bezierCurveTo(p.r * 1.5, p.r * 1.2, p.r * 1.2, -p.r * 0.8, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    if (activeCount > 0) {
      animId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animId);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };

  draw();
}

// Console greeting easter egg for engineering recruiters & developers
export function logDeveloperGreeting() {
  const styles = [
    'color: #D77AB6',
    'font-size: 13px',
    'font-weight: bold',
    'padding: 8px 12px',
    'background: #171321',
    'border: 1px solid #9276C9',
    'border-radius: 6px'
  ].join(';');

  console.log(
    `%c🌸 Welcome to DIMPLVERSE!
✦ Information Technology @ IGDTUW '28
✦ Exploring AI/ML, Full-Stack Architecture & Creative Technology
✦ GitHub: ${githubUrl}
✦ Email: bhdimple06@gmail.com
🐾 Mochi says: "Have fun exploring every pixel!"`,
    styles
  );
}
