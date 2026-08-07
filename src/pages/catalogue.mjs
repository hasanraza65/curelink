import { layout, pageHero } from '../lib/layout.mjs';
import { sectionHead, productCard, lifestyleStrip } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { products, byCategory, categories } from '../data/products.mjs';

/** Combined catalogue page listing both categories. */
export function catalogue() {
  const body = `
${pageHero({
  title: 'Our Products',
  lead: 'Whitening and denture care engineered in Europe, everyday pharmaceutical relief, and workplace supply — every line held to the same storage, handling and compliance standard.',
  crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Products' }],
})}

<section class="section">
  <div class="container">
    <h2 class="visually-hidden">Browse by category</h2>
    <div class="grid grid--3 mb-block">
      <a class="catcard catcard--dental reveal" href="${categories.dental.page}">
        <span class="catcard__icon">${icon('tooth')}</span>
        <span class="catcard__count">${byCategory('dental').length} products</span>
        <h3>${categories.dental.name}</h3>
        <p>Whitening systems, waterproof denture adhesives, cleansing tablets and oral tissue care.</p>
        <span class="link-arrow" style="color:#fff">Browse range${icon('arrowRight')}</span>
      </a>
      <a class="catcard catcard--pharma reveal" href="${categories.pharma.page}" style="--d:90ms">
        <span class="catcard__icon">${icon('pill')}</span>
        <span class="catcard__count">${byCategory('pharma').length} products</span>
        <h3>${categories.pharma.name}</h3>
        <p>Nutraceuticals for bone health, appetite support and fast relief from acidity and bloating.</p>
        <span class="link-arrow" style="color:#fff">Browse range${icon('arrowRight')}</span>
      </a>
      <a class="catcard catcard--consumer reveal" href="${categories.consumer.page}" style="--d:180ms">
        <span class="catcard__icon">${icon('box')}</span>
        <span class="catcard__count">${byCategory('consumer').length} products</span>
        <h3>${categories.consumer.name}</h3>
        <p>Bulk A4 paper and conveyor inkjet coding hardware for packing lines.</p>
        <span class="link-arrow" style="color:#fff">Browse range${icon('arrowRight')}</span>
      </a>
    </div>

    ${sectionHead({
      eyebrow: 'Full catalogue',
      title: 'Every product we carry',
      lead: 'Select any product for its full specification, indications and pack sizes.',
      align: 'left',
    })}
    <div class="grid grid--4">
      ${products.map((p, i) => productCard(p, 0, i)).join('')}
    </div>
  </div>
</section>
`;

  return layout({
    title: 'Our Products',
    description:
      'The complete Curelink catalogue — The Smile Strong whitening, Fittydent denture care, Oraflogo, Curedent, our pharmaceutical range and workplace supply.',
    canonical: 'products.html',
    active: 'products.html',
    depth: 0,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Products', href: 'products.html' }],
    body,
  });
}

/** Single-category listing (dental or pharma). */
export function categoryPage(key) {
  const cat = categories[key];
  const list = byCategory(key);
  // with three categories the cross-link points at the next one in order
  const order = ['dental', 'pharma', 'consumer'];
  const other = categories[order[(order.indexOf(key) + 1) % order.length]];
  // only products that actually have a lifestyle photograph
  const lifestyleSlugs = list.filter((p) => p.model).map((p) => p.slug).slice(0, 4);

  const body = `
${pageHero({
  title: cat.title,
  lead: cat.lead,
  crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Products', href: 'products.html' }, { label: cat.name }],
})}

<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: `${list.length} products`,
      title: `The complete ${cat.name.toLowerCase()} range`,
      lead: 'Select any product for its full specification, indications and pack sizes.',
      align: 'left',
    })}
    <div class="grid grid--3">
      ${list.map((p, i) => productCard(p, 0, i)).join('')}
    </div>
  </div>
</section>

${
  lifestyleSlugs.length
    ? `
<section class="section section--soft section--sm">
  <div class="container">
    ${sectionHead({
      eyebrow: 'In everyday use',
      title: `${cat.name} in real routines`,
      align: 'left',
    })}
    ${lifestyleStrip(lifestyleSlugs, 0)}
  </div>
</section>`
    : ''
}

<section class="section section--sm">
  <div class="container">
    <div class="crosslink reveal">
      <div>
        <h2>Looking for our ${other.name.toLowerCase()} range?</h2>
        <p>${other.lead}</p>
      </div>
      <a class="btn btn-outline btn-lg" href="${other.page}">View ${other.title}${icon('arrowRight')}</a>
    </div>
  </div>
</section>
`;

  return layout({
    title: cat.title,
    description: cat.lead,
    canonical: cat.page,
    active: cat.page,
    depth: 0,
    crumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'Products', href: 'products.html' },
      { label: cat.name, href: cat.page },
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: cat.title,
        itemListElement: list.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: `${site.url}/products/${p.slug}.html`,
        })),
      },
    ],
    body,
  });
}
