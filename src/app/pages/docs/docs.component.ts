import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import {  } from '@wawjs/ngx-translate';
import docsData from '../../../data/docs/docs.json';
import { catalogPackages, repoUrl } from '../../feature/catalog/catalog.data';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { DependencyGraphComponent } from '../../shared/dependency-graph/dependency-graph.component';
import { RichPipe, TrPipe } from '../../shared/translate/tr.pipe';

type DocsPage = 'overview' | 'installation' | 'architecture';

type DocBlock =
	| { type: 'p'; text: string }
	| { type: 'ul'; items: string[] }
	| { type: 'ol'; items: string[] }
	| { type: 'links'; items: { label: string; path: string; text: string }[] }
	| { type: 'code'; code: string }
	| { type: 'graph' }
	| { type: 'packages' };

interface DocPageContent {
	title: string;
	lead: string;
	sections: { title: string; blocks: DocBlock[] }[];
}

@Component({
	imports: [
		RouterLink,
		RouterLinkActive,
		CodeBlockComponent,
		DependencyGraphComponent,
		TrPipe,
		RichPipe,
	],
	templateUrl: './docs.component.html',
})
export class DocsComponent {
	protected readonly content = (docsData as Record<DocsPage, DocPageContent>)[
		inject(ActivatedRoute).snapshot.data['page'] as DocsPage
	];
	protected readonly nav = [
		{ label: 'Overview', path: '/docs' },
		{ label: 'Installation', path: '/docs/installation' },
		{ label: 'Architecture', path: '/docs/architecture' },
	];
	protected readonly packages = catalogPackages;
	protected readonly repoUrl = repoUrl;
}
