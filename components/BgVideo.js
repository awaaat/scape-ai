'use client';
import { useEffect, useRef, useState } from 'react';
import clips from '@/lib/clips.json';
import Link from 'next/link';
import { media } from '@/lib/media';

// One lazy, muted, looping video. This component only loads the file when it nears the viewport;
// play/pause (the 15 s holds, reduced motion, tab visibility) is handled by <VideoPauser /> for all videos.
export function Vid({ name, className = '' }) {
  const ref = useRef(null), v = media[name];
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !el.getAttribute('src')) { el.src = v.src; el.dispatchEvent(new Event('vid-src')); }
    }, { rootMargin: '300px', threshold: 0.01 });
    io.observe(el); return () => io.disconnect();
  }, [v.src]);
  return <video ref={ref} className={className} poster={v.poster} muted loop playsInline preload="none" disablePictureInPicture tabIndex={-1} aria-hidden="true" />;
}
// Full-bleed section background. dim = overlay darkness; side = extra left-to-right shade for headline legibility;
// zoom crops out baked-in borders; the clip slowly drifts vertically so the tall frame is explored, not just its centre.
export const Bg = ({ name, dim = 0.55, side = false, zoom = false }) => (
  <div className={'bgv' + (side ? ' side' : '') + (zoom ? ' zoom' : '')} aria-hidden="true"><Vid name={name} /><i style={{ background: `rgba(5,7,13,${dim})` }} /></div>);

// Home hero backdrop: two random clips, shown one at a time, crossfading (picked after mount so SSR and hydration match).
export function HeroBg2({ dim = 0.3, side = false, every = 12000 }) {
  const [pair, setPair] = useState(null);
  const [on, setOn] = useState(0);
  useEffect(() => {
    const p = [...clips.pool];
    for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    setPair(p.slice(0, 2));
  }, []);
  useEffect(() => {
    if (!pair) return;
    const t = setInterval(() => setOn(o => 1 - o), every);
    return () => clearInterval(t);
  }, [pair, every]);
  return (<div className={'bgv two' + (side ? ' side' : '')} aria-hidden="true">
    {pair && pair.map((n, k) => <div className={'bgh' + (on === k ? ' on' : '')} key={n}><Vid name={n} /></div>)}
    <i style={{ background: `rgba(5,7,13,${dim})` }} /></div>);
}

// Chapter divider: one full-bleed clip, big statement. compact = a shorter band for inner pages. No numbering.
export function Interlude({ video, zoom, eyebrow, title, text, children, id, dim = 0.5, compact = false }) {
  return (<section className={'il' + (compact ? ' compact' : '')} id={id}><Bg name={video} dim={dim} side zoom={zoom} />
    <div className="wrap il-in"><div className="il-tx">{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{text && <p className="sub">{text}</p>}{children && <div className="il-cta">{children}</div>}</div></div></section>);
}

// Content section on a video background (the same treatment as the home page's talent band).
export function VBand({ video, dim = 0.7, id, className = '', children }) {
  return (<section className={'pn vtal vband ' + className} id={id}><Bg name={video} dim={dim} /><div className="wrap">{children}</div></section>);
}

// Closing call to action on a video background (the same as the home page's closing banner).
export function VCta({ video, dim = 0.62, id, title, text, href = '/contact', label = 'Get a scoped quote' }) {
  return (<section className="pn vcta" id={id}><Bg name={video} dim={dim} /><div className="wrap vb-in"><h2>{title}</h2>{text && <p className="sub">{text}</p>}<Link className="btn p" href={href}>{label}</Link></div></section>);
}
