import { QUESTIONS } from './data';
import type { ScoreBand } from './data';

declare global {
  interface Window {
    jspdf?: { jsPDF: new () => JsPDFInstance };
  }
}

export interface JsPDFInstance {
  setFillColor(r: number, g: number, b: number): void;
  rect(x: number, y: number, w: number, h: number, style: string): void;
  roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style: string,
  ): void;
  setTextColor(r: number, g?: number, b?: number): void;
  setFontSize(size: number): void;
  setFont(family: string | undefined, style: string): void;
  text(text: string | string[], x: number, y: number, options?: Record<string, unknown>): void;
  splitTextToSize(text: string, maxWidth: number): string[];
  getTextWidth(text: string): number;
  setDrawColor(r: number, g: number, b: number): void;
  setLineWidth(width: number): void;
  line(x1: number, y1: number, x2: number, y2: number): void;
  addPage(): void;
  save(filename: string): void;
}

export function esc(s: string | undefined | null): string {
  return s
    ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    : '';
}

export function loadJsPDF(): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (window.jspdf) {
      resolve();
      return;
    }
    const urls = [
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js',
      'https://unpkg.com/jspdf@2.5.2/dist/jspdf.umd.min.js',
      'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
    ];
    function tryNext(i: number): void {
      if (i >= urls.length) {
        reject();
        return;
      }
      const s = document.createElement('script');
      s.src = urls[i];
      s.onload = function () {
        if (window.jspdf) resolve();
        else tryNext(i + 1);
      };
      s.onerror = function () {
        tryNext(i + 1);
      };
      document.head.appendChild(s);
    }
    tryNext(0);
  });
}

