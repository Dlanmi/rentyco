import 'server-only';
import sharp from 'sharp';
import { encode as encodeBlurhash } from 'blurhash';

export interface ImageMeta {
  width: number;
  height: number;
  blurhash: string;
}

const VALID_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif']);
const MAX_DIMENSION = 10_000;

/** Extracts dimensions and a blurhash from an image buffer.
 *  Throws if the buffer is not a valid image or exceeds size limits. */
export async function extractMetadata(buffer: Buffer): Promise<ImageMeta> {
  const image = sharp(buffer, { failOn: 'error' });
  const meta = await image.metadata();

  if (!meta.format || !VALID_FORMATS.has(meta.format)) {
    throw new Error(`Formato de imagen no soportado: ${meta.format ?? 'desconocido'}`);
  }

  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  if (width <= 0 || height <= 0) {
    throw new Error('La imagen tiene dimensiones inválidas');
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new Error(`La imagen excede el tamaño máximo (${MAX_DIMENSION}x${MAX_DIMENSION})`);
  }

  // Downscale to 32px on long edge for fast blurhash encoding.
  const scale = 32 / Math.max(width, height);
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const { data } = await image
    .raw()
    .ensureAlpha()
    .resize(w, h, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  const blurhash = encodeBlurhash(new Uint8ClampedArray(data), w, h, 4, 4);

  return { width, height, blurhash };
}
