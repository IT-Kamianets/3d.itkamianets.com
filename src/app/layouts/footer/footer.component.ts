import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { GITHUB_ORG_URL } from '../../feature/catalog/catalog.data';
import { CompanyService } from '../../feature/company/company.service';

@Component({
	selector: 'app-footer',
	imports: [RouterLink, TranslateDirective],
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
		this._translateService.translate(this.company().description)(),
	);
}
