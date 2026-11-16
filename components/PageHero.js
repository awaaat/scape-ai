import { Bg } from '@/components/BgVideo';
import { Crumb } from '@/components/Chrome';
import { pageVideo } from '@/lib/media';

// The one hero every plain page uses: a full-bleed video and the text. Nothing else.
export default function PageHero({ crumbs, title, lead, video = 4, children }) {
  return (<section className="page"><Bg name={pageVideo(video)} dim={0.3} side />
    <div className="wrap"><Crumb items={crumbs} /><h1>{title}</h1>{lead && <p className="lead">{lead}</p>}{children}</div></section>);
}
