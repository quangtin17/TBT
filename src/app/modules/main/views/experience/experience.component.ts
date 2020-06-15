import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { ExperienceService } from '../../services/experience.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  MetaService,
  LocalStorageService,
  IndexedDbService,
  ConnectionService
} from '../../../@core/services';
import { SpotlightItemData } from '../../../@core/models';
import { environment } from '../../../../../environments/environment';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'k-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, OnDestroy {
  htmlExperienceData: any;
  alias: string;
  spotlightData: SpotlightItemData;
  currentUserSubscription: Subscription;
  experienceConnectSub: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private metaService: MetaService,
    private localStorageService: LocalStorageService,
    private experienceService: ExperienceService,
    private indexedDbService: IndexedDbService,
    private connectionService: ConnectionService,
    private bookmarkService: BookmarkService
  ) {
    this.spotlightData = new SpotlightItemData();
    this.spotlightData.bookmarked = false;
  }

  ngOnInit() {
    this.experienceConnectSub = this.connectionService
      .createOnline()
      .subscribe(isOnline => {
        this.activatedRoute.paramMap.subscribe(params => {
          this.alias = `${params.get('alias')}`;
          console.log('[ExperienceComponent] is online', isOnline);
          if (!isOnline) {
            this.indexedDbService.getItem(this.alias).subscribe(response => {
              this.htmlExperienceData = response;
            });
          } else {
            this.getExperienceDataByAlias(this.alias);
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
      if (!!this.experienceConnectSub) {
        this.experienceConnectSub.unsubscribe();
      }
    }
  }

  /**
   * Get ExperienceId Data by Alias
   * @param ExperienceAlias
   * Return ExperienceId detail data JSON
   */
  getExperienceDataByAlias(ExperienceAlias: string) {
    // Handle Oflline Mode
    if (isPlatformBrowser(this.platformId)) {
      const StorageExperienceData = this.localStorageService.getItemFromListByAlias(
        environment.StorageExperienceKey,
        ExperienceAlias
      );
      if (!!StorageExperienceData) {
        this.htmlExperienceData = StorageExperienceData.data;
      }
    }

    // Call API
    this.experienceService
      .getExperienceData(ExperienceAlias)
      .subscribe(experience => {
        // Set HTML
        this.htmlExperienceData = experience.data;

        if (this.htmlExperienceData.redirect_to_journey) {
          // tslint:disable-next-line: max-line-length
          this.router.navigate(
            ['/story/journey', this.htmlExperienceData.journey_alias, 'info'],
            { relativeTo: this.activatedRoute, replaceUrl: true }
          );
        }

        // Set Title
        if (!!this.htmlExperienceData.title) {
          this.titleService.setTitle(
            this.htmlExperienceData.title + ' | The Better Traveller'
          );
        }

        // Set Meta Tags
        this.metaService.setMetaTags(this.htmlExperienceData.metatags);
        // set SpotlightData to bookmark
        this.spotlightData = new SpotlightItemData();
        this.spotlightData.id = experience.data.id;
        this.spotlightData.type = 'experiences';
        this.spotlightData.country_code = experience.data.country_code;
        this.spotlightData.alias = ExperienceAlias;
        this.spotlightData.title = experience.data.title;
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
      });
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

  showMoreNotes() {}
}
