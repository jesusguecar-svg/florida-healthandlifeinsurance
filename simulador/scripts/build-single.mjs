/**
 * Inlines the Vite build into one self-contained HTML file, so the simulator can
 * be opened straight from disk or hosted anywhere without a build step.
 *
 *   node scripts/build-single.mjs                  -> dist-single/index.html
 *   node scripts/build-single.mjs --fragment <ruta> -> page body only (sin <html>)
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const args = process.argv.slice(2);
const fragmentIndex = args.indexOf('--fragment');
const fragmentOut = fragmentIndex === -1 ? null : args[fragmentIndex + 1];

const html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');

const cssHref = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"/)?.[1];
const jsSrc = html.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1];
if (!cssHref || !jsSrc) {
  throw new Error('No se encontraron los recursos compilados en dist/index.html');
}

const read = (href) => fs.readFile(path.join(dist, href.replace(/^\//, '')), 'utf8');
const css = await read(cssHref);
const js = await read(jsSrc);

const title =
  html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Simulador de Salud y Vida de Florida';
const description =
  html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '';

const headParts = [
  `<title>${title}</title>`,
  description ? `<meta name="description" content="${description}" />` : '',
  `<style>\n${css}\n</style>`,
].filter(Boolean);

const bodyParts = ['<div id="root"></div>', `<script type="module">\n${js}\n</script>`];

const body = [...headParts, ...bodyParts].join('\n');

if (fragmentOut) {
  await fs.mkdir(path.dirname(path.resolve(fragmentOut)), { recursive: true });
  await fs.writeFile(path.resolve(fragmentOut), `${body}\n`);
  console.log(`Fragmento escrito en ${fragmentOut}`);
} else {
  const outDir = path.join(root, 'dist-single');
  await fs.mkdir(outDir, { recursive: true });
  const page = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${headParts.join('\n')}
  </head>
  <body>
${bodyParts.join('\n')}
  </body>
</html>
`;
  await fs.writeFile(path.join(outDir, 'index.html'), page);
  const kb = Math.round(Buffer.byteLength(page) / 1024);
  console.log(`dist-single/index.html (${kb} kB) listo para abrir en el navegador`);
}
