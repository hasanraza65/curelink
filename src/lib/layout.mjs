/**
 * Page shell: <head>, header, footer and the shared structural fragments every
 * page composes. Keeping this in one place is what guarantees the navigation,
 * meta tags and structured data stay identical across all generated pages.
 */

import { site, contact, social, nav, footerQuickLinks, aboutCopy } from '../data/site.mjs';
import { products } from '../data/products.mjs';
import { icon } from './icons.mjs';
import { versioned } from './assetver.mjs';

/** Prefix for relative asset/page links, based on how deep the page sits. */
export const rel = (depth) => (depth ? '../'.repeat(depth) : '');

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* -------------------------------------------------------------- structured data */

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url + '/',
    logo: `${site.url}/assets/img/site/logo.png`,
    slogan: site.tagline,
    description: site.description,
    email: contact.email,
    telephone: contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'P.O. Box #17639',
      addressLocality: contact.city,
      addressCountry: contact.countryCode,
    },
    areaServed: { '@type': 'Country', name: 'Pakistan' },
  };
}

function breadcrumbJsonLd(crumbs, depth) {
  if (!crumbs || crumbs.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href ? `${site.url}/${c.href.replace(/^\.\.\//, '')}` : undefined,
    })),
  };
}

/* ---------------------------------------------------------------------- head */

function head({ title, description, canonical, depth = 0, crumbs, jsonLd = [], preloadImage, noindex = false }) {
  const b = rel(depth);
  const fullTitle = title === site.name ? `${site.name} — ${site.tagline}` : `${title} | ${site.name}`;
  const graph = [organizationJsonLd(), breadcrumbJsonLd(crumbs, depth), ...jsonLd].filter(Boolean);
  const canonicalUrl = `${site.url}/${canonical || ''}`.replace(/\/index\.html$/, '/');

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add('js')</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonicalUrl)}">
<meta name="theme-color" content="${site.themeColor}">
<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonicalUrl)}">
<meta property="og:image" content="${site.url}/assets/img/site/logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${site.url}/assets/img/site/logo.png">

<link rel="icon" href="${b}assets/img/site/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${b}assets/img/site/logo.png">
<link rel="manifest" href="${b}site.webmanifest">

<link rel="preload" as="font" type="font/woff2" href="${b}assets/fonts/plus-jakarta-sans-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${b}assets/fonts/inter-latin.woff2" crossorigin>
${preloadImage ? `<link rel="preload" as="image" href="${b}${versioned(preloadImage)}" fetchpriority="high">` : ''}
<link rel="stylesheet" href="${b}${versioned('assets/css/fonts.css')}">
<link rel="stylesheet" href="${b}${versioned('assets/css/style.css')}">

<script type="application/ld+json">${JSON.stringify(graph.length === 1 ? graph[0] : graph)}</script>
</head>`;
}

/* -------------------------------------------------------------------- header */

function navItem(item, active, b) {
  const isActive = active === item.href || (item.mega && active && active.startsWith('products'));
  if (!item.mega) {
    return `<li class="nav-item"><a class="nav-link${isActive ? ' active' : ''}" href="${b}${item.href}"${isActive ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
  }
  const cols = item.columns
    .map(
      (col) => `
        <div class="mega__col">
          <a class="mega__colhead" href="${b}${col.href}">
            <span>${col.title}</span>${icon('arrowRight')}
          </a>
          <p class="mega__blurb">${col.blurb}</p>
          <ul class="mega__list">
            ${col.items.map((s) => `<li><a href="${b}${s.href}">${s.label}</a></li>`).join('')}
          </ul>
        </div>`
    )
    .join('');

  return `<li class="nav-item has-mega">
    <button class="nav-link nav-link--toggle${isActive ? ' active' : ''}" type="button" aria-expanded="false" aria-controls="mega-products">
      ${item.label}${icon('chevronDown', { cls: 'icon--xs' })}
    </button>
    <div class="mega" id="mega-products" hidden>
      <div class="mega__inner">
        ${cols}
        <div class="mega__promo">
          <span class="mega__promo-eyebrow">${site.tagline}</span>
          <p class="mega__promo-text">Bulk supply for hospitals, chemists and institutional tenders.</p>
          <a class="btn btn-brand btn-sm" href="${b}contact.html">Request a quote${icon('arrowRight')}</a>
        </div>
      </div>
    </div>
  </li>`;
}

