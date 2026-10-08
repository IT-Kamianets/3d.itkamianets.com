import type { IconName } from '../../shared/icon/icons';
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
	requirements: string[];
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
	icon: IconName;
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

export interface DependencyLevel {
	level: number;
	packages: CatalogPackage[];
}

/** Groups packages by dependency depth: level 0 has no dependencies, level 1 depends on level 0, and so on. */
export const dependencyLevels: DependencyLevel[] = (() => {
	const levels = new Map<string, number>();
	const levelOf = (slug: string): number => {
		const known = levels.get(slug);
		if (known !== undefined) {
			return known;
		}
		const dependencies = findPackage(slug)?.dependencies ?? [];
		const level = dependencies.length ? Math.max(...dependencies.map(levelOf)) + 1 : 0;
		levels.set(slug, level);
		return level;
	};
	catalogPackages.forEach((item) => levelOf(item.slug));
	const max = Math.max(...levels.values());
	return Array.from({ length: max + 1 }, (_, level) => ({
		level,
		packages: catalogPackages.filter((item) => levels.get(item.slug) === level),
	}));
})();
