/**
 * Product catalogue.
 *
 * Every claim below is taken from Curelink's own published copy or read
 * directly off the product packaging. Wording has been corrected for grammar,
 * consistency and tone — no clinical claims have been added, removed or
 * strengthened.
 */

export const categories = {
  dental: {
    slug: 'dental',
    name: 'Dental Care',
    page: 'dental-products.html',
    title: 'Dental Products',
    lead: 'Professional whitening, denture care that does not give up the moment you eat or drink, and treatment for gums and oral mucosa — the full dental range.',
  },
  pharma: {
    slug: 'pharma',
    name: 'Nutra-Division',
    page: 'pharma-products.html',
    title: 'Nutra-Division',
    /* The category is presented as the Nutra-Division; the individual product
       pages label their Category row 'Nutraceuticals', which is the regulatory
       classification rather than the business unit. */
    productLabel: 'Nutraceuticals',
    lead: 'Nutraceutical support for everyday health — bone strength, appetite and healthy growth, and fast relief from acidity and bloating. Distributed nationwide.',
  },
  consumer: {
    slug: 'consumer',
    name: 'Consumer Goods',
    page: 'consumer-goods.html',
    title: 'Consumer Goods',
    lead: 'Office and production supplies on the same distribution network as our healthcare lines — bulk A4 paper, coated bleach card, and inkjet coding hardware for packing lines.',
  },
};

