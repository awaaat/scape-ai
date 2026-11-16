import { BASE } from '@/lib/seo';
export default () => ({
  rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
  sitemap: [`${BASE}/sitemap.xml`, `${BASE}/video-sitemap.xml`],
  host: BASE,
});
