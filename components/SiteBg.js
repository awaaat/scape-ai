'use client';
import { useEffect, useRef, useState } from 'react';
import { media } from '@/lib/media';

const names = Object.keys(media);

// Fixed full-viewport backdrop. Crossfades through every clip in lib/media.js.
// Only the current and next clip are loaded; the rest stay idle.
export default function SiteBg({ every = 14000 }) {
  const [i, setI] = useState(0);
  const refs = useRef([]);
  const still = useRef(false);

  useEffect(() => { still.current = matchMedia('(prefers-reduced-motion: reduce)').matches; }, []);

  useEffect(() => {
    if (names.length < 2) return;
    const t = setInterval(() => { if (!document.hidden && !still.current) setI(n => (n + 1) % names.length); }, every);
    return () => clearInterval(t);
  }, [every]);

  useEffect(() => {
    const timers = [];
    refs.current.forEach((el, k) => {
      if (!el) return;
      const next = (i + 1) % names.length;
      if ((k === i || k === next) && !el.getAttribute('src')) el.src = media[names[k]].src;
      if (k === i) { if (!still.current) el.play().catch(() => {}); }
      else timers.push(setTimeout(() => el.pause(), 1800));
    });
    return () => timers.forEach(clearTimeout);
  }, [i]);

  return (<div className="sitebg" aria-hidden="true">
    {names.map((n, k) => (
      <video key={n} ref={el => (refs.current[k] = el)} className={k === i ? 'on' : ''}
        poster={media[n].poster} muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} />
    ))}
    <i />
  </div>);
}
