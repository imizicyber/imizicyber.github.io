/**
 * Email obfuscation — constructs the email address at runtime
 * to prevent scraper bots from harvesting it from static HTML.
 */
export function initEmailObfuscation(): void {
  const u = 'info';
  const d = 'imizicyber.com';
  const full = u + '@' + d;
  const el = document.getElementById('email-link') as HTMLAnchorElement | null;
  if (el) {
    el.href = 'mai' + 'lto:' + full;
    el.textContent = full;
  }
}
