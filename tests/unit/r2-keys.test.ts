import { describe, it, expect } from 'vitest';
import {
  extFromFilename,
  extFromContentType,
  listingImageKey,
  isValidListingImageKey,
  MAX_IMAGE_BYTES,
} from '@/lib/r2/keys';

describe('extFromFilename', () => {
  it('extracts jpg extension', () => {
    expect(extFromFilename('photo.jpg')).toBe('jpg');
  });

  it('extracts jpeg extension', () => {
    expect(extFromFilename('photo.jpeg')).toBe('jpeg');
  });

  it('extracts png extension', () => {
    expect(extFromFilename('photo.png')).toBe('png');
  });

  it('extracts webp extension', () => {
    expect(extFromFilename('photo.webp')).toBe('webp');
  });

  it('is case-insensitive', () => {
    expect(extFromFilename('PHOTO.JPG')).toBe('jpg');
    expect(extFromFilename('image.PNG')).toBe('png');
  });

  it('returns null for unsupported extensions', () => {
    expect(extFromFilename('file.gif')).toBeNull();
    expect(extFromFilename('file.svg')).toBeNull();
    expect(extFromFilename('file.bmp')).toBeNull();
    expect(extFromFilename('file.txt')).toBeNull();
  });

  it('returns null for no extension', () => {
    expect(extFromFilename('noext')).toBeNull();
    expect(extFromFilename('')).toBeNull();
  });
});

describe('extFromContentType', () => {
  it('maps MIME types to extensions', () => {
    expect(extFromContentType('image/jpeg')).toBe('jpg');
    expect(extFromContentType('image/png')).toBe('png');
    expect(extFromContentType('image/webp')).toBe('webp');
  });

  it('returns null for unsupported types', () => {
    expect(extFromContentType('image/gif')).toBeNull();
    expect(extFromContentType('text/html')).toBeNull();
    expect(extFromContentType('')).toBeNull();
  });
});

describe('listingImageKey', () => {
  it('builds correct key path', () => {
    const key = listingImageKey('abc-123', 'def-456', 'jpg');
    expect(key).toBe('listings/abc-123/def-456.jpg');
  });
});

describe('isValidListingImageKey', () => {
  const listingId = '8992b230-ea58-427a-9aad-41f88f1eb4f9';
  const imageId = 'be66b363-a3df-40c0-9b32-8e34c432a426';

  it('accepts valid keys', () => {
    expect(isValidListingImageKey(`listings/${listingId}/${imageId}.jpg`, listingId)).toBe(true);
    expect(isValidListingImageKey(`listings/${listingId}/${imageId}.jpeg`, listingId)).toBe(true);
    expect(isValidListingImageKey(`listings/${listingId}/${imageId}.png`, listingId)).toBe(true);
    expect(isValidListingImageKey(`listings/${listingId}/${imageId}.webp`, listingId)).toBe(true);
  });

  it('rejects keys with wrong listing ID', () => {
    expect(isValidListingImageKey(`listings/wrong-id/${imageId}.jpg`, listingId)).toBe(false);
  });

  it('rejects path traversal attempts', () => {
    expect(isValidListingImageKey(`listings/${listingId}/../etc/passwd`, listingId)).toBe(false);
    expect(isValidListingImageKey(`listings/${listingId}/../../secret.jpg`, listingId)).toBe(false);
  });

  it('rejects invalid extensions', () => {
    expect(isValidListingImageKey(`listings/${listingId}/${imageId}.gif`, listingId)).toBe(false);
    expect(isValidListingImageKey(`listings/${listingId}/${imageId}.html`, listingId)).toBe(false);
  });

  it('rejects malformed keys', () => {
    expect(isValidListingImageKey('', listingId)).toBe(false);
    expect(isValidListingImageKey('just-a-file.jpg', listingId)).toBe(false);
  });
});

describe('MAX_IMAGE_BYTES', () => {
  it('is 5MB', () => {
    expect(MAX_IMAGE_BYTES).toBe(5 * 1024 * 1024);
  });
});
