# Scape AI

Marketing site, interactive AI lab and order funnel for **ai.scapedatasolutions.com** (Next.js 15, React 19).

```bash
npm install
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL to your Django backend
npm run dev                    # http://localhost:5173
npm run build && npm start     # production on port 5173
```

## Where things are
| Path | What |
|---|---|
| `app/layout.js` | the `index.html` equivalent: meta, icons, Open Graph, Twitter, GA4 (consent mode), JSON-LD, noscript |
| `public/` | favicon.svg/.ico, icon-192/512, maskable icon, apple-touch-icon, og-default.png, site.webmanifest, llms.txt |
| `scripts/make-icons.py` | regenerates every icon and the share image |
| `components/ProjectFlow.js` | the tracked "Start a project" flow + dock, scroll toast and exit modal |
| `lib/ordersApi.js` | client for the Django `orders` app (site key `ai`) |
| `backend_patch/` + `docs/BACKEND_SETUP.md` | the one block to paste into the backend + how emails fire |
| `lib/solutions.js` | keyword-targeted landing pages (edit copy here) |
| `docs/SEO_KEYWORDS.md` | keyword research and plan |
| `docs/AI_DEMOS.md` | how the live AI demos work, turning on the model, cost protection |
| `app/api/chat`, `app/api/agent`, `lib/kb.js`, `lib/guard.js` | server routes and knowledge bases behind the assistant and agent |

Core content for services, industries and audiences lives in `lib/data.js`.