export function generatePDF(
  quizTotal: number,
  quizBand: ScoreBand,
  quizAnswers: number[],
  userName: string,
  userOrg: string,
): void {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const bc =
    quizBand.cls === 'band-critical'
      ? '#ef4444'
      : quizBand.cls === 'band-high'
        ? '#f97316'
        : quizBand.cls === 'band-moderate'
          ? '#eab308'
          : quizBand.cls === 'band-lowmod'
            ? '#60a5fa'
            : '#34d399';
  const jspdfMod = window.jspdf;
  if (!jspdfMod) throw new Error('jsPDF not loaded');
  const doc = new jspdfMod.jsPDF() as JsPDFInstance;
  let y = 20;
  const m = 20;
  const pw = 170;
  let pg = 1;

  function footer(): void {
    doc.setFontSize(7);
    doc.setTextColor(180);
    doc.text('imizicyber.com', 105, 290, { align: 'center' });
    doc.text('Page ' + pg, 190, 290, { align: 'right' });
    pg++;
  }
  function newPage(): void {
    footer();
    doc.addPage();
    y = 20;
  }

  // Header bar
  doc.setFillColor(11, 20, 33);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('imizicyber', m, 17);
  doc.setTextColor(132, 148, 167);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('imizicyber.com | ' + date, 190, 13, { align: 'right' });
  doc.setFontSize(8);
  doc.text('SECURITY SCORE REPORT', 105, 24, { align: 'center' });
  y = 36;

  if (userName) {
    doc.setTextColor(100);
    doc.setFontSize(9);
    doc.text('Prepared for: ' + userName + (userOrg ? ' (' + userOrg + ')' : ''), m, y);
    y += 7;
  }

  // Score display - compact
  const cr2 = parseInt(bc.slice(1, 3), 16),
    cg2 = parseInt(bc.slice(3, 5), 16),
    cb2 = parseInt(bc.slice(5, 7), 16);
  doc.setTextColor(cr2, cg2, cb2);
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.text(quizTotal + ' / 30', 105, y + 10, { align: 'center' });
  y += 16;
  doc.setTextColor(30);
  doc.setFontSize(12);
  doc.text(quizBand.label, 105, y, { align: 'center' });
  y += 5;
  doc.setTextColor(100);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  const desc = doc.splitTextToSize(quizBand.desc, 140);
  doc.text(desc, 105, y, { align: 'center' });
  y += desc.length * 4 + 6;

  // Divider
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.6);
  doc.line(m, y, 190, y);
  y += 6;

  // Score Breakdown - compact 2-column layout
  doc.setTextColor(30);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Score Breakdown', m, y);
  y += 6;
  quizAnswers.forEach(function (v, i) {
    const col = i % 2 === 0 ? 0 : 1;
    const cx = m + col * 88;
    if (i % 2 === 0 && i > 0) y += 1;
    if (i % 2 === 0 && y > 270) {
      newPage();
    }
    const p = Math.round((v / 3) * 100),
      fc = v <= 1 ? '#f97316' : v === 2 ? '#eab308' : '#34d399';
    doc.setTextColor(60);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text(QUESTIONS[i].label, cx, y);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(130);
    doc.text(v + '/3', cx + 78, y, { align: 'right' });
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(cx, y + 1.5, 78, 2.5, 1, 1, 'F');
    const fr2 = parseInt(fc.slice(1, 3), 16),
      fg = parseInt(fc.slice(3, 5), 16),
      fb = parseInt(fc.slice(5, 7), 16);
    doc.setFillColor(fr2, fg, fb);
    doc.roundedRect(cx, y + 1.5, Math.max(78 * (p / 100), 2), 2.5, 1, 1, 'F');
    if (col === 1) y += 7;
  });
  if (quizAnswers.length % 2 === 1) y += 7;
  y += 4;

  // Divider
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.6);
  doc.line(m, y, 190, y);
  y += 6;

  // Recommendations
  doc.setTextColor(30);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Prioritised Recommendations', m, y);
  y += 8;
  quizAnswers.forEach(function (v, i) {
    const r = QUESTIONS[i].recos[v],
      c =
        r.p === 'CRITICAL'
          ? '#ef4444'
          : r.p === 'HIGH'
            ? '#f97316'
            : r.p === 'MEDIUM'
              ? '#eab308'
              : '#34d399';
    const pcr = parseInt(c.slice(1, 3), 16),
      pcg = parseInt(c.slice(3, 5), 16),
      pcb = parseInt(c.slice(5, 7), 16);
    // Pre-calc body lines
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    const bl = doc.splitTextToSize(r.b, pw - 12);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    const tl = doc.splitTextToSize(r.h, pw - 12);
    const estH = 6 + tl.length * 4 + bl.length * 3.5 + 5;
    if (y + estH > 278) {
      newPage();
    }
    const startY = y;
    // Row 1: badge + category
    doc.setFontSize(6.5);
    doc.setFont(undefined, 'bold');
    const bw = doc.getTextWidth(r.p) + 5;
    doc.setFillColor(pcr, pcg, pcb);
    doc.roundedRect(m + 6, y, bw, 4, 1, 1, 'F');
    doc.setTextColor(255);
    doc.text(r.p, m + 8.5, y + 2.8);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.setFont(undefined, 'normal');
    doc.text(QUESTIONS[i].label.toUpperCase(), m + 7 + bw + 2, y + 2.8);
    y += 6;
    // Row 2: title
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30);
    doc.text(tl, m + 6, y + 3);
    y += tl.length * 4 + 1;
    // Row 3: description
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(bl, m + 6, y + 3);
    y += bl.length * 3.5 + 3;
    // Left accent bar (drawn last so height is exact)
    doc.setFillColor(pcr, pcg, pcb);
    doc.roundedRect(m, startY, 2, y - startY, 0.5, 0.5, 'F');
    y += 3;
  });

  // CTA footer
  if (y > 258) {
    newPage();
  }
  y += 2;
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.6);
  doc.line(m, y, 190, y);
  y += 6;
  doc.setTextColor(30);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Ready to close these gaps?', m, y);
  y += 6;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80);
  const ft = doc.splitTextToSize(
    'Our OSCP-certified team specialises in penetration testing and security assessments for banks and regulated organisations across East Africa.',
    pw,
  );
  doc.text(ft, m, y);
  y += ft.length * 4 + 5;
  doc.setTextColor(52, 211, 153);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(9);
  doc.text('info@imizicyber.com | +250 793 146 617 | imizicyber.com', m, y);
  footer();
  doc.save('imizicyber-security-report.pdf');
}

