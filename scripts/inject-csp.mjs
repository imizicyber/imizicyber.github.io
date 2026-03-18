/**
 * Post-build script: injects per-page CSP meta tags with SHA-256 hashes
 * for all inline scripts found in each HTML file.
 *
 * Replaces a placeholder CSP meta tag or adds one if missing.
 */
import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { resolve } from 'path';

const DIST = resolve('dist');

// External script sources allowed
const SCRIPT_SOURCES = [
  "'self'",
  'https://www.googletagmanager.com',
  'https://cdnjs.cloudflare.com',
  'https://unpkg.com',
  'https://cdn.jsdelivr.net',
];

const STYLE_SOURCES = ["'self'"];

const OTHER_DIRECTIVES = [
  "default-src 'self'",
  "font-src 'self'",
  "img-src 'self' https: data:",
  "connect-src 'self' https://formspree.io https://www.google-analytics.com",
  "frame-ancestors 'none'",
];

function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('base64');
}

function getInlineScriptHashes(html) {
  const hashes = new Set();
  const regex = /<script(?:\s+type="module")?>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const content = match[1];
    if (content.trim()) {
      hashes.add(`'sha256-${sha256(content)}'`);
    }
  }
  return [...hashes];
}

function getInlineStyleHashes(html) {
  const hashes = new Set();
  const regex = /<style[^>]*>([\s\S]*?)<\/style>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const content = match[1];
    if (content.trim()) {
      hashes.add(`'sha256-${sha256(content)}'`);
    }
  }
  return [...hashes];
}

function buildCSP(scriptHashes, styleHashes) {
  const scriptSrc = ['script-src', ...SCRIPT_SOURCES, ...scriptHashes].join(' ');
  const styleSrc = ['style-src', ...STYLE_SOURCES, ...styleHashes].join(' ');
  return [...OTHER_DIRECTIVES, scriptSrc, styleSrc].join('; ');
}

// Find all HTML files
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function findHtmlFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles(DIST);
let updated = 0;

for (const file of htmlFiles) {
  let html = readFileSync(file, 'utf8');
  const hashes = getInlineScriptHashes(html);
  const styleHashes = getInlineStyleHashes(html);

  const csp = buildCSP(hashes, styleHashes);
  const metaTag = `<meta http-equiv="Content-Security-Policy" content="${csp}">`;

  // Replace existing CSP meta tag or insert after <head>
  const cspRegex = /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/i;
  if (cspRegex.test(html)) {
    html = html.replace(cspRegex, metaTag);
  } else {
    html = html.replace(/<head>/, `<head>${metaTag}`);
  }

  writeFileSync(file, html);
  updated++;
}

console.log(`CSP injected into ${updated} HTML files with per-page script hashes.`);
