# Curelink — website

A complete rebuild of `curelink.5techsol.com`. All content, products and imagery
are carried over from the original site; the interface, copy quality, structure,
performance and accessibility are new.

Plain static HTML/CSS/JS output — upload the files and it runs. No server, no
database, no build step required at deploy time.

---

## Quick start

```bash
# view locally
python -m http.server 8000     # then open http://localhost:8000

# rebuild the HTML after editing anything in /src
node build.mjs
```

Node 18+ is required for the build (no npm packages needed).

---

## What to change before going live

| What | Where |
| --- | --- |
| Production domain (canonical URLs, sitemap, OG tags) | `src/data/site.mjs` → `site.url` |
| Social profile links (currently `#` — the source site had no live profiles) | `src/data/site.mjs` → `social` |
| Contact form delivery (see “Contact form” below) | `assets/js/main.js` |

Run `node build.mjs` after any change.

---

## Structure

```
├── index.html · about.html · products.html · … 24 generated pages
├── products/                 13 product detail pages
├── sitemap.xml · robots.txt · site.webmanifest
│
├── assets/
│   ├── css/style.css         the whole design system, in one commented file
│   ├── css/fonts.css         @font-face for the self-hosted fonts
│   ├── js/main.js            nav, drawer, scroll reveal, form validation
│   ├── fonts/                Plus Jakarta Sans + Inter (woff2, self-hosted)
│   └── img/
│       ├── products/         packshots (webp + png)
│       ├── products/model/   in-use lifestyle photography (webp + jpg)
│       └── site/             logo, hero photo, favicon
│
├── src/                      page sources — EDIT HERE, not the HTML
│   ├── data/site.mjs         identity, contact details, nav, vision/mission
│   ├── data/products.mjs     the full product catalogue
│   ├── data/legal.mjs        privacy policy + terms
│   ├── lib/                  layout shell, components, SVG icon set
│   └── pages/                one module per page type
│
├── build.mjs                 generates all HTML + sitemap + manifest + favicon
├── tools/                    image preparation scripts (see below)
└── _originals/               untouched source images — not needed for deployment
```

**Edit `/src`, then run the build.** The generated `.html` files at the root are
build output and will be overwritten. Everything shared between pages — header,
mega menu, footer, meta tags, structured data — lives in `src/lib/layout.mjs`, so
those can never drift out of sync across 24 pages.

Adding a product is one entry in `src/data/products.mjs`: its detail page, its
catalogue cards, the nav menu, the footer list and the sitemap all follow.

---

## The hero

A full-bleed background slider, not a split image layout. Three photographs
cross-fade behind the copy, driven by `heroSlides` in `src/data/site.mjs` — add
or remove an entry there and the slides, the dots and the aria labels all follow.

Every slide is composed with its subject on the right and open space on the
left. The scrim exploits that: on desktop it is a horizontal wash, heavy on the
left and clear by about 90% across, so the copy always sits on a dark ground and
nobody's face is ever behind text. On phones the crop is so tight that almost
nothing but the subject survives, so the scrim switches to a full veil.

`tools/prepare-slider.py` handles the images. The supplied files were 1.5–1.9 MB
PNGs; they are emitted as WebP with a JPEG fallback at two widths (2000px and
1100px) so a phone never downloads a desktop banner. The LCP slide is 73 KB, down
from 1.9 MB. Sources are kept in `_originals/slider/`.

```bash
python tools/prepare-slider.py
```

Behaviour: autoplays on a 6s cycle with the active dot doubling as a progress
bar; pauses on hover, on focus, and when the tab is hidden; arrow keys move
between slides; and under `prefers-reduced-motion` it does not autoplay or drift
at all — the first slide simply stays put and the dots still work.

---

## Design

The palette is taken from the logo and nothing else — the blue of the arc carries
the interface, the green of *Cure* drives actions, and the red of *link* appears
only as a small accent so it keeps its emphasis. Everything else is a neutral
slate ramp. All tokens sit at the top of `style.css`.

