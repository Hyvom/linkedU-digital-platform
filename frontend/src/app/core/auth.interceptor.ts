import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Intercepts all HTTP requests to add the JWT token to the Authorization header.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const token = isPlatformBrowser(platformId) ? localStorage.getItem('token') : null;

  // Define routes that should NEVER have an Authorization header
  const url = req.url.toLowerCase();
  const isPublicRoute = 
    url.includes('/api/auth/') || 
    url.includes('recommendation-ml-model') ||
    (url.includes('/api/destinations') && !url.includes('/api/admin/')) ||
    url.includes('/public/');

  /**
   * Only attach the token if:
   * 1. A token actually exists and isn't a stringified null value
   * 2. The route isn't explicitly marked as public
   */
  const hasValidToken = token && token.trim() !== '' && token !== 'null' && token !== 'undefined';

  if (hasValidToken && !isPublicRoute) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};