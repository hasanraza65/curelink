/**
 * Static site builder for Cure Link.
 *
 *   node build.mjs
 *
 * Composes every page from the shared layout, data and component modules in
 * /src, then writes plain static HTML to the project root — no runtime
 * dependency, no server, deployable to any static host as-is.
 *
 * It also emits sitemap.xml, robots.txt, the web manifest and the favicon so
 * those can never fall out of sync with the page list.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/data/site.mjs';
import { products, categories } from './src/data/products.mjs';
import { privacy, terms } from './src/data/legal.mjs';

import home from './src/pages/home.mjs';
import homeBackup from './src/pages/home-backup.mjs';
import about from './src/pages/about.mjs';
import { catalogue, categoryPage } from './src/pages/catalogue.mjs';
import productPage from './src/pages/product.mjs';
import partnersPage from './src/pages/partners.mjs';
import contactPage from './src/pages/contact.mjs';
import legalPage from './src/pages/legal.mjs';
import notFound from './src/pages/notfound.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------------ helpers */

async function emit(relPath, contents) {
  const full = join(ROOT, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, contents, 'utf8');
  const kb = (Buffer.byteLength(contents, 'utf8') / 1024).toFixed(1);
  console.log(`  ${relPath.padEnd(46)} ${kb.padStart(7)} KB`);
  return relPath;
}

/* -------------------------------------------------------------- page table */

const pages = [
  { path: 'index.html', render: home, priority: '1.0', changefreq: 'monthly' },
  // Reference-only rollback copy of the homepage — not in nav, excluded from
  // the sitemap and search indexing (noindex is set inside the page itself).
  { path: 'home-backup.html', render: homeBackup, noindex: true },
  { path: 'about.html', render: about, priority: '0.8', changefreq: 'yearly' },
  { path: 'products.html', render: catalogue, priority: '0.9', changefreq: 'monthly' },
  { path: categories.dental.page, render: () => categoryPage('dental'), priority: '0.9', changefreq: 'monthly' },
  { path: categories.pharma.page, render: () => categoryPage('pharma'), priority: '0.9', changefreq: 'monthly' },
  { path: categories.consumer.page, render: () => categoryPage('consumer'), priority: '0.9', changefreq: 'monthly' },
  { path: 'global-partners.html', render: partnersPage, priority: '0.7', changefreq: 'yearly' },
  { path: 'contact.html', render: contactPage, priority: '0.8', changefreq: 'yearly' },
  { path: 'privacy-policy.html', render: () => legalPage(privacy, 'privacy-policy.html'), priority: '0.3', changefreq: 'yearly' },
  { path: 'terms-conditions.html', render: () => legalPage(terms, 'terms-conditions.html'), priority: '0.3', changefreq: 'yearly' },
  ...products.map((p) => ({
    path: `products/${p.slug}.html`,
    render: () => productPage(p),
    priority: '0.8',
    changefreq: 'monthly',
  })),
  // 404 is generated but deliberately kept out of the sitemap.
  { path: '404.html', render: notFound, noindex: true },
];

/* ---------------------------------------------------------- extra artefacts */

function sitemap(list) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = list
    .filter((p) => !p.noindex)
    .map((p) => {
      const loc = `${site.url}/${p.path}`.replace(/\/index\.html$/, '/');
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const robots = () => `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;

const manifest = () =>
  JSON.stringify(
    {
      name: site.legalName,
      short_name: site.name,
      description: site.description,
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: site.themeColor,
      icons: [
        { src: '/assets/img/site/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/assets/img/site/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    null,
    2
  ) + '\n';

/**
 * Favicon: the logo mark reduced to its essentials — the blue arc, the red dot
 * and the green of "Cure" — so it stays legible at 16px where the full
 * wordmark would not.
 */
const favicon = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#072B45"/>
  <path d="M46 15.5A22 22 0 1 0 46 48.5" fill="none" stroke="#3D9BD5" stroke-width="6.5" stroke-linecap="round"/>
  <circle cx="30" cy="32" r="7.5" fill="#E02127"/>
  <circle cx="47" cy="32" r="4.5" fill="#00A651"/>
</svg>
`;

/* -------------------------------------------------------------------- build */

console.log(`\nBuilding ${site.name} — ${pages.length} pages\n`);
console.time('build');

for (const page of pages) {
  await emit(page.path, page.render());
}

console.log('');
await emit('sitemap.xml', sitemap(pages));
await emit('robots.txt', robots());
await emit('site.webmanifest', manifest());
await emit('assets/img/site/favicon.svg', favicon());

console.log('');
console.timeEnd('build');
console.log(`\nDone — ${pages.length} pages + 4 support files.\n`);
