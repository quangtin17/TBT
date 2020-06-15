import {
  Component,
  OnInit,
  PLATFORM_ID,
  Inject,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  LocalStorageService,
  IndexedDbService,
  ConnectionService
} from '../../../@core/services';
import { JourneyService } from '../../services/journey.service';
import { environment } from '../../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { StoryService } from '../../services/story.service';

@Component({
  selector: 'k-journey-info',
  templateUrl: './journey-info.component.html',
  styleUrls: ['./journey-info.component.scss']
})
export class JourneyInfoComponent implements OnInit, OnDestroy {
  htmlData: any;
  currentJourneyData: any;
  infoSubcription: Subscription;
  idInfo: number;
  showCount = 4;
  hasEnquiry: boolean;
  journeyInfoConnectSub: Subscription;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private journeyService: JourneyService,
    private localStorageService: LocalStorageService,
    private indexedDbService: IndexedDbService,
    private connectionService: ConnectionService,
    private storyService: StoryService
  ) {}

  ngOnInit() {
    this.journeyInfoConnectSub = this.connectionService
      .createOnline()
      .subscribe(isOnline => {
        this.infoSubcription = this.journeyService.journeyData.subscribe(rs => {
          // console.log('[JourneyInfoComponent] infoSubcription: ', rs);
          this.currentJourneyData = rs;
          if (!!this.currentJourneyData.enquiry) {
            this.hasEnquiry = this.currentJourneyData.enquiry;
          }

          if (!!this.currentJourneyData.alias) {
            if (!isOnline) {
              this.indexedDbService
                .getItem(this.currentJourneyData.alias)
                .subscribe(response => {
                  if (!!response.info) {
                    this.htmlData = response.info;
                  }
                });
            } else {
              this.getJourneyInfoDataByAlias(this.currentJourneyData.alias);
            }
          }

          if (!!rs.id) {
            this.idInfo = rs.id;
          }
        });
      });
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (!!this.infoSubcription) {
      this.infoSubcription.unsubscribe();
    }
    if (!!this.journeyInfoConnectSub) {
      this.journeyInfoConnectSub.unsubscribe();
    }
  }

  getJourneyInfoDataByAlias(JourneyInfoAlias: string) {
    // Handle Oflline Mode
    if (isPlatformBrowser(this.platformId)) {
      const StorageJourneyInfoData = this.localStorageService.getItemFromListByAlias(
        environment.StorageJourneyInfoKey,
        JourneyInfoAlias
      );
      if (!!StorageJourneyInfoData) {
        this.htmlData = StorageJourneyInfoData.data;
      }
    }

    // Call API
    this.journeyService
      .getJourneyTabDataByAlias(JourneyInfoAlias, environment.APIJourneyInfo)
      .subscribe(
        rs => {
          if (!!rs.success) {
            // console.log('[getJourneyInfoDataByAlias] infoData: ', infoData);
            this.htmlData = rs.data.info;
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

  openEnquiryDialog() {
    this.journeyService.openEnquiryDialog();
  }

  onScrollToTarget() {
    this.storyService.scrollToTarget();
  }
}
