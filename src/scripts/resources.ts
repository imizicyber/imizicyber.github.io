import { jsPDF } from 'jspdf';
import { esc } from './quiz/pdf';
import { trackEvent } from '@/scripts/analytics';
import { ANALYTICS } from '@/data/site';

interface ResourceSection {
  heading: string;
  items?: string[];
  text?: string;
}

interface ResourceData {
  title: string;
  subtitle: string;
  filename: string;
  sections: ResourceSection[];
}

const RESOURCE_DATA: Record<string, ResourceData> = {
  'bnr-checklist': {
    title: 'BNR Cybersecurity Compliance Checklist',
    subtitle:
      'For banks, MFIs, insurance companies, payment service providers and mobile money operators supervised by the National Bank of Rwanda.',
    filename: 'imizicyber-bnr-compliance-checklist.pdf',
    sections: [
      {
        heading: '1. Governance & Policy',
        items: [
          'Board-approved information security policy in place and reviewed annually',
          'Designated information security officer or equivalent role',
          'Board receives regular cybersecurity risk reports (at minimum quarterly)',
          'IT risk register maintained and reviewed',
          'Security roles and responsibilities documented for all staff',
        ],
      },
      {
        heading: '2. Risk Assessment',
        items: [
          'Annual information security risk assessment conducted',
          'Risk assessment covers all critical systems and business processes',
          'Risk treatment plan with assigned owners and timelines',
          'Risk assessment methodology documented',
        ],
      },
      {
        heading: '3. Vulnerability Assessment & Penetration Testing (VAPT)',
        items: [
          'Annual VAPT conducted by a qualified external provider',
          'VAPT covers all internet-facing systems (web apps, APIs, mobile, USSD)',
          'VAPT conducted by OSCP-certified or equivalent tester',
          'Formal written report delivered with severity ratings and remediation guidance',
          'Critical and high findings remediated and re-tested',
          'VAPT conducted after significant system changes',
        ],
      },
      {
        heading: '4. Access Management',
        items: [
          'All accounts are individual (no shared credentials)',
          'Principle of least privilege applied to all accounts',
          'Multi-factor authentication enabled for all staff on critical systems',
          'Privileged account management policy and monitoring',
          'Access review conducted at least quarterly',
          'Terminated staff accounts disabled within 24 hours',
        ],
      },
      {
        heading: '5. Incident Response',
        items: [
          'Documented incident response plan (IRP)',
          'IRP tested at least annually (tabletop exercise)',
          'Designated incident response team with clear roles',
          'BNR incident reporting procedure known and documented',
          'Incident log maintained for all security events',
          'Post-incident review process in place',
        ],
      },
      {
        heading: '6. Security Awareness Training',
        items: [
          'Security awareness training provided to all staff annually',
          'Training covers phishing, social engineering, password security, incident reporting',
          'Training completion records maintained',
          'Phishing simulation conducted at least annually',
          'Board and senior management receive security awareness briefing',
        ],
      },
      {
        heading: '7. Data Protection & Encryption',
        items: [
          'Customer and sensitive data classified',
          'All data encrypted in transit (TLS 1.2 minimum)',
          'Sensitive data encrypted at rest',
          'Data retention and deletion policy',
          'Data breach notification procedure documented',
        ],
      },
      {
        heading: '8. Third-Party Risk Management',
        items: [
          'Security due diligence conducted before engaging new vendors',
          'Security clauses in all contracts with third parties accessing your systems or data',
          'Annual review of critical third-party security posture',
          'Cloud provider security assessment and data location documented',
        ],
      },
      {
        heading: '9. Vulnerability & Patch Management',
        items: [
          'Asset inventory of all hardware and software maintained',
          'Monthly vulnerability scanning of all internet-facing assets',
          'Critical patches applied within 72 hours; high within 7 days; medium within 30 days',
          'End-of-life software identified and remediation plan in place',
        ],
      },
      {
        heading: '10. Business Continuity & Disaster Recovery',
        items: [
          'Business continuity plan (BCP) documented and tested annually',
          'Data backups taken regularly and restoration tested',
          'Recovery Time Objective (RTO) and Recovery Point Objective (RPO) defined',
          'Alternative processing arrangements for critical systems documented',
        ],
      },
    ],
  },
  'pentest-buyers-guide': {
    title: "Penetration Testing Buyer's Guide for East Africa",
    subtitle:
      'Everything you need to know before commissioning a penetration test in Rwanda or East Africa.',
    filename: 'imizicyber-pentest-buyers-guide.pdf',
    sections: [
      {
        heading: 'What you are buying',
        text: 'A penetration test is a structured, authorised attack on your systems by a skilled professional. The goal is to find and prove real vulnerabilities before attackers do. The deliverable is a written report with findings, proof of exploitation, severity ratings, and remediation guidance.',
      },
      {
        heading: 'Certifications to require',
        items: [
          'OSCP (Offensive Security Certified Professional): the gold standard. Requires practical hacking under exam conditions.',
          'CEH: knowledge-based certification, less practical than OSCP. CISM, CISSP: governance certifications. Not substitutes for OSCP for hands-on testing.',
          'Ask to see the actual certificate, not just a claim on the website.',
        ],
      },
      {
        heading: 'Questions to ask every provider',
        items: [
          '"Can I see a sample report?" A real provider will have a redacted sample. Thin 5-page reports that are mostly scanner output are a red flag.',
          '"Who will actually conduct the test?" Verify the tester\'s credentials, not just the company branding.',
          '"Do you include a free re-test of critical and high findings?" This should be standard.',
          '"How do you handle testing of production systems?" Listen for safeguards: out-of-hours testing, scope limitations, rollback procedures.',
          '"Can you provide signed Rules of Engagement before testing starts?" If they don\'t know what this is, look elsewhere.',
        ],
      },
      {
        heading: 'Red flags: walk away if you see these',
        items: [
          'Promises to test everything in 1 day at a very low price',
          'Report is purely scanner output (Nessus, Qualys) with no manual testing evidence',
          'No Rules of Engagement or NDA before testing starts',
          'Tester cannot name their certification or explain their methodology',
          'Vague scope: a good pentest requires a precisely defined scope',
          'No debrief call offered after the report is delivered',
        ],
      },
      {
        heading: 'What your report should contain',
        items: [
          'Executive summary: in plain language, suitable for board presentation',
          'Scope and methodology: what was tested, how, for how long',
          'Findings: each with description, severity, proof of concept, business impact, and remediation guidance',
          'Risk heat map: visual summary of all findings',
          'Remediation roadmap: prioritised action list',
          'Tester details: name, certifications held',
        ],
      },
      {
        heading: 'Scope: what to include',
        items: [
          'All internet-facing web applications',
          'All APIs (especially mobile banking and agent APIs)',
          'Mobile banking apps (Android + iOS)',
          'USSD gateways if applicable',
          'External network perimeter (publicly reachable IPs)',
          'Social engineering (phishing simulation), consider annually',
          'Internal network, if budget allows, add at least every other year',
        ],
      },
    ],
  },
  'security-awareness-template': {
    title: 'Security Awareness Training Session Template',
    subtitle:
      'Estimated duration: 2 hours. Suitable for all staff levels. Adapt as needed for your organisation.',
    filename: 'imizicyber-security-awareness-template.pdf',
    sections: [
      {
        heading: 'Session structure',
        items: [
          '0:00-0:15 Introduction: why security matters, recent incidents in East Africa',
          '0:15-0:35 Module 1: Phishing and email threats',
          '0:35-0:55 Module 2: Passwords, MFA, and account security',
          '0:55-1:10 Module 3: Social engineering and vishing (phone attacks)',
          '1:10-1:25 Module 4: Incident reporting',
          '1:25-1:45 Module 5: Mobile device and remote work security',
          '1:45-2:00 Quiz and Q&A',
        ],
      },
      {
        heading: 'Module 1: Phishing',
        items: [
          'Phishing emails often impersonate trusted sources: your IT team, BNR, RRA, MTN, or Airtel',
          'Red flags: urgency, unexpected requests, mismatched sender domains',
          'Never click links in unexpected emails. Go directly to the site by typing the address',
          'Never enter credentials on a page you reached via an email link',
          'Discussion prompt: "Has anyone received a suspicious email at work recently?"',
        ],
      },
      {
        heading: 'Module 2: Passwords & MFA',
        items: [
          'Password reuse across accounts is the single biggest account security mistake',
          'A strong password is long (14+ characters) and random. Use a password manager',
          'MFA protects your account even if your password is stolen',
          'Never share your MFA code with anyone, including people claiming to be IT support',
        ],
      },
      {
        heading: 'Module 3: Social engineering',
        items: [
          'Social engineers exploit trust, urgency, and authority',
          'A phone call claiming to be from the CEO, BNR, or IT support is not automatically legitimate',
          "Verification: hang up, find the caller's number independently, call back",
          'You are never "in trouble" for following verification procedures',
        ],
      },
      {
        heading: 'Module 4: Incident reporting',
        items: [
          'Report suspicious activity immediately. The first hour matters most',
          'Who to report to: [fill in your security contact]',
          'No blame for reporting in good faith. Early reporting is celebrated',
          'What to report: unexpected popups, suspected phishing, anything that looks wrong',
        ],
      },
      {
        heading: 'Post-session quiz (10 questions)',
        items: [
          '1. What should you check first if you receive an unexpected password reset email?',
          '2. If someone calls claiming to be from BNR and asks for credentials, what should you do?',
          '3. What is multi-factor authentication and why does it matter?',
          '4. What are three signs of a phishing email?',
          '5. If you click a suspicious link by accident, what should you do?',
          '6. What makes a password strong?',
          '7. What is a social engineering attack?',
          '8. How long can you wait before reporting a suspected security incident?',
          '9. Is it okay to use your work laptop on public WiFi without a VPN?',
          '10. If a colleague asks to borrow your access credentials, what should you do?',
        ],
      },
    ],
  },
};

