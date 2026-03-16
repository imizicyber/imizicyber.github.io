const STORAGE_KEY = 'imizi-theme';

export function getStoredTheme(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setTheme(theme: 'dark' | 'light'): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable
  }
}

export function toggleTheme(): void {
  const current = document.documentElement.dataset.theme;
  setTheme(current === 'light' ? 'dark' : 'light');
}