Two typefaces: **Plus Jakarta Sans** for headings, **Inter** for body text, both
self-hosted so there are no third-party requests.

Type and spacing scale fluidly with `clamp()` rather than jumping at breakpoints,
so the layout stays balanced at every width instead of only at the tested ones.

### The type scale

Sizes live in the `--fs-*` tokens at the top of `style.css`. The whole scale sits
at **0.82× the original**, and it is proportional on purpose.

The first attempts subtracted a fixed number of pixels from every size, which
does not work across a range this wide: 3px off a 53px heading is 6%, while the
same 3px off 17px body copy is 18%. The result read as "only the small text
changed" — because only the small text had visibly changed. Large sizes are now
scaled by ratio instead.

For `clamp()` sizes, the floor, the rem offset **and** the vw coefficient are all
multiplied by the ratio. Scaling only the endpoints would change the widths at
which the size starts and stops growing; scaling all three shrinks the value by
the same proportion at every viewport and leaves the breakpoints alone.

Headings were then tightened again against body copy — H2 sits at 2× body rather
than 2.45×, which suits a dense catalogue where most pages are a heading
followed immediately by specifications.

| | px @1440 | ×body |
| --- | --- | --- |
| Hero brand | 56 | 4.00 |
| H1 / page hero title | 36 | 2.57 |
| H2 / section headings | 28 | 2.00 |
| H3 / card titles | 17.9 | 1.28 |
| Hero tagline | 17.6 | 1.26 |
| Lead paragraph | 16.5 | 1.18 |
| Body copy | 14 | 1.00 |
| Nav links, card text | 12 | 0.86 |
| Eyebrows, badges | 11 | 0.79 |

**11px is the floor.** The uppercase letter-spaced labels — `.pgal__thumb span`,
`.modal__eyebrow`, `.spartner__since-label`, `.eyebrow`, product badges — all sit
on it, and the second pass held them there rather than taking the full 2px. They
are bold with wide tracking, which carries at 11px and stops carrying below it.
Body copy at 14px is likewise at the lower end of comfortable; a third reduction
would cost readability rather than polish.

A handful of components still set their own literal sizes rather than using a
token. They were adjusted in the same sweep, but if you re-scale the type again,
search for `font-size:` and not just the tokens.

---

## Company details

Both offices, both email addresses, the phone number, WhatsApp and the website
live in `contact` in `src/data/site.mjs`, and flow from there into the header
strip, footer, contact page, homepage contact block and the Organization schema.
Change them in one place.

* **Head Office** — P.O. Box #17639, Karachi, Pakistan
* **Regional Office** — Office #BH1-313, 4th Floor, Broadway Heights, Bahria
  Orchard, Lahore, Pakistan
* **WhatsApp** links via `wa.me`, which needs the number with no symbols; the
  displayed and linked forms are separate fields for that reason. The button
  keeps WhatsApp's own green rather than the brand green — people scan for that
  colour, and recolouring it would misrepresent the brand.

## Copy

Content is the client's own, rewritten for grammar, consistency and tone. Some
notable changes:

- The vision and mission statements had broken grammar and were rewritten to read
  cleanly while keeping their exact meaning.
- The 2030 goal was a single dense paragraph; it is now a five-step roadmap.
- “What makes us different” was three loose paragraphs; it is now a direct
  traditional-adhesive vs Fittydent comparison.
- Product features were run-on sentences; they are now titled feature entries.

**No claims were invented.** Every product, clinical and regulatory statement
traces back to the client's published copy or the product packaging itself. In
particular there are no fabricated statistics anywhere — the homepage uses
qualitative capability markers (DRAP compliant, cold chain, nationwide reach,
trained staff) rather than invented numbers like “500+ hospitals”.

Two pages needed judgement calls, both flagged here:

- **Global Partners** was in the original navigation but linked nowhere. It is
  built entirely from facts already on the client's site — Fittydent, Medicinalis
  (“manufactured in Europe under GMP standards”), Curedent and the in-house
  pharmaceutical line.
