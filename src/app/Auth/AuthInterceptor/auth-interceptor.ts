import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[AuthInterceptor] Intercepting request:', req.url);
  if (req.headers.has('skip-auth')) {
    const newHeaders = req.headers.delete('skip-auth');
    const modifiedReq = req.clone({ headers: newHeaders });
    console.log('[Interceptor] Skipping Auth:', modifiedReq.url);
    return next(modifiedReq);
  }

  const token = sessionStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[Interceptor] Adding token:', authReq);
    return next(authReq);
  }

  return next(req);
};
