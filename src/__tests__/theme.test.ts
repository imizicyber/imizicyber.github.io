import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredTheme, setTheme, toggleTheme } from '@/scripts/theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = 'dark';
  });

  describe('getStoredTheme', () => {
    it('returns null when no theme stored', () => {
      expect(getStoredTheme()).toBeNull();
    });

    it('returns light after storing light', () => {
      localStorage.setItem('imizi-theme', 'light');
      expect(getStoredTheme()).toBe('light');
    });

    it('returns dark after storing dark', () => {
      localStorage.setItem('imizi-theme', 'dark');
      expect(getStoredTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('sets data-theme attribute to light', () => {
      setTheme('light');
      expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('sets data-theme attribute to dark', () => {
      setTheme('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('persists theme to localStorage', () => {
      setTheme('light');
      expect(localStorage.getItem('imizi-theme')).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('toggles from dark to light', () => {
      document.documentElement.dataset.theme = 'dark';
      toggleTheme();
      expect(document.documentElement.dataset.theme).toBe('light');
      expect(localStorage.getItem('imizi-theme')).toBe('light');
    });

    it('toggles from light to dark', () => {
      document.documentElement.dataset.theme = 'light';
      toggleTheme();
      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(localStorage.getItem('imizi-theme')).toBe('dark');
    });
  });
});
