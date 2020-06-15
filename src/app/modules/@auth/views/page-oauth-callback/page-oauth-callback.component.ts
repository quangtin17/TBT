import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../@core/services/user.service';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'k-page-oauth-callback',
  templateUrl: './page-oauth-callback.component.html',
  styleUrls: ['./page-oauth-callback.component.scss']
})
export class PageOAuthCallbackComponent implements OnInit {
  paramCode: string;
  paramState: string;
  returnURL: string;
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.paramCode = params['code'];
        console.log('[PageOAuthCallbackComponent] code: ', this.paramCode); // Print the parameter to the console.
        this.paramState = params['state'];
        console.log('[PageOAuthCallbackComponent] state: ', this.paramState); // Print the parameter to the console.
        this.returnURL = this.localStorage.getItem('ReturnURL');
        // this.checkState();
        this.getAccessToken();
      });
    }
  }

  ngOnInit() {}

  checkState() {
    const OAuth = this.localStorage.getItem('OAuth');
    let stateStr = '';
    if (!!OAuth) {
      let jsonOAuth = JSON.parse(OAuth);
      stateStr = jsonOAuth.stateTimeStamp;
    }
    // else {
    //   stateStr = '7355608';
    // }
    console.log('[checkState] compare State : ', stateStr, this.paramState);

    if (
      (stateStr && this.paramState === stateStr) ||
      this.paramState === '7355608' // Case special
    ) {
      // valid state
      console.log('[checkState] valid !');
      this.getAccessToken();
    } else {
      // redirect to home page if invalid state
      console.log('[checkState] invalid !');
      this.authService.generateState();
    }
    if (!!this.returnURL) {
      this.router.navigateByUrl(this.returnURL);
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  getAccessToken() {
    this.authService.getAccessToken(this.paramCode).subscribe(
      rs => {
        console.log('[getAccessToken] rs: ', rs);
        if (rs.access_token) {
          this.localStorage.setItem(
            `${environment.AccessToken}`,
            rs.access_token
          );
          this.localStorage.setItem(
            `${environment.RefreshToken}`,
            rs.refresh_token
          );
          this.getUser();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getSessionToken() {
    this.authService.getSessionToken().subscribe(
      rs => {
        console.log('[getSessionToken] rs: ', rs);
        this.localStorage.setItem(`${environment.SessionToken}`, rs);
      },
      error => {
        console.log(error);
      }
    );
  }

  getUser() {
    this.authService.getUser().subscribe(
      user => {
        console.log('[getUser] rs: ', user);
        this.getSessionToken();
        if (!!user) {
          this.userService.setAuth(user);
        }
        if (!!this.returnURL) {
          this.router.navigateByUrl(this.returnURL);
        } else {
          this.router.navigateByUrl('/home');
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
