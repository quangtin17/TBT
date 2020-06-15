import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  MetaService,
  LocalStorageService,
  IndexedDbService,
  ConnectionService
} from '../../../@core/services';
import { WeekendOfGoodService } from '../../services/weekend-of-good.service';
import { SpotlightItemData } from '../../../@core/models';
import { environment } from '../../../../../environments/environment';
import { BookmarkService } from '../../services/bookmark.service';
import { StoryService } from '../../services/story.service';

@Component({
  selector: 'k-weekend-of-good',
  templateUrl: './weekend-of-good.component.html',
  styleUrls: ['./weekend-of-good.component.scss']
})
export class WeekendOfGoodComponent implements OnInit, OnDestroy {
  alias: string;
  htmlData: any;
  spotlightData: SpotlightItemData;
  currentUserSubscription: Subscription;
  currentUserData: any;
  wogConnectSub: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,

    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: MetaService,
    private localStorageService: LocalStorageService,
    private weekendOfGoodService: WeekendOfGoodService,
    private indexedDbService: IndexedDbService,
    private connectionService: ConnectionService,
    private bookmarkService: BookmarkService,
    private storyService: StoryService
  ) {
    this.spotlightData = new SpotlightItemData();
    this.spotlightData.bookmarked = false;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.wogConnectSub = this.connectionService
        .createOnline()
        .subscribe(isOnline => {
          this.activatedRoute.paramMap.subscribe(
            params => {
              this.alias = `${params.get('alias')}`;
              console.log('[WeekendOfGoodComponent] is online', isOnline);
              if (!isOnline) {
                this.indexedDbService
                  .getItem(this.alias)
                  .subscribe(response => {
                    this.htmlData = response;
                  });
              } else {
                this.getWeekendDataByAlias(this.alias);
              }
            },
            err => console.log(err)
          );
        });
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (isPlatformBrowser(this.platformId)) {
      if (!!this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
      if (!!this.wogConnectSub) {
        this.wogConnectSub.unsubscribe();
      }
    }
  }

  /**
   * Call API Service, get Weekend of Good data by alias
   * @param WeekendAlias
   * Return Weekend of Good detail data JSON
   */
  getWeekendDataByAlias(WeekendAlias: string) {
    // Handle Oflline Mode
    if (isPlatformBrowser(this.platformId)) {
      const StorageWOGData = this.localStorageService.getItemFromListByAlias(
        environment.StorageWOGKey,
        WeekendAlias
      );
      if (!!StorageWOGData) {
        this.htmlData = StorageWOGData.data;
      }
    }

    this.weekendOfGoodService.getWeekendDataByAlias(WeekendAlias).subscribe(
      rs => {
        if (!!rs.success) {
          // Set HTML
          this.htmlData = rs.data;

          // Set Title
          if (!!this.htmlData.story.title) {
            this.titleService.setTitle(
              this.htmlData.story.title + ' | The Better Traveller'
            );
          }

          // Set Meta Tags
          this.metaService.setMetaTags(this.htmlData.metatags);

          //set SpotlightData to bookmark
          this.spotlightData = new SpotlightItemData();
          this.spotlightData.id = this.htmlData.story.id;
          this.spotlightData.type = 'weekend-of-good';
          this.spotlightData.country_code = this.htmlData.story.country_code;
          this.spotlightData.alias = WeekendAlias;
          this.spotlightData.title = this.htmlData.story.title;
          this.spotlightData.bookmark_list_id = '';
          this.spotlightData.bookmarked = false;
          if (isPlatformBrowser(this.platformId)) {
            this.currentUserSubscription = this.bookmarkService
              .bookmarkTransformDataStream()
              .pipe(
                filter(
                  bookmarkItem => bookmarkItem.oid === this.spotlightData.id
                )
              )
              .subscribe(item => {
                this.spotlightData.bookmarked = true;
                this.spotlightData.bookmark_list_id = item.lid;
              });
          }
        }
      },
      err => console.log(err)
    );
  }

  /**
   * Funct handle click bookmark button.
   * @param item
   * Output: Change 'bookmarked' status of item.
   */
  bookmark(item: any) {
    // console.log('[Bookmark] Item Title: ', item.title);
    item.bookmarked = !item.bookmarked;
    // console.log('[Bookmark] Item bookmarked: ', item.bookmarked);
  }

  onScrollToTarget() {
    this.storyService.scrollToTarget();
  }
}
