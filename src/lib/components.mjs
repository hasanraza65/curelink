/**
 * Reusable content blocks shared between pages.
 */

import { icon } from './icons.mjs';
import { rel } from './layout.mjs';
import { categories, products } from '../data/products.mjs';
import { imageSize } from './imagesize.mjs';
import { versioned } from './assetver.mjs';

/** Eyebrow + title + optional lead, used above most sections. */
export function sectionHead({ eyebrow, title, lead, align = 'center', cls = '' }) {
  return `
<div class="sec-head sec-head--${align} ${cls} reveal">
  ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
  <h2 class="sec-head__title">${title}</h2>
  ${lead ? `<p class="sec-head__lead">${lead}</p>` : ''}
</div>`;
}

/**
 * Product card. `depth` controls the relative path so the same markup works
 * from the site root and from inside /products/.
 */
export function productCard(p, depth = 0, i = 0) {
  const b = rel(depth);
  const cat = categories[p.category];
  return `
<article class="pcard reveal" style="--d:${(i % 4) * 70}ms">
  <a class="pcard__link" href="${b}products/${p.slug}.html">
    <div class="pcard__media">
      <span class="pcard__cat">${cat.name}</span>
      <picture>
        <source srcset="${b}${versioned(p.image + '.webp')}" type="image/webp">
        <img src="${b}${versioned(p.image + '.png')}" alt="${p.alt}" width="600" height="600" loading="lazy" decoding="async">
      </picture>
    </div>
    <div class="pcard__body">
      <p class="pcard__brand">${p.brand}${p.pack ? ` · ${p.pack}` : ''}</p>
      <h3 class="pcard__title">${p.name}</h3>
      <p class="pcard__text">${p.tagline}</p>
      <span class="pcard__more">View details${icon('arrowRight')}</span>
    </div>
  </a>
</article>`;
}

/** Small icon + label + text card used for values and capabilities. */
export function featureCard({ icon: ic, title, text }, i = 0, tone = '') {
  return `
<div class="fcard reveal${tone ? ' fcard--' + tone : ''}" style="--d:${(i % 4) * 70}ms">
  <span class="fcard__icon">${icon(ic)}</span>
  <h3 class="fcard__title">${title}</h3>
  <p class="fcard__text">${text}</p>
</div>`;
}

/**
 * Product gallery for the detail page.
 *
 * Deliberately packshot-only. The lifestyle photograph is *not* mixed in here —
 * a person holding the box reads as a different kind of image to a clean
 * packshot, and swapping between the two in one frame made the header feel
 * inconsistent. The lifestyle shot anchors the feature section instead.
 *
 * The component still handles multiple shots, so extra packshot angles can be
 * added later via `p.extraShots` and the thumbnails appear automatically.
 */
export function productGallery(p, depth = 1) {
  const b = rel(depth);
  const shots = [
    { base: p.image, alt: p.alt, label: 'Product', ext: 'png' },
    ...(p.extraShots || []),
  ];

  const stage = shots
    .map(
      (s, i) => `
      <button class="pgal__slide${i === 0 ? ' is-active' : ''}" type="button"
              data-index="${i}" aria-label="Enlarge: ${s.alt}"${i ? ' tabindex="-1"' : ''}>
        <picture>
          <source srcset="${b}${versioned(s.base + '.webp')}" type="image/webp">
          <img src="${b}${versioned(s.base + '.' + s.ext)}" alt="${s.alt}" width="900" height="900"
               ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
        </picture>
        <span class="pgal__zoom" aria-hidden="true">${icon('plus')}</span>
      </button>`
    )
    .join('');

  const thumbs =
    shots.length > 1
      ? `
    <div class="pgal__thumbs" role="tablist" aria-label="${p.name} images">
      ${shots
        .map(
          (s, i) => `
      <button class="pgal__thumb${i === 0 ? ' is-active' : ''}" type="button" role="tab"
              data-index="${i}" aria-selected="${i === 0}" aria-label="${s.label}: ${s.alt}">
        <picture>
          <source srcset="${b}${versioned(s.base + '.webp')}" type="image/webp">
          <img src="${b}${versioned(s.base + '.' + s.ext)}" alt="" width="160" height="160" loading="lazy" decoding="async">
        </picture>
        <span>${s.label}</span>
      </button>`
        )
        .join('')}
    </div>`
      : '';

  return `
<div class="pgal" data-gallery>
  <div class="pgal__stage">${stage}</div>
  ${thumbs}
</div>`;
}

