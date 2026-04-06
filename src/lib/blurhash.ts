import { decode } from 'blurhash';

/**
 * Converts a blurhash string to a base64 data URL for next/image placeholders.
 * Uses tiny 32×32 pixel data — sufficient for SSR blur placeholders.
 */
export function blurhashToDataURL(hash: string, width = 32, height = 32): string {
  try {
    const pixels = decode(hash, width, height);
    // Build a minimal BMP in hex since Node / browser have no canvas.
    // Instead, emit a tiny PNG via binary buffer + base64.
    const png = pixelsToPng(pixels, width, height);
    return `data:image/png;base64,${png}`;
  } catch {
    // graceful: solid neutral
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=';
  }
}

/** Minimal RGBA-to-PNG encoder (single scanline filter 0). */
function pixelsToPng(pixels: Uint8ClampedArray, width: number, height: number): string {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  const chunks: number[] = [...sig];

  const u32 = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];

  // IHDR
  const ihdr = [...u32(width), ...u32(height), 8, 6, 0, 0, 0];
  chunks.push(...writeChunk('IHDR', ihdr));

  // IDAT — filter 0 per row + raw data, then deflate
  const raw: number[] = [];
  for (let y = 0; y < height; y++) {
    raw.push(0);
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      raw.push(pixels[i]!, pixels[i + 1]!, pixels[i + 2]!, pixels[i + 3]!);
    }
  }
  const compressed = deflate(new Uint8Array(raw));
  chunks.push(...writeChunk('IDAT', Array.from(compressed)));

  // IEND
  chunks.push(...writeChunk('IEND', []));

  // base64 encode
  let binary = '';
  for (const b of chunks) binary += String.fromCharCode(b);
  return typeof btoa !== 'undefined' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
}

function writeChunk(type: string, data: number[]): number[] {
  const len = data.length;
  const typeBytes = [type.charCodeAt(0), type.charCodeAt(1), type.charCodeAt(2), type.charCodeAt(3)];
  const crc = crc32([...typeBytes, ...data]);
  return [
    (len >>> 24) & 0xff, (len >>> 16) & 0xff, (len >>> 8) & 0xff, len & 0xff,
    ...typeBytes,
    ...data,
    (crc >>> 24) & 0xff, (crc >>> 16) & 0xff, (crc >>> 8) & 0xff, crc & 0xff,
  ];
}

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(bytes: number[]): number {
  let c = 0xffffffff;
  for (const b of bytes) c = crcTable[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** zlib deflate (stored blocks for simplicity; fast enough for 32×32). */
function deflate(data: Uint8Array): Uint8Array {
  const out: number[] = [0x78, 0x01]; // zlib header
  // stored block(s), max 65535 per block
  let i = 0;
  while (i < data.length) {
    const chunk = Math.min(65535, data.length - i);
    const isLast = i + chunk === data.length ? 1 : 0;
    out.push(isLast);
    out.push(chunk & 0xff, (chunk >> 8) & 0xff);
    const nchunk = ~chunk;
    out.push(nchunk & 0xff, (nchunk >> 8) & 0xff);
    for (let j = 0; j < chunk; j++) out.push(data[i + j]!);
    i += chunk;
  }
  // adler32
  let a = 1, b = 0;
  for (const byte of data) { a = (a + byte) % 65521; b = (b + a) % 65521; }
  out.push((b >>> 8) & 0xff, b & 0xff, (a >>> 8) & 0xff, a & 0xff);
  return new Uint8Array(out);
}