function generateResourcePDF(resource: string, userName: string, userOrg: string): void {
  const data = RESOURCE_DATA[resource];
  if (!data) return;
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const doc = new jsPDF();
  let y = 20;
  const m = 20;
  const pw = 170;
  let pg = 1;

  function pgFooter(): void {
    doc.setFontSize(7);
    doc.setTextColor(180);
    doc.text('imizicyber.com', 105, 290, { align: 'center' });
    doc.text('Page ' + pg, 190, 290, { align: 'right' });
    pg++;
  }
  function newPage(): void {
    pgFooter();
    doc.addPage();
    y = 20;
  }

  // Header bar
  doc.setFillColor(11, 20, 33);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(52, 211, 153);
  doc.setFontSize(16);
  doc.setFont(undefined as unknown as string, 'bold');
  doc.text('imizicyber', m, 17);
  doc.setTextColor(132, 148, 167);
  doc.setFontSize(9);
  doc.setFont(undefined as unknown as string, 'normal');
  doc.text('imizicyber.com | ' + date, 190, 13, { align: 'right' });
  doc.setFontSize(8);
  doc.text('FREE RESOURCE', 105, 24, { align: 'center' });
  y = 36;

  if (userName) {
    doc.setTextColor(100);
    doc.setFontSize(9);
    doc.text('Prepared for: ' + userName + (userOrg ? ' (' + userOrg + ')' : ''), m, y);
    y += 7;
  }

  // Title
  doc.setTextColor(30);
  doc.setFontSize(16);
  doc.setFont(undefined as unknown as string, 'bold');
  const tl = doc.splitTextToSize(data.title, pw);
  doc.text(tl, m, y);
  y += tl.length * 7 + 3;
  doc.setTextColor(100);
  doc.setFontSize(9);
  doc.setFont(undefined as unknown as string, 'italic');
  const sl = doc.splitTextToSize(data.subtitle, pw);
  doc.text(sl, m, y);
  y += sl.length * 4 + 5;
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.6);
  doc.line(m, y, 190, y);
  y += 8;

  // Sections
  data.sections.forEach(function (sec) {
    if (y > 255) {
      newPage();
    }
    doc.setTextColor(30);
    doc.setFontSize(11);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text(sec.heading, m, y);
    y += 6;
    if (sec.text) {
      doc.setFont(undefined as unknown as string, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60);
      const lines = doc.splitTextToSize(sec.text, pw);
      lines.forEach(function (l: string) {
        if (y > 278) {
          newPage();
        }
        doc.text(l, m, y);
        y += 4;
      });
      y += 3;
    }
    if (sec.items) {
      doc.setFont(undefined as unknown as string, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60);
      sec.items.forEach(function (item) {
        const lines = doc.splitTextToSize(item, pw - 6);
        if (y + lines.length * 4 > 278) {
          newPage();
        }
        doc.setTextColor(52, 211, 153);
        doc.text('\u2022', m, y);
        doc.setTextColor(60);
        doc.text(lines, m + 5, y);
        y += lines.length * 4 + 1.5;
      });
      y += 3;
    }
  });

  // CTA footer
  if (y > 260) {
    newPage();
  }
  y += 2;
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.6);
  doc.line(m, y, 190, y);
  y += 6;
  doc.setTextColor(30);
  doc.setFontSize(11);
  doc.setFont(undefined as unknown as string, 'bold');
  doc.text('Need help implementing this?', m, y);
  y += 6;
  doc.setFont(undefined as unknown as string, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80);
  const ft = doc.splitTextToSize(
    'Our OSCP-certified team specialises in penetration testing, security assessments, and training for banks and regulated organisations across East Africa.',
    pw,
  );
  doc.text(ft, m, y);
  y += ft.length * 4 + 5;
  doc.setTextColor(52, 211, 153);
  doc.setFont(undefined as unknown as string, 'bold');
  doc.setFontSize(9);
  doc.text('info@imizicyber.com | +250 793 146 617 | imizicyber.com', m, y);
  pgFooter();
  doc.save(data.filename);
}

