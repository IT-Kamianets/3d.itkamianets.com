import constructorsData from '../../../data/catalog/constructors.json';
import packagesData from '../../../data/catalog/packages.json';

export const GITHUB_ORG_URL = 'https://github.com/IT-Kamianets';

export interface CatalogPackage {
	slug: string;
	name: string;
	group: string;
	status: string;
	summary: string;
	purpose: string;
	dependencies: string[];
	version: string;
	license: string;
	packageId: string;
	install: string;
	usage: string;
	current: string[];
	features: string[];
	examples: string[];
	roadmap: string[];
	related: string[];
}

export interface CatalogConstructor {
	slug: string;
	name: string;
	icon: string;
	tagline: string;
	repo: string;
	description: string;
	gameTypes: string[];
	examples: string[];
	packages: string[];
	features: string[];
}

export interface PackageGroup {
	name: string;
	packages: CatalogPackage[];
}

export const catalogPackages = packagesData as CatalogPackage[];
export const catalogConstructors = constructorsData as CatalogConstructor[];

const PACKAGE_GROUP_ORDER = [
	'Core',
	'Scene',
	'Assets',
	'Interaction',
	'XR',
	'Spatial',
	'Engine integrations',
	'Utilities',
];

export const packageGroups: PackageGroup[] = PACKAGE_GROUP_ORDER.map((name) => ({
	name,
	packages: catalogPackages.filter((item) => item.group === name),
})).filter((group) => group.packages.length > 0);

export const repoUrl = (repo: string) => `${GITHUB_ORG_URL}/${repo}`;

export const findPackage = (slug: string) => catalogPackages.find((item) => item.slug === slug);

export const findConstructor = (slug: string) =>
	catalogConstructors.find((item) => item.slug === slug);

/** Game-specific package names a generated project would contain, e.g. `game-<name>-core`. */
export const GENERATED_PACKAGE_SUFFIXES = ['core', 'world', 'units', 'ui'];
