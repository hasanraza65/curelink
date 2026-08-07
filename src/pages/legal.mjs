import { layout, pageHero } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';
import { site } from '../data/site.mjs';
import { lastUpdated } from '../data/legal.mjs';

const slugify = (s) =>
  s.toLowerCase().replace(/^\d+\.\s*/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function legalPage(doc, file) {
  const body = `
${pageHero({
  title: doc.title,
  lead: doc.lead,
  crumbs: [{ label: 'Home', href: 'index.html' }, { label: doc.title }],
})}

<section class="section">
  <div class="container">
    <div class="split" style="align-items:start;grid-template-columns:1fr">
      <div class="legal">
        <div class="legal__meta reveal">
          <div><strong>Last updated</strong><br>${lastUpdated}</div>
          <div><strong>Company</strong><br>${site.name}</div>
        </div>

        <p class="lead reveal" style="margin-bottom:1.9rem">${doc.intro}</p>

        ${doc.sections
          .map(
            (s) => `
        <section class="legal__section reveal" id="${slugify(s.heading)}">
          <h2 class="legal__h2">${s.heading}</h2>
          ${(s.paras || []).map((p) => `<p>${p}</p>`).join('')}
          ${s.list ? `<ul class="ticks">${s.list.map((li) => `<li>${icon('check')}<span>${li}</span></li>`).join('')}</ul>` : ''}
          ${(s.after || []).map((p) => `<p style="margin-top:1.15rem">${p}</p>`).join('')}
        </section>`
          )
          .join('')}
      </div>
    </div>
  </div>
</section>
`;

  return layout({
    title: doc.title,
    description: doc.lead,
    canonical: file,
    active: file,
    depth: 0,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: doc.title, href: file }],
    body,
  });
}
