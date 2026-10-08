import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

// The app is in nextjs/; its Markdown is in ../docs/ and ../notebook/, recordings land in ../_media/, so the repo root is the root for
// Turbopack and for file tracing.
export default {
  async redirects() {
    return [
      // Addresses from before docs/ and notebook/ (2026-10-07).
      { source: "/context/:folder(notebook|dictation)/:path*", destination: "/notebook/:path*", permanent: false },
      { source: "/print/context/:folder(notebook|dictation)/:path*", destination: "/print/notebook/:path*", permanent: false },
      { source: "/context", destination: "/notebook", permanent: false },
      { source: "/guides/:path*", destination: "/docs/course-docs/:path*", permanent: false },
      { source: "/docs/guides/:path*", destination: "/docs/course-docs/:path*", permanent: false },
      { source: "/notetaking-and-workbooks/:path*", destination: "/docs/ai-research/notetaking-and-workbooks/:path*", permanent: false },
      { source: "/ai/:path*", destination: "/docs/ai-research/:path*", permanent: false },
    ];
  },
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.local"],
  turbopack: { root: path.resolve(appRoot, "..") },
  outputFileTracingRoot: path.resolve(appRoot, ".."),
  outputFileTracingIncludes: {
    "/*": ["../docs/**/*", "../notebook/**/*"],
    // The graphics renderer reads its fonts with fs at request time.
    "/api/graphics/render": ["./lib/graphics/fonts/*.ttf"],
  },
};
