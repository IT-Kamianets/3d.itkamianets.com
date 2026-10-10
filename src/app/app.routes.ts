import { Routes } from '@angular/router';
import { buildRouteMeta } from '@wawjs/ngx-default';
import { catalogConstructors, catalogPackages } from './feature/catalog/catalog.data';
import { companyProfile } from './feature/company/company.data';

const metaFor = (path: string) => ({ meta: buildRouteMeta(companyProfile, path) });

export const routes: Routes = [
	{
		path: '',
		data: {
			meta: {
				...buildRouteMeta(companyProfile, '/'),
				titleSuffix: '',
			},
		},
		loadComponent: () =>
			import('./pages/landing/landing.component').then((m) => m.LandingComponent),
	},
	{
		path: 'packages',
		data: metaFor('/packages'),
		loadComponent: () =>
			import('./pages/packages/packages.component').then((m) => m.PackagesComponent),
	},
	...catalogPackages.map((item) => ({
		path: `packages/${item.slug}`,
		data: { ...metaFor(`/packages/${item.slug}`), slug: item.slug },
		loadComponent: () =>
			import('./pages/package-detail/package-detail.component').then(
				(m) => m.PackageDetailComponent,
			),
	})),
	{
		path: 'constructors',
		data: metaFor('/constructors'),
		loadComponent: () =>
			import('./pages/constructors/constructors.component').then(
				(m) => m.ConstructorsComponent,
			),
	},
	...catalogConstructors.map((item) => ({
		path: `constructors/${item.slug}`,
		data: { ...metaFor(`/constructors/${item.slug}`), slug: item.slug },
		loadComponent: () =>
			import('./pages/constructor-detail/constructor-detail.component').then(
				(m) => m.ConstructorDetailComponent,
			),
	})),
	...[
		{ path: 'docs', page: 'overview' },
		{ path: 'docs/installation', page: 'installation' },
		{ path: 'docs/architecture', page: 'architecture' },
		{ path: 'docs/examples', page: 'examples' },
	].map(({ path, page }) => ({
		path,
		data: { ...metaFor(`/${path}`), page },
		loadComponent: () => import('./pages/docs/docs.component').then((m) => m.DocsComponent),
	})),
	{
		path: 'pitch',
		data: metaFor('/pitch'),
		loadComponent: () => import('./pages/pitch/pitch.component').then((m) => m.PitchComponent),
	},
	{
		path: '**',
		redirectTo: '',
	},
];
