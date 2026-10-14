// Writes src/assets/packages.md, served at https://3d.itkamianets.com/packages.md: every public package
// of the engine in one Markdown file, for developers and AI agents choosing packages for a new
// constructor or game. Generated from the same catalog as the website (src/data/catalog), so the
// two never disagree. Runs before every build; edit the catalog, not the output.
//
// Usage: node tools/catalog/generate-packages-md.mjs

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = async (file) => JSON.parse(await readFile(path.join(rootDir, file), 'utf8'));

const packages = await readJson('src/data/catalog/packages.json');
const constructors = await readJson('src/data/catalog/constructors.json');
const company = await readJson('src/data/company/company.json');

const siteUrl = (company.siteUrl || 'https://3d.itkamianets.com').replace(/\/$/, '');
const orgUrl = 'https://github.com/IT-Kamianets';
const bySlug = new Map(packages.map((item) => [item.slug, item]));

const GROUPS = [
	{ name: 'Schemas', text: 'JSON formats with no engine. Not Unity packages: read them, validate against them, or use the Unity package that implements them.' },
	{ name: 'Core', text: 'Unity systems every 3D game needs.' },
	{ name: 'Specific', text: 'Editing tools, devices, platforms and services that only some games need.' },
	{ name: 'Constructor', text: 'The parts of a constructor: its camera, its controls, and a starter project.' },
];

/** Every engine package a package needs, directly or not, ordered so each comes after what it needs. */
const installOrder = (slug) => {
	const order = [];
	const visit = (current) => {
		for (const dependency of bySlug.get(current)?.dependencies ?? []) {
			if (!order.includes(dependency)) {
				visit(dependency);
				order.push(dependency);
			}
		}
	};
	visit(slug);
	return order.filter((item) => bySlug.get(item)?.packageId);
};

const usedBy = (slug) => packages.filter((item) => item.dependencies.includes(slug)).map((item) => item.slug);
const anchor = (slug) => `#${slug.replace(/[^a-z0-9-]/g, '')}`;
const link = (slug) => `[\`${slug}\`](${anchor(slug)})`;
const list = (items) => items.map((item) => `- ${item}`).join('\n');
const gitUrl = (slug) => `${orgUrl}/${slug}.git`;

const kindOf = (item) =>
	item.packageId ? `Unity package \`${item.packageId}\`` : item.group === 'Schemas' ? 'JSON Schema (2020-12)' : 'Unity project';

const packageSection = (item) => {
	const order = installOrder(item.slug);
	// The install order above already covers the catalog's "add its engine packages first" requirement.
	const requirements = item.requirements.filter((text) => !text.startsWith('Add its engine packages first'));
	const users = usedBy(item.slug);
	const install = item.packageId
		? [
				'```text',
				gitUrl(item.slug),
				'```',
				'',
				order.length
					? `Unity does not resolve git dependencies of a git package, so add these first, in this order: ${order.map((slug) => `\`${slug}\``).join(' → ')}.`
					: 'No engine packages to add first.',
				...(requirements.length ? ['', 'Requirements:', '', list(requirements)] : []),
				...(item.optional.length ? ['', 'Optional:', '', list(item.optional)] : []),
			].join('\n')
		: item.install;

	return `### ${item.slug}

${item.summary}

| | |
|---|---|
| Kind | ${kindOf(item)} |
| Version | ${item.version || '-'} |
| Depends on | ${item.dependencies.length ? item.dependencies.map(link).join(', ') : 'nothing'} |
| Used by | ${users.length ? users.map(link).join(', ') : 'nothing in the engine'} |
| Repository | ${orgUrl}/${item.slug} |
| Page | ${siteUrl}/packages/${item.slug} |

**Purpose.** ${item.purpose}

**Usage.** ${item.usage}

**Includes:**

