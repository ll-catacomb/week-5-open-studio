import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export const site = {
  title: "AI Lab week 5",
  label: "The Notebook",
  term: "Learning Lab · AI Lab · Fall 2026",
  // The home page's heading and the line under it.
  heading: "The Notebook",
  deck: "Research, notetaking, writing & creating in the age of AI",
};

// Two folders of Markdown at the repo root (beside nextjs/), each at its own address: docs/a/b.md is /docs/a/b. Every
// file is a page, and every folder is a page too, showing its README.md (if any) above a list of what it holds. Names
// starting with "_" or "." are skipped.
// - docs/ is what we prepared: ai-research/ (written with AI, labeled as such on every page), readings/, course-docs/.
// - notebook/ is the student's own work. Dictated and photographed notes are written here.
// The home page shows the two as steps (`step:` in each folder's README), and docs/README.md can set `print_set:`.
const repoRoot = path.join(process.cwd(), "..");
// Keep these paths literal so the deployment traces only the published folders.
export const sources = [
  { mount: "docs", root: path.join(repoRoot, "docs") },
  { mount: "notebook", root: path.join(repoRoot, "notebook") },
];
export const notebookRoot = path.join(repoRoot, "notebook");

function sourceFor(slug) {
  const first = slug.split("/")[0];
  return sources.find((source) => source.mount === first);
}

// Pages under docs/ai-research/ say they were written with AI.
export function isAiGenerated(entry) {
  return entry.slug === "docs/ai-research" || entry.slug.startsWith("docs/ai-research/");
}

// Where an entry lives on disk, as shown on its page: docs/course-docs/how-it-works.md, notebook/.
function sourcePath(slug, kind) {
  return `${slug}${kind === "folder" ? "/" : ".md"}`;
}

// The file behind a /context-media/... address (an image a document embeds), or null if it's outside the two folders.
export function mediaFile(segments) {
  const parts = segments.map((segment) => decodeURIComponent(segment));
  const source = sourceFor(parts.join("/"));
  if (!source) return null;
  const file = path.resolve(source.root, ...parts.slice(1));
  return file.startsWith(source.root + path.sep) ? file : null;
}

