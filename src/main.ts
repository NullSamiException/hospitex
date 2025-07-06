import { bootstrapApplication } from '@angular/platform-browser';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig)
    .then((ref) => {
        const oidcSecurityService = ref.injector.get(OidcSecurityService);

        oidcSecurityService.checkAuthIncludingServer().subscribe({
            next: (authResult) => {
                console.log('✅ Authentication checked at startup:', authResult);
                if (!authResult.isAuthenticated) {
                    console.warn('🔒 Not authenticated → redirecting to login');
                    oidcSecurityService.authorize();
                }
            },
            error: (err) => {
                console.error('❌ Error during startup auth check:', err);

                if (err.message?.includes('no refresh token')) {
                    console.warn('🔄 No refresh token → forcing login');
                    oidcSecurityService.logoffAndRevokeTokens().subscribe(() => {
                        oidcSecurityService.authorize();
                    });
                }
            }
        });
    })
    .catch((err) => console.error(err));