export const products = [
  /* ---------------------------------------------------------------- dental */
  {
    slug: 'fittydent-super-denture-adhesive',
    name: 'Fittydent Super Denture Adhesive',
    shortName: 'Fittydent Super Adhesive',
    category: 'dental',
    brand: 'Fittydent',
    pack: '40 g & 20 g',
    tagline: 'The world’s only waterproof (non-water-soluble) denture adhesive cream',
    categoryLabel: 'Denture Care',
    summary:
      'A denture adhesive engineered not to wash out. One application holds securely for the whole day — through meals, drinks and conversation.',
    metaDescription:
      'Fittydent Super Denture Adhesive (40 g & 20 g) — the world’s only waterproof, non-water-soluble denture adhesive cream. 100% zinc free, all-day hold, one application per day.',
    image: 'assets/img/products/fittydent-super-adhesive',
    alt: 'Fittydent Super waterproof denture adhesive carton and tube',
    model: 'assets/img/products/model/fittydent-super-adhesive',
    modelAlt: 'A denture wearer holding the Fittydent Super waterproof denture adhesive tube, with the carton on the table',
    badges: ['Waterproof', '100% Zinc Free', 'All-day hold'],
    features: [
      { title: 'Waterproof formula', text: 'Worldwide the only waterproof denture adhesive — it will not wash out while eating or drinking.' },
      { title: '100% zinc free', text: 'Formulated entirely without zinc.' },
      { title: 'All-day hold', text: 'A secure hold that lasts from morning through to night.' },
      { title: 'Uppers and lowers', text: 'Suitable for both upper and lower dentures.' },
      { title: 'Free of taste', text: 'No flavour interference with food or drink.' },
      { title: 'Nothing gets trapped', text: 'No food particles get trapped underneath the denture.' },
      { title: 'Very economical', text: 'Only one application per day is required.' },
    ],
  },
  {
    slug: 'fittydent-adhesive-cushions',
    name: 'Fittydent Denture Adhesive Cushions (15’s)',
    shortName: 'Fittydent Cushions',
    category: 'dental',
    categoryLabel: 'Denture Care',
    brand: 'Fittydent',
    pack: '15’s',
    tagline: 'Waterproof cushions for a secure, comfortable fit',
    summary:
      'The only waterproof denture adhesive cushions available across Pakistan — including for the flat or narrow lower jaws that conventional products struggle with.',
    metaDescription:
      'Fittydent Adhesive Cushions (15’s) — the only waterproof denture adhesive cushions available across Pakistan. 100% zinc free, for flat or narrow lower jaws.',
    image: 'assets/img/products/fittydent-cushions',
    alt: 'Fittydent Adhesive Cushions pack of 15',
    model: 'assets/img/products/model/fittydent-cushions',
    modelAlt: 'A smiling man applying a Fittydent adhesive cushion to a lower denture, with the Cushions carton and sachets on the table',
    badges: ['Waterproof', '100% Zinc Free', 'Strong bond'],
    features: [
      { title: 'Waterproof cushions', text: 'The only waterproof denture adhesive cushions available across Pakistan.' },
      { title: '100% zinc free', text: 'Formulated entirely without zinc.' },
      { title: 'Difficult jaws', text: 'Effective even for flat or narrow lower jaws.' },
      { title: 'Strong bonding effect', text: 'A firm, dependable bond between denture and gum.' },
      { title: 'Excessive saliva', text: 'Effective for patients who produce excessive saliva.' },
    ],
  },
  {
    slug: 'fittydent-cleansing-tablets',
    name: 'Fittydent Denture Cleansing Tablets',
    shortName: 'Fittydent Cleansing Tablets',
    category: 'dental',
    categoryLabel: 'Denture Care',
    brand: 'Fittydent',
    pack: '16’s & 32’s',
    tagline: 'A complete daily clean for dentures and braces',
    summary:
      'Formulated to remove the non-water-soluble residue that a waterproof adhesive leaves behind — gently, without attacking the denture itself.',
    metaDescription:
      'Fittydent Denture Cleansing Tablets (16’s & 32’s) — removes adhesive residue and prevents plaque, odour and metal corrosion. Recommended by dentists.',
    image: 'assets/img/products/fittydent-cleansing-tablets',
    alt: 'Fittydent Denture Cleansing Tablets carton',
    model: 'assets/img/products/model/fittydent-cleansing-tablets',
    modelAlt: 'A denture wearer holding a Fittydent cleansing tablet sachet beside the 32-piece carton',
    badges: ['Dentist recommended', 'Brace safe', 'Anti-corrosion'],
    features: [
      { title: 'Removes adhesive residue', text: 'Remove all non-water soluble residues of Fittydent denture adhesive and cushions from denture.' },
      { title: 'Gentle on dentures', text: 'Gentle to both full and partial dentures.' },
      { title: 'Also for braces', text: 'Suitable for cleaning dental braces.' },
      { title: 'Protects metal parts', text: 'Prevents metal components from corroding.' },
      { title: 'Plaque and odour', text: 'Prevents plaque build-up and bad odour.' },
      { title: 'Professionally recommended', text: 'Recommended by dentists, doctors and orthodontists.' },
    ],
    note: 'Fittydent Super Cleansing Tablets clean plaque — Ref: Stiftung Warentest 10/2011.',
  },
  {
    slug: 'oraflogo-gel',
    name: 'Oraflogo Gel',
    shortName: 'Oraflogo Gel',
    category: 'dental',
    brand: 'Oraflogo Gel',
    pack: '10 ml',
    tagline: 'Ten active natural components for oral tissue healing',
    summary:
      'A gel for the natural healing of gums, the mucous membrane of the mouth and herpes — fast and effective, with no side effects or contraindications.',
    metaDescription:
      'Oraflogo Gel — natural healing gel for gums, oral mucous membrane and herpes. Ten active natural components, manufactured in Europe under GMP standards.',
    image: 'assets/img/products/oraflogo-gel',
    alt: 'Oraflogo Gel oral healing gel tube and carton',
    model: 'assets/img/products/model/oraflogo-gel',
    modelAlt: 'A smiling woman resting beside a tube of Oraflogo Gel',
    badges: ['10 natural actives', 'GMP · Europe', 'No contraindications'],
    intro: [
      'Oraflogo is a gel for the natural healing of gums, the mucous membrane of the mouth and herpes. Its selected formula of ten active natural components ensures fast and effective activity, without side effects or contraindications.',
      'All Medicinalis products are manufactured in Europe under GMP standards, using top-quality manufacturing equipment and strict quality controls.',
    ],
    indicationsTitle: 'Indicated for',
    indications: [
      'Canker sores and lesions of the oral mucosa that cause pain and discomfort',
      'Inflamed or damaged gums, and gingivitis',
      'Irritated oral tissue',
      'Aphtha',
      'Surgical wounds',
      'Mouth ulcers',
      'Bleeding gums',
      'Periodontal disease',
      'Oral herpes',
      'Stomatitis following chemotherapy and radiotherapy',
    ],
    features: [
      { title: 'Natural formulation', text: 'Ten active natural components selected to work together — containing 50% more hyaluronic acid and powerful active ingredients than comparable products.' },
      { title: 'Fast acting', text: 'Rapid, effective activity on the affected tissue.' },
      { title: 'How to use', text: 'Oraflogo Gel forms hygroscopic bonds with water, so it is recommended to dry the area before applying.' },
      { title: 'Well tolerated', text: 'No known side effects or contraindications.' },
      { title: 'European manufacture', text: 'Produced in Europe under GMP standards with strict quality controls.' },
    ],
  },
  {
    slug: 'oraflogo-oral-solution',
    name: 'Oraflogo Oral Solution',
    shortName: 'Oraflogo Oral Solution',
    category: 'dental',
    brand: 'Medicinalis',
    pack: '150 ml',
    tagline: 'Highly concentrated rinse for gums and oral mucosa',
    summary:
      'An oral solution for the natural relief of gums and oral mucosa, with seven natural ingredients and 1.2% hyaluronic acid.',
    metaDescription:
      'Oraflogo Oral Solution 150 ml — highly concentrated rinse for natural relief of gums and oral mucosa. Seven natural ingredients with 1.2% hyaluronic acid.',
    image: 'assets/img/products/oraflogo-oral-solution',
    alt: 'Oraflogo Oral Solution 150 ml carton',
    model: 'assets/img/products/model/oraflogo-oral-solution',
    modelAlt: 'The Oraflogo Oral Solution carton on a marble surface beside fresh green leaves',
    badges: ['150 ml', '1.2% hyaluronic acid', '7 natural ingredients'],
    intro: [
      'Seven natural ingredients in a highly concentrated oral solution with strong effect. Thanks to that synergy, Oraflogo provides relief and protects the oral mucosa, promoting its natural healing.',
      'Where the gel treats a specific spot, the solution reaches the entire surface of the oral mucosa — including larger and hard-to-reach areas of the mouth.',
    ],
    indicationsTitle: 'Suitable for treating',
    indications: [
      'Larger problems in the mouth, particularly in patients with reduced immunity — diabetic, heart and oncology patients, patients with renal failure, and patients recovering from severe systemic diseases',
      'Patients after major dental surgery in the mouth',
      'Patients with severe cases of inflamed gums, stomatitis or dry mouth',
      'Larger and hard-to-reach areas of the mouth',
    ],
    features: [
      { title: 'Seven natural ingredients', text: 'A concentrated formulation built on seven active natural ingredients.' },
      { title: '1.2% hyaluronic acid', text: 'A high concentration of hyaluronic acid, at low, medium and high molecular weight for better absorption in the gums.' },
      { title: 'Whole-mouth coverage', text: 'Works evenly across the entire surface of the oral mucosa and reaches areas a gel cannot.' },
      { title: 'Long-lasting local effect', text: 'Reaches damaged areas and holds a long-lasting local effect.' },
      { title: 'European manufacture', text: 'Produced in Europe under GMP standards with strict quality controls.' },
    ],
    note: 'Medical device. Store at up to 25 °C.',
  },
  {
    slug: 'the-smile-strong',
    name: 'The Smile Strong',
    shortName: 'The Smile Strong',
    category: 'dental',
    brand: 'Unica Group',
    pack: 'Complete kit · 35% HP',
    composition: '35% Hydrogen Peroxide',
    tagline: 'Complete teeth bleaching system',
    summary:
      'A professional in-office whitening system. One application of around twenty minutes, no lamp, no mixing and no refrigeration.',
    metaDescription:
      'The Smile Strong Complete 35% — professional in-office teeth bleaching from Unica Group. Ready-to-use 35% hydrogen peroxide gel, results in around 20 minutes, no lamp.',
    image: 'assets/img/products/the-smile-strong',
    alt: 'The Smile Strong complete teeth bleaching system kit box, 35% HP',
    model: 'assets/img/products/model/the-smile-strong',
    modelAlt: 'A dentist applying The Smile Strong whitening gel during an in-clinic session',
    badges: ['35% HP', 'No lamp needed', 'Professional use'],
    intro: [
      'Bright teeth and a beautiful smile help to improve our interpersonal relationships and, consequently, the quality of our lives. Studies on the evolution of teeth whitening treatments show a growing need for whiter teeth through safe, conservative professional or home treatment.',
      'The Smile® whitening line is produced with hydrogen peroxide and carbamide peroxide based concentrations. Hydrogen peroxide is the active ingredient in all the whitening formulas, and whitening works by oxide reduction: splitting into very small molecules allows the whitening agent to permeate and dilute within the enamel spaces.',
    ],
    features: [
      { title: 'Ready-to-use gel', text: 'No preliminary preparation, no mixing and no syringe-to-syringe transfer — the gel is applied directly onto the teeth.' },
      { title: 'Around 20 minutes', text: 'Effective in a single dental whitening session of roughly twenty minutes. The session rarely needs to be repeated.' },
      { title: 'No refrigeration', text: 'Stored and handled at room temperature.' },
      { title: 'Vital and devitalised teeth', text: 'Effective on both vital and devitalised teeth.' },
      { title: 'Visible performance indicator', text: 'The coloured gel turns whitish after about twenty minutes of application, showing the treatment has worked.' },
      { title: 'Low sensitivity', text: 'A pre-built desensitising agent keeps dental sensitivity low.' },
      { title: 'No lamp required', text: 'Whitening activates immediately — no activation lamp is needed.' },
    ],
    indicationsTitle: 'What is in the kit',
    indications: [
      '1 syringe “The Smile Strong 35%”, 3 ml HP (REF. RR17)',
      '1 syringe “The Smile Gum Guard” (REF. SR14)',
      '5 application tips',
      '2 small brushes',
      'Instructions for use',
      'Colour guide',
    ],
    note: 'Read the instructions carefully. For professional use only.',
  },
  {
    slug: 'curedent-mouthwash',
    name: 'Curedent® Mouthwash',
    shortName: 'Curedent Mouthwash',
    category: 'dental',
    categoryLabel: 'Oral Care',
    brand: 'Curedent',
    pack: '275 ml',
    tagline: 'Sodium Fluoride with Neem · 275 ml',
    featuresTitle: 'Sodium fluoride with Neem',
    summary:
      'A sodium fluoride mouthwash with neem for daily oral protection — part of the Curedent everyday oral hygiene line.',
    metaDescription:
      'Curedent® Mouthwash 275 ml — sodium fluoride rinse with neem for daily anti-cavity and anti-plaque oral protection. Available from Curelink, Pakistan.',
    image: 'assets/img/products/curedent-mouthwash',
    alt: 'Curedent sodium fluoride mouthwash 275 ml bottle',
    model: 'assets/img/products/model/curedent-mouthwash',
    modelAlt: 'A woman holding a bottle of Curedent Mouthwash in a bathroom',
    badges: ['Sodium fluoride', 'With neem', 'Anti-cavity'],
    features: [
      { title: 'Sodium fluoride', text: 'A sodium fluoride rinse formulated for routine use.' },
      { title: 'With neem', text: 'Neem, long used in oral care across the subcontinent, is combined with the fluoride base.' },
      { title: 'Anti-cavity', text: 'Supports protection against cavities as part of daily care.' },
      { title: 'Anti-plaque', text: 'Helps limit plaque accumulation between brushing.' },
      { title: 'Daily oral hygiene', text: 'Designed for everyday oral and dental hygiene.' },
    ],
  },
  {
    slug: 'curedent-denture-brush',
    name: 'Curedent® Denture Cleansing Brush',
    shortName: 'Curedent Denture Brush',
    category: 'dental',
    categoryLabel: 'Denture Care',
    brand: 'Curedent',
    pack: 'Single brush',
    subtitle: '(Formulated for Dentures)',
    tagline: 'Curedent® Denture Cleansing Brush is formulated for removable dentures and braces — an ordinary toothbrush is not.',
    summary:
      'Dentures require daily brushing to stay fresh, clean and free from stains. Cleansers alone cannot lift every food particle or surface stain.',
    metaDescription:
      'Curedent® Denture Cleansing Brush — formulated for removable dentures and braces, with a multi-tufted head, firm nylon bristles and an easy-grip contour handle.',
    image: 'assets/img/products/curedent-denture-brush',
    alt: 'Curedent Denture Cleansing Brush in its retail pack',
    model: 'assets/img/products/model/curedent-denture-brush',
    modelAlt: 'A man brushing at the bathroom mirror as part of a daily oral hygiene routine',
    badges: ['For dentures & braces', 'Multi-tufted head', 'Easy-grip handle'],
    intro: [
      'Dentures require daily brushing to stay fresh, clean and free from stains. While denture cleansers help reduce bacteria, remove residues and control odours, they cannot eliminate every food particle or surface stain on their own. For a thorough clean of dentures and braces, dentists recommend a specially designed Curedent® Denture Cleansing Brush rather than a regular toothbrush, as part of your daily oral care routine.',
    ],
    features: [
      { title: 'Multi-tufted head for dentures', text: 'A large multi-tufted head lifts food particles and stains from broad denture surfaces.' },
      { title: 'Compact second head', text: 'A smaller, angled head penetrates and cleans the contoured surfaces a large head cannot reach.' },
      { title: 'Firm nylon bristles', text: 'Strong and resilient, holding their shape through repeated use.' },
      { title: 'Easy-grip contour handle', text: 'A contoured handle gives easy, secure control while cleaning.' },
      { title: 'Not an ordinary toothbrush', text: 'Formulated for removable dentures and braces — a regular toothbrush is not designed for them.' },
    ],
  },

  /* ---------------------------------------------------------------- pharma */
  {
    slug: 'b-kalsin-tablet',
    name: 'B-KALCIN Tablet',
    shortName: 'B-KALCIN',
    category: 'pharma',
    brand: 'B-Kalcin',
    pack: '2 × 10 tablets',
    composition: 'Calcium + Vitamin D3',
    tagline: 'Helps build strong bones and teeth',
    summary:
      'A calcium and vitamin D3 tablet for bone health. On a twice-daily regimen, pregnant women can reach the calcium intake directed by the WHO.',
    metaDescription:
      'B-KALCIN Tablet (Calcium + Vitamin D3, 2×10) — bone health support for rickets, osteoporosis, vitamin D deficiency and low bone mineral density. From Curelink, Pakistan.',
    image: 'assets/img/products/b-kalsin-tablet',
    alt: 'B-KALCIN Calcium and Vitamin D3 tablets carton with blister pack',
    model: 'assets/img/products/model/b-kalsin-tablet',
    modelAlt: 'A smiling woman holding the B-KALCIN carton and a blister pack of tablets at home',
    badges: ['Calcium + Vitamin D3', 'Bone health', '2 × 10 tablets'],
    intro: [
      'The recommended daily intake of calcium and vitamin D increases during pregnancy. On a twice-daily regimen, pregnant women can obtain the amount of calcium directed by the World Health Organization.',
    ],
    indicationsTitle: 'Indications',
    indications: [
      'Rickets',
      'Osteoporosis',
      'Vitamin D deficiency',
      'Post-menopausal decline in bone health',
      'Low BMD (bone mineral density)',
    ],
    features: [
      { title: 'Calcium + Vitamin D3', text: 'A combination formulated to support absorption and bone mineralisation.' },
      { title: 'Suitable in pregnancy', text: 'A twice-daily regimen meets the calcium intake directed by the WHO.' },
      { title: 'Bone and teeth', text: 'Supports the maintenance of strong bones and teeth.' },
    ],
  },
  {
    slug: 'fasto-b-syrup',
    name: 'Fasto-B Syrup',
    shortName: 'Fasto-B',
    category: 'pharma',
    brand: 'Fasto-B',
    pack: '120 ml · Mint flavour',
    composition: 'Six herbal actives, 50 mg each per 5 ml',
    tagline: 'Appetite stimulant — a perfect combination',
    featuresTitle: 'The six herbs behind it',
    summary:
      'A herbal syrup that improves appetite and promotes weight gain and healthy growth, built on six botanical actives at 50 mg each per 5 ml.',
    metaDescription:
      'Fasto-B Syrup 120 ml — herbal appetite stimulant with six botanical actives. Promotes weight gain and healthy growth, supports anaemic patients and relieves constipation.',
    image: 'assets/img/products/fasto-b-syrup',
    alt: 'Fasto-B appetite stimulant syrup 120 ml carton',
    model: 'assets/img/products/model/fasto-b-syrup',
    modelAlt: 'An older man taking a spoonful of Fasto-B Syrup at the table, with the carton and bottle beside him',
    badges: ['Appetite stimulant', 'Six herbal actives', 'Mint flavour'],
    /* Botanical names are given in the accepted spelling; the local names in
       brackets are the ones used on the pack. Property terms follow the
       client's brochure verbatim — "oxytoxic" is their wording. */
    features: [
      { title: 'Ipomoea paniculata (Kshira Vidati)', text: 'Possesses anti-inflammatory, oxytoxic, antioxidant, anticancer, anti-psychotic and antimicrobial properties. Research Journal of Recent Sciences, Vol. 6(12), 12–22, December 2017.' },
      { title: 'Boerhaavia diffusa (Punarnava)', text: 'A plant source with a good amount of potassium that can help prevent serious anaemic conditions; with moderate calcium, zinc and iron it makes a good supplement for anaemic patients. International Journal of Pharmacy & Pharmaceutical Sciences, Vol. 4, Suppl. 2, 2012.' },
      { title: 'Glycyrrhiza glabra (Mulethi)', text: 'Reduces acid reflux and indigestion.' },
      { title: 'Eclipta alba (Bhringraj)', text: 'A promising hepatoprotective and hair-growth-stimulating herb. Asian Journal of Pharmaceutical and Clinical Research, Vol. 14, Issue 7, 2021.' },
      { title: 'Emblica officinalis (Amla)', text: 'In clinical study, the proprietary amla formulation showed a significant improvement in endothelial function.' },
      { title: 'Tinospora cordifolia (Giloy Khushk)', text: 'T. cordifolia extracts are responsible for showing considerable antibacterial and anticancer activity. Research article, Department of Biochemistry, University of Allahabad, India.' },
    ],
    indicationsTitle: 'Indications',
    indications: [
      'Improves appetite',
      'Promotes weight gain and healthy growth',
      'Helps kill bacteria in the body',
      'Relieves constipation',
    ],
    details: [
      {
        title: 'Supplemental facts',
        text: 'Each 5 ml contains: Ipomoea paniculata 50 mg, Boerhaavia diffusa 50 mg, Glycyrrhiza glabra 50 mg, Eclipta alba 50 mg, Emblica officinalis 50 mg, Tinospora cordifolia 50 mg.',
      },
      {
        title: 'Dosage',
        items: [
          'Children 1–3 years: 1 teaspoon, 2–3 times daily',
          'Children 4–12 years: 2 teaspoons, 2–3 times daily',
          'Over 12 years: 3 teaspoons, 2–3 times daily',
          'Or as directed by a physician',
        ],
      },
      {
        title: 'Precautions',
        items: [
          'Shake well before use',
          'Do not refrigerate; do not store above 30°C',
          'Use as prescribed by a healthcare practitioner',
        ],
      },
    ],
  },

  {
    slug: 'relox-s-syrup',
    name: 'Relox-S Syrup',
    shortName: 'Relox-S',
    category: 'pharma',
    brand: 'Relox-S',
    pack: '120 ml suspension',
    composition: 'Four herbal actives per 5 ml',
    tagline: 'Antacid & anti-flatulent — provides quick and prolonged relief',
    featuresTitle: 'The four herbs behind it',
    summary:
      'For acidity, indigestion, heartburn and flatulence. A safe antacid with significant acid-neutralising capacity — sugar free, with an excellent taste.',
    metaDescription:
      'Relox-S Syrup 120 ml — herbal antacid and anti-flatulent suspension for acidity, indigestion, heartburn and flatulence. Safe antacid, excellent taste, sugar free.',
    image: 'assets/img/products/relox-s-syrup',
    alt: 'Relox-S antacid and anti-flatulent suspension 120 ml carton',
    model: 'assets/img/products/model/relox-s-syrup',
    modelAlt: 'A smiling older man holding the Relox-S Syrup carton and bottle at home',
    badges: ['Safe antacid', 'Sugar free', 'Excellent taste'],
    intro: [
      'Study recommends that the product has significant acid-neutralising capacity and can be used as an antacid to inhibit gastric secretion in the stomach. International Journal of Drug Delivery Technology, 2016; 6(1): 27–29.',
    ],
    features: [
      { title: 'Cinnamomum zeylanicum (Darchini)', text: 'Decreases stomach acid and cools it down.' },
      { title: 'Foeniculum vulgare (Saunf)', text: 'Helps the smooth muscle of the GI system relax, reducing bloating and stomach cramps.' },
      { title: 'Zingiber officinale (Adrak)', text: 'Relief from nausea, dry retching and vomiting.' },
      { title: 'Mentha piperita (Pudina)', text: 'It is proposed that peppermint oil relaxes gastrointestinal smooth muscle.' },
    ],
    indicationsTitle: 'Indications',
    indications: [
      'Heartburn',
      'Indigestion',
      'Loss of appetite',
      'Bloating',
      'Flatulence',
      'Nausea',
      'Dyspepsia',
      'Gastric troubles',
      'Boosts metabolism',
    ],
    details: [
      {
        title: 'Supplemental facts',
        text: 'Each 5 ml contains: Cinnamomum zeylanicum 25 mg, Zingiber officinale 20 mg, Foeniculum vulgare 25 mg, Mentha piperita 15 mg.',
      },
      {
        title: 'Dosage',
        items: [
          'Children 6–12 years: 2.5–5 ml, 3 times a day',
          'Children over 12 years and adults: 10–20 ml, 3 times a day',
          'Or as directed by a physician',
        ],
      },
      {
        title: 'Precautions',
        items: [
          'Shake well before use',
          'Keep out of reach of children',
          'Pregnant women and lactating mothers should consult their doctor or pharmacist before use',
          'Do not refrigerate; do not store above 30°C',
          'Protect from direct sunlight',
        ],
      },
    ],
  },

  /* -------------------------------------------------------- consumer goods */
  {
    slug: 'a4-size-paper',
    name: 'A4 Size Paper',
    shortName: 'A4 Paper',
    category: 'consumer',
    brand: 'Curelink',
    pack: '500 sheets per ream · 5 reams per box',
    tagline: 'Bulk A4 copier paper in multiple weights',
    summary:
      'Standard 210 × 297 mm copier paper for everyday printing, copying and record keeping — supplied by the ream, the box or the pallet.',
    metaDescription:
      'A4 size copier paper (210 × 297 mm) in 70, 75 and 80 g/m² — 500 sheets per ream, supplied by the ream, box or pallet across Pakistan.',
    image: 'assets/img/products/a4-paper',
    alt: 'CureCopy A4 premium office paper box, 70 gsm, 500 sheets, 210 by 297 mm',
    badges: ['500 sheets', '210 × 297 mm', 'Multiple weights'],
    /* Buyers order paper by weight, so the enquiry form asks for it up front
       rather than leaving it to a free-text message. */
    variants: {
      name: 'weight',
      label: 'Paper weight',
      help: 'Heavier stock feels more substantial and shows less print-through.',
      options: [
        { value: '70 g/m²', note: 'Economical — high-volume internal printing' },
        { value: '75 g/m²', note: 'Everyday office standard' },
        { value: '80 g/m²', note: 'Premium — letterheads and documents that leave the building' },
      ],
      defaultIndex: 1,
    },
    intro: [
      'A4 is the standard document size across Pakistan, and paper is bought on weight. Lighter stock keeps high-volume internal printing economical; heavier stock feels more substantial and shows less print-through on double-sided documents.',
    ],
    features: [
      { title: 'Three weights', text: 'Available in 70, 75 and 80 g/m² so the stock can be matched to the job.' },
      { title: 'Standard ream', text: '500 sheets per ream, five reams per box.' },
      { title: 'True A4', text: '210 × 297 mm — the ISO 216 standard size for documents and records.' },
      { title: 'Multi-purpose', text: 'Suitable for inkjet, laser and photocopier use.' },
      { title: 'Bulk supply', text: 'Ordered by the ream, the box or the pallet, on the same delivery network as our healthcare lines.' },
    ],
  },
  {
    slug: 'bleach-card',
    name: 'Bleach Card (300 – 350 g/m²)',
    shortName: 'Bleach Card',
    category: 'consumer',
    categoryLabel: 'Consumer Goods',
    brand: 'Ningbo',
    pack: 'Four sheet sizes',
    tagline: 'Coated bleach board for printing, packaging and card work',
    summary:
      'Bleached coated board in four standard sheet sizes, supplied by the ream or the pallet — a bright, smooth face for printing, and the stiffness that packaging and card work need.',
    metaDescription:
      'Bleach card (Ningbo) in 30×50, 36×50 and 31×43 inch at 300 g/m² and 22×28 inch at 350 g/m² — coated board for printing, packaging and card work across Pakistan.',
    image: 'assets/img/products/bleach-card',
    /* Illustration, not a photograph — no product shot was supplied. It shows
       the sheet stack and the ordering dimensions rather than pretending to be
       a branded packshot. Swap it for a real photograph when one arrives. */
    alt: 'A stack of bleached coated board sheets with the sheet size marked',
    badges: ['300 – 350 g/m²', 'Four sheet sizes', 'Ningbo brand'],
    /* Board is ordered by sheet size, and the weight follows from it, so the
       two are shown together rather than as separate questions. */
    variants: {
      name: 'size',
      label: 'Sheet size',
      help: 'Sizes are in inches. Weight is fixed per size.',
      options: [
        { value: '30 × 50 in', note: '300 g/m²' },
        { value: '36 × 50 in', note: '300 g/m²' },
        { value: '31 × 43 in', note: '300 g/m²' },
        { value: '22 × 28 in', note: '350 g/m²' },
      ],
      defaultIndex: 0,
    },
    intro: [
      'Bleach card is a bleached, coated board used where a print job needs a bright white face and enough stiffness to hold its shape — folding cartons, printed packaging, tags, covers and card work.',
      'Supplied in four standard sheet sizes so the board can be matched to the press and the layout, which keeps trim waste down on a run.',
    ],
    features: [
      { title: 'Four sheet sizes', text: '30 × 50, 36 × 50 and 31 × 43 inches at 300 g/m², and 22 × 28 inches at 350 g/m².' },
      { title: 'Bright coated face', text: 'A smooth, bleached surface that holds ink cleanly and keeps colour true.' },
      { title: 'Holds its shape', text: 'Board weight rather than paper weight — it creases and folds without cracking.' },
      { title: 'Ningbo brand', text: 'Consistent stock from a single mill, so repeat runs match.' },
      { title: 'Bulk supply', text: 'Ordered by the ream or the pallet, on the same delivery network as our healthcare lines.' },
    ],
    note: 'Sheet sizes are quoted in inches, as they are ordered in the trade.',
  },
  {
    slug: 'inkjet-printer',
    name: 'CP-100 Inkjet Printer',
    shortName: 'Inkjet Printer',
    category: 'consumer',
    brand: 'WILLITA',
    pack: 'Model CP-100 · 10 kg',
    composition: 'Conveyor + thermal inkjet coder',
    tagline: 'Conveyor coding for dates, batches and barcodes',
    summary:
      'An automated transmission and coding machine: packs travel along the built-in conveyor while the inkjet head prints expiry dates, batch numbers and barcodes onto them.',
    metaDescription:
      'WILLITA CP-100 conveyor inkjet printer — automated transmission and coding machine for expiry dates, batch numbers and barcodes. 25 m/min, 12.7 mm or 25.4 mm print height.',
    image: 'assets/img/products/inkjet-printer',
    alt: 'WILLITA CP-100 inkjet coding machine with conveyor belt and touchscreen',
    model: 'assets/img/products/model/inkjet-printer',
    modelAlt: 'An operator coding printed date labels on the CP-100 conveyor inkjet printer',
    badges: ['25 m/min', 'Touchscreen', '100–240 V'],
    /* Buyers choose the coder by print height, so it is asked for up front. */
    variants: {
      name: 'printHeight',
      label: 'Print height',
      help: 'The height of the coded area the print head can cover in a single pass.',
      options: [
        { value: '12.7 mm', note: 'Single-line dates and batch codes' },
        { value: '25.4 mm', note: 'Taller blocks, two lines or barcodes' },
      ],
      defaultIndex: 0,
    },
    intro: [
      'Built for the end of a packing line rather than a desk. Packs are fed onto the conveyor by hand or automatically, carried past the print head, and coded as they pass — the practical way to apply manufacturing dates, expiry dates and batch numbers to cartons, pouches and labels.',
    ],
    features: [
      { title: 'Integrated conveyor', text: 'A built-in conveyor belt supporting both automatic and manual feed, running at up to 25 m/min.' },
      { title: 'Two print heights', text: 'Available with a 12.7 mm or 25.4 mm print head, depending on the size of the code you need to apply.' },
      { title: 'Touchscreen control', text: 'Codes, dates and layouts are set on the on-board touchscreen — no separate computer needed to run it.' },
      { title: 'Universal power', text: 'Runs on 100–240 V, and ships with a choice of AU, EU, UK or US plug.' },
      { title: 'USB interface', text: 'A USB connection for straightforward data transfer from a computer, with no network configuration.' },
      { title: 'Portable', text: 'Around 10 kg, boxed at 66 × 40 × 20 cm — light enough to move between lines or benches.' },
    ],
    indicationsTitle: 'Typical uses',
    indications: [
      'Manufacturing and expiry dates on cartons and pouches',
      'Batch and lot numbers for traceability',
      'Barcodes and serial codes',
      'Date coding on labels before they are applied',
    ],
    /* Specifications are taken from the manufacturer's own listing. The listing
       also claims a "maximum paper size of A0", which is auto-generated filler
       inconsistent with a conveyor coder, so it is deliberately not repeated. */
    note: 'Specifications as published by the manufacturer — confirm the exact configuration when ordering.',
  },
];

export const byCategory = (cat) => products.filter((p) => p.category === cat);
export const bySlug = (slug) => products.find((p) => p.slug === slug);