- **Curedent Mouthwash** appeared on the original homepage with no detail page and
  no copy. Its page is written from what is legible on the bottle: sodium
  fluoride, 275 ml, anti-cavity and anti-plaque, for daily oral hygiene.

---

## Product imagery

Each product has up to two images, both handled by scripts in `tools/` so they
can be regenerated from source at any time.

**Packshots** — `assets/img/products/<name>.webp` (+ `.png` fallback)
**In-use / lifestyle** — `assets/img/products/model/<name>.webp` (+ `.jpg`)

The two are used in different places on purpose:

* the **packshot** carries the product header, on its own — click it to open the
  lightbox (Escape closes, focus is trapped while open);
* the **lifestyle shot** anchors the "What sets it apart" section below it, as a
  left-hand image beside the feature list.

They are not mixed into one gallery. A person holding a box and a clean packshot
read as different kinds of image, and swapping between them in a single frame
made the header feel inconsistent. Putting the lifestyle shot beside the feature
list also fills a column that a short feature list would otherwise leave half
empty.

Products with no lifestyle shot — currently Oraflogo Oral Solution and A4 Paper — fall
back to the original two-column feature grid automatically.

All the lifestyle shots are currently portrait, but the layout does not assume
it. The feature image keeps its **natural** proportions rather than being cropped
to a fixed ratio, and `width`/`height` are read from the file header at build
time by `src/lib/imagesize.mjs`, so a differently-shaped image cannot cause a
layout shift. The four-up strips do use a fixed 3:4 crop for a tidy row; if a
future image puts the pack off centre, set `modelFocus` on that product (a CSS
`object-position`) to bias the crop.

The header gallery still supports multiple images: add `extraShots` to a product
in `src/data/products.mjs` and the thumbnail strip appears on its own.

The lifestyle shots also drive the "In everyday use" strips on the homepage and
on each category page.

### Where the images came from

The original site's pharma packshots were phone photographs — soft, flat,
colour-cast and lit by direct flash. `tools/retouch-product-images.py` still
handles those, and remains the source of the Fittydent, Oraflogo and Curedent
brush images:

white balance → cast neutralisation on near-neutral surfaces → black/white point
→ highlight recovery → vibrance → two-scale unsharp masking → Lanczos upscale →
soft grounded contact shadow → crop to content.

That last step matters: the source files carried a lot of empty margin, and
cards render images with `object-fit: contain`, so the margin was reproduced as
dead space inside every card. Trimming to the alpha bounding box plus one
consistent margin makes every product fill its frame to the same degree.

Nothing in that pipeline is generative — it is global tonal and colour work of
the kind a retoucher applies in Lightroom, plus a synthetic shadow composited
*underneath* the subject. Cast correction is weighted by inverse saturation, so
white cartons neutralise while brand greens, blues and reds stay as photographed.

`tools/prepare-new-images.py` handles the client-supplied AI imagery: it
normalises the lifestyle shots, and for replacement packshots that arrive on a
solid white background it keys the background out by flood-filling inward from
the border. Colour-keying alone would not work — these cartons are themselves
white, and the tolerance has to stay under about 10 because the background sits
at 254 while the carton's own face sits at 243.

```bash
python tools/retouch-product-images.py    # photographic retouch
python tools/prepare-new-images.py        # normalise supplied AI imagery
```

Both always re-read from `_originals/`, so they can be re-tuned and re-run
without generation loss. The pre-AI retouched packshots are kept in
`_originals/retouched/` and can be dropped back into `assets/img/products/`
at any time.

### ⚠ Three points to confirm

**0. The Oraflogo Oral Solution pack states 1.2% hyaluronic acid, not 0.3%.**
The replacement artwork supplied on 5 Aug reads *"7 natural ingredients with
1.2% hyaluronic acid"* and *"for natural RELIEF of gums and oral mucosa"*. The
earlier render and content sheet said 0.3% and "healing". The page now follows
the newer artwork throughout — badge, summary, features, meta description and
the Global Partners entry — because otherwise the page would contradict its own
photograph. **Please confirm 1.2% is the current formulation.** The new pack
also carries "Member of JGL Group"; the brand is still shown as Medicinalis,
which the earlier material stated — confirm which should appear.

