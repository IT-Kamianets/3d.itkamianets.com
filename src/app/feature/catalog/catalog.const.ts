import indexData from '../../../data/catalog/index.json';

export const GITHUB_ORG_URL = 'https://github.com/IT-Kamianets';
/** This website's own repository. */
export const SITE_REPO_URL = `${GITHUB_ORG_URL}/3d.itkamianets.com`;

export const repoUrl = (repo: string) => `${GITHUB_ORG_URL}/${repo}`;

/** A catalog entry as the routes and the footer need it. */
export interface CatalogLink {
	slug: string;
	name: string;
}

/**
 * Slugs and names only, generated from the catalog by `tools/catalog/generate-catalog-index.mjs`.
 * The routes and the footer are in the initial bundle, so they read this small file; the full
 * catalog (`catalog.data.ts`) stays in the lazy page chunks.
 */
export const catalogIndex: {
	packages: CatalogLink[];
	constructors: CatalogLink[];
	applications: CatalogLink[];
} = indexData;
