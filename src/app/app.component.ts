import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { SwPush, SwUpdate } from "@angular/service-worker";
import { filter } from "rxjs/operators";

import { environment } from "../environments/environment";

import { User } from "./modules/@core/models/user";
import { PushNotificationsService } from "./modules/@core/services/push-notifications.service";
import { UserService } from "./modules/@core/services/user.service";
import { BookmarkBtnService } from "./modules/@shared/services/bookmark-btn.service";
import { BookmarkService } from "./modules/main/services/bookmark.service";

declare let gtag: Function;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  trackingID = "UA-37455490-1";
  currentUserData: User;
  readonly VAPID_PUBLIC_KEY =
    "BHOA3CKDQm81Wjwpr-BfUceN_hPI1YsuK9jTo_k4F1yZ9N4hXUS4YFwn4RzJkevA6BXYGmUfpMojWp0V12duoW8";
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,

    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private pushNotificationsService: PushNotificationsService,
    private userService: UserService,
    private bookmarkBtnService: BookmarkBtnService,
    private bookmarkService: BookmarkService,
    private router: Router
  ) {
    this.currentUserData = this.userService.getCurrentUser;
  }

  ngOnInit(): void {
    // Browser check
    if (isPlatformBrowser(this.platformId)) {
      if (this.swUpdate.isEnabled) {
        console.log("[AppComponent] Service worker is enabled !");
        // setTimeout(() => this.toastrService.success('Service worker is enabled'));
        this.checkForUpdate();

        this.reloadPageAfterHaveNewVerision();

        this.trackingPageView();

        this.webPushNotifications();

        this.handleBookmarkListAfterLoadPage();
      } else {
        console.log("[AppComponent] Service worker is not enabled !");
      }
    }
  }

  reloadPageAfterHaveNewVerision() {
    this.swUpdate.available.subscribe(evt => {
      console.log(
        "[AppComponent] Service worker have a new version available -> Force Reload"
      );
      this.swUpdate.activateUpdate().then(() => window.location.reload());
    });
  }

  checkForUpdate() {
    this.swUpdate
      .checkForUpdate()
      .then(() => {
        // noop
      })
      .catch(err => {
        console.error("[AppComponent] Error when checking for SW update", err);
      });
  }

  trackingPageView() {
    if (environment.production) {
      this.router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe(event => {
          if (event instanceof NavigationEnd) {
            gtag("config", this.trackingID, {
              page_path: event.urlAfterRedirects
            });
          }
        });
    }
  }

  webPushNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => {
        // console.log('[AppComponent] sub', sub);
        // console.log('[AppComponent] endpoint', sub.endpoint);
        this.postSubscription(sub);
        this.pushNotificationsService.listenServiceWorkerMessages();
      })
      .catch(error =>
        console.log(
          "[AppComponent] Could not subscribe to notifications",
          error
        )
      );
  }

  postSubscription(sub: PushSubscription) {
    this.pushNotificationsService.postSubscription(sub).subscribe(data => {
      console.log("[AppComponent] postSubscription data:", data);
    });
  }

  handleBookmarkListAfterLoadPage() {
    if (this.hasBookmarkList()) {
      // this.indexedDbService.connectToIndexedDb();
      this.bookmarkService
        .bookmarkTransformDataStream()
        .subscribe(bookmarkItem => {
          this.bookmarkBtnService.saveDataToIndexedDB({
            ...bookmarkItem,
            type: bookmarkItem.type.replace(/\|.*$/, "")
          });
        });
    } else {
      this.bookmarkBtnService.clearAllBookmarks();
    }
  }

  hasBookmarkList(): boolean {
    return (
      !!this.currentUserData &&
      !!this.currentUserData.bookmark_lists &&
      this.currentUserData.bookmark_lists.length > 0
    );
  }
}