**1. Oraflogo Oral Solution was added, not swapped in.** The image and copy
supplied under "latest Oraflogo image" describe a *different SKU* to the one
already on the site: 150 ml oral solution with seven active ingredients, versus
the 10 ml gel with ten. Both are real Medicinalis products and the existing gel
page has its own accurate copy and lifestyle shot, so replacing it would have
destroyed correct content. The Oral Solution is therefore a second dental
product. Say the word if you meant it to replace the gel.

**2. The address on the Smile Strong brochure differs from the site.** The
brochure reads *P.O.Box 17619, Karachi-75300*; the site (taken from the original
curelink.5techsol.com) reads *P.O. Box #17639, Karachi*. Box number 17619 vs
17639. Contact details are not something to change on a guess, so the site still
carries the original value — please confirm which is right.

**3. Two printer specifications from the supplier listing were omitted.** The
AliExpress listing claims a "maximum paper size of A0" and "25ppm", both
auto-generated boilerplate that does not describe a conveyor coder. The page
uses the line speed from the product title (25 m/min) and leaves the A0 claim
out entirely rather than publishing a false specification.

### Consumer Goods imagery is illustration, not photography

A4 Size Paper ships with an **original vector illustration**
(`_originals/artwork/art-a4-paper.svg`), not a photograph. (The printer
illustration has been replaced by the supplied product photography.)

No suitable stock photography was available under a licence safe for commercial
use: the openly-licensed results were either cartoon clipart or photographs of
competitor-branded packaging (and, in the case of the best-lit option, US Letter
paper rather than A4). Rather than introduce an attribution obligation, a
share-alike obligation, or another company's branding onto this site, the two
images were drawn to match the existing packshot style — neutral, unbranded, in
the site palette.

It is deliberately generic: the ream carries no GSM figure, because the weight is
chosen on the page. **Swap it for real product photography when available.** The
SVG source is editable and re-renders with any SVG tool.

### ⚠ Label text on three AI packshots needs review

The AI that generated the replacement packshots **rewrote the small print** on
the cartons. The front panels are correct, but:

| Product | What the AI changed |
| --- | --- |
| **Relox-S Syrup** | Composition replaced. The real carton lists a herbal formula (Zingiber officinale, Cardamomum, Mentha piperita, Foeniculum vulgare, per 15 mL). The render lists Dextrose, "Beclomethas (API)", Cyproheptadine, Lysine HCl, Zinc sulfate and Tricholine citrate, per 5 mL. Manufacturer changed from **Curelink** to **"Care Life Pharma (Pvt.) Ltd."** |
| **Fasto-B Syrup** | Same substitution. The real carton lists six herbal actives (Ipomoea paniculata, Boerhaavia diffusa, Glycyrrhiza glabra, Eclipta alba, Emblica officinalis, Tinospora cordifolia). Manufacturer likewise changed to "Care Life Pharma". |
| **Curedent Mouthwash** | Volume changed **275 ml → 220 ml**, and the claims changed from "Sodium Fluoride / Anti Cavity & Anti Plaque" to "Germ Free Wash / Bad Breath & Oral Plaque". |

This matters because the composition and the manufacturer are regulated
statements on a medicine pack. At the sizes the site renders them the small
print is not legible, but the lightbox shows the image at up to 1200 px, where
it becomes readable.

**B-KALCIN is fine** — its front panel is accurate and no fabricated small print
is visible.

To revert any of these to the accurate photographic version, run
`python tools/retouch-product-images.py` — it rebuilds those packshots from the
untouched originals in `_originals/products/` and overwrites the AI renders.

One lifestyle image is also worth a second look: **Curedent Denture Brush** shows
a man brushing his teeth with an ordinary toothbrush, which is not what that
product is for — it is a dual-head brush for cleaning dentures out of the mouth.

## Performance

First load of the homepage is **≈133 KB** (HTML + CSS + JS gzipped, plus fonts,
logo and hero image).