${list(item.current)}
${item.api.length ? `
**API:**

| Member | What it does |
|---|---|
${item.api.map((entry) => `| `${entry.name.replace(/|/g, '\|')}` | ${entry.text} |`).join('
')}
` : ''}${item.example ? `
**Example:**

```${item.group === 'Schemas' ? 'json' : item.packageId ? 'csharp' : 'text'}
${item.example}
```
` : ''}
**Install:**

${install}
`;
};

const constructorSection = (item) => {
	const parts = item.parts.length ? item.parts.map(link).join(', ') : '-';

	return `### ${item.name}

${item.description}

| | |
|---|---|
| Camera | ${item.tagline} |
| Games like | ${item.examples.join(', ')} |
| Engine packages | ${item.packages.map(link).join(', ')} |
| Constructor packages | ${parts} |
| Starter repository | ${orgUrl}/${item.repo} |
| Page | ${siteUrl}/constructors/${item.slug} |
`;
};


const markdown = `# IT Kamianets 3D Engine: packages

Every public package of the IT Kamianets 3D Engine: what it does, what it depends on, and how to install it. Use this file to choose packages for a new constructor or game.

- Website: ${siteUrl}
- Source: ${orgUrl}
- This file: ${siteUrl}/packages.md (generated from the website catalog on every build)

${packages.length} packages: ${GROUPS.map((group) => `${packages.filter((item) => item.group === group.name).length} ${group.name.toLowerCase()}`).join(', ')}. ${constructors.length} constructors.

## How the engine is built

\`\`\`text
schemas            3d-*-schema                JSON, no engine
Unity packages     3d-unity-*                 core systems + specific ones
constructors       3d-constructor-<style>-*   one per camera style
game packages      <game>-*                   e.g. temnorid-arena-core
\`\`\`

Each layer uses only the layers above it in this list. Game rules never go into engine or constructor packages.

## Using packages

**Start a game from a starter repository.** Each constructor has one (\`${orgUrl}/3d-constructor-<style>\`, listed under Constructors). Clone it under your game name; its AGENTS.md walks you or your AI agent through creating the Unity project, the engine packages to add, and what to build first.

**Add a package to an existing Unity project.** In Unity, \`Window › Package Manager › + › Add package from git URL\`, then paste the package's git URL. Add its dependencies first: each package below lists its install order. Pin a version with a tag, e.g. \`${gitUrl('3d-unity-core')}#v0.1.0\`.

**Name your own packages** \`<game>-<part>\`, with the Unity package id \`com.itkamianets.<game>-<part>\`. A new game usually starts with the interface (\`<game>-menus\`, \`<game>-hud\`) and the gameplay (\`<game>-core\`, \`<game>-maps\`). A package that more than one game could use belongs in the engine instead.

**Change an engine package through a pull request**, never by copying it into a game. Clone it inside your game's repository (the starter's \`.gitignore\` ignores \`/3d-*/\`), work on a branch or your fork, point \`Packages/manifest.json\` at \`file:../<package>\` while you work, and open a pull request to the package's \`master\` branch. After the merge, switch back to the git URL pinned to the new tag. Full flow: ${siteUrl}/docs/start-a-game


## Packages at a glance

${GROUPS.map(
	(group) => `### ${group.name}

${group.text}

| Package | What it does | Depends on |
|---|---|---|
${packages
	.filter((item) => item.group === group.name)
	.map((item) => `| ${link(item.slug)} | ${item.summary} | ${item.dependencies.length ? item.dependencies.map((slug) => `\`${slug}\``).join(', ') : '-'} |`)
	.join('\n')}`,
).join('\n\n')}

## Constructors

A constructor is a ready start for one camera style: it adds a camera, controls and a starter project on top of the engine packages.

${constructors.map(constructorSection).join('\n')}
${GROUPS.map(
	(group) => `## ${group.name}

${group.text}

${packages.filter((item) => item.group === group.name).map(packageSection).join('\n')}`,
).join('\n')}`;

await writeFile(path.join(rootDir, 'src/assets/packages.md'), markdown.replace(/\n{3,}/g, '\n\n'));
console.log(`packages.md: ${packages.length} packages, ${constructors.length} constructors`);
