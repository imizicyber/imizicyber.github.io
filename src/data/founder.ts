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
      field: 'Informatics & Telecommunications',
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

  bio: 'Offensive security specialist who has broken into some of the most heavily defended financial systems in Europe, Africa, and the Middle East — then helped them rebuild stronger. OSCP and OSCP+ certified. MSc in Computer Security (Technical University of Denmark). Former red team operator at a Tier-1 Nordic bank. BlackHat Europe Arsenal presenter. Founded Imizi Cyber because East African organisations deserve the same calibre of security testing that protects European banks.',
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
    linkedIn: 'https://www.linkedin.com/in/evalyne171/',
    bio: 'The voice you hear first and the person who makes sure every engagement delivers real value. Evalyne drives business growth across East Africa — identifying organisations that need security, understanding their regulatory pressures, and matching them with the right solutions. She manages every client relationship end-to-end, from first conversation to final report delivery, ensuring nothing falls through the cracks.',
  },
];
