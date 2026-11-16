// Undo the unrequested design edits. Keep only: grids/check-squares gone, boxed grid heroes now sit on a video, logo.
const fs = require('fs');
const edit = (p, fn) => { if (!fs.existsSync(p)) return; const a = fs.readFileSync(p, 'utf8'), b = fn(a); if (a !== b) { fs.writeFileSync(p, b); console.log('patched', p); } };

// 1. CSS: drop my v12 block (flattened panels/chips, hidden bottom fade, lighter side shade, extra text shadows)
edit('app/globals.css', s => {
  s = s.replace(/\n\/\* =+\n\s+v12: video-only[\s\S]*?\.lg-t i\{[^}]*\}\n/, '\n');
  if (!s.includes('v14: grid off')) s += `
/* v14: grid off for the typographic hero (it now sits on a video) */
.xh-type{background-image:none!important}.xh-type:after{display:none!important}
`;
  return s;
});

// 2. Heroes: the original four layouts back (glass panel, stat strip, tile). Only the grid hero gets a video behind it.
const HERO = `/* ---------- heroes ---------- */
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

export const HEROES = { panel: HeroPanel, center: HeroCenter, type: HeroType, frame: HeroFrame };`;
edit('components/Blocks.js', s => /\/\* -+ heroes -+ \*\/[\s\S]*?export const HEROES = \{[^}]*\};/.test(s) ? s.replace(/\/\* -+ heroes -+ \*\/[\s\S]*?export const HEROES = \{[^}]*\};/, () => HERO) : s);

// 3. Video darkness on the other sections back to how they were
edit('components/BgVideo.js', s => s.replace('VBand({ video, dim = 0.5', 'VBand({ video, dim = 0.86').replace('VCta({ video, dim = 0.4', 'VCta({ video, dim = 0.62'));
edit('components/DemoWindow.js', s => s.replace('dim = 0.45', 'dim = 0.6').replace('dim={0.45}', 'dim={0.6}'));
edit('app/page.js', s => s.replace('<Bg name="globe" dim={0.45}/>', '<Bg name="globe" dim={0.84}/>').replace('<Bg name="hud" dim={0.4}/>', '<Bg name="hud" dim={0.62}/>'));
console.log('restore ok');
