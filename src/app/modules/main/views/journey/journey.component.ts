import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

import {
  MetaService,
  IndexedDbService,
  ConnectionService
} from '../../../@core/services';

import { JourneyService } from '../../services/journey.service';

import { SpotlightItemData } from '../../../@core/models';
import { DialogsService } from '../../../@shared/services/dialogs.service';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'k-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit, OnDestroy {
  alias: string;
  htmlData: any;
  spotlightData: SpotlightItemData;
  currentUserSubscription: Subscription;
  fbID: string;
  hasJourneyData: boolean;
  journeyConnectSub: Subscription;

  text: string;
  tabs: any[] = [
    {
      title: 'Story',
      route: './story'
    },
    {
      title: 'Info',
      route: ['./info']
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private journeyService: JourneyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private titleService: Title,
    private dialogsService: DialogsService,
    private location: Location,
    private indexedDbService: IndexedDbService,
    private connectionService: ConnectionService,
    private bookmarkService: BookmarkService
  ) {
    this.spotlightData = new SpotlightItemData();
    this.spotlightData.bookmarked = false;
    // Remove params when redirect to current page
  }

  ngOnInit() {
    // this.htmlDataSubscription = this.activatedRoute.paramMap.subscribe(
    if (isPlatformBrowser(this.platformId)) {
      this.journeyConnectSub = this.connectionService
        .createOnline()
        .subscribe(isOnline => {
          this.activatedRoute.paramMap.subscribe(params => {
            this.activatedRoute.queryParamMap.subscribe(queryParams => {
              this.alias = `${params.get('alias')}` || '';
              console.log('[JourneyComponent] is online', isOnline);

              if (!isOnline) {
                this.indexedDbService
                  .getItem(this.alias)
                  .subscribe(response => {
                    this.htmlData = response;
                  });
              } else {
                this.getJourneyDataByAlias(this.alias, queryParams);
                console.log('[JourneyComponent] online data', this.htmlData);
              }
              this.journeyService.setAlias(this.alias);
            });
          });
        });
    }
  }

  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (isPlatformBrowser(this.platformId)) {
      if (!!this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
      if (!!this.journeyConnectSub) {
        this.journeyConnectSub.unsubscribe();
      }
    }
  }

  /**
   * Call API Service, get Journey data by alias
   * @param JourneyAlias
   * Return Journey data JSON
   */
  getJourneyDataByAlias(JourneyAlias: string, queryParams?: any) {
    this.journeyService.getJourneyDataByAlias(JourneyAlias).subscribe(rs => {
      if (!!rs.success) {
        this.htmlData = rs.data;

        // Set Title
        if (!!this.htmlData.title) {
          this.titleService.setTitle(
            this.htmlData.title + ' | The Better Traveller'
          );
        }

        if (!!this.htmlData.enquiry_form) {
          this.journeyService.setEnquiry(true);
        } else {
          this.journeyService.setEnquiry(false);
        }
        // Set HTML
        this.journeyService.setHTMLData(rs.data);

        this.activatedRoute.queryParams.subscribe(params => {
          let urlNoParams = this.router.url.split('?')[0] || '';

          if (
            !!params.fbclid ||
            (!!params.enquiry && params.enquiry === 'true')
          ) {
            this.location.go(urlNoParams);
          }
          if (!!params.enquiry && params.enquiry === 'true') {
            console.log('check journey data', this.hasJourneyData);
            this.onOpenEnquiryDialog();
          }
        });

        // Set Meta Tags
        this.metaService.setMetaTags(this.htmlData.metatags);

        this.journeyService.setId(this.htmlData.id);
        this.dialogsService.setId(this.htmlData.id);

        // TODO: check query param to show thankyou dialog
        if (!!queryParams.get('action')) {
          this.journeyService.openDialogThankYou(queryParams);
        }

        // set SpotlightData to bookmark
        this.spotlightData = new SpotlightItemData();
        this.spotlightData.id = rs.data.id;
        this.spotlightData.type = 'journey';
        this.spotlightData.country_code = rs.data.country_code;
        this.spotlightData.alias = JourneyAlias;
        this.spotlightData.title = rs.data.title;
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

        // console.log('Set spotlight data', rs.data, this.spotlightData);
      }
    });
  }

  toggleBookmark(bookmark: boolean) {
    // console.log('journey bookmark before:', this.spotlightData.bookmarked);
    this.spotlightData.bookmarked = bookmark;
    // console.log('journey bookmark after:', this.spotlightData.bookmarked);
  }

  onOpenEnquiryDialog() {
    this.journeyService.openEnquiryDialog();
  }
}
