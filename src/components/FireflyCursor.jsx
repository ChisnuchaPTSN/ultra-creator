import { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const TRAIL_LIMIT = 32;

// A single decorative canvas: no DOM particles and no React updates per frame.
export default function FireflyCursor({ enabled }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const finePointer = window.matchMedia('(any-pointer: fine)');
    let width = 0;
    let height = 0;
    let frame = 0;
    let previousTime = 0;
    let lastMove = 0;
    let present = false;
    let started = false;
    let pointer = { x: 0, y: 0 };
    let lastTrail = null;
    let trail = [];
    const swarm = Array.from({ length: 7 }, (_, i) => ({
      x: 0, y: 0, phase: i * 2.39996,
      radius: 13 + i * 5.5, speed: 3.8 - i * .32,
      size: 1.05 + (i % 3) * .3,
    }));

    function clear() {
      context.clearRect(0, 0, width, height);
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      started = present = false;
      trail = [];
      lastTrail = null;
      clear();
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stop();
    }

    function glow(x, y, size, opacity, warm = false) {
      if (opacity < .008) return;
      const radius = size * 10;
      const halo = context.createRadialGradient(x, y, 0, x, y, radius);
      halo.addColorStop(0, `rgba(255,255,255,${opacity * .85})`);
      halo.addColorStop(.15, `rgba(233,213,255,${opacity * .45})`);
      halo.addColorStop(.45, `rgba(${warm ? '216,180,254' : '192,132,252'},${opacity * .2})`);
      halo.addColorStop(1, 'rgba(168,85,247,0)');
      context.fillStyle = halo;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      context.beginPath();
      context.ellipse(x, y, size * .65, size, -.35, 0, TAU);
      context.fillStyle = `rgba(250,245,255,${opacity})`;
      context.fill();
    }

    function animate(now) {
      frame = 0;
      const dt = Math.min((now - (previousTime || now)) / 1000, .045);
      previousTime = now;
      clear();
      context.globalCompositeOperation = 'screen';
      const time = now / 1000;
      const fade = Math.max(0, 1 - Math.max(0, now - lastMove - 700) / 1300);

      swarm.forEach((fly, i) => {
        const angle = fly.phase + time * (.26 + i * .018);
        const x = pointer.x + Math.cos(angle) * fly.radius;
        const y = pointer.y + Math.sin(angle * 1.13) * fly.radius * .7;
        const follow = 1 - Math.exp(-fly.speed * dt);
        fly.x += (x - fly.x) * follow;
        fly.y += (y - fly.y) * follow;
        const pulse = .35 + .65 * Math.pow(.5 + .5 * Math.sin(time * 1.8 + fly.phase), 2);
        glow(fly.x, fly.y, fly.size, pulse * fade * .85, i % 2 === 0);
      });

      trail = trail.filter(spark => spark.age < spark.life);
      trail.forEach(spark => {
        spark.age += dt;
        spark.x += Math.sin(time + spark.phase) * dt * 9;
        spark.y -= dt * (8 + Math.cos(time + spark.phase) * 3);
        const life = Math.max(0, 1 - spark.age / spark.life);
        glow(spark.x, spark.y, spark.size, life * life * .5, true);
      });
      context.globalCompositeOperation = 'source-over';
      if (fade > 0 || trail.length) frame = requestAnimationFrame(animate);
      else { clear(); previousTime = 0; started = false; }
    }

    function move(event) {
      if (!enabled || !finePointer.matches || event.pointerType !== 'mouse' || document.hidden) return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!started) {
        swarm.forEach(fly => {
          fly.x = pointer.x + Math.cos(fly.phase) * fly.radius;
          fly.y = pointer.y + Math.sin(fly.phase) * fly.radius * .7;
        });
        lastTrail = pointer;
        started = true;
      }
      if (lastTrail && Math.hypot(pointer.x - lastTrail.x, pointer.y - lastTrail.y) > 12) {
        trail.push({ ...pointer, age: 0, life: 1.1 + Math.random() * .6,
          phase: Math.random() * TAU, size: .55 + Math.random() * .45 });
        if (trail.length > TRAIL_LIMIT) trail.shift();
        lastTrail = pointer;
      }
      lastMove = performance.now();
      present = true;
      if (!frame) frame = requestAnimationFrame(animate);
    }

    function leave(event) {
      if (!event.relatedTarget && present) {
        present = false;
        lastMove = performance.now() - 1100;
        lastTrail = null;
      }
    }

    resize();
    if (!enabled) return stop;
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerout', leave, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('blur', stop);
    document.addEventListener('visibilitychange', stop);
    finePointer.addEventListener('change', stop);
    return () => {
      stop();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', stop);
      document.removeEventListener('visibilitychange', stop);
      finePointer.removeEventListener('change', stop);
    };
  }, [enabled]);

  return <canvas ref={canvasRef} className="firefly-cursor" aria-hidden="true" hidden={!enabled} />;
}
