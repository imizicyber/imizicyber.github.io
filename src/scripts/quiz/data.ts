export interface ScoreBand {
  min: number;
  max: number;
  cls: string;
  label: string;
  desc: string;
}

export interface Recommendation {
  pts: number;
  p: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  h: string;
  b: string;
}

export interface Question {
  label: string;
  recos: Recommendation[];
}

export const BANDS: ScoreBand[] = [
  {
    min: 0,
    max: 9,
    cls: 'band-critical',
    label: 'Critical Risk',
    desc: 'Your organisation has significant security gaps that are actively exploitable. Immediate action is required.',
  },
  {
    min: 10,
    max: 17,
    cls: 'band-high',
    label: 'High Risk',
    desc: 'Multiple important security controls are missing. You are likely vulnerable to common attacks. Prioritise remediation.',
  },
  {
    min: 18,
    max: 23,
    cls: 'band-moderate',
    label: 'Moderate Risk',
    desc: 'Some controls are in place but gaps remain. A targeted improvement plan will significantly reduce your exposure.',
  },
  {
    min: 24,
    max: 28,
    cls: 'band-lowmod',
    label: 'Low-Moderate Risk',
    desc: 'Good security foundation with room to improve. Focus on the gaps identified to reach a strong posture.',
  },
  {
    min: 29,
    max: 30,
    cls: 'band-strong',
    label: 'Strong Posture',
    desc: 'Excellent security controls. Maintain your programme and continue with regular testing to stay ahead.',
  },
];

export const QUESTIONS: Question[] = [
  {
    label: 'Penetration Testing',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Schedule a penetration test immediately',
        b: 'You have never tested your systems. Any determined attacker can find vulnerabilities that are invisible to you right now.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Move to annual penetration testing',
        b: 'Regulatory-only testing leaves you exposed for months. Annual testing is the BNR minimum.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Consider quarterly testing for high-risk systems',
        b: 'Annual testing is good. For payment systems, mobile banking, and APIs, quarterly assessments are best practice.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your current testing cadence',
        b: 'Quarterly testing is excellent. Ensure test scope covers new systems and changes promptly.',
      },
    ],
  },
  {
    label: 'Incident Response',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Create an incident response plan now',
        b: 'Without a plan, a breach will cause maximum damage. Even a basic documented plan reduces incident costs significantly.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Document your incident response procedures',
        b: 'Informal knowledge is not enough. Document roles, escalation contacts, notification requirements (BNR), and response steps.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Test your incident response plan',
        b: 'A plan that has never been tested will fail when you need it. Run a tabletop exercise this quarter.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Continue regular IR drills',
        b: 'Regular testing keeps the plan current. Update it after every actual incident.',
      },
    ],
  },
  {
    label: 'Security Awareness Training',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Implement security awareness training immediately',
        b: 'Your staff are your biggest vulnerability. Phishing is the leading attack vector.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Formalise your security awareness programme',
        b: 'Ad hoc conversations do not create lasting behaviour change. Implement structured annual training with phishing simulations.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Add phishing simulations to your training',
        b: 'Annual training without simulations loses effectiveness quickly.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your training programme',
        b: 'Regular training with simulations is excellent. Keep content updated with current threats.',
      },
    ],
  },
  {
    label: 'Access Management & MFA',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Eliminate shared passwords immediately',
        b: 'Shared credentials mean you cannot identify who did what during an incident or audit. This is a BNR violation.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Enable MFA on all critical systems',
        b: 'Password-only authentication is inadequate for banking systems. Credential theft bypasses it trivially.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Extend MFA to all remaining systems',
        b: 'Ensure MFA covers all administrative access, VPN, and developer systems.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your MFA coverage',
        b: 'Full MFA enforcement is excellent. Regularly audit accounts and review MFA methods.',
      },
    ],
  },
  {
    label: 'Third-Party Risk',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Assess your critical vendors immediately',
        b: 'A breach at a vendor is a breach at your organisation. Start with cloud providers and payment processors.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Formalise vendor security assessments',
        b: 'Implement a standard vendor questionnaire and review process as part of procurement.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Add ongoing monitoring to vendor reviews',
        b: 'One-time documentation review is not enough. Implement annual re-assessment of critical vendors.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your vendor risk programme',
        b: 'Formal assessments with monitoring is excellent. Ensure your programme covers new vendors promptly.',
      },
    ],
  },
  {
    label: 'Data Encryption',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Implement encryption on all data immediately',
        b: 'Unencrypted customer data is catastrophic if breached. This is a BNR requirement.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Add encryption at rest',
        b: 'Transit encryption only means your database and stored files are exposed to anyone with server access.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Implement data classification',
        b: 'Encryption is in place. Now classify your data so you can apply appropriate controls based on sensitivity.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your encryption controls',
        b: 'Full encryption with classification is excellent. Regularly audit key management procedures.',
      },
    ],
  },
  {
    label: 'Vulnerability Management',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Start vulnerability scanning immediately',
        b: 'You likely have unpatched critical vulnerabilities that are actively being exploited in the wild.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Move to proactive patching',
        b: 'Reactive patching means you are always behind attackers. Implement a scheduled patching cycle.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Define patch SLAs and automate where possible',
        b: 'Define formal SLAs: critical patches within 72 hours, high within 7 days, medium within 30 days.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your vulnerability management programme',
        b: 'Continuous management with SLAs is excellent. Ensure coverage includes cloud and third-party components.',
      },
    ],
  },
  {
    label: 'Web & API Security',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Deploy a WAF and conduct an application assessment',
        b: 'Your web applications and APIs are exposed with no protection. This is your highest-risk attack surface.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Deploy a Web Application Firewall',
        b: 'A basic firewall does not protect web applications. A WAF is table-stakes for any web-based banking service.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Add regular application penetration testing',
        b: 'A WAF alone misses application logic flaws and IDOR vulnerabilities. Add annual application-level testing.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your WAF and testing programme',
        b: 'WAF with regular testing is excellent. Ensure API security is specifically in scope.',
      },
    ],
  },
  {
    label: 'Security Governance',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Assign security responsibility immediately',
        b: 'Security without ownership means nothing gets done. Assign a responsible person today.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Dedicate security as a primary responsibility',
        b: 'Security as an add-on creates conflicts. Budget for dedicated security staff or managed security.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Establish board-level security reporting',
        b: 'BNR requires board-level security governance. Ensure security risks are reported to leadership.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your security governance structure',
        b: 'CISO with board reporting is excellent. Ensure governance remains effective as the organisation grows.',
      },
    ],
  },
  {
    label: 'Regulatory Compliance',
    recos: [
      {
        pts: 0,
        p: 'CRITICAL',
        h: 'Identify your compliance requirements immediately',
        b: 'Unawareness of BNR requirements is a serious regulatory risk. Engage a consultant to map requirements.',
      },
      {
        pts: 1,
        p: 'HIGH',
        h: 'Create a compliance implementation plan',
        b: 'Awareness without action creates regulatory liability. BNR inspections are increasing in frequency.',
      },
      {
        pts: 2,
        p: 'MEDIUM',
        h: 'Close your remaining compliance gaps',
        b: 'Document which controls are in place and create a roadmap to close remaining gaps.',
      },
      {
        pts: 3,
        p: 'LOW',
        h: 'Maintain your compliance programme',
        b: 'Full compliance is excellent. Ensure documentation is ready for regulatory inspection at any time.',
      },
    ],
  },
];