- Zero third-party requests — fonts, styles and scripts are all local.
- No JavaScript framework. `main.js` is ~3 KB gzipped.
- Product images ship as WebP with PNG fallbacks, lazy-loaded below the fold.
- Every `<img>` has explicit `width`/`height` to prevent layout shift.
- The hero image is preloaded with `fetchpriority="high"`.

### Cache busting

`style.css`, `fonts.css` and `main.js` keep the same filename across every
build, so a browser holding an old copy has no way to know a rebuild changed
them. The failure mode is nasty and easy to misread: fresh HTML rendered against
a stale stylesheet, so the page looks broken — the hero slides stack full-width
down the page instead of layering — while the files on disk are perfectly fine.
Rebuilding does not fix it, because the browser never asks for the new file.

`src/lib/assetver.mjs` hashes each file's contents at build time and appends
`?v=<hash>` to the link:

```html
<link rel="stylesheet" href="assets/css/style.css?v=88dad330">
<script src="assets/js/main.js?v=c9d8c17f" defer></script>
```

**Images are versioned the same way**, and for the same reason — it bites
harder there. Replacing `fittydent-cushions.jpg` with a new photograph under
the same filename left visitors looking at the old picture indefinitely, with
no way to force a refresh short of renaming the file by hand every time. Every
`<img>`, `<source>` and the LCP preload now carries a hash of the file itself:

```html
<source srcset="../assets/img/products/model/fittydent-cushions.webp?v=1b9dbddf" type="image/webp">
```

Swap the file, run `node build.mjs`, upload — the URL changes and browsers
refetch. Nothing to remember. The favicon, apple-touch icon and the absolute
`og:image` are left unversioned: they are cached by different rules and the
social scrapers want a stable URL.

The URL changes only when the file's bytes change, so browsers refetch exactly
when they should and cache hard the rest of the time. Nothing needs to be done
by hand — it updates on every `node build.mjs`.

If a page ever *does* look broken after a deploy, check the `?v=` value in the
page source against `assetHash` output before suspecting the CSS itself.

### A note on Bootstrap

Bootstrap 5 was used during development but has been **removed from the shipped
pages**. Once the design system was in place the markup depended on exactly three
Bootstrap utility classes (`d-none`, `d-lg-inline-flex`, `w-100`) and zero
Bootstrap JavaScript components — the navigation, drawer and form handling are
all custom. Loading 306 KB of CSS and JS for three utility rules worked directly
against the speed requirement, so those three rules were reimplemented locally.

That change alone took first load from ~700 KB to ~133 KB. If Bootstrap is wanted
back for future maintenance, add the CDN tags to `head()` and the script to
`layout()` in `src/lib/layout.mjs` — nothing else depends on its absence.

---

## SEO

Every page carries a unique title and meta description within Google's display
limits, a canonical URL, Open Graph and Twitter card tags, and JSON-LD structured
data. `Organization` schema is site-wide; product pages add `Product`, category
pages add `ItemList`, and every non-homepage adds `BreadcrumbList`.

`sitemap.xml`, `robots.txt` and `site.webmanifest` are generated by the build, so
they cannot fall behind the page list.

Product URLs were also restructured: the original site served pharmaceutical
products from `/dental-products/…` paths. They now live under `/products/…`.

---

## Accessibility

- All text and UI colour pairs meet **WCAG 2.1 AA** contrast. The logo green
  (`#00A651`) only reaches 3.19:1 on white, so it is used for icons and display
  type only; small text and the primary button use `--green-cta` / `--green-text`
  at the same hue and compliant luminance.
- One `<h1>` per page, no skipped heading levels.
- Keyboard operable throughout: skip link, visible focus rings, Escape closes the
  menus, and focus is trapped inside the mobile drawer while it is open.
- Scroll animations are disabled under `prefers-reduced-motion`.
- Reveal animations are scoped to `html.js`, so with JavaScript disabled all
  content renders visible rather than staying stuck at `opacity: 0`. A timed
  fallback also reveals anything the observer misses.

---

## Product pages on small screens

