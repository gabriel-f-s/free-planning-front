import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService} from './auth.service';
import {jwtDecode, JwtPayload} from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    const decoded: JwtPayload = jwtDecode(token);
    // @ts-ignore
    const expireDateInMs: number = decoded.exp * 1000;
    const actualMoment: number = Date.now();

    if (actualMoment > expireDateInMs) {
      authService.removeToken();
      router.navigate(['/auth/login']);
      return false;
    }

    return true;
  } catch (e) {
    authService.removeToken();
    router.navigate(['/auth/login']);
    return false;
  }

};
