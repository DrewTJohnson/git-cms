/**
 * Reads all markdown files in content/pages/ and generates
 * public/content-manifest.json for the public site's navigation.
 *
 * Extracts the first # Heading as the page title.
 * Runs as part of the build step: "node scripts/generate-manifest.js && vite build"
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, "..", "content", "pages");
const publicDir = join(__dirname, "..", "public");
const outputPath = join(publicDir, "content-manifest.json");

function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function slugify(filename) {
  return basename(filename, ".md");
}

// Ensure public/ exists
mkdirSync(publicDir, { recursive: true });

let files;
try {
  files = readdirSync(contentDir).filter((f) => f.endsWith(".md"));
} catch {
  console.warn(
    "No content/pages/ directory found. Creating empty manifest."
  );
  files = [];
}

const pages = files.map((filename) => {
  const slug = slugify(filename);
  const filePath = join(contentDir, filename);
  const content = readFileSync(filePath, "utf-8");
  const title = extractTitle(content) || slug;
  return { slug, title };
});

// Sort: home first, then alphabetically by title
pages.sort((a, b) => {
  if (a.slug === "home") return -1;
  if (b.slug === "home") return 1;
  return a.title.localeCompare(b.title);
});

writeFileSync(outputPath, JSON.stringify(pages, null, 2));
console.log(`Generated content-manifest.json with ${pages.length} page(s):`);
pages.forEach((p) => console.log(`  - ${p.slug}: ${p.title}`));
