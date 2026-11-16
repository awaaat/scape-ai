import { withOG } from '@/lib/seo';
import Link from 'next/link';
import { Bg, Interlude, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import { Crumb, Faq } from '@/components/Chrome';
import { industries, services, bySlug } from '@/lib/data';
export const generateStaticParams = () => industries.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = bySlug(industries, slug); if (!s) return {};
  return withOG({ title: `AI for ${s.name}`, description: s.desc, alternates: { canonical: `/industries/${slug}` } }); }
export default async function Industry({ params }) {
  const { slug } = await params; const s = bySlug(industries, slug); if (!s) notFound();
  const faq = [[`How is AI used in ${s.name.toLowerCase()}?`, s.uses.join('; ') + '.'], ['Can you meet our compliance requirements?', 'We scope security and compliance needs up front and can work inside your own cloud environment.']];
  const vi = industries.findIndex(x => x.slug === s.slug);
  return (<>
    <section className="page"><Bg name={pageVideo(5 + vi)} dim={0.8} side /><div className="wrap"><Crumb items={[{t:'Home',href:'/'},{t:'Industries'},{t:s.name}]}/>
      <h1>AI for <span className="grad">{s.name}</span></h1><p className="lead" style={{margin:'16px 0 28px'}}>{s.desc}</p><Link className="btn p" href="/contact">Talk to us</Link></div></section>
    <VBand video={pageVideo(8 + vi)}><h2>Use cases</h2><div className="cards" style={{marginTop:30}}>{s.uses.map(u=><div className="card" key={u}><h3>{u}</h3></div>)}</div></VBand>
    <section className="pn"><div className="wrap"><h2>Services</h2><div className="cards" style={{marginTop:30}}>{services.map(x=><Link className="card" key={x.slug} href={`/services/${x.slug}`}><h3>{x.name}</h3><p>{x.tag}</p></Link>)}</div></div></section>
    <Interlude compact video={pageVideo(2 + vi)} eyebrow="Built for your sector" title={`AI that fits ${s.name.toLowerCase()}, not a generic demo.`} text="We scope security and compliance needs up front and can work inside your own cloud environment." />
    <section className="pn"><div className="wrap" style={{maxWidth:860}}><h2>FAQ</h2><div style={{marginTop:24}}><Faq list={faq}/></div></div></section>
    <VCta video={pageVideo(11 + vi)} title={`Let's scope your ${s.name.toLowerCase()} project.`} text="An engineer replies within 24 hours with a written plan." label="Talk to us" />
  </>);
}
