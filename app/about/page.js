import Link from 'next/link';
import { withOG } from '@/lib/seo';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { Interlude, VBand, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { services, deliver } from '@/lib/data';

export const metadata = withOG({ title: 'About Scape AI', description: 'Scape AI is the AI engineering division of Scape Data Solutions: strategy, agents, custom models, evaluation, data and managed AI operations.', alternates: { canonical: '/about' } });

export default function About() {
  return (<>
    <PageHero crumbs={[{ t: 'Home', href: '/' }, { t: 'About' }]} title="AI engineering, delivered end to end." lead="Scape AI is the AI division of Scape Data Solutions. One accountable team designs, builds, evaluates and runs AI systems for enterprises, growing businesses and independent experts." video={8}>
      <div className="cta"><Link className="btn p" href="/contact">Get my free AI plan</Link><Link className="btn" href="/lab">Try live demos</Link></div></PageHero>
    <section><div className="wrap two"><Reveal><h2>What we do</h2><p className="big">We cover the whole path from the first use case to a system running in production, so you do not coordinate several vendors.</p></Reveal>
      <Reveal>{services.map((s, i) => <Link className="card" style={{ display: 'block', marginBottom: 12 }} key={s.slug} href={`/services/${s.slug}`}><span className="n" style={{ marginBottom: 8 }}>0{i + 1}</span><h3>{s.name}</h3><p>{s.tag}</p></Link>)}</Reveal></div></section>
    <Interlude compact video={pageVideo(2)} eyebrow="How we work" title="Scoped in writing. Proven before launch." text="Every engagement follows the same four stages, and nothing goes live without an evaluation gate." />
    <VBand video={pageVideo(5)}><Reveal><h2>The four stages</h2></Reveal><div className="cards" style={{ marginTop: 36 }}>{deliver.map((d, i) => <Reveal key={d.t}><div className="card"><span className="n">0{i + 1}</span><h3>{d.t}: {d.h}</h3><p>{d.p}</p></div></Reveal>)}</div></VBand>
    <VCta video={pageVideo(10)} title="Tell us the problem." text="An engineer replies within 24 hours with a written plan: scope, timeline and cost." label="Get my free AI plan" />
  </>);
}
