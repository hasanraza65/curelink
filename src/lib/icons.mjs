/**
 * Inline SVG icon set.
 *
 * Icons are inlined rather than loaded as a font or sprite sheet: it removes a
 * network request entirely, keeps them crisp at any size, and lets them inherit
 * `currentColor` so they respond to hover and theme states for free.
 *
 * All paths are drawn on a 24×24 grid with a 1.7 stroke for optical consistency.
 */

const S = (body, opts = {}) =>
  `<svg class="icon${opts.cls ? ' ' + opts.cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${opts.sw || 1.7}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  /* ---- trust markers ---- */
  shield: (o) => S('<path d="M12 3 5 6v5.5c0 4.3 2.9 8.3 7 9.5 4.1-1.2 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>', o),
  thermometer: (o) => S('<path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0Z"/><path d="M12 16.5v-6"/>', o),
  truck: (o) => S('<path d="M2 7.5h11v9H2z"/><path d="M13 10.5h4l4 3.2v2.8h-8z"/><circle cx="7" cy="18" r="1.9"/><circle cx="17" cy="18" r="1.9"/>', o),
  users: (o) => S('<circle cx="9" cy="8" r="3.2"/><path d="M2.8 19.5a6.4 6.4 0 0 1 12.4 0"/><path d="M16 5.4a3.2 3.2 0 0 1 0 5.2"/><path d="M17.6 14.4a6.4 6.4 0 0 1 3.6 5.1"/>', o),

  /* ---- pillars ---- */
  eye: (o) => S('<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.9"/>', o),
  target: (o) => S('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>', o),
  flag: (o) => S('<path d="M5.5 21V4"/><path d="M5.5 5.2h11l-2 3.4 2 3.4h-11"/>', o),

  /* ---- ui ---- */
  arrowRight: (o) => S('<path d="M4.5 12h15"/><path d="m13.5 6 6 6-6 6"/>', o),
  arrowUp: (o) => S('<path d="M12 19.5v-15"/><path d="m6 10.5 6-6 6 6"/>', o),
  chevronDown: (o) => S('<path d="m6 9.5 6 6 6-6"/>', o),
  check: (o) => S('<path d="m5 12.5 4.5 4.5L19 7.5"/>', { sw: 2.1, ...o }),
  close: (o) => S('<path d="M6 6l12 12M18 6 6 18"/>', { sw: 2, ...o }),
  menu: (o) => S('<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>', { sw: 2, ...o }),
  x: (o) => S('<path d="M6.5 6.5 12 12l5.5 5.5M17.5 6.5 12 12l-5.5 5.5"/>', { sw: 2, ...o }),
  plus: (o) => S('<path d="M12 5v14M5 12h14"/>', { sw: 2, ...o }),

  /* ---- contact ---- */
  pin: (o) => S('<path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10" r="2.7"/>', o),
  phone: (o) => S('<path d="M8.2 3.6 10 7.4l-2 1.7a11 11 0 0 0 5 5l1.7-2 3.8 1.8v3.3a1.6 1.6 0 0 1-1.8 1.6C10.1 18.2 5.8 13.9 4.3 5.4A1.6 1.6 0 0 1 5.9 3.6Z"/>', o),
  mail: (o) => S('<rect x="2.8" y="5" width="18.4" height="14" rx="2.2"/><path d="m3.4 6.6 8.6 6 8.6-6"/>', o),
  clock: (o) => S('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.3V12l3.2 2"/>', o),

  /* ---- product / value ---- */
  drop: (o) => S('<path d="M12 3.2s5.6 6 5.6 9.6a5.6 5.6 0 1 1-11.2 0C6.4 9.2 12 3.2 12 3.2Z"/>', o),
  sparkle: (o) => S('<path d="M12 3.5 13.6 9 19 10.6 13.6 12.2 12 17.7 10.4 12.2 5 10.6 10.4 9Z"/><path d="M18.2 16.4 19 18.6l2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"/>', o),
  layers: (o) => S('<path d="m12 3.4 8.6 4.3L12 12 3.4 7.7Z"/><path d="m3.4 12 8.6 4.3 8.6-4.3"/><path d="m3.4 16.3 8.6 4.3 8.6-4.3"/>', o),
  tooth: (o) => S('<path d="M7.6 3.6c-2 0-3.4 1.6-3.4 3.9 0 2 .6 3.1.9 5.1.3 1.9.4 3.4.7 5.1.2 1.3.6 2.7 1.6 2.7 1.3 0 1.4-1.7 1.7-3.4.3-1.6.5-3.3 1.5-3.3s1.2 1.7 1.5 3.3c.3 1.7.4 3.4 1.7 3.4 1 0 1.4-1.4 1.6-2.7.3-1.7.4-3.2.7-5.1.3-2 .9-3.1.9-5.1 0-2.3-1.4-3.9-3.4-3.9-1.6 0-2.2.8-3 .8s-1.4-.8-3-.8Z"/>', o),
  pill: (o) => S('<rect x="2.6" y="8.4" width="18.8" height="7.2" rx="3.6" transform="rotate(-45 12 12)"/><path d="M8.5 8.5l7 7"/>', o),
  award: (o) => S('<circle cx="12" cy="9.4" r="5.6"/><path d="m8.6 14.2-1.3 6.3 4.7-2.4 4.7 2.4-1.3-6.3"/>', o),
  globe: (o) => S('<circle cx="12" cy="12" r="8.6"/><path d="M3.6 12h16.8"/><path d="M12 3.4c2.2 2.4 3.4 5.4 3.4 8.6s-1.2 6.2-3.4 8.6c-2.2-2.4-3.4-5.4-3.4-8.6S9.8 5.8 12 3.4Z"/>', o),
  building: (o) => S('<path d="M4.2 20.4V5.2A1.4 1.4 0 0 1 5.6 3.8h6.2a1.4 1.4 0 0 1 1.4 1.4v15.2"/><path d="M13.2 9.6h5.2a1.4 1.4 0 0 1 1.4 1.4v9.4"/><path d="M3 20.4h18"/><path d="M7.2 7.4h3M7.2 11h3M7.2 14.6h3M16 13h1.2M16 16.4h1.2"/>', o),
  box: (o) => S('<path d="M20.4 8.2 12 3.6 3.6 8.2v7.6L12 20.4l8.4-4.6Z"/><path d="M3.6 8.2 12 12.8l8.4-4.6"/><path d="M12 12.8v7.6"/>', o),
  leaf: (o) => S('<path d="M4.6 19.4C3 15 5 8.4 11 6.2c2.6-1 6-1 9-1.2.4 3.6-.2 7.6-1.8 10.2-2.8 4.6-9 5.6-13.6 4.2Z"/><path d="M4.6 19.4C7.4 15.6 11 12.4 15.4 10"/>', o),
  heart: (o) => S('<path d="M12 20.2S3.8 15.4 3.8 9.8a4.4 4.4 0 0 1 8.2-2.3 4.4 4.4 0 0 1 8.2 2.3c0 5.6-8.2 10.4-8.2 10.4Z"/>', o),
  flask: (o) => S('<path d="M9.4 3.4h5.2"/><path d="M10.4 3.4v6L5.6 18a2 2 0 0 0 1.7 3h9.4a2 2 0 0 0 1.7-3l-4.8-8.6v-6"/><path d="M7.7 14.6h8.6"/>', o),
  quote: (o) => S('<path d="M9.4 6.6C6.6 7.8 5 10.2 5 13.2c0 2.6 1.5 4.2 3.5 4.2 1.8 0 3.1-1.3 3.1-3.1s-1.2-3-2.9-3c-.3 0-.6 0-.8.1.4-1.6 1.6-2.9 3.2-3.6ZM19 6.6c-2.8 1.2-4.4 3.6-4.4 6.6 0 2.6 1.5 4.2 3.5 4.2 1.8 0 3.1-1.3 3.1-3.1s-1.2-3-2.9-3c-.3 0-.6 0-.8.1.4-1.6 1.6-2.9 3.2-3.6Z"/>', o),

  /**
   * Registered mark, drawn rather than typeset.
   *
   * The ® glyph is mostly whitespace around a thin circled R. Set at the size a
   * superscript wants inside a 13px uppercase label it lands near 8–10px, where
   * the counter of the R fills in and the whole thing renders as a dot — which
   * beside letter-spaced capitals reads as a bullet separator. Drawn as a vector
   * it stays crisp and unmistakably a registered mark at any size.
   */
  registered: () =>
    '<svg class="icon rmark" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="10.2" stroke="currentColor" stroke-width="2.2"/>' +
    '<path d="M9.4 17.6V6.9h3.9a3 3 0 0 1 0 6h-3.9" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="m12.4 12.9 2.9 4.7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
    '</svg>',

  whatsapp: () =>
    '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.29Z"/></svg>',

  /* ---- social (filled) ---- */
  facebook: () =>
    '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg>',
  instagram: () =>
    '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.51.01-4.75.07-1.15.05-1.77.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.18-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.05 1.15.24 1.77.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.18.4 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c1.15-.05 1.77-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.18.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.05-1.15-.24-1.77-.4-2.18a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.18-.4-1.24-.06-1.61-.07-4.75-.07Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm6.29-2a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z"/></svg>',
  youtube: () =>
    '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z"/></svg>',
  linkedin: () =>
    '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.3 8.98h3.3V21H3.3V8.98Zm5.42 0h3.16v1.64h.04c.44-.83 1.52-1.71 3.13-1.71 3.34 0 3.96 2.2 3.96 5.07V21h-3.3v-5.36c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.83V21h-3.3V8.98Z"/></svg>',
};

export const icon = (name, opts) => (icons[name] ? icons[name](opts) : '');