function titleFromSlug(slug) {
  return slug
    .replace(/^\d{1,2}[-_](?=\D)/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function hrefFor(slug) {
  return slug ? `/${slug.split("/").map(encodeURIComponent).join("/")}` : "/";
}

function byOrder(a, b) {
  return a.order - b.order || a.title.localeCompare(b.title, undefined, { numeric: true });
}

async function parse(file) {
  const raw = await readFile(/* turbopackIgnore: true */ file, "utf8");
  let data = {};
  let content = raw;
  try {
    ({ data, content } = matter(raw));
  } catch {
    // Frontmatter that isn't valid YAML (Obsidian tolerates it): show the page without it rather than fail the site.
    content = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  }
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return { data, content, heading };
}

async function readFolder(dir, slug, parentTitle) {
  let entries = [];
  try {
    entries = await readdir(/* turbopackIgnore: true */ dir, { withFileTypes: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const readme = entries.find((entry) => entry.isFile() && /^readme\.md$/i.test(entry.name));
  const intro = readme ? await parse(path.join(dir, readme.name)) : { data: {}, content: "", heading: "" };
  const folder = {
    kind: "folder",
    slug,
    dir: slug,
    source: sourcePath(slug, "folder"),
    href: hrefFor(slug),
    title: typeof intro.data.title === "string" ? intro.data.title : intro.heading || titleFromSlug(slug.split("/").pop() || "Home"),
    description: typeof intro.data.description === "string" ? intro.data.description : "",
    eyebrow: typeof intro.data.eyebrow === "string" ? intro.data.eyebrow : parentTitle || "Folder",
    order: number(intro.data.order, 999),
    // A step on the home page (`step: 1`), and the tool its page leads with (`tool: /capture`, `tool_title`, `tool_copy`).
    step: number(intro.data.step, 0),
    subtitle: typeof intro.data.subtitle === "string" ? intro.data.subtitle : "",
    tool: typeof intro.data.tool === "string" ? intro.data.tool : "",
    toolTitle: typeof intro.data.tool_title === "string" ? intro.data.tool_title : "",
    toolCopy: typeof intro.data.tool_copy === "string" ? intro.data.tool_copy : "",
    // Smaller buttons side by side at the top of the folder's page (`tools: [{ href, title, copy }]`), and a heading
    // above the list of what the folder holds (`list_heading: Your notes`).
    tools: Array.isArray(intro.data.tools) ? intro.data.tools.filter((tool) => typeof tool?.href === "string" && typeof tool?.title === "string") : [],
    listHeading: typeof intro.data.list_heading === "string" ? intro.data.list_heading : "",
    content: intro.content,
    data: intro.data,
    docs: [],
    folders: [],
  };

  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".") || entry === readme) continue;
    const childSlug = slug ? `${slug}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      folder.folders.push(await readFolder(path.join(dir, entry.name), childSlug, slug ? folder.title : ""));
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const docSlug = childSlug.slice(0, -3);
    const { data, content, heading } = await parse(path.join(dir, entry.name));
    folder.docs.push({
      kind: "doc",
      slug: docSlug,
      dir: slug,
      source: sourcePath(docSlug, "doc"),
      href: hrefFor(docSlug),
      title: typeof data.title === "string" ? data.title : heading || titleFromSlug(entry.name.slice(0, -3)),
      description: typeof data.description === "string" ? data.description : "",
      eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : slug ? folder.title : "Working document",
      updated: typeof data.updated === "string" ? data.updated : "",
      order: number(data.order, 999),
      content,
      data,
    });
  }

  folder.docs.sort(byOrder);
  folder.folders.sort(byOrder);
  folder.count = folder.docs.length + folder.folders.reduce((sum, child) => sum + child.count, 0);
  return folder;
}

// The home page: the two folders, in the order their READMEs give (`order:`), as one tree.
export async function getRoot() {
  const folders = [];
  for (const source of sources) folders.push(await readFolder(source.root, source.mount, ""));
  folders.sort(byOrder);
  const docs = folders.find((folder) => folder.slug === "docs");
  return {
    kind: "folder", slug: "", dir: "", source: "", href: "/", title: site.heading, description: site.deck, eyebrow: "", order: 0,
    content: "", data: docs?.data || {}, docs: [], folders, count: folders.reduce((sum, folder) => sum + folder.count, 0),
  };
}

function flatten(folder, out = []) {
  if (folder.slug) out.push(folder);
  out.push(...folder.docs);
  for (const child of folder.folders) flatten(child, out);
  return out;
}

export async function getEntries() {
  return flatten(await getRoot());
}

// The entry at a path, the folders above it (for breadcrumbs), and the documents beside it (for the pager).
export async function getEntry(segments) {
  const parts = segments.map((segment) => decodeURIComponent(segment));
  let folder = await getRoot();
  const trail = [];
  for (let i = 0; i < parts.length; i++) {
    const slug = parts.slice(0, i + 1).join("/");
    const last = i === parts.length - 1;
    const child = folder.folders.find((entry) => entry.slug === slug);
    if (child && last) return { entry: child, trail, siblings: [] };
    if (child) {
      trail.push(child);
      folder = child;
      continue;
    }
    const doc = last && folder.docs.find((entry) => entry.slug === slug);
    return doc ? { entry: doc, trail, siblings: folder.docs } : null;
  }
  return null;
}

// Relative links resolve from the linking document's folder, so links written for GitHub or Obsidian work here too.
export function resolveMarkdownHref(href, dir = "") {
  if (!href) return "#";
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const [pathname, hash = ""] = href.split("#");
  let target = path.posix.normalize(path.posix.join(dir, decodeURIComponent(pathname)));
  target = target.replace(/\.md$/i, "").replace(/(?:^|\/)readme$/i, "").replace(/\/$/, "");
  if (target === "." || target.startsWith("..")) target = "";
  return `${hrefFor(target)}${hash ? `#${hash}` : ""}`;
}