export function fallbackHTML(
  quizTotal: number,
  quizBand: ScoreBand,
  quizAnswers: number[],
  userName: string,
  userOrg: string,
): void {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const bc =
    quizBand.cls === 'band-critical'
      ? '#ef4444'
      : quizBand.cls === 'band-high'
        ? '#f97316'
        : quizBand.cls === 'band-moderate'
          ? '#eab308'
          : quizBand.cls === 'band-lowmod'
            ? '#60a5fa'
            : '#34d399';
  let h =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Security Score Report</title><style>';
  h +=
    '*{margin:0;padding:0;box-sizing:border-box}body{font-family:Helvetica,Arial,sans-serif;color:#222;max-width:700px;margin:0 auto;padding:20px 24px;font-size:13px}';
  h +=
    '.hd{background:#0b1421;padding:16px 20px;margin:-20px -24px 20px;display:flex;justify-content:space-between;align-items:center}.hd .b{color:#34d399;font-size:18px;font-weight:700}.hd .m{text-align:right;color:#8494a7;font-size:11px}';
  h +=
    '.sc{text-align:center;font-size:40px;font-weight:700;margin:24px 0 6px}hr{border:none;border-top:1px solid #ddd;margin:16px 0}h2{font-size:14px;margin:16px 0 10px}';
  h +=
    '.rc{margin-bottom:12px;padding:6px 0 6px 10px;border-left:3px solid #ddd}.badge{display:inline-block;font-size:8px;font-weight:700;color:#fff;padding:1px 5px;border-radius:2px;margin-right:4px}.rt{font-size:12px;font-weight:700}.rb{font-size:11px;color:#666;margin-top:2px}';
  h +=
    '.ft{border-top:2px solid #34d399;padding-top:12px;margin-top:24px}.ft p{font-size:11px;color:#555;margin-bottom:4px}.ft .c{color:#34d399;font-weight:700}';
  h += '</style></head><body>';
  h +=
    '<div class="hd"><div class="b">imizicyber</div><div class="m">imizicyber.com<br>' +
    date +
    '</div></div>';
  if (userName)
    h +=
      '<p style="color:#666;font-size:11px;margin-bottom:8px">Prepared for: ' +
      esc(userName) +
      (userOrg ? ' (' + esc(userOrg) + ')' : '') +
      '</p>';
  h += '<div class="sc" style="color:' + bc + '">' + quizTotal + ' / 30</div>';
  h +=
    '<p style="text-align:center;font-size:16px">' +
    quizBand.label +
    '</p><p style="text-align:center;color:#666;font-size:12px;margin-bottom:24px">' +
    quizBand.desc +
    '</p><hr><h2>Prioritised Recommendations</h2>';
  quizAnswers.forEach(function (v, i) {
    const r = QUESTIONS[i].recos[v],
      c =
        r.p === 'CRITICAL'
          ? '#ef4444'
          : r.p === 'HIGH'
            ? '#f97316'
            : r.p === 'MEDIUM'
              ? '#eab308'
              : '#34d399';
    h +=
      '<div class="rc" style="border-left-color:' +
      c +
      '"><span class="badge" style="background:' +
      c +
      '">' +
      r.p +
      '</span><span class="rt">' +
      r.h +
      '</span><div class="rb">' +
      r.b +
      '</div></div>';
  });
  h +=
    '<div class="ft"><p><strong>Need help?</strong> info@imizicyber.com | +250 793 146 617 | imizicyber.com</p></div></body></html>';
  const b = new Blob([h], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'imizicyber-security-report.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
