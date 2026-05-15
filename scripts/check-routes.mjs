import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const contentDir = path.join(repoRoot, 'src', 'content');
const distDir = path.join(repoRoot, 'dist');
const distBlogDir = path.join(distDir, 'blog');
const sitemapPath = path.join(distDir, 'sitemap-0.xml');

const staticRoutes = ['/', '/about/', '/blog/', '/contact/', '/creative-commons/', '/privacy/'];
const siteUrl = 'https://bneuhausz.dev';

function normalizeFrontmatterValue(value) {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function getPostSlugs() {
  const markdownFiles = readdirSync(contentDir).filter((file) => file.endsWith('.md'));
  const slugs = [];

  for (const file of markdownFiles) {
    const filePath = path.join(contentDir, file);
    const content = readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    if (!frontmatterMatch) {
      throw new Error(`Missing frontmatter in ${file}`);
    }

    const slugMatch = frontmatterMatch[1].match(/^slug:\s*(.+)$/m);
    if (!slugMatch) {
      throw new Error(`Missing slug in frontmatter for ${file}`);
    }

    slugs.push(normalizeFrontmatterValue(slugMatch[1]));
  }

  return slugs;
}

function getSitemapUrls() {
  if (!existsSync(sitemapPath)) {
    throw new Error('sitemap-0.xml was not found. Run npm run build first.');
  }

  const sitemap = readFileSync(sitemapPath, 'utf8');
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
}

function check() {
  if (!existsSync(distDir)) {
    throw new Error('dist directory not found. Run npm run build first.');
  }

  const slugs = getPostSlugs();
  const expectedBlogRoutes = slugs.map((slug) => `/blog/${slug}/`);
  const expectedRoutes = [...staticRoutes, ...expectedBlogRoutes];

  const missingBlogFiles = expectedBlogRoutes.filter((route) => {
    const slug = route.replace('/blog/', '').replace(/\/$/, '');
    return !existsSync(path.join(distBlogDir, slug, 'index.html'));
  });

  const blogFolders = readdirSync(distBlogDir).filter((entry) => {
    if (entry === 'index.html') return false;
    const fullPath = path.join(distBlogDir, entry);
    return existsSync(path.join(fullPath, 'index.html'));
  });

  const sitemapUrls = new Set(getSitemapUrls());
  const missingSitemapUrls = expectedRoutes
    .map((route) => `${siteUrl}${route}`)
    .filter((url) => !sitemapUrls.has(url));

  if (missingBlogFiles.length || missingSitemapUrls.length || blogFolders.length !== slugs.length) {
    if (missingBlogFiles.length) {
      console.error('Missing blog route files:');
      missingBlogFiles.forEach((route) => console.error(`  - ${route}`));
    }

    if (missingSitemapUrls.length) {
      console.error('Missing sitemap URLs:');
      missingSitemapUrls.forEach((url) => console.error(`  - ${url}`));
    }

    if (blogFolders.length !== slugs.length) {
      console.error(`Blog route count mismatch: dist has ${blogFolders.length}, content has ${slugs.length}`);
    }

    process.exit(1);
  }

  console.log(`Route parity OK: ${slugs.length} blog posts, ${expectedRoutes.length} total expected routes.`);
}

check();
