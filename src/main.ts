import { bootstrapApplication } from '@angular/platform-browser';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig)
    .then((ref) => {
        const oidcSecurityService = ref.injector.get(OidcSecurityService);

        oidcSecurityService.checkAuth().subscribe({
    next: (authResult) => {
        console.log('✅ Startup Auth Check:', authResult);
        if (authResult.isAuthenticated) {
            console.log('🎉 User authenticated, continue to app');
        } else {
            console.warn('🔒 Not authenticated → redirecting to login');
            oidcSecurityService.authorize();
        }
    },
    error: (err) => {
        console.error('❌ Error during auth check:', err);
        // oidcSecurityService.logoffAndRevokeTokens().subscribe(() => {
        //     oidcSecurityService.authorize();
        // });
    }
});

    })
    .catch((err) => console.error(err));
