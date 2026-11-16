import { withOG } from '@/lib/seo';
import { Interlude, VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import { Faq } from '@/components/Chrome';
import { industries, services, bySlug } from '@/lib/data';
import { HeroPanel, HeroCenter, HeroType, HeroFrame, Sec, Head, Split, Rows, Cols, Bento, Statement, Actions, Btn, VSec } from '@/components/Blocks';
export const generateStaticParams = () => industries.map(s => ({ slug: s.slug }));
export async function generateMetadata({ params }) { const { slug } = await params; const s = bySlug(industries, slug); if (!s) return {};
  return withOG({ title: `AI for ${s.name}`, description: s.desc, alternates: { canonical: `/industries/${slug}` } }); }
export default async function Industry({ params }) {
  const { slug } = await params; const s = bySlug(industries, slug); if (!s) notFound();
  const i = industries.findIndex(x => x.slug === s.slug), h = i % 4, v = Math.floor(i / 4) % 2, n = s.name.toLowerCase();
  const faq = [[`How is AI used in ${n}?`, s.uses.join('; ') + '.'], ['Can you meet our compliance requirements?', 'We scope security and compliance needs up front and can work inside your own cloud environment.']];
  const common = { crumb: [{ t: 'Home', href: '/' }, { t: 'Industries' }, { t: s.name }], title: <>AI for <span className="grad">{s.name}</span></>, lead: s.desc, actions: <Actions><Btn p href="/contact">Talk to us</Btn></Actions> };
  const hero = [
    <HeroPanel key="h" {...common} video={pageVideo(5 + i)} label="Where it applies" rows={s.uses.map(u => [u])} />,
    <HeroCenter key="h" {...common} video={pageVideo(5 + i)} stats={[['Sector', s.name], ['Use cases', String(s.uses.length)], ['First reply', '24 hours']]} />,
    <HeroType key="h" {...common} video={pageVideo(5 + i)} spec={[['Sector', s.name], ['Use cases', String(s.uses.length)], ['Delivery', 'Inside your cloud if needed'], ['First reply', '24 hours']]} />,
    <HeroFrame key="h" {...common} video={pageVideo(5 + i)} tag={`${s.name} · AI`} />,
  ][h];
  const showUses = h !== 0, uses = s.uses.map(u => [u]), svc = services.map(x => [x.name, x.tag, `/services/${x.slug}`]);
  return (<div className="xp">{hero}
    {v === 0 ? <>
      {showUses && <Sec><Head k="Use cases" title="Where AI helps first" /><div style={{ marginTop: 40 }}><Cols items={uses} /></div></Sec>}
      <Interlude compact video={pageVideo(2 + i)} eyebrow="Built for your sector" title={`AI that fits ${n}, not a generic demo.`} text="We scope security and compliance needs up front and can work inside your own cloud environment." />
      <VSec video={pageVideo(8 + i)} k="Services" title={`What we can build for ${n}`}><div style={{ marginTop: 36 }}><Rows two items={svc} /></div></VSec>
      <Split alt k="FAQ" title="Questions we hear"><Faq list={faq} /></Split>
    </> : <>
      {showUses && <Split k="Use cases" title="Where AI helps first"><Rows items={uses} /></Split>}
      <VSec video={pageVideo(8 + i)} k="Services" title={`What we can build for ${n}`}><div style={{ marginTop: 36 }}><Bento items={svc} /></div></VSec>
      <Statement by="Built for your sector">{`AI that fits ${n}, not a generic demo. We scope security and compliance up front and can work inside your own cloud.`}</Statement>
      <Sec narrow={860}><Head k="FAQ" title="Questions we hear" /><div style={{ marginTop: 24 }}><Faq list={faq} /></div></Sec>
    </>}
    <VCta video={pageVideo(11 + i)} title={`Let's scope your ${n} project.`} text="An engineer replies within 24 hours with a written plan." label="Talk to us" />
  </div>);
}