function resourceFallbackHTML(resource: string, userName: string, userOrg: string): void {
  const data = RESOURCE_DATA[resource];
  if (!data) return;
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  let h =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + data.title + '</title><style>';
  h +=
    '*{margin:0;padding:0;box-sizing:border-box}body{font-family:Helvetica,Arial,sans-serif;color:#222;max-width:700px;margin:0 auto;padding:20px 24px;font-size:13px}';
  h +=
    '.hd{background:#0b1421;padding:16px 20px;margin:-20px -24px 20px;display:flex;justify-content:space-between;align-items:center}.hd .b{color:#34d399;font-size:18px;font-weight:700}.hd .m{text-align:right;color:#8494a7;font-size:11px}';
  h +=
    'h1{font-size:20px;margin:16px 0 6px}h2{font-size:14px;margin:18px 0 8px}.sub{color:#666;font-size:12px;font-style:italic;margin-bottom:16px}';
  h += 'hr{border:none;border-top:2px solid #34d399;margin:12px 0}';
  h +=
    'ul{margin:0 0 10px 20px}li{font-size:12px;color:#444;margin-bottom:4px;line-height:1.5}li::marker{color:#34d399}';
  h += 'p.txt{font-size:12px;color:#444;line-height:1.5;margin-bottom:8px}';
  h +=
    '.ft{border-top:2px solid #34d399;padding-top:12px;margin-top:24px}.ft p{font-size:11px;color:#555;margin-bottom:4px}.ft .c{color:#34d399;font-weight:700}';
  h += '</style></head><body>';
  h +=
    '<div class="hd"><div class="b">imizicyber</div><div class="m">imizicyber.com<br>' +
    date +
    '</div></div>';
  if (userName)
    h +=
      '<p style="color:#666;font-size:11px;margin-bottom:6px">Prepared for: ' +
      esc(userName) +
      (userOrg ? ' (' + esc(userOrg) + ')' : '') +
      '</p>';
  h += '<h1>' + data.title + '</h1><p class="sub">' + data.subtitle + '</p><hr>';
  data.sections.forEach(function (sec) {
    h += '<h2>' + sec.heading + '</h2>';
    if (sec.text) h += '<p class="txt">' + sec.text + '</p>';
    if (sec.items) {
      h += '<ul>';
      sec.items.forEach(function (item) {
        h += '<li>' + item + '</li>';
      });
      h += '</ul>';
    }
  });
  h +=
    '<div class="ft"><p><strong>Need help?</strong> info@imizicyber.com | +250 793 146 617 | imizicyber.com</p></div></body></html>';
  const b = new Blob([h], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = data.filename.replace('.pdf', '.html');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function initResources(): void {
  // Open form toggle
  function openForm(id: string): void {
    const fw = document.getElementById('form-' + id);
    if (fw) fw.classList.toggle('open');
  }

  // Bind download buttons
  document.querySelectorAll<HTMLButtonElement>('.btn-download').forEach(function (btn) {
    const onclickAttr = btn.getAttribute('onclick');
    if (onclickAttr) {
      const match = onclickAttr.match(/openForm\('([^']+)'\)/);
      if (match) {
        const id = match[1];
        btn.removeAttribute('onclick');
        btn.addEventListener('click', function () {
          openForm(id);
        });
      }
    }
  });

  function submitResource(e: Event, id: string, resource: string): void {
    e.preventDefault();
    const btn = document.getElementById('sub-' + id) as HTMLButtonElement | null;
    const form = e.target as HTMLFormElement;
    const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]');
    const orgInput = form.querySelector<HTMLInputElement>('input[name="organisation"]');
    if (!btn || !nameInput || !orgInput) return;

    const name = nameInput.value;
    const org = orgInput.value;
    btn.disabled = true;
    btn.textContent = 'Generating PDF\u2026';

    try {
      const fd = new FormData(form);
      fetch(ANALYTICS.formspreeUrl, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' },
      })
        .then(function (r) {
          if (!r.ok)
            r.json().then(function (d: Record<string, unknown>) {
              console.warn('Formspree:', d.error || r.status);
            });
        })
        .catch(function (err: unknown) {
          console.warn('Formspree network error:', err);
        });
    } catch {
      /* noop */
    }

    const data = RESOURCE_DATA[resource];
    try {
      generateResourcePDF(resource, name, org);
      const ok = document.getElementById('ok-' + id);
      if (ok) ok.style.display = 'block';
      btn.textContent = 'Downloaded \u2713';
      trackEvent('resource_download', {
        resource_name: data?.title ?? resource,
        page: window.location.pathname,
      });
    } catch {
      resourceFallbackHTML(resource, name, org);
      const ok = document.getElementById('ok-' + id);
      if (ok) ok.style.display = 'block';
      btn.textContent = 'Downloaded \u2713';
      trackEvent('resource_download', {
        resource_name: data?.title ?? resource,
        page: window.location.pathname,
      });
    }
  }

  // Bind resource forms
  document.querySelectorAll<HTMLFormElement>('.res-form').forEach(function (form) {
    const onsubmitAttr = form.getAttribute('onsubmit');
    if (onsubmitAttr) {
      const match = onsubmitAttr.match(/submitResource\(event,'([^']+)','([^']+)'\)/);
      if (match) {
        const id = match[1];
        const resource = match[2];
        form.removeAttribute('onsubmit');
        form.addEventListener('submit', function (e: Event) {
          submitResource(e, id, resource);
        });
      }
    }
  });
}
