/**
 * Global site configuration: identity, contact details, navigation and SEO
 * defaults. Every page is generated from this single source of truth, so the
 * header, footer and structured data can never drift between pages.
 */

export const site = {
  name: 'Curelink',
  legalName: 'Curelink Pharmaceuticals',
  tagline: 'Your link to better health',
  url: 'https://www.curelinkpharma.net',
  locale: 'en_PK',
  themeColor: '#0A5B96',
  founded: 2025,
  description:
    'Import, distribution, marketing and tender company for pharmaceuticals and medical devices across Pakistan — 25+ cities, 2,000+ dental clinics and 3,000+ pharmacies.',
};

export const contact = {
  /* Two offices. `address` stays as the single-line form used in the footer,
     schema and meta descriptions; `offices` drives the contact page. */
  address: 'P.O. Box #17639, Karachi, Pakistan',
  offices: [
    {
      label: 'Head Office',
      lines: ['P.O. Box #17639', 'Karachi, Pakistan'],
    },
    {
      label: 'Regional Office',
      lines: ['Office #BH1-313, 4th Floor', 'Broadway Heights, Bahria Orchard', 'Lahore, Pakistan'],
    },
  ],
  city: 'Karachi',
  country: 'Pakistan',
  countryCode: 'PK',
  phone: '+92-21-34018811-2',
  phoneHref: '+922134018811',
  phoneAlt: '+92-21-34018812',
  phoneAltHref: '+922134018812',
  whatsapp: '+92 317 3014999',
  // wa.me needs the number in international format with no symbols
  whatsappHref: 'https://wa.me/923173014999',
  email: 'info@curelinkpharma.net',
  emailAlt: 'curelink_org@yahoo.com',
  website: 'www.curelinkpharma.net',
  websiteHref: 'https://www.curelinkpharma.net',
  hours: 'Monday – Saturday, 9:00 AM – 6:00 PM (PKT)',
};

/* The source site links these from the footer but has no live profiles yet.
   Update the href values once the accounts are published. */
