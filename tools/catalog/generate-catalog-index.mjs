// Writes src/data/catalog/index.json: the slug and name of every package, constructor and application.
// The routes and the footer need only these, so the initial bundle imports this small file instead of
// the full catalog, which stays in the lazy page chunks. Runs before every build (and with
// `npm run catalog`); edit the catalog, not the output.
//
// Usage: node tools/catalog/generate-catalog-index.mjs

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = async (file) =>
	JSON.parse(await readFile(path.join(rootDir, 'src/data/catalog', file), 'utf8'));
const pick = (items) => items.map(({ slug, name }) => ({ slug, name }));

const index = {
	packages: pick(await readJson('packages.json')),
	constructors: pick(await readJson('constructors.json')),
	applications: pick(await readJson('applications.json')),
};

await writeFile(
	path.join(rootDir, 'src/data/catalog/index.json'),
	`${JSON.stringify(index, null, '\t')}\n`,
);
console.log(
	`index.json: ${index.packages.length} packages, ${index.constructors.length} constructors, ${index.applications.length} applications`,
);
