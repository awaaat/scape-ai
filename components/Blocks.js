import Link from 'next/link';
import { Bg, Vid, VBand } from '@/components/BgVideo';
import { Crumb } from '@/components/Chrome';
import { pageVideo } from '@/lib/media';

/* =====================================================================
   Page building blocks. Pages pick a hero and a body arrangement, so no two
   neighbouring pages share the same skeleton. All styles live under .xp / .xh / .x-*
   ===================================================================== */

const pad = (i) => String(i + 1).padStart(2, '0');

/* ---------- heroes ---------- */
const hv = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// 1. video + glass panel on the right
export function HeroPanel({ crumb, title, lead, actions, video, dim = 0.4, label, rows = [] }) {
  return (<section className="page xh xh-panel"><Bg name={video} dim={dim} side />
    <div className="wrap xh-grid"><div><Crumb items={crumb} /><h1>{title}</h1><p className="lead">{lead}</p>{actions}</div>
      <aside className="xh-card"><div className="xh-card-h mono">{label}</div>
        {rows.map((r, i) => <div className="xh-card-r" key={i}><span className="mono">{pad(i)}</span><div><b>{r[0]}</b>{r[1] && <p>{r[1]}</p>}</div></div>)}</aside></div></section>);
}

// 2. centred statement over a zoomed clip, with a stat strip
export function HeroCenter({ crumb, title, lead, actions, video, dim = 0.4, stats = [], fx }) {
  return (<section className="page xh xh-center"><Bg name={video} dim={dim} zoom />{fx}
    <div className="wrap"><Crumb items={crumb} /><h1>{title}</h1><p className="lead">{lead}</p>{actions}
      {stats.length > 0 && <div className="xh-stats">{stats.map(([k, v]) => <div key={k}><b>{k}</b><span>{v}</span></div>)}</div>}</div></section>);
}

// 3. huge headline, spec sheet on the right. The grid background is replaced by a video.
export function HeroType({ crumb, title, lead, actions, video, dim = 0.4, spec = [] }) {
  const last = crumb && crumb.length ? crumb[crumb.length - 1].t : 'x';
  const v = video || pageVideo(hv(typeof last === 'string' ? last : 'x'));
  return (<section className="page xh xh-type"><Bg name={v} dim={dim} side /><div className="wrap xh-grid"><div><Crumb items={crumb} /><h1>{title}</h1></div>
    <div><p className="lead">{lead}</p>{actions}
      <dl className="xh-dl">{spec.map(([k, val]) => <div key={k}><dt className="mono">{k}</dt><dd>{val}</dd></div>)}</dl></div></div></section>);
}

// 4. clip in a framed tile instead of full bleed
export function HeroFrame({ crumb, title, lead, actions, video, tag }) {
  return (<section className="page xh xh-frame"><div className="wrap xh-grid"><div><Crumb items={crumb} /><h1>{title}</h1><p className="lead">{lead}</p>{actions}</div>
    <div className="xh-tile"><Vid name={video} /><i /><span className="mono">{tag}</span></div></div></section>);
}

export const HEROES = { panel: HeroPanel, center: HeroCenter, type: HeroType, frame: HeroFrame };

/* ---------- section shells ---------- */

// Every content section sits on a subtle video (dim = how dark the overlay is; plain = no video).
// The clip rotates through the pool, so two neighbouring sections never share one.
let seq = 0;
export const Sec = ({ id, alt, narrow, className = '', video, dim = 0.74, plain, children }) => {
  const v = plain ? null : (video || pageVideo(seq++));
  return (<section id={id} className={`x-sec${alt ? ' alt' : ''}${v ? ' sv' : ''} ${className}`}>{v && <Bg name={v} dim={dim} />}
    <div className="wrap" style={narrow ? { maxWidth: narrow } : undefined}>{children}</div></section>);
};

export const Head = ({ k, title, sub }) =>
  <div className="x-head">{k && <div className="eyebrow">{k}</div>}<h2>{title}</h2>{sub && <p className="sub">{sub}</p>}</div>;

// sticky heading on the left, content on the right
export const Split = ({ id, alt, k, title, sub, flip, video, children }) => {
  const inner = <div className={'x-split' + (flip ? ' flip' : '')}><div className="x-split-h"><Head k={k} title={title} sub={sub} /></div><div className="x-split-b">{children}</div></div>;
  return video ? <VBand video={video} id={id}>{inner}</VBand> : <Sec id={id} alt={alt}>{inner}</Sec>;
};

// heading + content on a dark video band (same look as the home page bands)
export const VSec = ({ video, id, k, title, sub, children }) =>
  <VBand video={video} id={id}><Head k={k} title={title} sub={sub} />{children}</VBand>;

/* ---------- content modules ---------- */

// ruled list: number, title, text, arrow. No boxes.
export const Rows = ({ items, two }) =>
  <div className={'x-rows' + (two ? ' two' : '')}>{items.map(([t, d, href], i) => {
    const In = (<><span className="mono x-n">{pad(i)}</span><h3>{t}</h3>{d && <p>{d}</p>}{href && <span className="x-ar">↗</span>}</>);
    return href ? <Link key={t} href={href} className="x-row">{In}</Link> : <div key={t} className="x-row">{In}</div>;
  })}</div>;

// open columns with a top rule and an oversized number
export const Cols = ({ items, n = 3 }) =>
  <div className="x-cols" style={{ '--n': n }}>{items.map(([t, d, href], i) => {
    const In = (<><span className="x-big">{pad(i)}</span><h3>{t}</h3>{d && <p>{d}</p>}</>);
    return href ? <Link key={t} href={href} className="x-col">{In}</Link> : <div key={t} className="x-col">{In}</div>;
  })}</div>;

// mosaic: first tile is large
export const Bento = ({ items }) =>
  <div className="x-bento">{items.map(([t, d, href], i) => {
    const In = (<><span className="mono">{pad(i)}</span><h3>{t}</h3>{d && <p>{d}</p>}{href && <span className="x-ar">↗</span>}</>);
    return href ? <Link key={t} href={href} className={'x-tile' + (i === 0 ? ' big' : '')}>{In}</Link> : <div key={t} className={'x-tile' + (i === 0 ? ' big' : '')}>{In}</div>;
  })}</div>;

// connected steps along a line
export const Path = ({ steps, vertical }) =>
  <ol className={'x-path' + (vertical ? ' v' : '')}>{steps.map(([t, d], i) => <li key={t}><span className="x-dot">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>;

// one big typographic statement
export const Statement = ({ children, by }) =>
  <Sec className="x-state"><p className="x-quote">{children}</p>{by && <div className="mono x-by">{by}</div>}</Sec>;

export const Cloud = ({ items }) => <div className="x-cloud">{items.map(c => <span key={c}>{c}</span>)}</div>;

// horizontal strip of linked names
export const Strip = ({ items }) =>
  <div className="x-strip">{items.map(([t, d, href]) => <Link key={t} href={href}><b>{t}</b><span>{d}</span><i>→</i></Link>)}</div>;

export const Actions = ({ children }) => <div className="cta">{children}</div>;
export const Btn = ({ href, p, children }) => <Link className={'btn' + (p ? ' p' : '')} href={href}>{children}</Link>;
