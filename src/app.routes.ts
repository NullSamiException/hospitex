import { Routes, CanActivateFn, Router } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

// 👇 Protect authenticated routes
const authGuard: CanActivateFn = () => {
    const oidcSecurityService = inject(OidcSecurityService);
    const router = inject(Router);

    return oidcSecurityService.isAuthenticated$.pipe(
        map((isAuthenticated) => {
            if (isAuthenticated) {
                console.log('✅ User is authenticated');
                return true;
            } else {
                console.warn('❌ Not authenticated → redirecting to /auth/login');
                return router.createUrlTree(['/auth/login']);
            }
        })
    );
};

// 👇 Prevent access to /auth/login if already logged in
const loginGuard: CanActivateFn = () => {
    const oidcSecurityService = inject(OidcSecurityService);
    const router = inject(Router);

    return oidcSecurityService.isAuthenticated$.pipe(
        map((isAuthenticated) => {
            if (isAuthenticated) {
                console.log('🔄 Already authenticated → redirecting to /');
                return router.createUrlTree(['/']);
            }
            return true;
        })
    );
};

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', data: { breadcrumb: 'Saas Dashboard' }, loadComponent: () => import('@/pages/dashboard/saasdashboard').then(c => c.SaasDashboard) },
            { path: 'dashboard-sales', data: { breadcrumb: 'Sales Dashboard' }, loadComponent: () => import('@/pages/dashboard/salesdashboard').then(c => c.SalesDashboard) },
            { path: 'uikit', data: { breadcrumb: 'UI Kit' }, loadChildren: () => import('@/pages/uikit/uikit.routes') },
            { path: 'documentation', data: { breadcrumb: 'Documentation' }, loadComponent: () => import('@/pages/documentation/documentation').then(c => c.Documentation) },
            { path: 'pages', data: { breadcrumb: 'Pages' }, loadChildren: () => import('@/pages/pages.routes') },
            { path: 'apps', data: { breadcrumb: 'Apps' }, loadChildren: () => import('./app/apps/apps.routes') },
            { path: 'ecommerce', data: { breadcrumb: 'E-Commerce' }, loadChildren: () => import('@/pages/ecommerce/ecommerce.routes') },
            { path: 'profile', data: { breadcrumb: 'User Management' }, loadChildren: () => import('@/pages/usermanagement/usermanagement.routes') },
        ]
    },
    {
        path: 'auth',
        canActivate: [loginGuard],
        loadChildren: () => import('@/pages/auth/auth.routes')
    },
    { path: 'landing', loadComponent: () => import('@/pages/landing/landing').then(c => c.Landing) },
    { path: 'notfound', loadComponent: () => import('@/pages/notfound/notfound').then(c => c.Notfound) },
    { path: '**', redirectTo: '/notfound' }
];
