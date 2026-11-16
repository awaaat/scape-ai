import PageHero from '@/components/PageHero';

export default function Legal({ title, lead, updated = '17 November 2026', video = 6, children }) {
  return (<><PageHero crumbs={[{ t: 'Home', href: '/' }, { t: title }]} title={title} lead={lead} video={video} />
    <section><div className="wrap prose"><p className="mono">Last updated {updated}</p>{children}</div></section></>);
}
