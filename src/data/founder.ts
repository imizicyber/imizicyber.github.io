// TODO: Replace src/assets/founder.png with actual founder photograph
// TODO: Replace src/assets/evalyne.png with actual team member photograph
import founderPhoto from '../assets/founder.png';
import evalynePhoto from '../assets/evalyne.png';

export interface Certification {
  name: string;
  org: string;
  year?: number;
}

export interface Experience {
  role: string;
  org: string;
  location: string;
  description: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  country: string;
}

export interface Speaking {
  event: string;
  topic?: string;
  location: string;
  year: number;
}

export interface Founder {
  name: string;
  shortName: string;
  title: string;
  photo: ImageMetadata;
  linkedIn: string;
  certifications: Certification[];
  speaking: Speaking[];
  education: Education[];
  experience: Experience[];
  bio: string;
}

export const FOUNDER: Founder = {
  name: 'Aristofanis Chionis Koufakos',
  shortName: 'Aristofanis Chionis',
  title: 'Founder & Lead Penetration Tester',
  photo: founderPhoto,
  linkedIn: 'https://www.linkedin.com/in/aristofanischionis/',

  certifications: [
    { name: 'OSCP', org: 'Offensive Security' },
    { name: 'OSCP+', org: 'Offensive Security' },
    { name: 'PNPT', org: 'TCM Security' },
  ],

  speaking: [
    {
      event: 'BlackHat Europe Arsenal',
      location: 'London',
      year: 2023,
    },
  ],

  education: [
    {
      degree: 'MSc',
      field: 'Computer Security',
      institution: 'Technical University of Denmark',
      country: 'Denmark',
    },
    {
      degree: 'BSc',
      field: 'Informatics',
      institution: 'National and Kapodistrian University of Athens',
      country: 'Greece',
    },
  ],

  experience: [
    {
      role: 'Red Team Member & Penetration Tester',
      org: 'Tier-1 Nordic Bank',
      location: 'Denmark',
      description:
        'Internal red team operations, penetration testing, CTF development, and employee security awareness programmes.',
    },
    {
      role: 'Penetration Tester',
      org: 'Pan-African Banking Group',
      location: 'Multiple African countries',
      description:
        'Penetration testing of web applications, APIs, core banking infrastructure, physical security systems, and VoIP platform hardening reviews.',
    },
    {
      role: 'Security Tooling Engineer',
      org: 'Top-5 South African Bank',
      location: 'South Africa',
      description:
        'Built custom penetration testing suite for critical API gateway infrastructure.',
    },
    {
      role: 'Penetration Tester',
      org: 'Securities Trading Firm',
      location: 'Abu Dhabi, UAE',
      description:
        'Penetration testing of the trading platform, targeting transaction workflows and financial data handling.',
    },
    {
      role: 'Open Source Contributor',
      org: 'Google Summer of Code — Honeynet Project',
      location: 'Remote',
      description:
        'Selected contributor for Google Summer of Code 2023 and 2024 with the Honeynet Project, building open-source security tooling.',
    },
  ],

  bio: 'Software engineer turned offensive security specialist with red team and penetration testing experience at major banks across Europe, Africa, and the Middle East. OSCP and OSCP+ certified, BlackHat Europe Arsenal presenter, and founder of Imizi Cyber in Kigali, Rwanda.',
} as const;

export interface TeamMember {
  name: string;
  title: string;
  photo: ImageMetadata;
  linkedIn?: string;
  bio: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Evalyne Kembabazi',
    title: 'Marketing & Business Development Manager',
    photo: evalynePhoto,
    bio: 'Leads client acquisition, strategic partnerships, and market expansion across East Africa. With deep knowledge of the regional business landscape, Evalyne connects organisations with the cybersecurity solutions that fit their compliance requirements, risk profile, and budget. She manages client relationships from initial consultation through engagement delivery, ensuring every project meets expectations.',
  },
];
