import { BASE, services, industries, audiences } from '@/lib/data';
import { solutions } from '@/lib/solutions';

const NOW = new Date();
const e = (path, priority, changeFrequency = 'monthly') => ({ url: BASE + path, lastModified: NOW, changeFrequency, priority });

export default function sitemap() {
  return [
    e('', 1, 'weekly'), e('/solutions', 0.9, 'weekly'), e('/lab', 0.8, 'weekly'), e('/contact', 0.8, 'yearly'), e('/about', 0.6, 'yearly'),
    ...solutions.map(x => e(`/solutions/${x.slug}`, 0.9)),
    ...services.map(s => e(`/services/${s.slug}`, 0.9)),
    ...industries.map(s => e(`/industries/${s.slug}`, 0.7)),
    ...audiences.map(s => e(`/for/${s.slug}`, 0.7)),
    ...services.flatMap(s => audiences.map(a => e(`/services/${s.slug}/for/${a.slug}`, 0.6))),
    e('/sitemap', 0.3), e('/privacy', 0.2, 'yearly'), e('/terms', 0.2, 'yearly'), e('/cookies', 0.2, 'yearly'),
  ];
}
