import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService, TranslateDirective, TranslateService } from '@wawjs/ngx-translate';
import { ThemeService } from '@wawjs/ngx-ui';
import type { Language } from '@wawjs/ngx-translate';
import type { AppLanguage } from '../../../environments/environment.prod';
import { GITHUB_ORG_URL } from '../../feature/catalog/catalog.data';
import { CompanyService } from '../../feature/company/company.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
	selector: 'app-topbar',
	imports: [NgOptimizedImage, RouterLink, RouterLinkActive, TranslateDirective, IconComponent],
	templateUrl: './topbar.component.html',
})
export class TopbarComponent {
	private readonly _translateService = inject(TranslateService);
	private readonly _themeService = inject(ThemeService);
	private readonly _languageService = inject(LanguageService);
	private readonly _router = inject(Router);

	protected readonly links = [
		{ label: 'Packages', path: '/packages' },
		{ label: 'Constructors', path: '/constructors' },
		{ label: 'Docs', path: '/docs' },
	];
	protected readonly githubUrl = GITHUB_ORG_URL;
	protected readonly company = inject(CompanyService).company;
	protected readonly activeLanguage = this._languageService.language;
	protected readonly mode = computed(() => this._themeService.mode() ?? 'dark');
	protected readonly languages = computed(() =>
		this._languageService.languages().map((language) => _toAppLanguage(language)),
	);
	protected readonly currentLanguage = computed(() =>
		_toAppLanguage(this._languageService.getLanguage(this.activeLanguage())),
	);
	protected readonly nextLanguage = computed(() => {
		const languages = this.languages();
		const index = languages.findIndex((item) => item.code === this.currentLanguage().code);

		return languages[(index + 1) % languages.length] ?? languages[0]!;
	});
	protected readonly toggleLabel = computed(() => {
		this.activeLanguage();
		return this._translateService.translate(
			this.mode() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
		)();
	});
	protected readonly languageLabel = computed(() => {
		this.activeLanguage();
		return `${this._translateService.translate('Switch language to')()} ${this.nextLanguage().nativeName}`;
	});

	protected toggleMode() {
		this._themeService.setMode(this.mode() === 'dark' ? 'light' : 'dark');
	}

	protected async switchLanguage() {
		await this._translateService.setLanguage(this.nextLanguage().code);
		await this._router.navigateByUrl(this._router.url);
	}
}

function _toAppLanguage(language: Language | undefined): AppLanguage {
	const fallback: AppLanguage = {
		code: 'en',
		name: 'English',
		nativeName: 'English',
		flagSrc: 'flags/united-kingdom.svg',
		htmlLang: 'en',
		population: 0,
	};

	return { ...fallback, ...(language as Partial<AppLanguage> | undefined) };
}
