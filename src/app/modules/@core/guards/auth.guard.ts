import { Injectable, Inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { PLATFORM_ID } from '@angular/core';

import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../../@auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    let isAuthenticated = this.userService.isAuthenticatedUser;
    if (!!isAuthenticated) {
      console.log('[is Authen] : ', isAuthenticated);
      return true;
    } else {
      console.log('access denied!');
      this.authService.autoLogin();

      return false;
    }
  }
}
