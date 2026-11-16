// Source clips are portrait 9:16. Web versions live in /public/media (audio stripped).
// lib/clips.json is written by scripts/videos.sh from whatever is in public/media. Do not edit it by hand.
import clips from './clips.json';
const m = (n) => ({ src: `/media/${n}.mp4`, poster: `/media/${n}.jpg` });
const table = Object.fromEntries(clips.all.map((n) => [n, m(n)]));
// A name that no longer exists (a deleted clip) falls back to another clip instead of breaking the page.
export const media = new Proxy(table, { get: (t, k) => (typeof k === 'symbol' || k in t ? t[k] : t[clips.pool[0]]) });
// Inner pages: one different clip per section; old and new clips alternate so neighbours never match.
const POOL = clips.pool;
export const pageVideo = (i) => POOL[((i % POOL.length) + POOL.length) % POOL.length];
