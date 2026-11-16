import Link from 'next/link';
import Logo from '@/components/Logo';
import { Announce } from '@/components/Interactive';
import { solutions } from '@/lib/solutions';
import NavMenus from '@/components/NavMenus';
import { StartStrip } from '@/components/ProjectFlow';
import { services, industries, audiences } from '@/lib/data';
export function Nav() {
  const groups = [
    { label: 'AI Stack', items: services.map(s => ({ href: `/services/${s.slug}`, name: s.name, sub: s.tag })), feat: { href: '/contact', t: 'Scope an AI project', s: 'Tell us the goal. We reply within 24 hours.' } },
    { label: 'Solutions', items: solutions.map(x => ({ href: `/solutions/${x.slug}`, name: x.title, sub: x.tier })), feat: { href: '/solutions', t: 'All AI solutions', s: 'Chatbots, RAG, agents, MCP, evaluation, fine-tuning and more.' } },
    { label: 'Industries', items: industries.map(s => ({ href: `/industries/${s.slug}`, name: s.name, sub: s.desc })) },
    { label: 'Who we serve', items: audiences.map(s => ({ href: `/for/${s.slug}`, name: s.name, sub: s.desc })) },
  ];
  const flat = [...services.map(s => [s.name, `/services/${s.slug}`]), ...solutions.map(x => [x.title, `/solutions/${x.slug}`]), ...industries.map(s => [s.name, `/industries/${s.slug}`]), ...audiences.map(s => [s.name, `/for/${s.slug}`]), ['AI Lab', '/lab'], ['Contact', '/contact']];
  return (<><Announce /><header className="hd"><div className="hb"><Link href="/" className="logo" aria-label="Scape AI home"><Logo size={38} /></Link><NavMenus groups={groups} flat={flat} /></div></header></>);
}
export function Footer() {
  return (<><StartStrip /><footer><div className="wrap fg">
    <div><div className="logo" style={{color:'#fff'}}><Logo size={46} /></div><p style={{marginTop:12,maxWidth:300}}>AI systems for businesses, enterprises and individuals: strategy, implementation, evaluation, data and talent.</p></div>
    <div><b>AI Stack</b>{services.map(s=><Link key={s.slug} href={`/services/${s.slug}`}>{s.name}</Link>)}</div>
    <div><b>Solutions</b>{solutions.slice(0, 8).map(x=><Link key={x.slug} href={`/solutions/${x.slug}`}>{x.title.replace(' Services','').replace(' Company','')}</Link>)}<Link href="/solutions">All solutions →</Link></div>
    <div><b>Industries</b>{industries.map(s=><Link key={s.slug} href={`/industries/${s.slug}`}>{s.name}</Link>)}</div>
    <div><b>Who we serve</b>{audiences.map(s=><Link key={s.slug} href={`/for/${s.slug}`}>{s.name}</Link>)}<Link href="/contact">Contact</Link></div>
  </div><div className="wrap fl"><span>© {new Date().getFullYear()} Scape AI, a division of Scape Data Solutions.</span><nav><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/sitemap">Site map</Link></nav></div></footer></>);
}
export const Crumb = ({ items }) => <div className="crumb">{items.map((i,n)=><span key={n}>{i.href?<Link href={i.href}>{i.t}</Link>:i.t}{n<items.length-1?' / ':''}</span>)}</div>;
export const Faq = ({ list }) => (<>{list.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:list.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))})}}/></>);
