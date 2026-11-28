import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { browserConfig } from './app/app.config';

bootstrapApplication(App, browserConfig).catch((err) => {
	console.error(err);
});
