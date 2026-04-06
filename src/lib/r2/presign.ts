import 'server-only';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2, R2_BUCKETS } from './client';

const PUT_TTL_SECONDS = 5 * 60; // 5 min
const GET_TTL_SECONDS = 60;

export async function getPresignedPutUrl(args: {
  key: string;
  contentType: string;
  contentLength: number;
  bucket?: keyof typeof R2_BUCKETS;
}): Promise<string | null> {
  const client = getR2();
  if (!client) return null;
  const cmd = new PutObjectCommand({
    Bucket: R2_BUCKETS[args.bucket ?? 'listings'],
    Key: args.key,
    ContentType: args.contentType,
    ContentLength: args.contentLength,
  });
  return getSignedUrl(client, cmd, { expiresIn: PUT_TTL_SECONDS });
}

export async function getPresignedGetUrl(args: {
  key: string;
  bucket?: keyof typeof R2_BUCKETS;
}): Promise<string | null> {
  const client = getR2();
  if (!client) return null;
  const cmd = new GetObjectCommand({
    Bucket: R2_BUCKETS[args.bucket ?? 'listings'],
    Key: args.key,
  });
  return getSignedUrl(client, cmd, { expiresIn: GET_TTL_SECONDS });
}
