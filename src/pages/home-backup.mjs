/**
 * Homepage — pre-update reference copy.
 *
 * A frozen snapshot of the homepage's hero and trust section as they read
 * before the Coverages/Partners/Reason-to-choose-us rework: the plain DRAP /
 * cold-chain / nationwide-delivery hero bullets, and the four-marker
 * compliance grid in place of the stat band and partner logos. Everything
 * below that point (product panel, vision/mission, portfolio, contact) is
 * unchanged from the live homepage, since none of it was part of that update.
 *
 * Not linked from navigation — reachable only by direct URL, and excluded
 * from the sitemap and search indexing (see `noindex` in build.mjs) so it
 * never competes with the real homepage. Kept only as a rollback reference;
 * delete this file and its build.mjs entry once it is no longer needed.
 */
import { layout } from '../lib/layout.mjs';
import { imageSize } from '../lib/imagesize.mjs';
import { versioned } from '../lib/assetver.mjs';
import { sectionHead, productCard, contactForm, productPanel, lifestyleStrip } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import {
  site, contact, pillars, comparison, aboutCopy, contactCopy, strategy, heroSlides,
} from '../data/site.mjs';
import { products, byCategory, categories } from '../data/products.mjs';

/** The four markers this spot showed before today — not exported from
 * site.mjs since nothing live references them any more. */
const oldTrustMarkers = [
  { icon: 'shield', title: 'DRAP Compliant', text: 'Operating in line with the Drug Regulatory Authority of Pakistan.' },
  { icon: 'thermometer', title: 'Cold Chain Maintained', text: 'Temperature-sensitive medicines held within validated limits end to end.' },
  { icon: 'truck', title: 'Nationwide Reach', text: 'Hospitals, chemists and institutional tenders supplied across Pakistan.' },
  { icon: 'users', title: 'Trained Specialists', text: 'Experienced distribution staff handling every consignment.' },
];

