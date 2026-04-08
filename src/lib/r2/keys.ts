const VALID_EXT = new Set(['jpg', 'jpeg', 'png', 'webp']);
const VALID_DOC_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf']);

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10MB for verification documents
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_DOC_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;

export function extFromFilename(filename: string): string | null {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = match?.[1];
  if (!ext) return null;
  const raw = ext === 'jpg' ? 'jpeg' : ext;
  if (!VALID_EXT.has(ext) && !VALID_EXT.has(raw)) return null;
  return ext;
}

export function extFromContentType(contentType: string): string | null {
  switch (contentType) {
    case 'image/jpeg': return 'jpg';
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    default: return null;
  }
}

/** listings/<listingId>/<uuid>.<ext> */
export function listingImageKey(listingId: string, uuid: string, ext: string): string {
  return `listings/${listingId}/${uuid}.${ext}`;
}

/** avatars/<userId>-<ts>.<ext> */
export function avatarKey(userId: string, ext: string): string {
  return `avatars/${userId}-${Date.now()}.${ext}`;
}

/** Safe path validator for user-supplied keys. */
export function isValidListingImageKey(key: string, listingId: string): boolean {
  return new RegExp(`^listings/${listingId}/[a-f0-9-]{36}\\.(jpg|jpeg|png|webp)$`).test(key);
}

/** verifications/<userId>/<type>/<uuid>.<ext> */
export function verificationDocKey(userId: string, type: string, uuid: string, ext: string): string {
  return `verifications/${userId}/${type}/${uuid}.${ext}`;
}

export function extFromDocFilename(filename: string): string | null {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = match?.[1];
  if (!ext) return null;
  const raw = ext === 'jpg' ? 'jpeg' : ext;
  if (!VALID_DOC_EXT.has(ext) && !VALID_DOC_EXT.has(raw)) return null;
  return ext;
}

export function isValidVerificationKey(key: string, userId: string): boolean {
  return new RegExp(`^verifications/${userId}/[a-z_]+/[a-f0-9-]{36}\\.(jpg|jpeg|png|webp|pdf)$`).test(key);
}
