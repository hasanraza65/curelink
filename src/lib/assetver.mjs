/**
 * Content-hashed asset URLs.
 *
 * `style.css` and `main.js` keep the same filename across every build, so a
 * browser that has already cached them has no way to know a rebuild changed
 * them — it happily keeps serving the old copy. That produces the worst kind of
 * bug: fresh HTML rendered against a stale stylesheet, so the page looks broken
 * in a way that no amount of rebuilding fixes, and nothing is actually wrong
 * with the files on disk.
 *
 * Appending a hash of the file's own contents makes the URL change whenever the
 * file changes, and stay identical when it doesn't. The browser refetches
 * exactly when it should and caches hard the rest of the time.
 */
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const cache = new Map();

/**
 * Short content hash for a build-root-relative asset path.
 * Returns an empty string if the file is missing, so a typo degrades to an
 * un-versioned link rather than breaking the build.
 */
export function assetHash(path) {
  if (cache.has(path)) return cache.get(path);

  let hash = '';
  if (existsSync(path)) {
    hash = createHash('sha1').update(readFileSync(path)).digest('hex').slice(0, 8);
  }

  cache.set(path, hash);
  return hash;
}

/** `assets/css/style.css` -> `assets/css/style.css?v=1a2b3c4d` */
export function versioned(path) {
  const h = assetHash(path);
  return h ? `${path}?v=${h}` : path;
}
