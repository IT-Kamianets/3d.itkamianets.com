import type { IconName } from '../../shared/icon/icons';
import constructorsData from '../../../data/catalog/constructors.json';
import packagesData from '../../../data/catalog/packages.json';

export const GITHUB_ORG_URL = 'https://github.com/IT-Kamianets';

export interface CatalogPackage {
	slug: string;
	name: string;
	group: string;
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
	/** Optional SDKs or packages the code supports when present, one sentence each. */
	optional: string[];
	/** The most useful public members (or schema files and fields), with one sentence each. */
	api: { name: string; text: string }[];
	/** A short code sample using the real API (JSON for schemas); empty when there is none. */
	example: string;
}

export interface CatalogConstructor {
	slug: string;
	name: string;
	icon: IconName;
	tagline: string;
	/** The starter repository developers clone to start a game of this style (constructors/ in the workspace). */
	repo: string;
	description: string;
	gameTypes: string[];
	examples: string[];
	/** Engine packages the constructor builds on. */
	packages: string[];
	/** The constructor's own packages (camera, controls, template); empty until it is built. */
	parts: string[];
	features: string[];
}

export interface PackageGroup {
	name: string;
	packages: CatalogPackage[];
}

export const catalogPackages = packagesData as CatalogPackage[];
export const catalogConstructors = constructorsData as CatalogConstructor[];

/** From generic to specific, the same order as the architecture: schemas, then Unity core, then the game kit, then specific, then constructor parts. */
const PACKAGE_GROUP_ORDER = ['Schemas', 'Core', 'Game kit', 'Specific', 'Constructor'];

export const packageGroups: PackageGroup[] = PACKAGE_GROUP_ORDER.map((name) => ({
	name,
	packages: catalogPackages.filter((item) => item.group === name),
})).filter((group) => group.packages.length > 0);

export const repoUrl = (repo: string) => `${GITHUB_ORG_URL}/${repo}`;

export const findPackage = (slug: string) => catalogPackages.find((item) => item.slug === slug);

export const findConstructor = (slug: string) =>
	catalogConstructors.find((item) => item.slug === slug);

/**
 * Game-specific packages a new project starts with, named `<game>-<suffix>` (e.g. `temnorid-arena-core`):
 * the interface first, then the gameplay.
 */
export const GENERATED_PACKAGE_SUFFIXES = ['menus', 'hud', 'core', 'maps'];

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