export const social = [
  { name: 'Facebook', href: '#', icon: 'facebook' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'YouTube', href: '#', icon: 'youtube' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
];

/**
 * Hero background slider.
 *
 * Every image is composed with its subject on the right and open space on the
 * left, which is what lets the copy sit over a dark scrim on the left without
 * covering anyone's face.
 */
export const heroSlides = [
  {
    file: 'slide-1',
    alt: 'A smiling older man relaxing on a bench in a sunlit garden',
  },
  {
    file: 'slide-3',
    alt: 'The Fittydent range — denture adhesive, cushions and cleansing tablets',
  },
  {
    file: 'slide-2',
    alt: 'A smiling woman resting beside a tube of Oraflogo Gel in a bright living room',
  },
];

export const nav = [
  { label: 'Home', href: 'index.html' },
  { label: 'About Us', href: 'about.html' },
  {
    label: 'Products',
    href: 'products.html',
    mega: true,
    columns: [
      {
        title: 'Dental Care',
        href: 'dental-products.html',
        blurb: 'Denture adhesives, cleansing and oral care.',
        items: [
          { label: 'Fittydent Super Denture Adhesive', href: 'products/fittydent-super-denture-adhesive.html' },
          { label: 'Fittydent Adhesive Cushions', href: 'products/fittydent-adhesive-cushions.html' },
          { label: 'Fittydent Cleansing Tablets', href: 'products/fittydent-cleansing-tablets.html' },
          { label: 'Oraflogo Gel', href: 'products/oraflogo-gel.html' },
          { label: 'Oraflogo Oral Solution', href: 'products/oraflogo-oral-solution.html' },
          { label: 'The Smile Strong', href: 'products/the-smile-strong.html' },
          { label: 'Curedent Mouthwash', href: 'products/curedent-mouthwash.html' },
          { label: 'Curedent Denture Brush', href: 'products/curedent-denture-brush.html' },
        ],
      },
      {
        title: 'Nutra-Division',
        href: 'pharma-products.html',
        blurb: 'Nutraceuticals for everyday health.',
        items: [
          { label: 'B-KALCIN Tablet', href: 'products/b-kalsin-tablet.html' },
          { label: 'Fasto-B Syrup', href: 'products/fasto-b-syrup.html' },
          { label: 'Relox-S Syrup', href: 'products/relox-s-syrup.html' },
        ],
      },
      {
        title: 'Consumer Goods',
        href: 'consumer-goods.html',
        blurb: 'Office paper, bleach card and printing hardware.',
        items: [
          { label: 'A4 Size Paper', href: 'products/a4-size-paper.html' },
          { label: 'Bleach Card', href: 'products/bleach-card.html' },
          { label: 'Inkjet Printer', href: 'products/inkjet-printer.html' },
        ],
      },
    ],
  },
  { label: 'Global Partners', href: 'global-partners.html' },
  { label: 'Contact', href: 'contact.html' },
];

export const footerQuickLinks = [
  { label: 'About Us', href: 'about.html' },
  { label: 'Global Partners', href: 'global-partners.html' },
  { label: 'Dental Products', href: 'dental-products.html' },
  { label: 'Nutra-Division', href: 'pharma-products.html' },
  { label: 'Consumer Goods', href: 'consumer-goods.html' },
  { label: 'Contact Us', href: 'contact.html' },
  { label: 'Privacy Policy', href: 'privacy-policy.html' },
  { label: 'Terms & Conditions', href: 'terms-conditions.html' },
];

/**
 * Distribution coverage. Real reach numbers replaced the previous compliance
 * claims (DRAP / cold chain) at the client's request — a buyer comparing
 * distributors cares how many clinics and stores you already reach, and every
 * competitor claims compliance anyway.
 */
export const coverage = {
  label: 'Coverages',
  items: [
    { icon: 'pin',    figure: '25+',    label: 'Cities' },
    { icon: 'tooth',  figure: '2,000+', label: 'Dental clinics' },
    { icon: 'pill',   figure: '3,000+', label: 'Pharmacy & medical stores' },
    { icon: 'box',    figure: '100+',   label: 'Wholesalers' },
  ],
  note: 'Dedicated sales & marketing staff specialised in dental products.',
};

/** The principals Curelink distributes for, shown as monograms. */
export const distributors = {
  title: 'Official Distributors & Global Partners',
  logos: [
    { file: 'fittydent',    name: 'Fittydent Int’l' },
    /* medicinalis and y-and-r: the client's supplied renders for these two
       have low text-to-background contrast when the mark is lifted onto a
       transparent background — keying them out the way the others are keyed
       leaves the text nearly invisible. Kept as full-tile crops instead, each
       image's own background intact exactly as supplied, just cropped to the
       logo and scaled to the row height. */
    { file: 'medicinalis',  name: 'Medicinalis', tile: true },
    { file: 'y-and-r',      name: 'Y & R', tile: true },
    /* This mark is white with no other colour in the source file — on the
       light strip it needs a dark backing chip to read at all, the same fix
       already used for light packaging on .ppanel__thumb. The logo's own
       pixels are untouched. */
    { file: 'unica-group',  name: 'Unica Group', chip: true },
    { file: 'arber-pharma', name: 'Arber Pharma' },
  ],
};

/**
 * Why Curelink, as a distributor rather than as a product line. Linked from
 * the hero pill of the same name, and given its own section on the homepage.
 */
export const whyUs = {
  eyebrow: 'Why work with us',
  title: 'Reason to choose us',
  items: [
    { icon: 'truck', title: 'Sales & Marketing Network across Pakistan' },
    { icon: 'award', title: 'Market Reputation' },
    { icon: 'flag',  title: '25+ Sales & Marketing Experience (Pharma & Dental)' },
  ],
};

/**
 * Vision, mission and goal. `text` is an array so a pillar can carry the short
 * statement plus the fuller paragraph behind it — mission and goal both do,
 * which is why this is not a plain string.
 */
export const pillars = {
  vision: {
    icon: 'eye',
    title: 'Our Vision',
    text: [
      'To be a trusted global partner in medical devices and pharmaceuticals — where innovation meets reliability, for healthier lives worldwide.',
    ],
  },
  mission: {
    icon: 'target',
    title: 'Our Mission',
    text: [
      'Our mission is to create sustainable value for our global partners, healthcare professionals and customers by expanding access to innovative, high-quality dental and healthcare solutions. By setting new benchmarks in marketing, distribution and customer service, we are helping shape a stronger, more connected healthcare ecosystem across Pakistan.',
      'To partner with healthcare providers in delivering reliable, easy-to-use medical devices across the Pakistan market — guided by excellence, integrity and continuous improvement, and setting new standards in safety, efficiency and patient care.',
    ],
  },
  goal: {
    icon: 'flag',
    title: 'Our Goal & Strategy',
    text: [
      'We are committed to continuously enhancing our products, services and operational capabilities to meet the evolving needs of customers across Pakistan. Reliability, accessibility and timely delivery are at the core of everything we do, ensuring that hospitals, pharmacies, dental clinics, healthcare institutions and government tenders receive dependable products and responsive support. Through consistent service excellence and a customer-centric approach, we strive to build lasting partnerships and strengthen healthcare delivery across the country.',
      'To become a leading provider of innovative, high-quality medical devices and pharmaceutical products in Pakistan and the wider region — improving patient outcomes and setting industry standards by 2030.',
    ],
  },
};

/** The 2030 strategy, restructured from a single dense paragraph. */
export const strategy = [
  {
    step: '01',
    title: 'Build a cutting-edge portfolio',
    text: 'Develop a portfolio of advanced devices and products — diagnostic tools, Rho-D immunoglobulin and dental disinfectant solutions among them.',
  },
  {
    step: '02',
    title: 'Win the core segments',
    text: 'Penetrate the key domestic segments first: hospitals and clinics throughout Pakistan.',
  },
  {
    step: '03',
    title: 'Expand across the region',
    text: 'Extend reach beyond Pakistan into the Middle East, Africa and wider Asia.',
  },
  {
    step: '04',
    title: 'Deepen the network',
    text: 'Establish a strong distribution network and strategic partnerships with healthcare providers.',
  },
  {
    step: '05',
    title: 'Hold the compliance line',
    text: 'Maintain full compliance with the Drug Regulatory Authority of Pakistan (DRAP) at every stage.',
  },
];

/** "What makes us different" — restructured as a like-for-like comparison. */
/**
 * Fittydent (non water soluble) against conventional water-soluble fixatives.
 * Taken from the Fittydent comparison table; the citation travels with it
 * because the claims are comparative and should show where they come from.
 */
export const comparison = {
  eyebrow: 'The Fittydent difference',
  title: 'Why a waterproof denture adhesive changes everything',
  traditional: {
    label: 'Conventional fixatives',
    points: [
      'Conventional denture adhesives work by thickening saliva between the denture and gum.',
      'The denture holds only by suction.',
      'Being water soluble, these fixatives dissolve and lose their effectiveness within a short period of time.',
      'Non-effective in excessive saliva.',
    ],
  },
  fittydent: {
    label: 'Fittydent fixatives',
    points: [
      'Fittydent will not wash away when denture wearers are eating or drinking.',
      'Dentures hold longer and stronger in the mouth.',
      'No denture adhesive residues will leak into the stomach.',
      'Effective for denture wearers with excessive saliva.',
    ],
  },
  source:
    'Source: Kelsey C. — JADA, Vol. 128 (Journal of the American Dental Association).',
};

/**
 * Contact copy. Shared by the Contact page and the homepage contact section so
 * the two cannot drift — the same two audiences are addressed in both places.
 */
export const contactCopy = {
  intro: [
    'We welcome global manufacturers seeking a trusted partner for exclusive marketing and distribution opportunities in Pakistan — one of the world’s largest and fastest-growing healthcare markets. Curelink Pharmaceuticals provides local expertise, market access, and a reliable distribution network to help international brands establish and grow their presence in Pakistan.',
    'For hospitals, pharmacies, healthcare institutions, dental clinics and tender teams, please contact us with your supply requirements. Our team will respond with product availability, pack sizes, commercial terms, and the support needed to meet your healthcare procurement needs.',
  ],
  /* Short signpost for the page hero — the paragraphs above carry the detail,
     and repeating them before the reader reaches the form says it twice. */
  heroLead:
    'Partnership enquiries from international manufacturers, and supply enquiries from hospitals, pharmacies, dental clinics and tender teams.',
};

export const aboutCopy = {
  heading: 'Leading the Market with Consistency Since 2010',
  headingTail: 'Your Global Sole Distribution Partner.',
  lead:
    'Curelink Pharmaceuticals exists to redefine pharmaceutical marketing and distribution across Pakistan as the trusted sole agent for leading dental and healthcare brands. We believe that exceptional dental and healthcare products deserve an equally exceptional commercialisation and distribution experience. Through strategic marketing, strong partnerships, operational excellence and an unwavering commitment to reliability, we ensure that the quality of every product is reflected in every customer interaction, every delivery and every service we provide.',
  footerBlurb:
    'CURELINK Pharmaceuticals (Pvt.) Ltd. — an import, distribution, marketing and tender company, delivering reliable, accessible and timely healthcare solutions across Pakistan, backed by strict safety standards and a trained distribution team.',
};

/**
 * About Us narrative. Kept here rather than inline in the page so the founder
 * details and partnership dates live with the rest of the company facts.
 */
export const about = {
  eyebrow: 'Who we are',
  heading: 'Delivering global healthcare excellence through trusted partnerships',
  intro:
    'Founded with a vision to bring world-class healthcare solutions to the region, Curelink Pharmaceuticals is a customer-focused pharmaceutical company dedicated to delivering innovative, high-quality products backed by exceptional service and long-term partnerships.',
  trust:
    'Since its inception, Curelink Pharmaceuticals has earned the confidence of internationally respected healthcare companies by consistently demonstrating professionalism, integrity, regulatory compliance and a strong commitment to quality. Our success is built on long-term relationships founded on trust, consistency and shared values.',

  /* The founder is presented by role rather than by name, at the client's
     request — the personal name and academic qualifications were removed. The
     experience behind the company is still the trust signal, so the record and
     the two figures stay. */
  founder: {
    name: 'Founder of Curelink Pharmaceuticals',
    role: 'Leadership',
    bio:
      'Brings over 30 years of professional experience in the pharmaceutical industry, including extensive expertise in specialised biological products and 14 years of dedicated leadership in the dental healthcare sector.',
    stats: [
      { figure: '30+', label: 'Years in pharmaceuticals' },
      { figure: '14', label: 'Years leading dental healthcare' },
    ],
  },

  strategicPartners: {
    title: 'Our global strategic partners',
    lead: 'These enduring collaborations reflect our commitment to representing globally recognised brands with the highest standards of excellence.',
    items: [
      { name: 'Fittydent International GmbH', logo: 'fittydent', country: 'Austria', since: '2013', role: 'Exclusive Distribution Partner' },
      { name: 'Medicinalis d.o.o.', logo: 'medicinalis', country: 'Slovenia', since: '2018', role: 'Exclusive Distribution Partner' },
    ],
  },

  commitment: {
    title: 'Our commitment',
    body: [
      'At Curelink Pharmaceuticals, we believe that sustainable success is built on quality, innovation and customer satisfaction. We do not simply supply products — we provide dependable healthcare solutions supported by responsive service, scientific expertise and ethical business practices.',
      'As we continue to expand our portfolio and strengthen our international partnerships, our mission remains clear: to improve lives by making trusted healthcare solutions accessible, while creating lasting value for our partners, healthcare professionals and the communities we serve.',
    ],
  },

  signOff: 'Importer, Distributor, Marketer',
  signOffName: 'CURELINK® PHARMACEUTICALS',
};

export const partners = [
  {
    name: 'Fittydent International GmbH',
    region: 'Austria',
    role: 'Denture care technology',
    text: 'Creator of the world’s only waterproof denture adhesive. The Fittydent range — super adhesive, adhesive cushions and cleansing tablets — is 100% zinc free and formulated to hold securely through eating and drinking.',
    products: ['Fittydent Super Denture Adhesive', 'Fittydent Adhesive Cushions', 'Fittydent Cleansing Tablets'],
  },
  {
    name: 'Medicinalis d.o.o.',
    region: 'Slovenia',
    role: 'Oral health formulations',
    text: 'All Medicinalis products are manufactured in Europe under GMP standards, using top-quality manufacturing equipment and strict quality controls. Oraflogo Gel is built on a selected formula of ten active natural components; the Oral Solution carries seven, with 1.2% hyaluronic acid.',
    products: ['Oraflogo Gel', 'Oraflogo Oral Solution'],
  },
  {
    name: 'Unica Group',
    region: 'Europe',
    role: 'Teeth whitening systems',
    text: 'One of the first companies to produce dental whitening systems, since 1994. With more than thirty years behind it, Unica Group has achieved a leading position in the global teeth whitening market.',
    products: ['The Smile Strong'],
  },
  {
    name: 'Curedent®',
    region: 'Curelink brand',
    role: 'Denture brush & mouthwash — 275 ml',
    text: 'Curelink’s own oral hygiene line, developed to sit alongside the denture care range — a denture cleansing brush formulated for removable dentures and braces, and a sodium fluoride mouthwash with neem for daily protection.',
    products: ['Curedent Denture Brush', 'Curedent Mouthwash'],
  },
  {
    name: 'Nutraceuticals Portfolio',
    region: 'Pakistan',
    role: 'Nutra-Division',
    text: 'Our own nutraceutical portfolio for bone health, appetite support and everyday gastric relief — distributed nationwide through the same 25+ city network as every other line we carry.',
    products: ['B-KALCIN Tablet', 'Fasto-B Syrup', 'Relox-S Syrup'],
  },
];

