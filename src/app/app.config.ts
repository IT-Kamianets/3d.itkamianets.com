import {
	APP_INITIALIZER,
	ApplicationConfig,
	mergeApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
	buildAbsoluteUrl,
	buildSeoTitleSuffix,
	provideNgxDefaultSeo,
	stripTitleSuffix,
} from '@wawjs/ngx-default';
import { provideNgxCore } from '@wawjs/ngx-core';
import { ProvideTranslateConfig, provideTranslate } from '@wawjs/ngx-translate';
import { provideNgxUi } from '@wawjs/ngx-ui';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { BootstrapService } from './feature/bootstrap/bootstrap.service';
import { companyProfile } from './feature/company/company.data';

/** Languages for both platforms; the Ukrainian dictionary is added per platform (see below). */
export const translateConfig: ProvideTranslateConfig = {
	defaultLanguage: environment.defaultLanguage,
	languages: environment.languages,
};

const initializeBootstrapData = (bootstrapService: BootstrapService) => () =>
	bootstrapService.initialize();

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideHttpClient(withFetch()),
		provideNgxCore({
			meta: {
				applyFromRoutes: true,
				useTitleSuffix: true,
				defaults: {
					title: stripTitleSuffix(companyProfile.defaultSeo.title, companyProfile.name),
					titleSuffix: buildSeoTitleSuffix(companyProfile),
					description: companyProfile.defaultSeo.description,
					image: buildAbsoluteUrl(
						companyProfile.siteUrl,
						companyProfile.defaultSeo.image,
					),
					robots: companyProfile.defaultSeo.robots,
				},
			},
		}),
		provideNgxDefaultSeo({
			siteUrl: companyProfile.siteUrl,
		}),
		provideNgxUi({
			mode: 'dark',
			roundedTokens: { radius: '0.625rem', radiusPill: '624.9375rem' },
		}),
		provideRouter(
			routes,
			withInMemoryScrolling({
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
			}),
		),
		provideClientHydration(withEventReplay()),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeBootstrapData,
			deps: [BootstrapService],
			multi: true,
		},
	],
};

/**
 * The browser fetches `/i18n/<language>.json` (served from `src/i18n`) before the app hydrates, so the
 * Ukrainian dictionary stays out of the initial bundle. The server bundles it instead
 * (`app.config.server.ts`), so prerendered pages are already Ukrainian.
 */
export const browserConfig = mergeApplicationConfig(appConfig, {
	providers: [provideTranslate(translateConfig)],
});