export default function homeBackup() {
  const featured = products.filter((p) =>
    ['the-smile-strong', 'fittydent-super-denture-adhesive', 'fittydent-cleansing-tablets',
     'oraflogo-oral-solution', 'b-kalsin-tablet', 'relox-s-syrup', 'fasto-b-syrup', 'a4-size-paper'].includes(p.slug)
  );

  const body = `
<section class="hero" data-slider>
  <div class="hero__media">
    ${heroSlides
      .map(
        (s, i) => `
    <div class="hero__slide${i === 0 ? ' is-active' : ''}" data-slide="${i}"${i ? ' aria-hidden="true"' : ''}>
      <picture>
        <source media="(max-width: 720px)" srcset="${versioned(`assets/img/slider/${s.file}@sm.webp`)}" type="image/webp">
        <source media="(max-width: 720px)" srcset="${versioned(`assets/img/slider/${s.file}@sm.jpg`)}">
        <source srcset="${versioned(`assets/img/slider/${s.file}.webp`)}" type="image/webp">
        <img src="${versioned(`assets/img/slider/${s.file}.jpg`)}" alt="${s.alt}"
             width="${imageSize('assets/img/slider/' + s.file + '.jpg').width}"
             height="${imageSize('assets/img/slider/' + s.file + '.jpg').height}"
             ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
      </picture>
    </div>`
      )
      .join('')}
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>

  <div class="container hero__inner">
    <div class="hero__content">
      <h1 class="hero__brand">
        CURELINK<sup class="hero__r">&reg;</sup>
        <span class="hero__brand-2">PHARMACEUTICALS</span>
      </h1>
      <p class="hero__tagline">
        We don’t just sell products&mdash;we build relationships through outstanding service.
      </p>
      <div class="hero__actions">
        <a class="btn btn-brand btn-lg" href="products.html">Explore the catalogue${icon('arrowRight')}</a>
        <a class="btn btn-ghost-light btn-lg" href="contact.html">Talk to our team</a>
      </div>
      <ul class="hero__points">
        <li>${icon('check')}<span>DRAP compliant</span></li>
        <li>${icon('check')}<span>Cold chain maintained</span></li>
        <li>${icon('check')}<span>Nationwide delivery</span></li>
      </ul>

      <div class="hero__dots" role="tablist" aria-label="Choose a slide">
        ${heroSlides
          .map(
            (s, i) => `
        <button class="hero__dot${i === 0 ? ' is-active' : ''}" type="button" role="tab"
                data-dot="${i}" aria-selected="${i === 0}" aria-label="Slide ${i + 1} of ${heroSlides.length}">
          <span class="hero__dot-fill"></span>
        </button>`
          )
          .join('')}
      </div>
    </div>
  </div>
</section>

<section class="section section--sm" aria-labelledby="capabilities-heading">
  <div class="container">
    <h2 class="visually-hidden" id="capabilities-heading">What we guarantee</h2>
    <div class="markers reveal">
      ${oldTrustMarkers
        .map(
          (m) => `
      <div class="marker">
        <span class="marker__icon">${icon(m.icon)}</span>
        <div>
          <h3>${m.title}</h3>
          <p>${m.text}</p>
        </div>
      </div>`
        )
        .join('')}
    </div>
  </div>
</section>

<section class="section section--soft" id="about">
  <div class="container">
    <div class="split">
      <div class="reveal reveal--left">
        ${productPanel(
          [
            'fittydent-super-denture-adhesive',
            'oraflogo-gel',
            'fittydent-cleansing-tablets',
            'the-smile-strong',
          ],
          0,
          { title: `${products.length} products, three categories`, text: 'Dental, nutraceutical and consumer — one standard' },
          { compact: true }
        )}
      </div>

      <div class="reveal reveal--right">
        <span class="eyebrow">About Curelink</span>
        <h2 class="about-h">${aboutCopy.heading} &mdash; <span class="u-mark">${aboutCopy.headingTail}</span></h2>
        <p class="about-p">${aboutCopy.lead}</p>
        <p style="margin-top:1.4rem">
          <a class="link-arrow" href="about.html">More about our story${icon('arrowRight')}</a>
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'What drives us',
      title: 'Vision, mission and the road to 2030',
      lead: 'Three commitments that shape every consignment we handle and every partnership we enter.',
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

<section class="section section--soft" id="products">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Our portfolio',
      title: 'Three categories. One standard of care.',
      lead: 'From whitening systems and denture care engineered in Europe to everyday therapeutic relief and workplace supply — every line is handled to the same standard.',
    })}

    <div class="grid grid--3 mb-block-sm">
      <a class="catcard catcard--dental reveal" href="${categories.dental.page}">
        <span class="catcard__icon">${icon('tooth')}</span>
        <span class="catcard__count">${byCategory('dental').length} products</span>
        <h3>Dental Care</h3>
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
        <h3>Consumer Goods</h3>
        <p>Bulk A4 paper and conveyor inkjet coding hardware for packing lines.</p>
        <span class="link-arrow" style="color:#fff">Browse range${icon('arrowRight')}</span>
      </a>
    </div>

    <div class="grid grid--4">
      ${featured.map((p, i) => productCard(p, 0, i)).join('')}
    </div>
  </div>
</section>

<section class="section section--sm">
  <div class="container">
    ${sectionHead({
      eyebrow: 'In everyday use',
      title: 'Made for real routines',
      lead: 'Our range sits in bathrooms and on kitchen tables across Pakistan — everyday care, used the way it was designed to be.',
    })}
    ${lifestyleStrip(
      ['the-smile-strong', 'fittydent-super-denture-adhesive', 'b-kalsin-tablet', 'relox-s-syrup'],
      0
    )}
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: comparison.eyebrow,
      title: comparison.title,
    })}

    <div class="compare">
      <div class="compare__card compare__card--bad reveal reveal--left">
        <span class="compare__label">${comparison.traditional.label}</span>
        <ul class="compare__list">
          ${comparison.traditional.points.map((t) => `<li>${icon('x')}<span>${t}</span></li>`).join('')}
        </ul>
      </div>

      <div class="compare__vs reveal reveal--scale">VS</div>

      <div class="compare__card compare__card--good reveal reveal--right">
        <span class="compare__label">${comparison.fittydent.label}</span>
        <ul class="compare__list">
          ${comparison.fittydent.points.map((t) => `<li>${icon('check')}<span>${t}</span></li>`).join('')}
        </ul>
      </div>
    </div>

    <p class="compare__source reveal">${comparison.source}</p>

    <div class="reveal" style="text-align:center;margin-top:2rem">
      <a class="btn btn-deep btn-lg" href="products/fittydent-super-denture-adhesive.html">
        See the Fittydent range${icon('arrowRight')}
      </a>
    </div>
  </div>
</section>

<section class="section section--deep">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Goal &amp; strategy',
      title: 'How we get to 2030',
      lead: 'Becoming a leading provider of innovative, high-quality medical devices and pharmaceutical products in Pakistan and the wider region.',
      cls: 'sec-head--light',
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

<section class="section" id="contact">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Need some more info?',
      title: 'Let’s talk supply',
      lead: contactCopy.intro[0],
      align: 'left',
    })}
    <p class="sec-head__lead sec-head__lead--follow reveal">${contactCopy.intro[1]}</p>

    <div class="split" style="align-items:start">
      <div class="reveal reveal--left" style="display:grid;gap:1rem">
        ${contact.offices
          .map(
            (o, i) => `
        <div class="infocard">
          <span class="infocard__icon">${icon(i === 0 ? 'building' : 'pin')}</span>
          <div>
            <h3>${o.label}</h3>
            <p>${o.lines.join('<br>')}</p>
          </div>
        </div>`
          )
          .join('')}
        <div class="infocard">
          <span class="infocard__icon">${icon('phone')}</span>
          <div>
            <h3>Call or WhatsApp</h3>
            <a href="tel:${contact.phoneHref}">${contact.phone}</a>
            <a href="${contact.whatsappHref}" target="_blank" rel="noopener">${contact.whatsapp} (WhatsApp)</a>
          </div>
        </div>
        <div class="infocard">
          <span class="infocard__icon">${icon('mail')}</span>
          <div>
            <h3>Email us</h3>
            <a href="mailto:${contact.email}">${contact.email}</a>
            <a href="mailto:${contact.emailAlt}">${contact.emailAlt}</a>
            <a href="${contact.websiteHref}">${contact.website}</a>
          </div>
        </div>
        <div class="infocard">
          <span class="infocard__icon">${icon('clock')}</span>
          <div>
            <h3>Working hours</h3>
            <p>${contact.hours}</p>
          </div>
        </div>
      </div>

      <div class="formwrap reveal reveal--right">
        <h3 style="margin-bottom:.4rem">Send us a message</h3>
        <p style="margin-bottom:1.25rem;font-size:var(--fs-sm);color:var(--text-muted)">
          Fill in the form and our team will get back to you.
        </p>
        ${contactForm('home-backup')}
      </div>
    </div>
  </div>
</section>
`;

  return layout({
    title: 'Homepage (previous version — reference only)',
    description: site.description,
    canonical: 'home-backup.html',
    active: '',
    depth: 0,
    preloadImage: 'assets/img/slider/slide-1.webp',
    noindex: true,
    body,
  });
}
