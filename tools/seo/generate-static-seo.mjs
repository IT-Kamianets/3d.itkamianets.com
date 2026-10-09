import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const outputDirs = [path.join(rootDir, 'dist/app/browser')];

const packages = await readJson('src/data/catalog/packages.json');
const constructors = await readJson('src/data/catalog/constructors.json');

const staticRoutes = [
	'/',
	'/packages',
	...packages.map((item) => `/packages/${item.slug}`),
	'/docs',
	'/docs/installation',
	'/docs/architecture',
	'/docs/examples',
	'/constructors',
	...constructors.map((item) => `/constructors/${item.slug}`),
];

const company = await readJson('src/data/company/company.json');
const siteUrl = trimTrailingSlash(company.siteUrl || 'https://example.com');
const pageSeo = company.pageSeo ?? {};

const routes = staticRoutes.filter((route) => isIndexable(route, pageSeo));
const lastmod = new Date().toISOString().slice(0, 10);

await Promise.all(
	outputDirs.map(async (outputDir) => {
		await mkdir(outputDir, { recursive: true });
		await writeFile(path.join(outputDir, 'sitemap.xml'), buildSitemap(routes, siteUrl, lastmod));
		await writeFile(path.join(outputDir, 'robots.txt'), buildRobots(siteUrl));
		await Promise.all(staticRoutes.map((route) => syncOgUrl(outputDir, route, siteUrl)));
	}),
);

function buildSitemap(routes, siteUrl, lastmod) {
	const urls = routes
		.map(
			(route) => `	<url>
		<loc>${escapeXml(toAbsoluteUrl(siteUrl, route))}</loc>
		<lastmod>${lastmod}</lastmod>
	</url>`,
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** The shared index.html seeds og:url with the home page; point each prerendered page at its own URL. */
async function syncOgUrl(outputDir, route, siteUrl) {
	if (route === '/') {
		return;
	}

	const file = path.join(outputDir, route, 'index.html');
	const html = await readFile(file, 'utf8');
	const url = escapeXml(toAbsoluteUrl(siteUrl, route));
	const updated = html.replace(
		/(<meta\s+property="og:url"\s+content=")[^"]*(")/,
		(_, start, end) => `${start}${url}${end}`,
	);

	if (updated !== html) {
		await writeFile(file, updated);
	}
}

function buildRobots(siteUrl) {
	return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function isIndexable(route, pageSeo) {
	const robots = pageSeo[route]?.robots;

	return typeof robots !== 'string' || !robots.toLowerCase().includes('noindex');
}

async function readJson(relativePath) {
	return JSON.parse(await readFile(path.join(rootDir, relativePath), 'utf8'));
}

function toAbsoluteUrl(siteUrl, route) {
	return `${siteUrl}${route === '/' ? '' : route}`;
}

function trimTrailingSlash(value) {
	return value.endsWith('/') ? value.slice(0, -1) : value;
}

function escapeXml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
