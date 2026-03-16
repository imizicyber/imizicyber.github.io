import { describe, it, expect, beforeEach } from 'vitest';
import {
  getConsentState,
  setConsentState,
  resetConsentState,
  loadGA,
  initCookieBanner,
} from '@/scripts/cookie-consent';

describe('cookie-consent', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getConsentState', () => {
    it('returns null when no consent stored', () => {
      expect(getConsentState()).toBeNull();
    });

    it('returns accepted after setConsentState(true)', () => {
      setConsentState(true);
      expect(getConsentState()).toBe('accepted');
    });

    it('returns rejected after setConsentState(false)', () => {
      setConsentState(false);
      expect(getConsentState()).toBe('rejected');
    });

    it('returns null for invalid stored values', () => {
      localStorage.setItem('imizi-cookie-consent', 'invalid');
      expect(getConsentState()).toBeNull();
    });
  });

  describe('resetConsentState', () => {
    it('clears stored consent', () => {
      setConsentState(true);
      resetConsentState();
      expect(getConsentState()).toBeNull();
    });
  });

  describe('loadGA', () => {
    it('appends a script tag to document head', () => {
      const initialScripts = document.head.querySelectorAll('script').length;
      loadGA();
      const scripts = document.head.querySelectorAll('script');
      expect(scripts.length).toBe(initialScripts + 1);
      const lastScript = scripts[scripts.length - 1];
      expect(lastScript.src).toContain('googletagmanager.com');
    });

    it('sets window.gtag function', () => {
      loadGA();
      expect(typeof window.gtag).toBe('function');
    });

    it('initializes dataLayer', () => {
      loadGA();
      expect(Array.isArray(window.dataLayer)).toBe(true);
    });
  });

  describe('initCookieBanner', () => {
    beforeEach(() => {
      document.body.replaceChildren();
      const banner = document.createElement('div');
      banner.id = 'cookie-banner';
      const acceptBtn = document.createElement('button');
      acceptBtn.id = 'cookie-accept';
      acceptBtn.textContent = 'Accept';
      const rejectBtn = document.createElement('button');
      rejectBtn.id = 'cookie-reject';
      rejectBtn.textContent = 'Reject';
      banner.appendChild(acceptBtn);
      banner.appendChild(rejectBtn);
      document.body.appendChild(banner);
    });

    it('returns early if banner elements not found', () => {
      document.body.replaceChildren();
      initCookieBanner();
    });

    it('shows banner when no consent stored', () => {
      initCookieBanner();
      const banner = document.getElementById('cookie-banner');
      expect(banner).not.toBeNull();
      expect(banner?.classList.contains('visible')).toBe(true);
    });

    it('hides banner and stores consent on accept click', () => {
      initCookieBanner();
      const acceptBtn = document.getElementById('cookie-accept');
      expect(acceptBtn).not.toBeNull();
      acceptBtn?.click();
      const banner = document.getElementById('cookie-banner');
      expect(banner?.classList.contains('visible')).toBe(false);
      expect(getConsentState()).toBe('accepted');
    });

    it('hides banner and stores rejection on reject click', () => {
      initCookieBanner();
      const rejectBtn = document.getElementById('cookie-reject');
      expect(rejectBtn).not.toBeNull();
      rejectBtn?.click();
      const banner = document.getElementById('cookie-banner');
      expect(banner?.classList.contains('visible')).toBe(false);
      expect(getConsentState()).toBe('rejected');
    });

    it('does not show banner if already accepted', () => {
      setConsentState(true);
      initCookieBanner();
      const banner = document.getElementById('cookie-banner');
      expect(banner?.classList.contains('visible')).toBe(false);
    });

    it('does not show banner if already rejected', () => {
      setConsentState(false);
      initCookieBanner();
      const banner = document.getElementById('cookie-banner');
      expect(banner?.classList.contains('visible')).toBe(false);
    });
  });
});
