import { withOG } from '@/lib/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Crumb, Faq } from '@/components/Chrome';
import { Bg, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { services, audiences, bySlug, faqFor } from '@/lib/data';
export const generateStaticParams = () => services.flatMap(s => audiences.map(a => ({ slug: s.slug, aud: a.slug })));
export async function generateMetadata({ params }) { const { slug, aud } = await params; const s = bySlug(services, slug), a = bySlug(audiences, aud); if (!s || !a) return {};
  return withOG({ title: `${s.name} for ${a.name}`, description: `${s.desc} Built for ${a.name.toLowerCase()}.`, alternates: { canonical: `/services/${slug}/for/${aud}` } }); }
export default async function Combo({ params }) {
  const { slug, aud } = await params; const s = bySlug(services, slug), a = bySlug(audiences, aud); if (!s || !a) notFound();
  const vi = services.findIndex(x => x.slug === s.slug) + audiences.findIndex(x => x.slug === a.slug) * 2;
  return (<>
    <section className="page"><Bg name={pageVideo(vi + 1)} dim={0.8} side /><div className="wrap"><Crumb items={[{t:'Home',href:'/'},{t:s.name,href:`/services/${s.slug}`},{t:a.name}]}/>
      <h1>{s.name} for <span className="grad">{a.name}</span></h1>
      <p className="lead" style={{margin:'16px 0 28px'}}>{s.desc} {a.desc}</p><Link className="btn p" href="/contact">Get a proposal</Link></div></section>
    <VBand video={pageVideo(vi + 5)}><h2>Scope</h2><div className="cards" style={{marginTop:30}}>{s.items.map(i=><div className="card" key={i}><h3>{i}</h3></div>)}</div></VBand>
    <section className="pn"><div className="wrap" style={{maxWidth:860}}><h2>FAQ</h2><div style={{marginTop:24}}><Faq list={faqFor(s)}/></div></div></section>
    <VCta video={pageVideo(vi + 9)} title={`${s.name} for ${a.name.toLowerCase()}, scoped in 24 hours.`} text="An engineer replies with a written plan: scope, timeline and cost." label="Get a proposal" />
  </>);
}
