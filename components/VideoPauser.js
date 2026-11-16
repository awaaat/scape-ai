'use client';
import { useEffect } from 'react';

// Owns play/pause for EVERY <video> on the page, whichever component renders it, including ones added later.
// Each video runs on its own random schedule: plays for a random PLAY_MIN..PLAY_MAX, holds on its current
// frame for exactly PAUSE_MS, then plays again for another random stretch. Retune the three numbers here.
const PAUSE_MS = 10000, PLAY_MIN = 4000, PLAY_MAX = 14000;
const rnd = (a, b) => a + Math.random() * (b - a);

export default function VideoPauser() {
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = new WeakSet(), disposers = new Set();

    const attach = (el) => {
      if (seen.has(el)) return; seen.add(el);
      let visible = false, held = false, timer, dead = false;
      const sync = () => {
        const go = visible && !held && !still && document.visibilityState === 'visible';
        el.classList.toggle('hold', !go);                 // also freezes the CSS drift animation
        if (go) { if (el.getAttribute('src') || el.currentSrc) el.play().catch(() => {}); } else el.pause();
      };
      const dispose = () => { dead = true; clearTimeout(timer); io.disconnect(); disposers.delete(dispose);
        el.removeEventListener('play', guard); el.removeEventListener('vid-src', sync); document.removeEventListener('visibilitychange', sync); };
      const guard = () => { if (held || still) el.pause(); };   // stops autoplay or other code starting it mid-hold
      const cycle = () => {
        if (dead) return; if (!el.isConnected) return dispose();
        held = false; sync();
        timer = setTimeout(() => { if (!el.isConnected) return dispose(); held = true; sync(); timer = setTimeout(cycle, PAUSE_MS); }, rnd(PLAY_MIN, PLAY_MAX));
      };
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { rootMargin: '300px', threshold: 0.01 });
      io.observe(el); el.addEventListener('play', guard); el.addEventListener('vid-src', sync);
      document.addEventListener('visibilitychange', sync); disposers.add(dispose); cycle();
    };

    const scan = (n) => { if (n.nodeType !== 1) return; if (n.tagName === 'VIDEO') attach(n); n.querySelectorAll?.('video').forEach(attach); };
    scan(document.body);
    const mo = new MutationObserver((ms) => ms.forEach(m => m.addedNodes.forEach(scan)));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); [...disposers].forEach(d => d()); };
  }, []);
  return null;
}
