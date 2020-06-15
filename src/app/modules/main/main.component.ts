import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../@auth/services/auth.service';
import { UserService } from '../@core';
import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'k-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: any,

    private authService: AuthService,
    private userService: UserService,
    private pageScrollService: PageScrollService
  ) {}

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.queryParams.subscribe(
        params => {
          // console.log('[MainComponent] params', params);
          if (!!params.scrollTo) {
            // Scroll To Top
            setTimeout(() => {
              this.pageScrollService.scroll({
                document: this.document,
                scrollTarget: `.${params.scrollTo}`,
                scrollOffset: 120
              });
              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: {},
                replaceUrl: true
                // queryParamsHandling: 'merge', // remove to replace all query params by provided
              });
            }, 1000);
          }
        },
        err => console.log(err)
      );
    }
  }
  ngOnInit() {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.queryParams.subscribe(
        params => {
          let urlNoParams = this.router.url.split('?')[0] || '';

          if (!!params.login && params.login === 'true') {
            if (!this.userService.getCurrentUser) {
              this.loginByOAuth();
            } else {
              this.location.go(urlNoParams);
            }
          }
        },
        err => console.log(err)
      );
    }
  }

  loginByOAuth() {
    this.authService.autoLogin();
  }
}
