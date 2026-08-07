import { layout, pageHero } from '../lib/layout.mjs';
import { imageSize } from '../lib/imagesize.mjs';
import { versioned } from '../lib/assetver.mjs';
import { sectionHead } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site, pillars, strategy, about, coverage } from '../data/site.mjs';

export default function aboutPage() {
  const f = about.founder;
  const sp = about.strategicPartners;

  const body = `
${pageHero({
  title: 'About Us',
  lead: about.heading,
  crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'About Us' }],
})}

<section class="section">
  <div class="container">
    <div class="split">
      <div class="split__media reveal reveal--left">
        <picture>
          <source srcset="${versioned('assets/img/site/about-1.webp')}" type="image/webp">
          <img src="${versioned('assets/img/site/about-1.jpg')}" alt="Curelink Pharmaceuticals — Broadway Heights, Bahria Orchard, Lahore"
               width="${imageSize('assets/img/site/about-1.jpg').width}"
               height="${imageSize('assets/img/site/about-1.jpg').height}"
               loading="lazy" decoding="async">
        </picture>
        <div class="split__badge">
          ${icon('heart')}
          <span>
            <strong>${site.tagline}</strong>
            <span>Serving Pakistan nationwide</span>
          </span>
        </div>
      </div>

      <div class="reveal reveal--right">
        <span class="eyebrow">${about.eyebrow}</span>
        <h2>Delivering global healthcare excellence through
          <span class="u-mark">trusted partnerships</span></h2>
        <p class="lead">${about.intro}</p>
        <p>${about.trust}</p>
      </div>
    </div>
  </div>
</section>

<!-- Leadership. The founder's record is one of the strongest trust signals the
     company has, so it gets its own block rather than a line inside a paragraph. -->
<section class="section section--soft">
  <div class="container">
    <div class="founder reveal">
      <div class="founder__intro">
        <span class="founder__badge">${icon('award')}</span>
        <p class="founder__role">${f.role}</p>
        <h2 class="founder__name">${f.name}</h2>
      </div>
      <div class="founder__body">
        <p>${f.bio}</p>
        <div class="founder__stats">
          ${f.stats
            .map(
              (st) => `
          <div class="founder__stat">
            <strong>${st.figure}</strong>
            <span>${st.label}</span>
          </div>`
            )
            .join('')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Exclusive rights',
      title: sp.title,
      lead: sp.lead,
      align: 'left',
    })}
    <div class="grid grid--2">
      ${sp.items
        .map(
          (p, i) => `
      <article class="spartner reveal" style="--d:${i * 90}ms">
        <span class="spartner__icon">
          <picture>
            <source srcset="${versioned(`assets/img/partners/${p.logo}.webp`)}" type="image/webp">
            <img src="${versioned(`assets/img/partners/${p.logo}.png`)}" alt="${p.name}"
                 width="${imageSize(`assets/img/partners/${p.logo}.png`).width}"
                 height="${imageSize(`assets/img/partners/${p.logo}.png`).height}"
                 loading="lazy" decoding="async">
          </picture>
        </span>
        <div class="spartner__text">
          <h3 class="spartner__name">${p.name}</h3>
          <p class="spartner__country">${icon('pin', { cls: 'icon--xs' })}${p.country}</p>
          <p class="spartner__role">${p.role}</p>
        </div>
        <span class="spartner__since">
          <span class="spartner__since-label">Partner since</span>
          <strong>${p.since}</strong>
        </span>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--soft">
  <div class="container">
    <div class="split" style="align-items:start">
      <div class="reveal reveal--left">
        <span class="eyebrow">${about.commitment.title}</span>
        <h2>More than a supplier</h2>
        ${about.commitment.body.map((t) => `<p>${t}</p>`).join('')}
      </div>
      <div class="reveal reveal--right">
        <div class="markers markers--stack">
          ${coverage.items
            .map(
              (c) => `
          <div class="marker">
            <span class="marker__icon">${icon(c.icon)}</span>
            <div>
              <h3>${c.figure} ${c.label}</h3>
            </div>
          </div>`
            )
            .join('')}
          <p class="marker__note">${coverage.note}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'What drives us',
      title: 'Vision, mission and goal',
      lead: 'Three commitments that shape how we grow and who we grow with.',
    })}
    <div class="pillars">
      ${[pillars.vision, pillars.mission, pillars.goal]
        .map(
          (p, i) => `
      <article class="pillar reveal" style="--d:${i * 90}ms">
        <div class="pillar__head">
          <span class="pillar__icon">${icon(p.icon)}</span>
          <h3 class="pillar__title">${p.title}</h3>
        </div>
        <div class="pillar__body">
          ${p.text.map((t) => `<p class="pillar__text">${t}</p>`).join('\n          ')}
        </div>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--deep">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Goal &amp; strategy',
      title: 'Our roadmap to 2030',
      lead: 'A five-part plan to become a leading provider of medical devices and pharmaceutical products in Pakistan and the wider region.',
    })}
    <div class="roadmap">
      ${strategy
        .map(
          (s, i) => `
      <article class="roadstep reveal" style="--d:${(i % 2) * 80}ms">
        <span class="roadstep__num">${s.step}</span>
        <div>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </div>
      </article>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--sm">
  <div class="container">
    <div class="signoff reveal">
      <span class="signoff__mark">${icon('sparkle')}</span>
      <p class="signoff__name">${about.signOffName}</p>
      <p class="signoff__line">${about.signOff}</p>
    </div>
  </div>
</section>
`;

  return layout({
    title: 'About Us',
    description:
      'Curelink Pharmaceuticals — global healthcare excellence through trusted partnerships. Exclusive distribution for Fittydent (Austria) and Medicinalis (Slovenia).',
    canonical: 'about.html',
    active: 'about.html',
    depth: 0,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'About Us', href: 'about.html' }],
    body,
  });
}
