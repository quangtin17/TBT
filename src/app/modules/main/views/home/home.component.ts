import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { filter, map } from 'rxjs/operators';

import { HomeService } from '../../services/home.service';
import {
  UserService,
  MetaService,
  LocalStorageService
} from '../../../@core/services';

import {
  HomeData,
  SpotlightItemData,
  BookmarkItem
} from '../../../@core/models';
import { environment } from '../../../../../environments/environment';
import { BookmarkService } from '../../services/bookmark.service';
import { ImageKit } from '../../../@core/helpers/ImageKit';
@Component({
  selector: 'k-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  preserveWhitespaces: false
})
export class HomeComponent implements OnInit, OnDestroy {
  htmlData: HomeData;
  showMoreCountry: boolean;
  isMobile: boolean;
  listInspiration: SpotlightItemData[];
  currentUserSubscription: Subscription;
  bannerImageSrc: string;

  spotlightTravelInspirations: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private router: Router,
    private titleService: Title,
    private deviceService: DeviceDetectorService,
    private userService: UserService,
    private homeService: HomeService,
    private metaService: MetaService,
    private bookmarkService: BookmarkService,

    private localStorageService: LocalStorageService
  ) {
    this.showMoreCountry = false;
    this.isMobile = this.deviceService.isMobile();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (isPlatformBrowser(this.platformId)) {
      if (!!this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
    }
  }

  ngOnInit() {
    // Handle Oflline Mode
    if (isPlatformBrowser(this.platformId)) {
      const storageHomeData = this.localStorageService.getList(
        environment.StorageHomePageKey
      );
      if (!!storageHomeData) {
        // console.log('[storageHomeData] : ', storageHomeData);

        this.htmlData = JSON.parse(storageHomeData);

        // Set Spotlight
        if (
          this.htmlData.inspirations.list_inspirations &&
          this.htmlData.inspirations.list_inspirations.length > 0
        ) {
          this.spotlightTravelInspirations = this.htmlData.inspirations.list_inspirations[0];
          this.listInspiration = this.htmlData.inspirations.list_inspirations;
        }
      }
    }

    // Call API
    this.homeService.getPageHome().subscribe(rs => {
      if (!!rs.success) {
        // Set HTML
        this.htmlData = rs.data;

        // Set banner image src
        if (rs.data.selectors.banner && rs.data.selectors.banner.banner_format === 'photo') {
          this.bannerImageSrc = rs.data.selectors.banner.gallery[0].img_url.replace('leads.ourbetterworld.org', 'ik.imagekit.io/congtran/tbt' + '/tr:f-' + ImageKit.detectFormatImage());
        }

        // Set Title
        if (!!this.htmlData.title) {
          this.titleService.setTitle(this.htmlData.title);
        }

        // Set Meta Tags
        if (!!this.htmlData.metatags) {
          this.metaService.setMetaTags(this.htmlData.metatags);
        }

        // Set Spotlight
        if (
          this.htmlData.inspirations.list_inspirations &&
          this.htmlData.inspirations.list_inspirations.length > 0
        ) {
          this.spotlightTravelInspirations = this.htmlData.inspirations.list_inspirations[0];
          this.listInspiration = this.htmlData.inspirations.list_inspirations;
          // console.log('listInspiration', this.listInspiration);
        }

        // Update Localstorage
        this.localStorageService.updateList(
          environment.StorageHomePageKey,
          rs.data
        );
        if (isPlatformBrowser(this.platformId)) {
          this.bookmarkService
            .bookmarkTransformDataStream()
            .subscribe(bookmarkItem => {
              this.listInspiration.map(inspiration => {
                if (bookmarkItem.oid === inspiration.id) {
                  inspiration.bookmarked = true;
                }
              });
            });
        }
      }
    });
  }

  onCountrySelected(event) {
    // console.log('[HomeComponent] [onMenuItemSelected] Event: ', event);
    if (event.redirect_the_search_page) {
      this.router.navigate(['/search'], {
        queryParams: { type: 'stories', country: event.id }
      });
    } else {
      this.router.navigate(['/all-countries/', event.alias]);
    }
  }

  /**
   * Funct handle click bookmark button.
   * @param item
   * Output: Change 'bookmarked' status of item.
   */
  bookmark(item: any) {
    // console.log('[Bookmark] item: ', item);
    item.bookmarked = !item.bookmarked;
    // console.log('[Bookmark] Item bookmarked: ', item.bookmarked);
  }
}
