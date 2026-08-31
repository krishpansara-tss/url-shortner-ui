import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth.services';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthServices);
  const router = inject(Router);

  // Grant access ONLY if user is logged in AND has ADMIN role
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // If logged in as normal USER -> redirect away from admin panel to /users/urls
  if (authService.isLoggedIn()) {
    alert('Access Denied: The Admin Panel is strictly restricted to ADMIN users only.');
    router.navigate(['/users/urls']);
    return false;
  }

  // If unauthenticated -> redirect to /login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