Three things behave differently below the 992px breakpoint:

* **The packshot is not sticky.** In the single-column layout a sticky image
  pins itself to the top of the viewport while the copy scrolls underneath, so
  the badges and heading rendered on top of the product. Sticky is applied only
  at the desktop breakpoint, where the two columns sit side by side.
* **A sticky action bar** appears once the inline enquiry button has scrolled
  away, carrying the product thumbnail, name and an Enquire button. It is
  suppressed again while the footer call to action is on screen, so there are
  never two competing CTAs, and it is hidden entirely on desktop where the
  button stays in view.
* The back-to-top button lifts above the bar. That offset uses `:has()` with a
  `body.has-pbar` class as a fallback for browsers without it.

Bar visibility is measured from `getBoundingClientRect()` on scroll rather than
watched with an IntersectionObserver. An observer only fires when the
intersection state *changes*, so jumping straight past the button — an in-page
anchor, a restored scroll position, a fast flick — moves the element from below
the viewport to above it without ever intersecting, and the callback never runs.

## Contact form

Where a product is sold in variants — currently A4 paper, in 70, 75 and 80 g/m² —
the detail page carries a weight selector, and the choice is copied into the
enquiry dialog when it opens. The message then states both the product and the
variant, so a buyer never has to restate it. Products without variants render no
selector and no variant field.

Product pages open the form **in a dialog on the page** rather than sending the
visitor to the contact page. The dialog names the product, shows its packshot,
pre-selects the right enquiry category, and carries the product name through in
a hidden field — so the message says which item it is about and nobody has to
re-type it. It closes on Escape, traps focus, and focuses the close button
rather than the first input, so opening it does not immediately raise a mobile
keyboard.

## Email delivery

All three forms post to a single PHP endpoint, `mail/send.php`.

```
mail/
├── send.php           the endpoint every form posts to
├── Smtp.php           minimal SMTP client (no Composer, no PHPMailer)
├── config.php         SMTP credentials — keep OUT of version control
├── config.sample.php  copy this to config.php on a new deployment
├── selftest.php       diagnoses setup problems; delete before launch
└── .htaccess          blocks web access to everything except send.php
```

**Why SMTP rather than `mail()`.** PHP's `mail()` on shared cPanel sends as the
web-server user, which fails SPF and DMARC for the domain and lands enquiries in
spam. Authenticating as the real mailbox is what makes them deliverable.

### Setting it up

1. `cp mail/config.sample.php mail/config.php`
2. Put the mailbox password in `config.php`
3. Run `php mail/selftest.php` — it checks config, reachability, TLS and
   credentials in order and names whichever one fails
4. Delete `mail/selftest.php`

### The TLS certificate

Namecheap shared cPanel serves `mail.<yourdomain>` from a shared box whose
certificate is issued for `*.web-hosting.com`, so a strict hostname match fails
even though the certificate is a valid Sectigo one. `config.php` therefore sets:

```php
'peer_name' => '*.web-hosting.com',
```

The chain is still fully verified — this only adjusts the name expected on it.
Once the site runs on the same cPanel account the issue disappears entirely if
you switch to the local mail server: `'host' => 'localhost', 'port' => 25,
'encryption' => 'none'`.

### What the endpoint does

* Validates name, a real email address and a message, and rejects any value
  containing a line break — that is how form-to-relay attacks work
* Silently accepts and discards honeypot submissions, and anything posted within
  three seconds of the page rendering
* Throttles to one submission per IP per 20 seconds, checked *after* validation
  so correcting a typo never locks anyone out
* Sends an HTML + plain-text notification with `Reply-To` set to the enquirer,
  so replying answers the customer rather than the office mailbox
* Returns JSON; the front end reports the result inline with no page reload

If PHP is not running — a static preview, or a host without PHP — the form falls
back to opening the visitor's mail client with everything pre-filled, rather
than losing the enquiry.

---

## Browser support

All current versions of Chrome, Edge, Firefox and Safari, desktop and mobile.
Verified with no horizontal overflow at 320 px, 390 px and 768 px.
