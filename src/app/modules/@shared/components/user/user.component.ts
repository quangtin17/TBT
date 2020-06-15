import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { UserService } from '../../../@core/services';
import { AuthService } from '../../../@auth/services/auth.service';

import { User } from '../../../@core/models';
import { environment } from '../../../../../environments/environment';
import { NavigationEnd, Router, Event, NavigationStart } from '@angular/router';
@Component({
  selector: 'k-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  currentUserSubscription: Subscription;
  user: User;
  openUserPanel: boolean;
  OAuthURL: string;
  @HostListener('document:click', ['$event'])
  onClickOutside(event) {
    if (
      !this.elementRef.nativeElement.contains(event.target) &&
      this.openUserPanel
    ) {
      this.openUserPanel = false;
    }
  }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.openUserPanel = false;

    // this.router.events.subscribe((event: Event) => {
    //   if (
    //     event instanceof NavigationStart &&
    //     isPlatformBrowser(this.platformId)
    //   ) {
    //     console.log('[UserComponent] change route');

    //     this.openUserPanel = false;
    //   }
    // });
  }

  ngOnInit(): void {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      // Assign Subscription to watch userService.currentUser value.
      this.currentUserSubscription = this.userService.currentUser.subscribe(
        rs => {
          this.user = rs;
          // console.log('[UserComponent] user: ', this.user);
        }
      );
      this.OAuthURL = this.authService.OAuthURL || ''; // Get OAuth from service
    }
  }

  ngOnDestroy(): void {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      // Unsubscribe for
      this.currentUserSubscription.unsubscribe();
    }
  }

  /**
   * Funct handle click on User Button
   * On Mobile: Redirect to Login page
   */
  clickUserBtn() {
    this.authService.autoLogin();
  }
  clickUserControl() {
    this.openUserPanel = !this.openUserPanel;
  }

  clickLogout() {
    this.userService.logout().subscribe(
      rs => {
        console.log('log out data: ', rs);
        if (!!rs.success) {
          this.userService.cleanAuth();
        }
      },
      error => {
        console.log('Cannot post log out to server, so just clean auth');
        this.userService.cleanAuth();
      }
    );
  }
  clickMyAccountSettingBtn() {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      this.window.open(
        environment.APIEndpointOBWStg + '/user/' + this.user.id + '/settings',
        '_blank'
      );
    }
  }

  clickLoginBtn() {
    // check is Browser
    this.authService.autoLogin();
  }

  clickRegisterBtn() {
    this.authService.autoRegister();
  }
}
