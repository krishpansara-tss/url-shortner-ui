import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthServices } from '../services/auth.services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServices);
  const router = inject(Router);
  const token = authService.getToken();

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.removeToken();
        router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
      }
      return throwError(() => error);
    })
  );
};
