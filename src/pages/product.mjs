import { layout, pageHero } from '../lib/layout.mjs';
import {
  sectionHead, productCard, productGallery, enquiryModal, productBar, variantPicker,
} from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { imageSize } from '../lib/imagesize.mjs';
import { versioned } from '../lib/assetver.mjs';
import { products, categories } from '../data/products.mjs';

export default function productPage(p) {
  const cat = categories[p.category];
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);

  const body = `
${pageHero({
  title: p.name,
  lead: [p.subtitle, p.tagline].filter(Boolean).join(' — '),
  depth: 1,
  crumbs: [
    { label: 'Home', href: 'index.html' },
    { label: 'Products', href: 'products.html' },
    { label: cat.name, href: cat.page },
    { label: p.shortName },
  ],
})}

<section class="section">
  <div class="container">
    <div class="pdetail">
      <div class="pdetail__media reveal reveal--left">
        ${productGallery(p, 1)}
      </div>

      <div class="reveal reveal--right">
        <div class="pdetail__badges">
          ${p.badges.map((b, i) => `<span class="badge-pill${i === 0 ? ' badge-pill--accent' : ''}">${icon('check')}${b}</span>`).join('')}
        </div>

        <h2 style="margin-bottom:.7rem">${p.tagline}</h2>
        <p class="lead">${p.summary}</p>

        ${(p.intro || []).map((t) => `<p>${t}</p>`).join('')}

        <dl class="pdetail__meta">
          <div>
            <dt>Category</dt>
            <dd>${p.categoryLabel || cat.productLabel || cat.name}</dd>
          </div>
          <div>
            <dt>Brand</dt>
            <dd>${p.brand}</dd>
          </div>
          ${p.pack ? `<div><dt>Pack size</dt><dd>${p.pack}</dd></div>` : ''}
          ${p.composition ? `<div><dt>Composition</dt><dd>${p.composition}</dd></div>` : ''}
        </dl>

        ${
          p.indications
            ? `
        <h3 style="margin-top:1.6rem">${p.indicationsTitle || 'Indications'}</h3>
        <ul class="ticks ticks--2">
          ${p.indications.map((t) => `<li>${icon('check')}<span>${t}</span></li>`).join('')}
        </ul>`
            : ''
        }

        ${
          (p.details || []).length
            ? `
        <div class="pdetail__details">
          ${p.details
            .map(
              (d) => `
          <section class="pdetail__detail">
            <h3 class="pdetail__detail-title">${d.title}</h3>
            ${d.text ? `<p>${d.text}</p>` : ''}
            ${
              d.items
                ? `<ul class="ticks">${d.items.map((it) => `<li>${icon('check')}<span>${it}</span></li>`).join('')}</ul>`
                : ''
            }
          </section>`
            )
            .join('')}
        </div>`
            : ''
        }

        ${p.note ? `<p class="pdetail__note">${icon('award')} ${p.note}</p>` : ''}

        ${variantPicker(p)}

        <div class="pdetail__actions" data-detail-actions>
          <button class="btn btn-brand btn-lg" type="button" data-modal-open="enquiry">
            Enquire about this product${icon('arrowRight')}
          </button>
          <a class="btn btn-outline btn-lg" href="../${cat.page}">Back to ${cat.name}</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    ${
      p.model
        ? `
    <div class="featsplit">
      <div class="featsplit__body reveal reveal--left">
        <span class="eyebrow">Key features</span>
        <h2>${p.featuresTitle || 'What sets it apart'}</h2>
        <ul class="featlist">
          ${p.features
            .map(
              (f) => `
          <li>
            ${icon('check')}
            <div>
              <strong>${f.title}</strong>
              <span>${f.text}</span>
            </div>
          </li>`
            )
            .join('')}
        </ul>
      </div>
      <!-- Media second in the DOM so that when the columns stack on mobile the
           heading and features lead, and the photograph follows. -->
      <div class="featsplit__media reveal reveal--right">
        <picture>
          <source srcset="../${versioned(p.model + '.webp')}" type="image/webp">
          <img src="../${versioned(p.model + '.jpg')}" alt="${p.modelAlt}"
               width="${imageSize(p.model + '.jpg').width}" height="${imageSize(p.model + '.jpg').height}"
               loading="lazy" decoding="async">
        </picture>
      </div>
    </div>`
        : `
    ${sectionHead({ eyebrow: 'Key features', title: p.featuresTitle || 'What sets it apart', align: 'left' })}
    <ul class="featlist grid grid--2" style="list-style:none;padding:0">
      ${p.features
        .map(
          (f, i) => `
      <li class="reveal" style="--d:${(i % 2) * 70}ms">
        ${icon('check')}
        <div>
          <strong>${f.title}</strong>
          <span>${f.text}</span>
        </div>
      </li>`
        )
        .join('')}
    </ul>`
    }
  </div>
</section>

${
  related.length
    ? `
<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'More from this range',
      title: `Other ${cat.name.toLowerCase()} products`,
      align: 'left',
    })}
    <div class="grid grid--3">
      ${related.map((r, i) => productCard(r, 1, i)).join('')}
    </div>
  </div>
</section>`
    : ''
}

${enquiryModal(p, 1)}
${productBar(p, 1)}
`;

  return layout({
    title: p.name,
    description: p.metaDescription,
    canonical: `products/${p.slug}.html`,
    active: 'products.html',
    depth: 1,
    preloadImage: `${p.image}.png`,
    crumbs: [
      { label: 'Home', href: 'index.html' },
      { label: 'Products', href: 'products.html' },
      { label: cat.name, href: cat.page },
      { label: p.shortName, href: `products/${p.slug}.html` },
    ],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.name,
        image: `${site.url}/${p.image}.png`,
        description: p.summary,
        category: cat.name,
        brand: { '@type': 'Brand', name: p.brand },
        ...(p.pack ? { size: p.pack } : {}),
        manufacturer: { '@id': `${site.url}/#organization` },
      },
    ],
    body,
  });
}
