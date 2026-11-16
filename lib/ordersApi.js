// Client for the Django `orders` app (/api/orders/...). Same engine as the parent site and the thesis site;
// this storefront is registered in the backend as site "ai" (see backend_patch/catalog_ai_site.py).
export const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');
export const SITE_KEY = process.env.NEXT_PUBLIC_ORDER_SITE || 'ai';

export class OrderApiError extends Error {
  constructor(message, status, fieldErrors) { super(message); this.status = status; this.fieldErrors = fieldErrors || null; }
}
const NETWORK_MSG = "Couldn't reach the server. Check your connection and try again, or email info@scapedatasolutions.com";

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API}/orders${path}`, { method, credentials: 'include', headers: body === undefined ? undefined : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch { throw new OrderApiError(NETWORK_MSG, 0); }
  if (res.status === 204) return null;
  let data = null; try { data = await res.json(); } catch { /* empty body */ }
  if (res.status === 429) throw new OrderApiError('Too many requests. Please wait a minute and try again.', 429);
  if (!res.ok) {
    if (data && typeof data === 'object') {
      const key = Object.keys(data)[0]; const first = Array.isArray(data[key]) ? data[key][0] : data[key];
      throw new OrderApiError(typeof first === 'string' ? first : 'Please check your details and try again.', res.status, res.status === 400 ? data : null);
    }
    throw new OrderApiError('Something went wrong. Please try again or email info@scapedatasolutions.com', res.status);
  }
  return data;
}

export const startOrder = (payload) => request('/start/', { method: 'POST', body: { site: SITE_KEY, ...payload } });
export const getOrder = (token) => request(`/${encodeURIComponent(token)}/`);
export const saveOrder = (token, payload) => request(`/${encodeURIComponent(token)}/`, { method: 'PATCH', body: payload });
export const submitOrder = (token, payload = {}) => request(`/${encodeURIComponent(token)}/submit/`, { method: 'POST', body: payload });

// Exit / return signals. sendBeacon survives tab close; the backend turns "leave" into an abandoned-order alert
// 5 minutes later unless "return" (or loading the draft) cancels it.
export const beacon = (token, kind) => { try { navigator.sendBeacon(`${API}/orders/${encodeURIComponent(token)}/${kind}/`); } catch { /* unsupported */ } };

const TOKEN_KEY = `scape_order_token_${SITE_KEY}`;
export const loadToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
export const saveToken = (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* private mode */ } };
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

// Where the visitor came from. URL utm_* wins; otherwise we tag the on-site entry point (dock, exit modal, nav...).
export function attribution(medium = 'site') {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search); const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => { if (p.get(k)) utm[k] = p.get(k).slice(0, 200); });
  if (!utm.utm_source) { utm.utm_source = 'scape-ai'; utm.utm_medium = medium; utm.utm_campaign = (window.location.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home').slice(0, 190); }
  utm.entry = medium;
  return { page_url: window.location.href.slice(0, 500), referrer: (document.referrer || '').slice(0, 500), utm };
}
