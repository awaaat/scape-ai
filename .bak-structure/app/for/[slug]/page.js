import { withOG } from '@/lib/seo';
import Link from 'next/link';
import { Bg, Interlude, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import Offer from '@/components/Offer';
import { NeuralCanvas } from '@/components/Labs';
import { Crumb } from '@/components/Chrome';
import { audiences, services, bySlug } from '@/lib/data';
export const generateStaticParams = () => audiences.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = bySlug(audiences, slug); if (!s) return {};
  return withOG({ title: `AI services for ${s.name}`, description: s.desc, alternates: { canonical: `/for/${slug}` } }); }
export default async function Aud({ params }) {
  const { slug } = await params; const s = bySlug(audiences, slug); if (!s) notFound(); const vi = 9 + audiences.findIndex(x => x.slug === s.slug);
  return (<><section className="page" style={{position:'relative',overflow:'hidden'}}><Bg name={pageVideo(9 + audiences.findIndex(x => x.slug === s.slug))} dim={0.74} side /><NeuralCanvas density={45}/><div className="wrap" style={{position:'relative'}}><Crumb items={[{t:'Home',href:'/'},{t:'Who we serve'},{t:s.name}]}/>
    <h1>AI services for <span className="grad">{s.name}</span></h1><p className="lead">{s.desc}</p><div className="cta"><Link className="btn p" href="/contact">Get started</Link><Link className="btn" href="/lab">Try live demos</Link></div></div></section>
    <VBand video={pageVideo(vi + 4)}><Reveal><h2>Specific offers, with a demo for each.</h2><div style={{height:20}}/><Offer initial={slug} lock/></Reveal></VBand>
    <Interlude compact video={pageVideo(vi + 7)} eyebrow="See it before you buy it" title="Every offer comes with a demo you can use." text="Open any of them, run it on your own example, then talk to us."><Link className="btn p" href="/lab">Try the live demos</Link></Interlude>
    <section className="pn mid"><div className="wrap"><Reveal><h2>Every service, tailored for {s.name.toLowerCase()}.</h2></Reveal><div className="cards" style={{marginTop:36}}>{services.map(x=><Reveal key={x.slug}><Link className="card" href={`/services/${x.slug}/for/${s.slug}`}><span className="ar">↗</span><h3 style={{marginTop:30}}>{x.name}</h3><p>{x.tag}</p></Link></Reveal>)}</div></div></section>
    <VCta video={pageVideo(vi + 10)} title="Your first AI win is one 24-hour reply away." text="Tell us the problem. An engineer sends back a written plan with scope, timeline and cost." label="Get my free AI plan" /></>);
}
