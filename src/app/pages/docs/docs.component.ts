import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateDirective } from '@wawjs/ngx-translate';
import {
	catalogPackages,
	dependencyLevels,
	GITHUB_ORG_URL,
	repoUrl,
} from '../../feature/catalog/catalog.data';

type DocsPage = 'overview' | 'installation' | 'architecture';

@Component({
	imports: [RouterLink, RouterLinkActive, TranslateDirective],
	templateUrl: './docs.component.html',
})
export class DocsComponent {
	protected readonly page = inject(ActivatedRoute).snapshot.data['page'] as DocsPage;
	protected readonly nav = [
		{ label: 'Overview', path: '/docs' },
		{ label: 'Installation', path: '/docs/installation' },
		{ label: 'Architecture', path: '/docs/architecture' },
	];
	protected readonly orgUrl = GITHUB_ORG_URL;
	protected readonly packages = catalogPackages;
	protected readonly levels = dependencyLevels;
	protected readonly repoUrl = repoUrl;
}
