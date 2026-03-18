export interface CaseStudy {
  slug: string;
  title: string;
  clientType: string;
  region: string;
  engagementType: string;
  duration: string;
  findingsCount: number;
  criticalCount: number;
  summary: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'east-africa-bank-pentest',
    title: 'Penetration Test: East African Commercial Bank',
    clientType: 'Commercial Bank',
    region: 'East Africa',
    engagementType: 'Network & Web Application Penetration Test',
    duration: '3 weeks',
    findingsCount: 5,
    criticalCount: 1,
    summary:
      'External and internal penetration test of a BNR-regulated commercial bank revealed critical IDOR vulnerability exposing 45,000+ customer financial records, alongside JWT and network segmentation failures.',
  },
  {
    slug: 'mobile-money-security-assessment',
    title: 'Security Assessment: Mobile Money Platform',
    clientType: 'Mobile Network Operator (Fintech Subsidiary)',
    region: 'East Africa',
    engagementType: 'Comprehensive Security Assessment',
    duration: '4 weeks',
    findingsCount: 6,
    criticalCount: 2,
    summary:
      'Full-scope security assessment of a mobile money platform processing 2 million daily transactions uncovered USSD session fixation and hardcoded encryption keys affecting 1.2 million active users.',
  },
];
