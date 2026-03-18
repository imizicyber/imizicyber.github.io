import { ANALYTICS } from '@/data/site';

/**
 * Send a GA4 custom event. Only fires if consent was given and gtag is loaded.
 * This is the single entry point all components should use for GA4 events.
 */
export function trackEvent(eventName: string, params?: Record<string, string>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Dynamically inject the LinkedIn Insight Tag script.
 * Must only be called after cookie consent is accepted.
 */
export function loadLinkedIn(): void {
  const partnerId = ANALYTICS.linkedInPartnerId;
  if (!partnerId || partnerId === 'REPLACE_ME') return;

  window._linkedin_partner_id = partnerId;
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(partnerId);

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
  document.head.appendChild(s);
}

// Type declarations for LinkedIn Insight Tag window globals
declare global {
  interface Window {
    _linkedin_partner_id: string;
    _linkedin_data_partner_ids: string[];
  }
}
