import 'server-only';
import { S3Client } from '@aws-sdk/client-s3';

let _client: S3Client | null = null;

/**
 * Cloudflare R2 S3-compatible client. Uses global signature v4.
 * Returns null if env vars are missing (dev fallback).
 */
export function getR2(): S3Client | null {
  if (_client) return _client;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) return null;

  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

export const R2_BUCKETS = {
  listings:
    process.env.R2_BUCKET_LISTINGS ??
    process.env.R2_BUCKET_NAME ??
    'renty-listing-images',
  avatars: process.env.R2_BUCKET_AVATARS ?? 'renty-avatars',
};

export const R2_PUBLIC_BASE =
  process.env.NEXT_PUBLIC_CDN_BASE ??
  process.env.R2_PUBLIC_BASE ??
  process.env.R2_PUBLIC_URL ??
  'https://cdn.rentyco.app';

export function publicUrlFor(key: string): string {
  return `${R2_PUBLIC_BASE.replace(/\/$/, '')}/${key.replace(/^\/+/, '')}`;
}
