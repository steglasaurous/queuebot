import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { SettingsService } from './services/settings.service';
import { QueuebotApiService } from './services/queuebot-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const JWT_PUBLIC_KEY = 'jwt_public_key';
export const QUEUEBOT_API_BASE_URL = 'queuebot_api_base_url';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
        provide: JWT_PUBLIC_KEY,
        useValue: environment.jwtPublicKey,
    },
    {
        provide: QUEUEBOT_API_BASE_URL,
        useValue: environment.queuebotApiBaseUrl,
    },
    provideAnimations()
],
};
