import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getAllPosts } from '@/lib/blog';
import { getActiveSlugsForCity } from '@/lib/db/listings.repository';
import { listActiveCities } from '@/lib/db/cities.repository';

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/como-funciona', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/renty-score', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/inquilinos', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/arrendadores', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/nosotros', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/lista-de-espera', changeFrequency: 'weekly', priority: 0.95 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/legal/terminos', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/legal/privacidad', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/legal/datos', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.data.updatedDate || post.data.pubDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const cities = await listActiveCities();
  const cityEntries: MetadataRoute.Sitemap = cities.flatMap((c) => [
    { url: `${SITE_URL}/${c.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${SITE_URL}/${c.slug}/arriendos`, lastModified: now, changeFrequency: 'daily' as const, priority: 0.95 },
  ]);

  const listingEntries: MetadataRoute.Sitemap = (
    await Promise.all(
      cities.map(async (c) => {
        const slugs = await getActiveSlugsForCity(c.slug, 200);
        return slugs.map((s) => ({
          url: `${SITE_URL}/${c.slug}/arriendos/${s}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      })
    )
  ).flat();

  return [...staticEntries, ...postEntries, ...cityEntries, ...listingEntries];
}
