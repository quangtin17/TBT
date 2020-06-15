import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

import {
  MetaService,
  LocalStorageService,
  IndexedDbService,
  ConnectionService
} from '../../../@core/services';
import { MeetService } from '../../services/meet.service';

import { SpotlightItemData } from '../../../@core/models';
import { environment } from '../../../../../environments/environment';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'k-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss']
})
export class MeetComponent implements OnInit, OnDestroy {
  htmlMeetData: any;
  alias: string;
  // gallery: NgxGalleryImage[];
  spotlightData: SpotlightItemData;
  currentUserSubscription: Subscription;
  meetConnectSub: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: MetaService,
    private localStorageService: LocalStorageService,
    private meetService: MeetService,
    private indexedDbService: IndexedDbService,
    private connectionService: ConnectionService,
    private bookmarkService: BookmarkService
  ) {
    this.spotlightData = new SpotlightItemData();
    this.spotlightData.bookmarked = false;
  }

  ngOnInit() {
    this.meetConnectSub = this.connectionService
      .createOnline()
      .subscribe(isOnline => {
        this.activatedRoute.paramMap.subscribe(params => {
          this.alias = `${params.get('alias')}`;
          console.log('[MeetComponent] is online', isOnline);
          if (!isOnline) {
            this.indexedDbService.getItem(this.alias).subscribe(response => {
              this.htmlMeetData = response;
            });
          } else {
            this.getMeetDataByAlias(this.alias);
          }
        });
      });
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (isPlatformBrowser(this.platformId)) {
      if (!!this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
      if (!this.meetConnectSub) {
        this.meetConnectSub.unsubscribe();
      }
    }
  }

  /**
   * Call API Service, get Meet data by alias
   * @param meetAlias
   * Return Meet detail data JSON
   */
  getMeetDataByAlias(meetAlias: string) {
    // Handle Oflline Mode
    if (isPlatformBrowser(this.platformId)) {
      const StorageMeetData = this.localStorageService.getItemFromListByAlias(
        environment.StorageMeetKey,
        meetAlias
      );
      if (!!StorageMeetData) {
        this.htmlMeetData = StorageMeetData.data;
      }
    }

    // Call API
    this.meetService.getMeetData(meetAlias).subscribe(
      meetData => {
        // Set HTML
        this.htmlMeetData = meetData.data;
        console.log('[getMeetData] meetData: ', meetData.data);

        // Set Title
        if (!!this.htmlMeetData.title) {
          this.titleService.setTitle(
            this.htmlMeetData.title + ' | The Better Traveller'
          );
        }

        // Set Meta Tags
        this.metaService.setMetaTags(this.htmlMeetData.metatags);

        //set SpotlightData to bookmark
        this.spotlightData = new SpotlightItemData();
        this.spotlightData.id = meetData.data.id;
        this.spotlightData.type = 'meet';
        this.spotlightData.country_code = meetData.data.country_code;
        this.spotlightData.alias = meetAlias;
        this.spotlightData.title = meetData.data.title;
        this.spotlightData.bookmark_list_id = '';
        this.spotlightData.bookmarked = false;
        if (isPlatformBrowser(this.platformId)) {
          this.currentUserSubscription = this.bookmarkService
            .bookmarkTransformDataStream()
            .pipe(
              filter(bookmarkItem => bookmarkItem.oid === this.spotlightData.id)
            )
            .subscribe(item => {
              this.spotlightData.bookmarked = true;
              this.spotlightData.bookmark_list_id = item.lid;
            });
        }
      },
      err => console.log(err)
    );
  }
}