function header(active, depth) {
  const b = rel(depth);
  const mobileNav = nav
    .map((item) => {
      if (!item.mega) {
        return `<li><a class="mnav__link${active === item.href ? ' active' : ''}" href="${b}${item.href}">${item.label}</a></li>`;
      }
      return item.columns
        .map(
          (col, i) => `
        <li>
          <button class="mnav__link mnav__toggle" type="button" aria-expanded="false" aria-controls="mnav-${i}">
            ${col.title}${icon('chevronDown', { cls: 'icon--xs' })}
          </button>
          <ul class="mnav__sub" id="mnav-${i}" hidden>
            <li><a href="${b}${col.href}">All ${col.title}</a></li>
            ${col.items.map((s) => `<li><a href="${b}${s.href}">${s.label}</a></li>`).join('')}
          </ul>
        </li>`
        )
        .join('');
    })
    .join('');

  return `
<a class="skip-link" href="#main">Skip to content</a>

<div class="topbar">
  <div class="container topbar__inner">
    <p class="topbar__tag">${site.tagline}</p>
    <div class="topbar__links">
      <a href="tel:${contact.phoneHref}">${icon('phone', { cls: 'icon--xs' })}<span>${contact.phone}</span></a>
      <a href="${contact.whatsappHref}" target="_blank" rel="noopener">${icon('whatsapp', { cls: 'icon--xs' })}<span>${contact.whatsapp}</span></a>
      <a href="mailto:${contact.email}">${icon('mail', { cls: 'icon--xs' })}<span>${contact.email}</span></a>
    </div>
  </div>
</div>

<header class="site-header" id="siteHeader">
  <div class="container site-header__inner">
    <a class="brand" href="${b}index.html" aria-label="${site.name} — home">
      <img src="${b}${versioned('assets/img/site/logo.png')}" alt="${site.name}" width="180" height="105" fetchpriority="high" decoding="async">
    </a>

    <nav class="mainnav" aria-label="Primary">
      <ul class="mainnav__list">
        ${nav.map((i) => navItem(i, active, b)).join('')}
      </ul>
    </nav>

    <div class="site-header__actions">
      <a class="btn btn-brand btn-sm hide-below-lg" href="${b}contact.html">Get in touch${icon('arrowRight')}</a>
      <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<div class="mnav" id="mobileNav" hidden>
  <div class="mnav__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="mnav__head">
      <img src="${b}${versioned('assets/img/site/logo.png')}" alt="${site.name}" width="130" height="76" decoding="async">
      <button class="mnav__close" type="button" aria-label="Close menu">${icon('close')}</button>
    </div>
    <ul class="mnav__list">${mobileNav}</ul>
    <div class="mnav__foot">
      <a class="btn btn-brand w-100" href="${b}contact.html">Get in touch${icon('arrowRight')}</a>
      <a class="mnav__contact" href="tel:${contact.phoneHref}">${icon('phone')}<span>${contact.phone}</span></a>
      <a class="mnav__contact" href="${contact.whatsappHref}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${contact.whatsapp}</span></a>
      <a class="mnav__contact" href="mailto:${contact.email}">${icon('mail')}<span>${contact.email}</span></a>
    </div>
  </div>
</div>`;
}

/* -------------------------------------------------------------------- footer */

