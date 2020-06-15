import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

import { ApiService } from '../../@core/services/api.service';
import { environment } from '../../../../environments/environment';
import { ResponseType } from '@angular/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public OAuthURL: string;
  public SignUpURL: string;
  isBrowser: boolean;
  constructor(
    private router: Router,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: any,
    private APIService: ApiService
  ) {
    // Check if Browser
    if (isPlatformBrowser(this.platformId)) {
      // this.generateState();
      this.gerenerateOAuthRedirectUrl();
    }
  }

  get getOAuthURL(): string {
    return this.OAuthURL;
  }

  gerenerateOAuthRedirectUrl() {
    let str = '?';

    // let stateStr: string;
    // const OAuth = this.localStorage.getItem('OAuth');
    // if (!!OAuth) {
    //   let jsonOAuth = JSON.parse(OAuth);
    //   stateStr = jsonOAuth.stateTimeStamp;
    // } else {
    //   stateStr = '123';
    // }

    const OAuthConfig = {
      ...environment.OAuth2.configClient,
      redirect_uri:
        this.window.location.origin + environment.OAuth2.RedirectRoute,
      response_type: 'code',
      scope: ''
      // state: stateStr // current State string
    };
    // console.log('[gerenerateOAuthRedirectUrl] state: ', stateStr);
    for (const key in OAuthConfig) {
      if (OAuthConfig.hasOwnProperty(key)) {
        str += `${key}=${OAuthConfig[key]}&`;
      }
    }

    this.OAuthURL =
      environment.OAuth2.AuthorizeEndpoint + encodeURIComponent(str);
  }

  generateState() {
    const stamp = new Date().getTime().toString();
    const currentTimeStamp = parseInt(stamp, 10);
    const expiredTimeStamp = currentTimeStamp + 3600000; // 1 hour
    const OAuth = this.localStorage.getItem('OAuth');

    const newOAuth = {
      stateTimeStamp: currentTimeStamp.toString(),
      expire: expiredTimeStamp.toString()
    };
    if (!OAuth) {
      // Not Existed -> Create
      this.localStorage.setItem('OAuth', JSON.stringify(newOAuth));
      // console.log('[generateState] Not Existed -> Create: ', newOAuth);
    } else {
      // Existed -> Check Expired
      const currentExpired = parseInt(OAuth.expire, 10);
      if (currentTimeStamp >= currentExpired) {
        // Expired -> Create New
        this.localStorage.setItem('OAuth', JSON.stringify(newOAuth));
        // console.log('[generateState] Expired -> Create: ', newOAuth);
      }
    }
  }

  getAccessToken(paramCode: string) {
    const tokenConfig = {
      ...environment.OAuth2.configClient,
      redirect_uri: window.location.origin + environment.OAuth2.RedirectRoute,
      grant_type: environment.OAuth2.AccessTokenGrantType,
      code: paramCode
    };
    // console.log('[getAccessToken] FormData: ', tokenConfig);

    const formData: FormData = new FormData();
    for (const key in tokenConfig) {
      if (tokenConfig.hasOwnProperty(key)) {
        formData.append(key, tokenConfig[key]);
      }
    }

    return this.APIService.POST_FORM_DATA(
      `${environment.OAuth2.TokenEndpoint}`,
      formData
    );
  }

  getUser() {
    return this.APIService.GET(`${environment.OAuth2.UserEndpoint}`);
  }

  getSessionToken() {
    const path = `${environment.APIEndpointOBWStg}${environment.APISessionToken}`;
    return this.APIService.GETTEXT(path);
  }

  refreshToken(token) {
    const tokenConfig = {
      ...environment.OAuth2.configClient,
      redirect_uri: window.location.origin + environment.OAuth2.RedirectRoute,
      grant_type: environment.OAuth2.RefreshTokenGrantType,
      refresh_token: token
    };
    // console.log('[getrefreshToken] FormData: ', tokenConfig);

    const formData: FormData = new FormData();
    for (const key in tokenConfig) {
      if (tokenConfig.hasOwnProperty(key)) {
        formData.append(key, tokenConfig[key]);
      }
    }

    return this.APIService.POST_FORM_DATA(
      `${environment.OAuth2.TokenEndpoint}`,
      formData
    ).pipe(
      map(rs => {
        if (!!rs && rs.access_token) {
          // console.log(`[getrefreshToken] ${token} rs:`, rs);
          this.localStorage.setItem(
            `${environment.AccessToken}`,
            rs.access_token
          );
          this.localStorage.setItem(
            `${environment.RefreshToken}`,
            rs.refresh_token
          );
          return rs;
        }
      })
    );
  }

  autoLogin(paramObj: Object = {}) {
    // check is Browser
    // console.log('[Auth Service] Auto Login, and return to: ', this.router.url);

    // Remove empty params
    Object.keys(paramObj).forEach(
      key =>
        (paramObj[key] == null || paramObj[key].length == 0) &&
        delete paramObj[key]
    );
    let paramStr = '';
    for (const key in paramObj) {
      if (paramObj.hasOwnProperty(key)) {
        paramStr += `${key}=${paramObj[key]}&`;
      }
    }
    // console.log('[Auth Service] paramStr: ', paramStr);

    if (isPlatformBrowser(this.platformId)) {
      if (paramStr) {
        if (this.router.url.indexOf('?') > -1) {
          this.localStorage.setItem(
            'ReturnURL',
            this.router.url + '&' + paramStr
          );
        } else {
          this.localStorage.setItem(
            'ReturnURL',
            this.router.url + '?' + paramStr
          );
        }
      } else {
        this.localStorage.setItem('ReturnURL', this.router.url);
      }
      if (!!this.OAuthURL) {
        let title = document.title.toString().replace('’', "'"); // fix case title contain (’) character
        let str = `path=${this.window.location.pathname}&title=${title}&src=tbt&`;
        // let encode = encodeURIComponent(str);
        // console.log('[Auth Service]autoLogin, encode: ', encode);

        this.window.location.href =
          this.OAuthURL +
          encodeURIComponent(str) +
          encodeURIComponent(paramStr);
      }
    }
  }

  autoRegister() {
    // check is Browser
    console.log(
      '[Auth Service] Auto Register, and return to: ',
      this.router.url
    );

    if (isPlatformBrowser(this.platformId)) {
      this.localStorage.setItem('ReturnURL', this.router.url);
      this.window.open(
        environment.APIEndpointOBWStg +
          '/user/register?schema=' +
          this.window.location.protocol +
          '&domain=' +
          this.window.location.host +
          '&path=' +
          this.window.location.pathname +
          '&title=' +
          this.window.document.title +
          '&client_id=' +
          environment.OAuth2.configClient.client_id +
          '&client_secret=' +
          environment.OAuth2.configClient.client_secret +
          '&src=tbt&come_back=true#',
        '_blank'
      );
    }
  }
}
