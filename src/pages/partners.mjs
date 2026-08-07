import { layout, pageHero } from '../lib/layout.mjs';
import { sectionHead } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { partners } from '../data/site.mjs';
import { products } from '../data/products.mjs';

const slugFor = (name) => {
  const hit = products.find((p) => p.name === name || p.shortName === name);
  return hit ? `products/${hit.slug}.html` : 'products.html';
};

const iconFor = (i) => ['globe', 'flask', 'sparkle', 'tooth', 'leaf'][i % 5];

export default function partnersPage() {
  const body = `
${pageHero({
  title: 'Global Partners',
  lead: 'World-renowned brands — exclusive marketing and distribution rights in Pakistan.',
  crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Global Partners' }],
})}

<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Who we work with',
      title: 'World-renowned brands — exclusive rights in Pakistan',
      lead: 'Curelink holds exclusive marketing and distribution rights for European-manufactured dental and oral care, alongside our own Curedent and Nutra-Division lines — all under one set of storage, handling and compliance standards.',
      align: 'left',
    })}

    <div style="display:grid;gap:1.5rem">
      ${partners
        .map(
          (pt, i) => `
      <article class="partner reveal" style="--d:${(i % 2) * 80}ms">
        <div>
          <div class="partner__head">
            <span class="partner__icon">${icon(iconFor(i))}</span>
            <div style="min-width:0">
              <h2 class="partner__name">${pt.name}</h2>
              <p class="partner__role">${pt.role}</p>
            </div>
            <span class="partner__region">${icon('pin', { cls: 'icon--xs' })}${pt.region}</span>
          </div>
          <p style="margin-top:1rem">${pt.text}</p>
        </div>
        <div>
          <h3 style="font-size:var(--fs-h4);margin-bottom:.7rem">Products in this line</h3>
          <ul class="partner__tags">
            ${pt.products.map((n) => `<li><a href="${slugFor(n)}">${n}</a></li>`).join('')}
          </ul>
        </div>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Partner with us',
      title: 'Bringing a product to Pakistan?',
      lead: 'We are building a distribution network and strategic partnerships with healthcare providers — and expanding into the Middle East, Africa and wider Asia.',
    })}
    <div class="grid grid--3">
      <div class="fcard reveal">
        <span class="fcard__icon">${icon('shield')}</span>
        <h3 class="fcard__title">Regulatory groundwork</h3>
        <p class="fcard__text">We operate in compliance with the Drug Regulatory Authority of Pakistan (DRAP) at every stage of distribution.</p>
      </div>
      <!-- Cold chain was removed at the client's request. A manufacturer
           choosing a distributor wants to know the commercial function on
           offer, which is what replaced it. -->
      <div class="fcard reveal fcard--accent" style="--d:80ms">
        <span class="fcard__icon">${icon('layers')}</span>
        <h3 class="fcard__title">Import to tender, in one company</h3>
        <p class="fcard__text">Import, distribution, marketing and tender supply handled end to end, without a chain of intermediaries.</p>
      </div>
      <div class="fcard reveal" style="--d:160ms">
        <span class="fcard__icon">${icon('truck')}</span>
        <h3 class="fcard__title">Established reach</h3>
        <p class="fcard__text">25+ cities, 2,000+ dental clinics, 3,000+ pharmacy and medical stores, and 100+ wholesalers.</p>
      </div>
    </div>
    <div class="reveal" style="text-align:center;margin-top:2rem">
      <a class="btn btn-brand btn-lg" href="contact.html">Discuss a partnership${icon('arrowRight')}</a>
    </div>
  </div>
</section>
`;

  return layout({
    title: 'Global Partners',
    description:
      'The brands behind our catalogue: Fittydent denture care, Medicinalis oral gels made in Europe under GMP, and our own Curedent and pharmaceutical lines.',
    canonical: 'global-partners.html',
    active: 'global-partners.html',
    depth: 0,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Global Partners', href: 'global-partners.html' }],
    body,
  });
}
