import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';

bootstrapApplication(AppComponent, appConfig).then((ref) => {
    const oidcSecurityService = ref.injector.get(OidcSecurityService);

    oidcSecurityService.checkAuthIncludingServer().subscribe({
        next: (authResult) => {
            console.log('✅ Authentication checked at startup:', authResult);
        },
        error: (err) => {
            console.error('❌ Error during startup auth check:', err);
        }
    });
}).catch((err) => console.error(err));