function footer(depth) {
  const b = rel(depth);
  const featured = products.slice(0, 6);
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-cta reveal">
      <div class="footer-cta__text">
        <h2 class="footer-cta__title">Need a supply partner you can rely on?</h2>
        <p>Tell us what your hospital, pharmacy or tender requires — we will come back with availability and terms.</p>
      </div>
      <a class="btn btn-brand btn-lg" href="${b}contact.html">Start a conversation${icon('arrowRight')}</a>
    </div>

    <div class="footer-grid">
      <div class="footer-col footer-col--about">
        <img class="footer-logo" src="${b}${versioned('assets/img/site/logo.png')}" alt="${site.name}" width="170" height="99" loading="lazy" decoding="async">
        <p>${aboutCopy.footerBlurb}</p>
        <ul class="social">
          ${social
            .map(
              (s) =>
                `<li><a href="${s.href}" aria-label="${s.name}"${s.href === '#' ? '' : ' target="_blank" rel="noopener"'}>${icon(s.icon)}</a></li>`
            )
            .join('')}
        </ul>
      </div>

      <div class="footer-col">
        <h3 class="footer-head">Our Products</h3>
        <ul class="footer-links">
          ${featured.map((p) => `<li><a href="${b}products/${p.slug}.html">${p.shortName}</a></li>`).join('')}
        </ul>
      </div>

      <div class="footer-col">
        <h3 class="footer-head">Quick Links</h3>
        <ul class="footer-links">
          ${footerQuickLinks.map((l) => `<li><a href="${b}${l.href}">${l.label}</a></li>`).join('')}
        </ul>
      </div>

      <div class="footer-col">
        <h3 class="footer-head">Get In Touch</h3>
        <ul class="footer-contact">
          ${contact.offices
            .map(
              (o) => `<li>${icon('pin')}<span><strong class="footer-office">${o.label}</strong>${o.lines.join(', ')}</span></li>`
            )
            .join('')}
          <li>${icon('phone')}<a href="tel:${contact.phoneHref}">${contact.phone}</a></li>
          <li>${icon('whatsapp')}<a href="${contact.whatsappHref}" target="_blank" rel="noopener">${contact.whatsapp}</a></li>
          <li>${icon('mail')}<a href="mailto:${contact.email}">${contact.email}</a></li>
          <li>${icon('mail')}<a href="mailto:${contact.emailAlt}">${contact.emailAlt}</a></li>
          <li>${icon('globe')}<a href="${contact.websiteHref}">${contact.website}</a></li>
          <li>${icon('clock')}<span>${contact.hours}</span></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; ${site.founded}–<span data-year>${site.founded}</span> ${site.legalName}. All rights reserved.</p>
      <ul class="footer-bottom__links">
        <li><a href="${b}privacy-policy.html">Privacy Policy</a></li>
        <li><a href="${b}terms-conditions.html">Terms &amp; Conditions</a></li>
      </ul>
    </div>
  </div>
</footer>

<button class="to-top" type="button" aria-label="Back to top">${icon('arrowUp')}</button>`;
}

/* ------------------------------------------------------------------ wrapper */

/** Breadcrumb strip used on every page except the homepage. */
export function pageHero({ title, lead, crumbs = [], depth = 0, variant = '' }) {
  const b = rel(depth);
  const trail = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<li aria-current="page">${c.label}</li>`
        : `<li><a href="${b}${c.href}">${c.label}</a></li>`
    )
    .join('');
  return `
<section class="pagehero${variant ? ' pagehero--' + variant : ''}">
  <div class="pagehero__bg" aria-hidden="true"></div>
  <div class="container pagehero__inner">
    <nav class="crumbs" aria-label="Breadcrumb"><ol>${trail}</ol></nav>
    <h1 class="pagehero__title">${title}</h1>
    ${lead ? `<p class="pagehero__lead">${lead}</p>` : ''}
  </div>
</section>`;
}

export function layout({
  title,
  description,
  canonical,
  active,
  depth = 0,
  crumbs,
  jsonLd,
  body,
  bodyClass = '',
  preloadImage,
  noindex,
}) {
  const b = rel(depth);
  return `${head({ title, description, canonical, depth, crumbs, jsonLd, preloadImage, noindex })}
<body class="${bodyClass}">
${header(active, depth)}
<main id="main">
${body}
</main>
${footer(depth)}
<script src="${b}${versioned('assets/js/main.js')}" defer></script>
</body>
</html>
`;
}

export { esc };