/**
 * Lifestyle strip — the in-use photography, used to give the catalogue pages a
 * human anchor rather than only floating packshots.
 */
export function lifestyleStrip(slugs, depth = 0) {
  const b = rel(depth);
  const picks = slugs.map((s) => products.find((x) => x.slug === s)).filter((x) => x && x.model);
  return `
<div class="lstrip">
  ${picks
    .map(
      (p, i) => `
  <a class="lstrip__item reveal" href="${b}products/${p.slug}.html" style="--d:${i * 80}ms">
    <picture>
      <source srcset="${b}${versioned(p.model + '.webp')}" type="image/webp">
      <img src="${b}${versioned(p.model + '.jpg')}" alt="${p.modelAlt}"
           width="${imageSize(p.model + '.jpg').width}" height="${imageSize(p.model + '.jpg').height}"
           ${p.modelFocus ? `style="object-position:${p.modelFocus}"` : ''}
           loading="lazy" decoding="async">
    </picture>
    <span class="lstrip__label">
      <strong>${p.shortName}</strong>
      <span>${p.tagline}</span>
    </span>
  </a>`
    )
    .join('')}
</div>`;
}

/**
 * Product-family panel.
 *
 * The source site supplied only one genuine photograph, so rather than pad the
 * page with unrelated stock imagery this composes a branded panel from the real
 * product shots — honest to the catalogue and stronger visually than a repeat.
 */
export function productPanel(slugs, depth = 0, caption, opts = {}) {
  const b = rel(depth);
  const picks = slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter(Boolean);

  return `
<div class="ppanel${opts.compact ? ' ppanel--compact' : ''}">
  <div class="ppanel__glow" aria-hidden="true"></div>
  <div class="ppanel__grid">
    ${picks
      .map(
        (p, i) => `
    <a class="ppanel__item" href="${b}products/${p.slug}.html" style="--d:${i * 90}ms">
      <span class="ppanel__thumb">
        <picture>
          <source srcset="${b}${versioned(p.image + '.webp')}" type="image/webp">
          <img src="${b}${versioned(p.image + '.png')}" alt="${p.alt}" width="300" height="300" loading="lazy" decoding="async">
        </picture>
      </span>
      <span class="ppanel__name">${p.shortName}</span>
    </a>`
      )
      .join('')}
  </div>
  ${
    caption
      ? `<div class="ppanel__caption">
          ${icon('box')}
          <span><strong>${caption.title}</strong><span>${caption.text}</span></span>
        </div>`
      : ''
  }
</div>`;
}

/**
 * Variant chooser (currently paper weight).
 *
 * Rendered as radio inputs styled as pills, so it works with the keyboard and
 * without JavaScript. The chosen value is copied into the enquiry dialog when
 * it opens, which is why buyers do not have to restate it in the message.
 */
export function variantPicker(p) {
  const v = p.variants;
  if (!v) return '';
  return `
<fieldset class="vpick" data-variant-source="${v.name}">
  <legend class="vpick__legend">${v.label}</legend>
  ${v.help ? `<p class="vpick__help">${v.help}</p>` : ''}
  <div class="vpick__options">
    ${v.options
      .map(
        (o, i) => `
    <label class="vpick__opt">
      <input type="radio" name="variant-${v.name}" value="${o.value}"${i === (v.defaultIndex || 0) ? ' checked' : ''}>
      <span class="vpick__pill">
        <span class="vpick__value">${o.value}</span>
        ${o.note ? `<span class="vpick__note">${o.note}</span>` : ''}
      </span>
    </label>`
      )
      .join('')}
  </div>
</fieldset>`;
}

