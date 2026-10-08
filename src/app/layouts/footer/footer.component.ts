import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@wawjs/ngx-translate';
import { GITHUB_ORG_URL } from '../../feature/catalog/catalog.data';
import { CompanyService } from '../../feature/company/company.service';
import { TrPipe } from '../../shared/translate/tr.pipe';

/** English source text; translated through the dictionary so the footer follows the active language. */
const FOOTER_DESCRIPTION =
	'A framework ecosystem for building reusable 3D applications and games: core packages, game constructors, and generated game projects.';

@Component({
	selector: 'app-footer',
	imports: [RouterLink, TrPipe],
	templateUrl: './footer.component.html',
})
export class FooterComponent {
	private readonly _translateService = inject(TranslateService);

	protected readonly company = inject(CompanyService).company;
	protected readonly currentYear = new Date().getFullYear();
	protected readonly githubUrl = GITHUB_ORG_URL;
	protected readonly pageLinks = [
		{ label: 'Packages', path: '/packages' },
		{ label: 'Constructors', path: '/constructors' },
		{ label: 'Docs', path: '/docs' },
	];
	protected readonly companyDescription = computed(() =>
		this._translateService.translate(FOOTER_DESCRIPTION)(),
	);
}
