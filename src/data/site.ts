export const SITE = {
  name: 'imizicyber',
  legalName: 'IMIZI Cyber Consulting Ltd',
  url: 'https://imizicyber.com',
  locale: 'en_RW',
  lang: 'en',
  region: 'RW',
  placename: 'Kigali',
  // OG image now imported from src/assets/og.png via Astro asset pipeline
  // See SEOHead.astro and BlogPostLayout.astro for import usage
  ogImageWidth: '1200',
  ogImageHeight: '630',
} as const;

export const CONTACT = {
  email: 'info@imizicyber.com',
  securityEmail: 'security@imizicyber.com',
  phone: '+250 793 146 617',
  whatsappUrl:
    'https://wa.me/250793146617?text=Hi%20imizicyber%2C%20I%27d%20like%20to%20discuss%20security%20services',
  address: 'Norrsken House, 1 KN 78 St, Kigali, Rwanda',
} as const;

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/imizicyber',
  github: 'https://github.com/imizicyber',
} as const;

export const ANALYTICS = {
  gaId: 'G-R7TC88KH9N',
  formspreeId: 'mjgerrlv',
  formspreeUrl: 'https://formspree.io/f/mjgerrlv',
  // Replace with your LinkedIn Insight Tag Partner ID from Campaign Manager
  // (Campaign Manager -> Account Assets -> Insight Tag -> View Tag)
  linkedInPartnerId: 'REPLACE_ME',
} as const;
