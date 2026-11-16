'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function NavMenus({ groups, flat }) {
  const [open, setOpen] = useState(null); const [mob, setMob] = useState(false);
  const path = usePathname(); const tm = useRef(null);
  useEffect(() => { setOpen(null); setMob(false); }, [path]);
  useEffect(() => { const k = (e) => { if (e.key === 'Escape') { setOpen(null); setMob(false); } }; const c = (e) => { if (!e.target.closest?.('.hd')) { setOpen(null); setMob(false); } }; addEventListener('keydown', k); addEventListener('click', c); return () => { removeEventListener('keydown', k); removeEventListener('click', c); }; }, []);
  const enter = (i) => { clearTimeout(tm.current); setOpen(i); };
  const leave = () => { clearTimeout(tm.current); tm.current = setTimeout(() => setOpen(null), 140); };
  const go = () => { clearTimeout(tm.current); setOpen(null); setMob(false); };
  return (<>
    <nav className="links">
      {groups.map((g, i) => (
        <div key={g.label} className="dd" onMouseEnter={() => enter(i)} onMouseLeave={leave}>
          <span tabIndex={0} role="button" aria-expanded={open === i} className={open === i ? 'act' : ''} onClick={() => setOpen(open === i ? null : i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(open === i ? null : i); } }}>
            {g.label}<svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: 6, transform: open === i ? 'rotate(180deg)' : 'none', transition: '.2s' }}><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></span>
          <div className={'panel' + (open === i ? ' open' : '')}>
            {g.items.map(s => <Link key={s.href} href={s.href} onClick={go}><b>{s.name}</b><small>{s.sub}</small></Link>)}
            {g.feat && <Link href={g.feat.href} onClick={go} className="feat"><b>{g.feat.t}</b><small>{g.feat.s}</small></Link>}
          </div>
        </div>))}
      <Link href="/lab" onClick={go}>AI Lab</Link>
      <Link href="/contact" onClick={go} className="btn p" style={{ marginLeft: 10, padding: '0 18px' }}>Get a free AI plan</Link>
    </nav>
    <div className="mob2"><button className="mono" onClick={() => setMob(!mob)} aria-expanded={mob}>{mob ? 'Close' : 'Menu'}</button>
      {mob && <div className="mobp">{flat.map(([n, h]) => <Link key={h} href={h} onClick={go}>{n}</Link>)}</div>}</div>
  </>);
}
