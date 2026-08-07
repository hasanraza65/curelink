/**
 * Intrinsic image dimensions, read from the file header at build time.
 *
 * Every <img> needs correct width/height attributes to reserve the right box
 * before the image loads — otherwise the page shifts as it arrives. Hard-coding
 * those numbers works only while every image shares one aspect ratio, which
 * stopped being true as soon as a landscape lifestyle shot joined the portrait
 * ones. Reading the header keeps the markup honest with no manual bookkeeping.
 *
 * Supports PNG, JPEG and WebP — the formats this site ships.
 */
import { readFileSync, existsSync } from 'node:fs';

const cache = new Map();

function parse(buf) {
  // PNG: 8-byte signature, then IHDR with width/height as big-endian uint32
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG: walk the segment markers to the start-of-frame
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const marker = buf[i + 1];
      // SOF0..SOF15, excluding the non-frame markers DHT/JPG/DAC
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  // WebP: RIFF container, VP8 / VP8L / VP8X chunk
  if (buf.length > 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') {
      return {
        width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
        height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
      };
    }
    if (chunk === 'VP8 ') {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
  }

  return null;
}

/**
 * @param {string} path  file path, relative to the project root
 * @param {{width:number,height:number}} fallback used if the file is missing
 */
export function imageSize(path, fallback = { width: 800, height: 800 }) {
  if (cache.has(path)) return cache.get(path);
  let out = fallback;
  try {
    if (existsSync(path)) out = parse(readFileSync(path)) || fallback;
  } catch {
    /* fall through to the fallback */
  }
  cache.set(path, out);
  return out;
}
