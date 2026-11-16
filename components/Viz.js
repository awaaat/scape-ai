import { services } from '@/lib/data';
const short = n => n.replace('AI ', '');
export function IntegrationViz() {
  const ys = services.map((_, i) => 40 + i * 48);
  return (<svg viewBox="0 0 1000 416" className="viz" role="img" aria-label="Your company connects to Scape AI, which connects to eight service lines">
    <defs><linearGradient id="gw" x1="0" x2="1"><stop offset="0" stopColor="#096CFF"/><stop offset="1" stopColor="#6C9BFF"/></linearGradient></defs>
    <path className="wire" d="M200 208 H400"/><path className="wire f" d="M200 208 H400"/>
    {ys.map((y, i) => <g key={i}><path className="wire" d={`M560 208 C660 208 660 ${y} 760 ${y}`}/><path className="wire f" style={{animationDelay: `${i * .15}s`}} d={`M560 208 C660 208 660 ${y} 760 ${y}`}/>
      <circle r="3.5" fill="#FFFFFF"><animateMotion dur="3.2s" begin={`${i * .4}s`} repeatCount="indefinite" path={`M560 208 C660 208 660 ${y} 760 ${y}`}/></circle>
      <rect x="760" y={y - 18} width="210" height="36" rx="6" className="nd"/><text x="778" y={y + 5} className="tx">{services[i].name}</text></g>)}
    <rect x="40" y="170" width="160" height="76" rx="8" className="nd"/><text x="120" y="204" textAnchor="middle" className="tx">Your company</text><text x="120" y="226" textAnchor="middle" className="tx2">teams · data · systems</text>
    <rect x="400" y="160" width="160" height="96" rx="10" className="hub"/><text x="480" y="204" textAnchor="middle" className="tx" fontSize="18">Scape AI</text><text x="480" y="228" textAnchor="middle" className="tx2">one accountable team</text>
    <circle cx="480" cy="208" r="70" className="ring"/><circle cx="480" cy="208" r="70" className="ring" style={{animationDelay:'1.2s'}}/>
  </svg>);
}
export function FlowViz() {
  const st = ['Data', 'Model', 'Evaluate', 'Deploy', 'Monitor'];
  return (<svg viewBox="0 0 1000 220" className="viz" role="img" aria-label="Data to model to evaluate to deploy to monitor, looping back">
    {st.map((s, i) => <g key={s}><rect x={30 + i * 195} y="70" width="140" height="64" rx="8" className="nd" style={{animation: 'nlit 7.5s infinite', animationDelay: `${i * 1.5}s`}}/><text x={100 + i * 195} y="108" textAnchor="middle" className="tx">{s}</text>
      {i < 4 && <path className="wire f" d={`M${170 + i * 195} 102 H${225 + i * 195}`}/>}</g>)}
    <path className="wire f" d="M880 134 C880 210 100 210 100 134" style={{animationDirection:'reverse'}}/><text x="490" y="203" textAnchor="middle" className="tx2">feedback loop: production signals improve the next release</text>
  </svg>);
}
export function InfraViz() {
  const cells = Array.from({ length: 24 });
  return (<svg viewBox="0 0 1000 340" className="viz" role="img" aria-label="Workloads flow into a compute grid and out to latency, cost and quality">
    {['Data', 'Prompts', 'Traffic'].map((l, i) => <g key={l}><text x="30" y={100 + i * 70} className="tx2">{l}</text><path className="wire f" d={`M100 ${96 + i * 70} H340`} style={{animationDelay: `${i * .3}s`}}/></g>)}
    <rect x="340" y="40" width="320" height="260" rx="12" className="hub" style={{animation:'glow 3s ease-in-out infinite'}}/>
    {cells.map((_, i) => <rect key={i} x={366 + (i % 6) * 48} y={66 + Math.floor(i / 6) * 58} width="40" height="46" rx="5" className="cell" style={{animationDelay: `${(i % 6) * .18 + Math.floor(i / 6) * .3}s`}}/>)}
    {['Latency', 'Cost', 'Quality'].map((l, i) => <g key={l}><path className="wire f" d={`M660 ${96 + i * 70} H760`} style={{animationDelay: `${i * .3}s`}}/><text x="770" y={92 + i * 70} className="tx2">{l}</text><rect x="770" y={102 + i * 70} width="200" height="8" rx="4" fill="#1c2030"/><rect x="770" y={102 + i * 70} width="200" height="8" rx="4" fill="url(#gw2)" className="fillbar" style={{animationDelay: `${i * .4}s`}}/></g>)}
    <defs><linearGradient id="gw2"><stop offset="0" stopColor="#096CFF"/><stop offset="1" stopColor="#6C9BFF"/></linearGradient></defs>
  </svg>);
}
