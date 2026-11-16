import AgentDemo from '@/components/AgentConsole';
import { withOG } from '@/lib/seo';
import Link from 'next/link';
import { Bg, Interlude, VBand, VCta } from '@/components/BgVideo';
import { DemoStage } from '@/components/DemoWindow';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import { NeuralCanvas, EvalLab, RagViz, RoiCalc } from '@/components/Labs';
import { AssistantDemo, TrainingPlayground, BenchmarkConsole, ExtractDemo } from '@/components/Demos';
import { Tabs, TypedTerm } from '@/components/Interactive';
import { Crumb, Faq } from '@/components/Chrome';
import { serviceSeo, LD, breadcrumbLd, serviceLd } from '@/lib/seo';
import { services, audiences, bySlug, faqFor, detail, deliver } from '@/lib/data';
export const generateStaticParams = () => services.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = bySlug(services, slug); if (!s) return {};
  const [t, dsc] = serviceSeo[s.slug] || [s.name, s.desc];
  return withOG({ title: t, description: dsc, alternates: { canonical: `/services/${s.slug}` } }); }
export default async function Service({ params }) {
  const { slug } = await params; const s = bySlug(services, slug); if (!s) notFound(); const d = detail[slug];
  const demos = { 'ai-evaluation': [['Build a benchmark and review like an expert',<BenchmarkConsole/>,'benchmark'],['Run an evaluation suite',<EvalLab/>,'suite']], 'ai-development': [['Chat with a grounded assistant',<AssistantDemo/>,'assistant'],['Train a model live',<TrainingPlayground/>,'training']], 'ai-strategy': [['Estimate the impact',<RoiCalc/>,'roi']], 'ai-analytics': [['Estimate the impact',<RoiCalc/>,'roi']], 'ai-integration': [['Extract data from documents',<ExtractDemo/>,'documents'],['Watch an agent use your tools',<AgentDemo/>,'agents']], 'managed-ai': [['Watch an agent use your tools',<AgentDemo/>,'agents']], 'data-services': [['Extract data from documents',<ExtractDemo/>,'documents']], 'ai-talent': [['Review model outputs like an expert',<BenchmarkConsole/>,'benchmark']] }; const demo = demos[slug] || [];
  const vi = 3 + services.findIndex(x => x.slug === s.slug); const rel = services.filter(x => x.slug !== slug).slice(0, 3);
  return (<>
    <LD data={[breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'AI Stack' }, { name: s.name, path: `/services/${s.slug}` }]), serviceLd({ name: (serviceSeo[s.slug] || [s.name])[0], description: s.desc, path: `/services/${s.slug}` })]} />
    <section className="page" style={{position:'relative',overflow:'hidden'}}><Bg name={pageVideo(3 + services.findIndex(x => x.slug === s.slug))} dim={0.74} side /><NeuralCanvas density={50}/><div className="wrap" style={{position:'relative'}}><Crumb items={[{t:'Home',href:'/'},{t:'AI Stack'},{t:s.name}]}/>
      <h1>{s.name}</h1><p className="lead">{s.desc}</p>
      <div className="cta"><Link className="btn p" href="/contact">Talk to an expert</Link><Link className="btn" href={`/services/${s.slug}/for/enterprise`}>For enterprise</Link></div></div></section>
    <section><div className="wrap two"><Reveal><p className="big">{d.problem}</p></Reveal><Reveal>{d.outcomes.map((o,i)=><div className="card" style={{marginBottom:12}} key={o}><span className="n" style={{marginBottom:12}}>0{i+1}</span><p style={{color:'#fff'}}>{o}</p></div>)}</Reveal></div></section>
    <section><div className="wrap"><Reveal><h2>{s.name} deliverables</h2></Reveal><div className="cards" style={{marginTop:36}}>{s.items.map((i,n)=><Reveal key={i}><div className="card"><span className="n">0{n+1}</span><h3>{i}</h3></div></Reveal>)}</div></div></section>
    <Interlude compact video={pageVideo(vi + 2)} eyebrow="Delivery" title="Built to run in production, not just to demo." text="Short cycles, visible progress and an evaluation gate before anything goes live."><Link className="btn p" href="/contact">Talk to an expert</Link></Interlude>
    {demo.map(([t,c,k],i)=><DemoStage key={t} id={`demo-${i + 1}`} kind={k} title={t} video={pageVideo(vi + 5 + i)}>{c}</DemoStage>)}
    <section><div className="wrap"><Reveal><h2>From scope to operations.</h2><p className="sub">The same four-stage approach on every engagement.</p><Tabs items={deliver}/></Reveal></div></section>
    <VBand video={pageVideo(vi + 8)}><Reveal><h2>What we work with</h2><div className="chips" style={{marginTop:28}}>{d.stack.map(c=><span className="cx" key={c}>{c}</span>)}</div></Reveal></VBand>
    <section><div className="wrap"><Reveal><h2>{s.name} for your team</h2></Reveal><div className="cards" style={{marginTop:36}}>{audiences.map(a=><Reveal key={a.slug}><Link className="card" href={`/services/${s.slug}/for/${a.slug}`}><span className="ar">↗</span><h3 style={{marginTop:30}}>{a.name}</h3><p>{a.desc}</p></Link></Reveal>)}</div></div></section>
    <section><div className="wrap"><Reveal><h2>Works well with</h2></Reveal><div className="cards" style={{marginTop:36}}>{rel.map(x=><Link className="card" key={x.slug} href={`/services/${x.slug}`}><span className="ar">↗</span><h3 style={{marginTop:30}}>{x.name}</h3><p>{x.tag}</p></Link>)}</div></div></section>
    <section><div className="wrap" style={{maxWidth:860}}><Reveal><h2>FAQ</h2><div style={{marginTop:28}}><Faq list={faqFor(s)}/></div></Reveal></div></section>
    <VCta video={pageVideo(vi + 10)} title={`Let's scope your ${s.name.toLowerCase()} project.`} text="An engineer replies within 24 hours with a written plan: scope, timeline and cost." label="Get started" /></>);
}
