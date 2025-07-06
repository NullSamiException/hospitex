import { provideAuth } from 'angular-auth-oidc-client';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch()),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        provideAnimations(),
        provideAuth({
            config: {
                authority: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_DVT3Zga6h',
                clientId: '294jljvu34snu0nd4cm8fqf9bu',
                redirectUrl: 'http://localhost:4200/',
                responseType: 'code',
                useRefreshToken: true,
                scope: 'openid email phone'
            }
        })
    ]
};
