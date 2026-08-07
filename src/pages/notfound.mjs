import { layout } from '../lib/layout.mjs';
import { icon } from '../lib/icons.mjs';

export default function notFound() {
  const body = `
<section class="hero hero--center">
  <div class="hero__grid-bg" aria-hidden="true"></div>
  <span class="blob blob--a" aria-hidden="true"></span>
  <div class="container" style="max-width:44rem">
    <span class="eyebrow eyebrow--light">Error 404</span>
    <h1 class="hero__title">This page has moved on</h1>
    <p class="hero__lead">
      The page you were looking for is not here. It may have been renamed, or the link that
      brought you here may be out of date.
    </p>
    <div class="hero__actions">
      <a class="btn btn-brand btn-lg" href="index.html">Back to home${icon('arrowRight')}</a>
      <a class="btn btn-ghost-light btn-lg" href="products.html">Browse products</a>
    </div>
  </div>
</section>
`;

  return layout({
    title: 'Page Not Found',
    description: 'The page you were looking for could not be found on the Curelink website.',
    canonical: '404.html',
    active: '',
    depth: 0,
    body,
  });
}
