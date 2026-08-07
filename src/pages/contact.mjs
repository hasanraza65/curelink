import { layout, pageHero } from '../lib/layout.mjs';
import { sectionHead, contactForm } from '../lib/components.mjs';
import { icon } from '../lib/icons.mjs';
import { site, contact, contactCopy } from '../data/site.mjs';

export default function contactPage() {
  const body = `
${pageHero({
  title: 'Contact Us',
  lead: contactCopy.heroLead,
  crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Contact Us' }],
})}

<section class="section">
  <div class="container">
    <h2 class="visually-hidden">Contact details</h2>
    <div class="grid grid--2 mb-block">
      ${contact.offices
        .map(
          (o, i) => `
      <div class="infocard reveal" style="--d:${i * 70}ms">
        <span class="infocard__icon">${icon(i === 0 ? 'building' : 'pin')}</span>
        <div>
          <h3>${o.label}</h3>
          <p>${o.lines.join('<br>')}</p>
        </div>
      </div>`
        )
        .join('')}
    </div>

    <div class="grid grid--4 mb-block">
      <div class="infocard reveal">
        <span class="infocard__icon">${icon('phone')}</span>
        <div>
          <h3>Phone</h3>
          <a href="tel:${contact.phoneHref}">${contact.phone}</a>
        </div>
      </div>
      <div class="infocard infocard--wa reveal" style="--d:40ms">
        <span class="infocard__icon">${icon('whatsapp')}</span>
        <div>
          <h3>WhatsApp</h3>
          <a href="${contact.whatsappHref}" target="_blank" rel="noopener">${contact.whatsapp}</a>
        </div>
      </div>
      <div class="infocard reveal" style="--d:70ms">
        <span class="infocard__icon">${icon('mail')}</span>
        <div>
          <h3>Email &amp; web</h3>
          <a href="mailto:${contact.email}">${contact.email}</a>
          <a href="mailto:${contact.emailAlt}">${contact.emailAlt}</a>
          <a href="${contact.websiteHref}">${contact.website}</a>
        </div>
      </div>
      <div class="infocard reveal" style="--d:140ms">
        <span class="infocard__icon">${icon('clock')}</span>
        <div>
          <h3>Hours</h3>
          <p>${contact.hours}</p>
        </div>
      </div>
    </div>

    <div class="split" style="align-items:start">
      <div class="reveal reveal--left">
        <span class="eyebrow">Or fill up this form</span>
        <h2>Tell us what you need</h2>
        <p class="lead">${contactCopy.intro[0]}</p>
        ${contactCopy.intro.slice(1).map((t) => `<p>${t}</p>`).join('\n        ')}

        <h3 class="callout__head">What we can help with</h3>
        <ul class="ticks">
          <li>${icon('check')}<span>Supply for hospitals, chemists and institutional tenders</span></li>
          <li>${icon('check')}<span>Cold-chain handling for temperature-sensitive lines</span></li>
          <li>${icon('check')}<span>Distribution partnerships and new-product enquiries</span></li>
          <li>${icon('check')}<span>Nationwide delivery across Pakistan</span></li>
        </ul>

        <!-- An action, not a repeat of the reference details above: the phone
             number is in the strip at the top of the page as data, and here as
             a one-tap alternative to filling in the form. -->
        <div class="callout">
          <span class="callout__icon">${icon('phone')}</span>
          <div class="callout__body">
            <strong>Prefer to talk it through?</strong>
            <span>Call us, or message the team on WhatsApp.</span>
          </div>
          <a class="btn btn-outline" href="tel:${contact.phoneHref}">${icon('phone')}Call now</a>
          <a class="btn btn-wa" href="${contact.whatsappHref}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>
        </div>
      </div>

      <div class="formwrap reveal reveal--right">
        ${contactForm('contact')}
      </div>
    </div>
  </div>
</section>
`;

  return layout({
    title: 'Contact Us',
    description:
      'Contact Curelink Pharmaceuticals — distribution partnerships for global manufacturers, and supply for hospitals, pharmacies, dental clinics and tender teams.',
    canonical: 'contact.html',
    active: 'contact.html',
    depth: 0,
    crumbs: [{ label: 'Home', href: 'index.html' }, { label: 'Contact Us', href: 'contact.html' }],
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Curelink',
        url: `${site.url}/contact.html`,
        mainEntity: { '@id': `${site.url}/#organization` },
      },
    ],
    body,
  });
}
