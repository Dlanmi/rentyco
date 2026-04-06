/**
 * Local MDX/Markdown loader for blog posts.
 * Reads files from `content/blog/` at build time, parses frontmatter with
 * gray-matter, and exposes typed metadata + raw content for MDX compilation.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export const BLOG_CATEGORIES = [
  'inquilinos',
  'arrendadores',
  'legal',
  'mercado',
  'producto',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  author: string;
  category: BlogCategory;
  tags: string[];
  image?: string;
  imageAlt?: string;
  readingTime?: number;
}

export interface BlogPost {
  slug: string;
  data: BlogPostFrontmatter;
  content: string;
}

const BLOG_DIR = join(process.cwd(), 'content', 'blog');

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  inquilinos: 'Inquilinos',
  arrendadores: 'Arrendadores',
  legal: 'Legal',
  mercado: 'Mercado',
  producto: 'Producto',
};

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  inquilinos: 'bg-teal/10 text-teal',
  arrendadores: 'bg-coral/10 text-coral',
  legal: 'bg-amber-100 text-amber-700',
  mercado: 'bg-emerald-100 text-emerald-700',
  producto: 'bg-violet-100 text-violet-700',
};

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date in blog frontmatter: ${String(value)}`);
  }
  return parsed;
}

function assertCategory(value: unknown): BlogCategory {
  if (typeof value === 'string' && (BLOG_CATEGORIES as readonly string[]).includes(value)) {
    return value as BlogCategory;
  }
  throw new Error(`Invalid blog category: ${String(value)}`);
}

function parsePost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const rt = readingTime(content).minutes;

  const frontmatter: BlogPostFrontmatter = {
    title: String(data.title),
    description: String(data.description),
    pubDate: toDate(data.pubDate),
    updatedDate: data.updatedDate ? toDate(data.updatedDate) : undefined,
    author: typeof data.author === 'string' && data.author ? data.author : 'Equipo Renty',
    category: assertCategory(data.category),
    tags: Array.isArray(data.tags) ? data.tags.map((t) => String(t)) : [],
    image: typeof data.image === 'string' ? data.image : undefined,
    imageAlt: typeof data.imageAlt === 'string' ? data.imageAlt : undefined,
    readingTime:
      typeof data.readingTime === 'number' ? data.readingTime : Math.max(1, Math.round(rt)),
  };

  return { slug, data: frontmatter, content };
}

let cache: BlogPost[] | null = null;

export async function getAllPosts(): Promise<BlogPost[]> {
  if (cache) return cache;
  const entries = await readdir(BLOG_DIR, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && /\.(md|mdx)$/.test(e.name));
  const posts = await Promise.all(
    files.map(async (f) => {
      const slug = f.name.replace(/\.(md|mdx)$/, '');
      const raw = await readFile(join(BLOG_DIR, f.name), 'utf8');
      return parsePost(slug, raw);
    })
  );
  posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  cache = posts;
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function formatBlogDate(date: Date): string {
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
