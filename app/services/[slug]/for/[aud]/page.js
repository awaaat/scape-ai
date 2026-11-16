import { withOG } from '@/lib/seo';
import { VCta } from '@/components/BgVideo';
import { pageVideo } from '@/lib/media';
import { notFound } from 'next/navigation';
import { Faq } from '@/components/Chrome';
import { services, audiences, bySlug, faqFor } from '@/lib/data';
import { HeroPanel, HeroCenter, HeroType, HeroFrame, Sec, Head, Split, Rows, Cols, Bento, Statement, Actions, Btn } from '@/components/Blocks';
export const generateStaticParams = () => services.flatMap(s => audiences.map(a => ({ slug: s.slug, aud: a.slug })));
export async function generateMetadata({ params }) { const { slug, aud } = await params; const s = bySlug(services, slug), a = bySlug(audiences, aud); if (!s || !a) return {};
  return withOG({ title: `${s.name} for ${a.name}`, description: `${s.desc} Built for ${a.name.toLowerCase()}.`, alternates: { canonical: `/services/${slug}/for/${aud}` } }); }
export default async function Combo({ params }) {
  const { slug, aud } = await params; const s = bySlug(services, slug), a = bySlug(audiences, aud); if (!s || !a) notFound();
  const si = services.findIndex(x => x.slug === s.slug), ai = audiences.findIndex(x => x.slug === a.slug), vi = si + ai * 2;
  const h = (si + ai) % 4, b = (si + 2 * ai) % 3, an = a.name.toLowerCase();
  const common = { crumb: [{ t: 'Home', href: '/' }, { t: s.name, href: `/services/${s.slug}` }, { t: a.name }], title: <>{s.name} for <span className="grad">{a.name}</span></>, lead: `${s.desc} ${a.desc}`,
    actions: <Actions><Btn p href="/contact">Get a proposal</Btn></Actions> };
  const items = s.items.map(x => [x]);
  const hero = [
    <HeroPanel key="h" {...common} video={pageVideo(vi + 1)} label="In scope" rows={items} />,
    <HeroCenter key="h" {...common} video={pageVideo(vi + 1)} stats={[['Service', s.name], ['Audience', a.name], ['First reply', '24 hours']]} />,
    <HeroType key="h" {...common} video={pageVideo(vi + 1)} spec={[['Service', s.tag], ['Audience', a.name], ['Workstreams', String(s.items.length)], ['First reply', '24 hours']]} />,
    <HeroFrame key="h" {...common} video={pageVideo(vi + 1)} tag={`${s.name} · ${a.name}`} />,
  ][h];
  const scope = h === 0 ? <Statement by={`Built for ${an}`}>{a.desc}</Statement>
    : b === 0 ? <Sec><Head k="Scope" title="What is included" /><div style={{ marginTop: 40 }}><Cols n={4} items={items} /></div></Sec>
    : b === 1 ? <Split video={pageVideo(vi + 13)} k="Scope" title="What is included"><Rows items={items} /></Split>
    : <Sec alt><Head k="Scope" title="What is included" /><div style={{ marginTop: 36 }}><Bento items={items} /></div></Sec>;
  const faq = <Faq list={faqFor(s)} />;
  return (<div className="xp">{hero}{scope}
    {b === 1 ? <Sec narrow={860}><Head k="FAQ" title="Questions we hear" /><div style={{ marginTop: 24 }}>{faq}</div></Sec> : <Split flip={b === 2} video={pageVideo(vi + 5)} k="FAQ" title="Questions we hear">{faq}</Split>}
    <VCta video={pageVideo(vi + 9)} title={`${s.name} for ${an}, scoped in 24 hours.`} text="An engineer replies with a written plan: scope, timeline and cost." label="Get a proposal" />
  </div>);
}
