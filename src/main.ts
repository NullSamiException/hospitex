// import { bootstrapApplication } from '@angular/platform-browser';
// import { OidcSecurityService } from 'angular-auth-oidc-client';
// import { AppComponent } from './app.component';
// import { appConfig } from './app.config';

// bootstrapApplication(AppComponent, appConfig)
//     .then((ref) => {
//         const oidcSecurityService = ref.injector.get(OidcSecurityService);

//         oidcSecurityService.checkAuth().subscribe({
//     next: (authResult) => {
//         console.log('✅ Startup Auth Check:', authResult);
//         if (authResult.isAuthenticated) {
//             console.log('🎉 User authenticated, continue to app');
//         } else {
//             console.warn('🔒 Not authenticated → redirecting to login');
//             oidcSecurityService.authorize();
//         }
//     },
//     error: (err) => {
//         console.error('❌ Error during auth check:', err);
//         // oidcSecurityService.logoffAndRevokeTokens().subscribe(() => {
//         //     oidcSecurityService.authorize();
//         // });
//     }
// });

//     })
//     .catch((err) => console.error(err));
import { bootstrapApplication } from '@angular/platform-browser';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig)
    .then((ref) => {
        const oidcSecurityService = ref.injector.get(OidcSecurityService);

        // ✅ Check if the current route is a Cognito callback
        const isAuthCallback = window.location.pathname.includes('/auth/callback');

        if (!isAuthCallback) {
            // ✅ Perform auth check only if not on callback route
            oidcSecurityService.checkAuth().subscribe({
                next: (authResult) => {
                    console.log('✅ Startup Auth Check:', authResult);
                    if (authResult.isAuthenticated) {
                        console.log('🎉 User authenticated, continue to app');
                    } else {
                        console.warn('🔒 Not authenticated → waiting for user to sign in');
                        // 👇 DO NOT auto-redirect to Cognito
                        // Let user click "Sign In" manually
                        // oidcSecurityService.authorize();
                    }
                },
                error: (err) => {
                    console.error('❌ Error during auth check:', err);
                    // 👇 Optional: clear local tokens if there's an error
                    oidcSecurityService.logoffLocal();
                }
            });
        } else {
            console.log('📢 Auth callback detected, processing...');
            // ✅ Callback processing happens in CallbackComponent
        }
    })
    .catch((err) => console.error(err));