/**
 * Per-product enquiry dialog.
 *
 * Opens in place rather than sending the visitor to the generic contact page:
 * the product they were reading about stays on screen, and the message carries
 * that product through, so nobody has to re-type which item they meant.
 */
export function enquiryModal(p, depth = 1) {
  const b = rel(depth);
  const cat = categories[p.category];
  const SUBJECT_BY_CATEGORY = {
    dental: 'Dental product supply',
    pharma: 'Nutraceutical supply',
    consumer: 'Office & consumer goods',
  };
  const defaultSubject = SUBJECT_BY_CATEGORY[p.category] || '';

  return `
<div class="modal" id="enquiry" hidden>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
    <button class="modal__close" type="button" data-modal-close aria-label="Close enquiry form">${icon('close')}</button>

    <div class="modal__head">
      <span class="modal__thumb">
        <picture>
          <source srcset="${b}${versioned(p.image + '.webp')}" type="image/webp">
          <img src="${b}${versioned(p.image + '.png')}" alt="" width="120" height="120" loading="lazy" decoding="async">
        </picture>
      </span>
      <div class="modal__headtext">
        <span class="modal__eyebrow">Product enquiry</span>
        <h2 class="modal__title" id="enquiry-title">${p.name}</h2>
        <p class="modal__meta">${p.brand}${p.pack ? ` · ${p.pack}` : ''} · ${cat.name}</p>
      </div>
    </div>

    <div class="modal__body">
      <p class="modal__intro">
        Tell us what you need and we will come back with availability, pack sizes and terms
        for <strong>${p.name}</strong>.
      </p>
      ${contactForm('enq', {
        product: p.name,
        defaultSubject,
        variant: p.variants || null,
        depth,
      })}
    </div>
  </div>
</div>`;
}

/**
 * Sticky action bar for narrow screens.
 *
 * On a phone the main enquiry button scrolls away almost immediately, so it is
 * mirrored here once the visitor has moved past it. Hidden on desktop, where
 * the button stays in view beside the product.
 */
export function productBar(p, depth = 1) {
  const b = rel(depth);
  return `
<div class="pbar" data-pbar hidden>
  <span class="pbar__thumb">
    <picture>
      <source srcset="${b}${versioned(p.image + '.webp')}" type="image/webp">
      <img src="${b}${versioned(p.image + '.png')}" alt="" width="96" height="96" loading="lazy" decoding="async">
    </picture>
  </span>
  <span class="pbar__text">
    <strong>${p.shortName}</strong>
    <span>${p.pack || p.brand}</span>
  </span>
  <button class="btn btn-brand pbar__cta" type="button" data-modal-open="enquiry">
    Enquire${icon('arrowRight')}
  </button>
</div>`;
}

/** Long-form legal / policy body rendered from a simple section array. */
export function legalBody(sections) {
  return sections
    .map(
      (s) => `
<section class="legal__section reveal">
  <h2 class="legal__h2">${s.heading}</h2>
  ${(s.paras || []).map((p) => `<p>${p}</p>`).join('')}
  ${s.list ? `<ul class="ticks">${s.list.map((li) => `<li>${icon('check')}<span>${li}</span></li>`).join('')}</ul>` : ''}
  ${(s.after || []).map((p) => `<p>${p}</p>`).join('')}
</section>`
    )
    .join('');
}

/**
 * Contact form markup, shared by the contact page, the home page section and
 * the per-product enquiry dialog.
 *
 * `opts.product` turns it into a product enquiry: a hidden field carries the
 * product name through to the message so the recipient — and the visitor —
 * can see exactly what is being asked about.
 */
