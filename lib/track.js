// Google Analytics 4 events (no-ops until gtag has loaded / consent mode lets it record).
export const track = (name, params = {}) => { try { if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params); } catch { /* never break the page */ } };
