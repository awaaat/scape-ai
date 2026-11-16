import Link from 'next/link';
import PageHero from '@/components/PageHero';
export const metadata = { title: 'Page not found', robots: { index: false, follow: true } };
export default function NotFound() {
  return (<PageHero crumbs={[{ t: 'Home', href: '/' }, { t: '404' }]} title="That page doesn't exist." lead="It may have moved. Head home or browse every page." video={11}>
    <div className="cta"><Link className="btn p" href="/">Back home</Link><Link className="btn" href="/sitemap">Browse all pages</Link></div></PageHero>);
}
