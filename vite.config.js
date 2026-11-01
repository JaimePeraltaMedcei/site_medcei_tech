import { defineConfig } from 'vite';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const partialsDir = resolve(root, 'partials');
const SKIP = new Set(['node_modules', 'dist', 'public', 'partials', 'src', '.claude', '.taste-skill']);

// Every index.html (plus 404.html) is a page with its own address.
function findPages(dir = root, pages = {}) {
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP.has(name) && !name.startsWith('.')) findPages(full, pages);
    } else if (name === 'index.html' || (dir === root && name === '404.html')) {
      const key = relative(root, full).split(sep).join('/').replace(/(\/)?index\.html$/, '') || 'home';
      pages[key] = full;
    }
  }
  return pages;
}

// <!-- include:name --> is replaced with partials/name.html, so the header,
// footer and closing call to action are written once.
function htmlIncludes() {
  const include = (html, depth = 0) =>
    html.replace(/<!--\s*include:([\w-]+)\s*-->/g, (_, name) => {
      if (depth > 5) throw new Error(`Include loop at ${name}`);
      return include(readFileSync(resolve(partialsDir, `${name}.html`), 'utf8'), depth + 1);
    });

  return {
    name: 'html-includes',
    transformIndexHtml: { order: 'pre', handler: (html) => include(html) },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(partialsDir)) server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [htmlIncludes()],
  server: { port: 5173, strictPort: true },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: { input: findPages() },
  },
});
