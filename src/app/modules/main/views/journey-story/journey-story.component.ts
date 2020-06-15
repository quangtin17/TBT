import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject
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
  selector: 'k-journey-story',
  templateUrl: './journey-story.component.html',
  styleUrls: ['./journey-story.component.scss']
})
export class JourneyStoryComponent implements OnInit, OnDestroy {
  htmlData: any;
  currentJourneyData: any;
  storySubcription: Subscription;
  idStory: number;
  hasEnquiry: boolean;
  journeyStoryConnectSub: Subscription;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private journeyService: JourneyService,
    private localStorageService: LocalStorageService,
    private indexedDbService: IndexedDbService,
    private connectionService: ConnectionService,
    private storyService: StoryService
  ) {}

  ngOnInit() {
    this.journeyStoryConnectSub = this.connectionService
      .createOnline()
      .subscribe(isOnline => {
        this.storySubcription = this.journeyService.journeyData.subscribe(
          rs => {
            // console.log('[JourneyStoryComponent] storySubcription: ', rs);
            this.currentJourneyData = rs;
            if (!!this.currentJourneyData.enquiry) {
              this.hasEnquiry = this.currentJourneyData.enquiry;
            }

            if (!!this.currentJourneyData.alias) {
              if (!isOnline) {
                this.indexedDbService
                  .getItem(this.currentJourneyData.alias)
                  .subscribe(response => {
                    if (!!response.story) {
                      this.htmlData = response.story;
                    }
                  });
              } else {
                this.getJourneyStoryDataByAlias(this.currentJourneyData.alias);
              }
            }
            if (!!rs.id) {
              this.idStory = rs.id;
            }
          },
          err => console.log(err)
        );
      });
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (!!this.storySubcription) {
      this.storySubcription.unsubscribe();
    }
    if (!!this.journeyStoryConnectSub) {
      this.journeyStoryConnectSub.unsubscribe();
    }
  }

  getJourneyStoryDataByAlias(JourneyStoryAlias: string) {
    // Handle Oflline Mode
    if (isPlatformBrowser(this.platformId)) {
      const StorageJourneyStoryData = this.localStorageService.getItemFromListByAlias(
        environment.StorageJourneyStoryKey,
        JourneyStoryAlias
      );
      if (!!StorageJourneyStoryData) {
        this.htmlData = StorageJourneyStoryData.data;
      }
    }

    // Call API
    this.journeyService
      .getJourneyTabDataByAlias(JourneyStoryAlias, environment.APIJourneyStory)
      .subscribe(
        rs => {
          if (!!rs.success) {
            // console.log('[getJourneyStoryDataByAlias] storyData: ', infoData);
            this.htmlData = rs.data.story;
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
    console.log('[Bookmark] Item Title: ', item.title);
    item.bookmarked = !item.bookmarked;
    console.log('[Bookmark] Item bookmarked: ', item.bookmarked);
  }

  openEnquiryDialog() {
    this.journeyService.openEnquiryDialog();
  }

  onScrollToTarget() {
    this.storyService.scrollToTarget();
  }
}
