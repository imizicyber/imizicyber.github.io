import { ANALYTICS } from '@/data/site';

const STORAGE_KEY = 'imizi-cookie-consent';

export type ConsentState = 'accepted' | 'rejected' | null;

export function getConsentState(): ConsentState {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'accepted' || value === 'rejected') return value;
    return null;
  } catch {
    return null;
  }
}

export function setConsentState(accepted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'rejected');
  } catch {
    // localStorage unavailable
  }
}

export function resetConsentState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

export function loadGA(): void {
  const gaId = ANALYTICS.gaId;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', gaId);
}

export function initCookieBanner(): void {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner || !acceptBtn || !rejectBtn) return;

  const bannerEl = banner;
  function handleConsent(accepted: boolean): void {
    setConsentState(accepted);
    bannerEl.classList.remove('visible');
    if (accepted) loadGA();
  }

  acceptBtn.addEventListener('click', () => handleConsent(true));
  rejectBtn.addEventListener('click', () => handleConsent(false));

  const state = getConsentState();
  if (state === 'accepted') {
    loadGA();
  } else if (state !== 'rejected') {
    banner.classList.add('visible');
    rejectBtn.focus();
  }
}

// Type declarations for window globals used by GA
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
