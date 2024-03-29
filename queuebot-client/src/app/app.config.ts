import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
export const QUEUEBOT_API_BASE_URL = 'queuebot_api_base_url';
export const WEBSOCKET_URL = 'websocket_url';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    {
      provide: QUEUEBOT_API_BASE_URL,
      useValue: environment.queuebotApiBaseUrl,
    },
    provideAnimations(),
    {
      provide: WEBSOCKET_URL,
      useValue: environment.websocketUrl,
    },
  ],
};
