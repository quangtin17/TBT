import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  TransferState,
  makeStateKey,
  StateKey
} from '@angular/platform-browser';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import {
  map,
  catchError,
  finalize,
  switchMap,
  filter,
  take,
  tap
} from 'rxjs/operators';

import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { environment } from '../../../../environments/environment';

import { NgxSpinnerService } from 'ngx-spinner';
import { ShareGroupService } from '../../@shared/services/share-group.service';
import { DialogsService } from '../../@shared/services/dialogs.service';

import { AuthService } from '../../@auth/services/auth.service';
import { UserService } from '../../@core/services/user.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  keyRequestUrl: StateKey<string>;
  constructor(
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState,
    private shareGroupService: ShareGroupService,
    private dialogService: DialogsService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show(); // show Spinner

    if (
      !request.url.includes(environment.APIEndpointForum) &&
      !request.url.includes(environment.APIEndpointIpAddress)
    ) {
      // add access token
      const token: string = this.localStorage.getItem(
        `${environment.AccessToken}`
      );
      if (!!token) {
        request = this.addTokenToRequest(request, token, 'Authorization');
      }
      // add session token
      const sessionToken: string = this.localStorage.getItem(
        `${environment.SessionToken}`
      );
      if (!!sessionToken) {
        request = this.addTokenToRequest(request, sessionToken, 'X-CSRF-Token');
      }

      // add roles header
      const rolesStr = this.localStorage.getItem(`${environment.RolesKey}`);
      if (!!rolesStr) {
        // console.log('roles: ', rolesStr);
        const roles = JSON.parse(rolesStr);
        request = this.addTokenToRequest(
          request,
          roles.toString(),
          `${environment.HeaderRolesKey}`
        );
      }
    }

    // this.keyRequestUrl = makeStateKey<string>(request.url);
    // // transferState
    // if (isPlatformServer(this.platformId)) {
    //   // Case Server Render
    //   console.log('[Server Render]');
    //   return this.intercreptorHandler(request, next);
    // } else {
    //   // Case Browser Render
    //   console.log('[Browser Render]');
    //   const storedResponse = this.transferState.get<any>(
    //     this.keyRequestUrl,
    //     null
    //   ); // get stored respsonse
    //   if (!!storedResponse) {
    //     // have a stored res
    //     console.log('Have a stored respsonse !!!: ', this.keyRequestUrl);
    //     const response = new HttpResponse({
    //       body: storedResponse,
    //       status: 200
    //     });
    //     this.transferState.remove(this.keyRequestUrl);

    //     // Set share toggle
    //     if (!!storedResponse.data && !!storedResponse.data.share) {
    //       console.log('storedResponse [Share]:', storedResponse.data.share);
    //       this.shareGroupService.setHiddenStatus(storedResponse.data.share);
    //     }
    //     this.spinner.hide(); // hide spinner

    //     return of(response);
    //   } else {
    //     return this.intercreptorHandler(request, next);
    //   }
    // }

    return this.intercreptorHandler(request, next);
  }

  private intercreptorHandler(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.spinner.hide(); // hide spinner

          if (!!event.body) {
            //// transferState
            // this.transferState.set(this.keyRequestUrl, event.body);
            // console.log('intercreptorHandler [URL]:', this.keyRequestUrl);
            // console.log('intercreptorHandler [event.body]:', event.body);

            // Set share toggle
            if (event.body.data) {
              if ('share' in event.body.data) {
                // console.log(
                //   'intercreptorHandler [Share]:',
                //   event.body.data.share
                // );
                this.shareGroupService.setHiddenStatus(event.body.data.share);
              }
            }
          }
        }
        return event;
      }),
      catchError((rs: HttpErrorResponse) => {
        this.spinner.hide(); // hide spinner
        // console.log('[Interceptor CatchError] : ', rs);

        // Get Message
        let errorMsg = '';
        if (!!rs.message) {
          errorMsg = rs.message;
        }
        if (!!rs.error && rs.error.message) {
          errorMsg = rs.error.message;
        }
        switch (rs.status) {
          case 422:
            this.dialogService.setAccountExistsMessage(rs.error.message);
            return throwError(rs);
          case 401:
            console.log('[Unauthorized] error 401');
            return this.handle401Error(request, next);
          // return throwError(rs);
          case 403:
            console.log('[Forbidden] error 403 -> cleanAuth !!!');

            this.userService.cleanAuth(); // Clean Current User
            return throwError(rs);
          default:
            // handle the error
            console.log('HttpErrorResponse', errorMsg, rs);
            return throwError(rs);
        }
      })
    );
  }

  private addTokenToRequest(
    request: HttpRequest<any>,
    token: string,
    key: string
  ): HttpRequest<any> {
    switch (key) {
      case 'Authorization':
        return request.clone({
          headers: request.headers.set(key, 'Bearer ' + token)
        });
      default:
        return request.clone({
          headers: request.headers.set(key, token)
        });
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    // Check if any isRefreshingToken request is calling
    if (!this.isRefreshingToken) {
      console.log('[handle401Error] Not isRefreshing ');

      this.isRefreshingToken = true; // set flag to true

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      const token: string = this.localStorage.getItem(
        `${environment.RefreshToken}`
      );
      console.log('[handle401Error] RefreshToken: ', token);

      if (!!token) {
        console.log(
          '[handle401Error] Have token -> Invoke authService.refreshToken'
        );
        return this.authService.refreshToken(token).pipe(
          switchMap((user: any) => {
            if (!!user) {
              console.log('[handle401Error] refreshToken user:', user);
              this.tokenSubject.next(user.access_token);
              this.localStorage.setItem(
                `${environment.AccessToken}`,
                user.access_token
              );
              this.localStorage.setItem(
                `${environment.RefreshToken}`,
                user.refresh_token
              );
              return next.handle(
                this.addTokenToRequest(
                  request,
                  user.access_token,
                  'Authorization'
                )
              );
            }
          }),
          catchError(err => {
            console.log('[handle401Error] catchError', err);
            this.userService.cleanAuth();
            this.authService.autoLogin();
            return throwError(err);
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
      } else {
        // no token to refresh
        console.log('[handle401Error] no token -> logout and login again');
        this.userService.cleanAuth();
        this.authService.autoLogin();
      }
    } else {
      console.log('[handle401Error] isRefreshing ');

      this.isRefreshingToken = false;
      console.log('isRefreshingToken done ');

      return this.tokenSubject.pipe(
        switchMap(token => {
          if (!!token) {
            console.log(`isRefreshingToken done with ${token}`);
            return next.handle(
              this.addTokenToRequest(request, token, 'Authorization')
            );
          } else {
            console.log(`isRefreshingToken fail - logout`);
            this.userService.cleanAuth();
            this.authService.autoLogin();
          }
        })
      );
    }
  }
}
