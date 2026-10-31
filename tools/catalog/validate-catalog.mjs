import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const packages = await json(path.join(root, 'src/data/catalog/packages.json'));
const constructors = await json(path.join(root, 'src/data/catalog/constructors.json'));
const docs = await json(path.join(root, 'src/data/docs/docs.json'));
const bySlug = new Map(packages.map((item) => [item.slug, item]));
assert.equal(bySlug.size, packages.length, 'Duplicate package slug');
assert.equal(new Set(constructors.map((item) => item.slug)).size, constructors.length);
const closure = (slug, visiting = new Set()) => {
	assert(bySlug.has(slug), `Unknown package: ${slug}`);
	assert(!visiting.has(slug), `Dependency cycle at ${slug}`);
	const next = new Set(visiting).add(slug);
	return new Set([
		slug,
		...bySlug.get(slug).dependencies.flatMap((dep) => [...closure(dep, next)]),
	]);
};
for (const item of packages) {
	assert(
		/^3d-(unity-|constructor-|[a-z]+-schema$)/.test(item.slug),
		`Non-framework package: ${item.slug}`,
	);
	assert(
		!item.packageId || item.packageId === `com.itkamianets.${item.slug}`,
		`Invalid package ID: ${item.slug}`,
	);
	closure(item.slug);
	for (const slug of item.related) assert(bySlug.has(slug), `Broken related link: ${slug}`);
}
for (const item of constructors) {
	assert(/^3d-constructor-/.test(item.repo));
	for (const slug of [...item.parts, ...item.packages])
		assert(bySlug.has(slug), `Broken constructor reference: ${slug}`);
}
for (const page of Object.values(docs)) {
	const ids = page.sections.map((section) =>
		section.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, ''),
	);
	assert.equal(new Set(ids).size, ids.length, `Duplicate section anchor: ${page.title}`);
	for (const block of page.sections.flatMap((section) => section.blocks)) {
		if (block.type === 'manifest')
			block.packages.forEach((slug) => {
				assert(bySlug.get(slug)?.packageId, `Not an installable package: ${slug}`);
				closure(slug);
			});
	}
}
async function* files(directory) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory() && !['.git', 'Library', 'node_modules'].includes(entry.name))
			yield* files(file);
		else if (entry.isFile()) yield file;
	}
}
for await (const file of files(path.join(root, 'src'))) {
	if (/\.(json|ts|html|md)$/.test(file)) {
		assert(
			!/temnorid-[a-z0-9-]+/i.test(await readFile(file, 'utf8')),
			`Game package identifier on framework site: ${file}`,
		);
	}
}
const argument = (name) => {
	const index = process.argv.indexOf(name);
	if (index < 0) return null;
	assert(
		process.argv[index + 1] && !process.argv[index + 1].startsWith('--'),
		`Missing value for ${name}`,
	);
	return path.resolve(process.argv[index + 1]);
};
const workspace = argument('--workspace');
if (workspace) {
	let projects = 0;
	const used = new Set();
	for (const entry of await readdir(workspace, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		let manifest;
		try {
			manifest = await json(path.join(workspace, entry.name, 'Packages/manifest.json'));
		} catch (error) {
			if (error.code === 'ENOENT') continue;
			throw error;
		}
		projects++;
		for (const id of Object.keys(manifest.dependencies)) {
			if (!id.startsWith('com.itkamianets.3d-')) continue;
			const slug = id.slice('com.itkamianets.'.length);
			assert(
				bySlug.get(slug)?.packageId === id,
				`Missing framework dependency in ${entry.name}: ${id}`,
			);
			used.add(slug);
		}
	}
	console.log(`Workspace: ${projects} Unity projects, ${used.size} framework packages covered`);
}
const sources = argument('--sources');
if (sources) {
	let checked = 0;
	const assemblies = new Map();
	const references = [];
	for (const item of packages.filter((item) => item.packageId)) {
		const directory = path.join(sources, item.slug);
		const source = await json(path.join(directory, 'package.json'));
		assert.equal(source.name, item.packageId);
		assert.equal(source.version, item.version, `Stale version: ${item.slug}`);
		checked++;
		for await (const file of files(directory)) {
			if (!file.endsWith('.asmdef')) continue;
			const assembly = await json(file);
			if (
				assembly.includePlatforms?.includes('Editor') ||
				/[\\/](Tests|Editor)[\\/]/i.test(file)
			)
				continue;
			assemblies.set(assembly.name, item.slug);
			references.push({ slug: item.slug, refs: assembly.references ?? [] });
		}
	}
	for (const { slug, refs } of references) {
		for (const ref of refs) {
			const dependency = assemblies.get(ref);
			if (dependency && dependency !== slug)
				assert(
					closure(slug).has(dependency),
					`Missing assembly dependency: ${slug} -> ${dependency}`,
				);
		}
	}
	console.log(
		`Sources: ${checked} Unity package versions and named runtime assembly references checked`,
	);
}
console.log(
	`Catalog valid: ${packages.length} framework packages, ${constructors.length} constructors, ${Object.keys(docs).length} documentation pages`,
);
