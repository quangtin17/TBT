import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MetaService } from '../../../@core/services/meta.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { CountryService } from '../../services/country.service';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'k-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  htmlData: any;
  htmlTopStoryCountry: any;
  isMobile: boolean;
  currentUserSubscription: Subscription;
  constructor(
    private countryService: CountryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private titleService: Title,
    private deviceService: DeviceDetectorService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private bookmarkService: BookmarkService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (!!this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
    }
  }

  ngOnInit() {
    // if (isPlatformBrowser(this.platformId)) {
    this.activatedRoute.paramMap.subscribe(
      params => {
        let countryAlias = params.get('alias');
        // console.log('countryAlias: ', countryAlias);
        if (!!countryAlias) {
          this.getCountryByAlias(countryAlias);
        }
      },
      err => console.log(err)
    );
    // }
  }

  /**
   * Funct Call API request Country Data by Alias.
   * @param countryAlias
   * Output: Get Data to render HTML (htmlData).
   */
  getCountryByAlias(countryAlias: string) {
    this.countryService.getCountryByAlias(countryAlias).subscribe(
      rs => {
        if (!!rs.success) {
          // Set HTML
          this.htmlData = rs.data;

          // Redirect for special case
          if (!!this.htmlData.redirect_the_search_page) {
            this.router.navigate(['/search'], {
              queryParams: { term: '', country: this.htmlData.id }
            });
          }

          // Set Title
          if (this.htmlData.country && this.htmlData.country.name) {
            this.titleService.setTitle(
              this.htmlData.country.name + ' | The Better Traveller'
            );
          }

          // Set Meta Tags
          this.metaService.setMetaTags(this.htmlData.metatags);

          // console.log('[getCountryByAlias] country', this.htmlData);

          if (
            this.htmlData.stories &&
            this.htmlData.stories.list_stories &&
            this.htmlData.stories.list_stories.length > 0
          ) {
            this.htmlTopStoryCountry = this.htmlData.stories.list_stories[0];
            if (isPlatformBrowser(this.platformId)) {
              this.currentUserSubscription = this.bookmarkService
                .bookmarkTransformDataStream()
                .subscribe(bookmarkItem => {
                  const list_stories = this.htmlData.stories.list_stories;
                  const list_experiences = this.htmlData.experiences
                    .list_experiences;
                  list_stories.map(story => {
                    if (bookmarkItem.oid === story.id) {
                      story.bookmarked = true;
                      story.bookmark_list_id = bookmarkItem.lid;
                    }
                  });
                  list_experiences.map(experience => {
                    if (bookmarkItem.oid === experience.id) {
                      experience.bookmarked = true;
                      experience.bookmark_list_id = bookmarkItem.lid;
                    }
                  });
                });
            }
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
}
