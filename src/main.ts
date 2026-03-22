import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from '@sentry/angular';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

Sentry.init({
  dsn: environment.sentryDsn,
  sendDefaultPii: true,
});

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
