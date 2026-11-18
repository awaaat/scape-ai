# Connecting Scape AI to the order-tracking backend

The site talks to the **same Django `orders` app** as scapedatasolutions.com (`/api/orders/...`), registered as its own
storefront called `ai`. Nothing else in the backend changes.

## 1. Register the site (2 minutes)
1. Open `backend_patch/catalog_ai_site.py`, paste the `AI = build_site(...)` block into `orders/catalog.py` above `SITES`.
2. Change `SITES = {...}` to include it: `SITES = {s["key"]: s for s in (THESIS, MAIN, AI)}`.
3. Commit and deploy the backend (Render). Verify: `GET https://<backend>/api/orders/catalog/?site=ai` returns Scape AI's steps.

## 2. Environment variables
| Where | Variable | Value |
|---|---|---|
| Backend (Render) | `ORDER_NOTIFICATION_EMAILS` | the address(es) that should receive every alert (comma separated) |
| Backend | `ORDERS_API_BASE_URL` | the backend's public URL, so reminder emails get click tracking + one-click unsubscribe |
| Backend | `ORDER_ENGINE_INPROCESS` | `true` if you have no cron / Celery beat (runs the reminder engine inside the web process) |
| Backend | `BREVO_API_KEY`, `DEFAULT_FROM_EMAIL` | already set for the parent site |
| This site (Vercel) | `NEXT_PUBLIC_API_URL` | `https://<backend>/api` |
| This site | `NEXT_PUBLIC_BASE_URL` | `https://ai.scapedatasolutions.com` |

CORS needs nothing: `https://ai.scapedatasolutions.com` matches your existing `*.scapedatasolutions.com` regex, and
`http://localhost:5173` is already allowed for development.

## 3. What happens, and which email you get
| Visitor does | Backend does | Email |
|---|---|---|
| Types a valid email and leaves the field, or clicks Continue (step 1) | creates a draft with the email, utm/referrer/page, visitor id | none yet (recoverable lead) |
| Enters name + picks who they are (step 2) | name + email now both known | **`[ORDER STARTED · ai]`** to you |
| Fills steps 3 and 4 | saves each step (`current_step`), scores the lead | none |
| Closes the tab (`pagehide` beacon) | marks exit; 5 min later if still a draft | **`[ABANDONED ORDER · ai]`** to you, plus a "you were one step away" email with a resume link to the client |
| Comes back via the link | `/contact?resume=<token>` re-opens the flow exactly where they stopped | cancels the pending alert |
| Still silent | reminder ladder 24h, 72h, 7d, 14d (urgent: 4h, 24h, 48h), never 20:00-08:00 local | reminders to the client |
| Score ≥ 65 and still a draft after 24h | | **`[HOT LEAD PENDING]`** to you |
| Submits | order becomes `submitted`, reference `SCP-XXXXXX` | **`[NEW ORDER · ai]`** to you (Reply goes straight to the client) **and a confirmation to the client** |
| Every morning 08:00 (backend timezone) | | `[ORDER DIGEST]` |

If the backend is unreachable at submit time, the site falls back to its own `/api/contact` route (set `FORMSPREE_ID`
to receive these) so a lead is never lost.

## 4. Test it locally
```bash
# backend
python manage.py runserver 8000
# this site (a second terminal)
cp .env.example .env.local   # keep NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev                  # http://localhost:5173
```
Open the site, click **Get started**, enter an email, then watch the backend log and the admin at `/admin/orders/order/`.
`python manage.py run_order_engagement --dry-run` prints what the reminder engine would send.