export function contactForm(idPrefix = 'c', opts = {}) {
  const { product = null, defaultSubject = '', variant = null, depth = 0 } = opts;
  const sel = (v) => (v === defaultSubject ? ' selected' : '');
  const action = `${rel(depth)}mail/send.php`;
  return `
<form class="cform" id="${idPrefix}-form" action="${action}" method="post" novalidate>
  ${product ? `<input type="hidden" name="product" value="${product}">` : ''}
  <!-- Spam traps. The honeypot is hidden from people but filled in by naive
       bots; form_time lets the server reject anything submitted impossibly
       fast. Both are checked in mail/send.php. -->
  <div class="cform__trap" aria-hidden="true">
    <label for="${idPrefix}-company-website">Company website</label>
    <input type="text" id="${idPrefix}-company-website" name="company_website" tabindex="-1" autocomplete="off">
  </div>
  <input type="hidden" name="form_time" value="" data-form-time>
  <input type="hidden" name="page_url" value="" data-page-url>
  <div class="cform__row">
    <div class="field">
      <label for="${idPrefix}-name">Name / company <span aria-hidden="true">*</span></label>
      <input type="text" id="${idPrefix}-name" name="name" autocomplete="organization" required placeholder="Jane Doe or Doe Pharmacy">
      <p class="field__error" data-error>Please tell us who you are.</p>
    </div>
    <div class="field">
      <label for="${idPrefix}-email">Email address <span aria-hidden="true">*</span></label>
      <input type="email" id="${idPrefix}-email" name="email" autocomplete="email" required placeholder="you@company.com">
      <p class="field__error" data-error>Please enter a valid email address.</p>
    </div>
  </div>
  ${
    variant
      ? `<div class="field">
    <label for="${idPrefix}-variant">${variant.label}</label>
    <select id="${idPrefix}-variant" name="variant" data-variant-target="${variant.name}">
      ${variant.options
        .map((o, i) => `<option${i === (variant.defaultIndex || 0) ? ' selected' : ''}>${o.value}</option>`)
        .join('')}
    </select>
  </div>`
      : ''
  }
  <div class="cform__row">
    <div class="field">
      <label for="${idPrefix}-phone">Phone number</label>
      <input type="tel" id="${idPrefix}-phone" name="phone" autocomplete="tel" placeholder="+92 300 0000000">
      <p class="field__error" data-error>Please check this number.</p>
    </div>
    <div class="field">
      <label for="${idPrefix}-subject">I am enquiring about</label>
      <select id="${idPrefix}-subject" name="subject">
        <option value=""${sel('')}>Select an option</option>
        <option${sel('Dental product supply')}>Dental product supply</option>
        <option${sel('Nutraceutical supply')}>Nutraceutical supply</option>
        <option${sel('Office & consumer goods')}>Office &amp; consumer goods</option>
        <option${sel('Hospital or institutional tender')}>Hospital or institutional tender</option>
        <option${sel('Distribution partnership')}>Distribution partnership</option>
        <option${sel('Something else')}>Something else</option>
      </select>
    </div>
  </div>
  <div class="field">
    <label for="${idPrefix}-message">Message <span aria-hidden="true">*</span></label>
    <textarea id="${idPrefix}-message" name="message" rows="5" required placeholder="${product ? 'Quantities, pack sizes, delivery city, timelines…' : 'Quantities, delivery city, timelines — whatever helps us answer properly.'}"></textarea>
    <p class="field__error" data-error>Please add a short message.</p>
  </div>
  <div class="cform__foot">
    <button class="btn btn-brand btn-lg" type="submit">Send message${icon('arrowRight')}</button>
    <p class="cform__note">We normally reply within one working day.</p>
  </div>
  <p class="cform__status" data-status role="status" aria-live="polite"></p>
</form>`;
}
