import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UtilityService } from '../../Service/UtilityService/utility-service';



export const authInterceptor: HttpInterceptorFn = (initialReq, next) => {

  const router = inject(Router);
   const utilityService   = inject(UtilityService); 

  let req = initialReq;

  // Keep your skip-auth behavior
  if (req.headers.has('skip-auth')) {
    req = req.clone({ headers: req.headers.delete('skip-auth') });
  }

  // Attach token
  const token = sessionStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  // Avoid logout loops on auth APIs
  const isAuthCall = /\/(auth|login|refresh|token|register)\b/i.test(req.url);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (!isAuthCall && (err.status === 401 || err.status === 403)) {
        // Clear auth state and redirect
        sessionStorage.removeItem('token');        // or sessionStorage.clear()
        // Optional: preserve where the user was
        const returnUrl = router.routerState.snapshot.url;
        utilityService.error('Unauthorized access');
        router.navigate(['/authentication/login'], { queryParams: { reason: 'unauthorized', returnUrl } });
      }
      return throwError(() => err);
    })
  );
};
