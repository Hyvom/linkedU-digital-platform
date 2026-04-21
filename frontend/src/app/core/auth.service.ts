import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role') || 'GUEST';
    }
    return 'GUEST';
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /**
   * Helper to determine which API base to use.
   * Prevents students from calling /api/admin endpoints.
   * @param isPublic If true, always uses the /api base regardless of user role.
   */
  getApiUrl(path: string, isPublic: boolean = false): string {
    const role = this.getUserRole();
    const token = this.getToken();
    const isLoggedIn = role !== 'GUEST' && !!token && token !== 'null' && token !== 'undefined';
    
    const pathLower = path.toLowerCase();
    // If the path is for destinations and not admin, it must use the public base
    const isDestinationsPath = pathLower.includes('destinations') && !pathLower.includes('admin');
    
    const base = (role === 'ADMIN' && isLoggedIn && !isPublic && !isDestinationsPath) ? '/api/admin' : '/api';

    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  }
}