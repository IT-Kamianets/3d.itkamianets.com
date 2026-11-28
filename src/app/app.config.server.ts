import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideTranslate } from '@wawjs/ngx-translate';
import uaTranslations from '../i18n/ua.json';
import { appConfig, translateConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
	providers: [
		provideServerRendering(withRoutes(serverRoutes)),
		// Bundled on the server only, so prerendered pages are already in the default language.
		provideTranslate({ ...translateConfig, translations: { ua: uaTranslations, en: {} } }),
	],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
