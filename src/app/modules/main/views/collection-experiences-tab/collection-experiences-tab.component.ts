import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../services/collection.service';

import { Pager } from '../../../@core/models/pager';
import { PagerService } from '../../../@core/services/pager.service';
import { Subscription } from 'rxjs';
import { UserService, FilterService } from '../../../@core';
import { isPlatformBrowser } from '@angular/common';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'k-collection-experiences-tab',
  templateUrl: './collection-experiences-tab.component.html',
  styleUrls: ['./collection-experiences-tab.component.scss']
})
export class CollectionExperiencesTabComponent implements OnInit {
  htmlData: any;
  currentPage: any;
  alias: string;
  optionsCountry: any[];
  selectedCountries: any[];
  previousSelect: any[] = [];
  // pager object
  pager: Pager;
  page_size: number;
  currentUserSubscription: Subscription;

  constructor(
    private collectionService: CollectionService,
    private pagerService: PagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private bookmarkService: BookmarkService
  ) {
    this.currentPage = 0;
    this.activatedRoute.queryParams.subscribe(params => {
      if (!!params.page) {
        this.currentPage = parseInt(params.page);
      }
    });
    this.optionsCountry = [];
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (!!this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.optionsCountry = [...this.filterService.optionsCountry];
      this.activatedRoute.parent.paramMap.subscribe(
        params => {
          this.alias = params.get('alias');
          this.selectedCountries = JSON.parse(
            this.localStorage.getItem(
              'countries-collection-experience-' + this.alias
            )
          );
          this.previousSelect = this.selectedCountries;
          this.getCollectionTabDataByAlias(
            this.alias,
            this.currentPage,
            this.selectedCountries
          );
        },
        err => console.log(err)
      );
    });
  }

  /**
   * Funct Call API get list of countries data
   * @param page // default value is 0
   * Assign data result to htmlData
   * Init Paging with currentPage value
   */
  getCollectionTabDataByAlias(
    collectionAlias: string,
    page: number = 0,
    countries: any[] = null
  ) {
    // console.log('[getCollectionByAlias] :', collectionAlias, page);

    this.collectionService
      .getCollectionTabDataByAlias(
        collectionAlias,
        'experiences',
        page,
        countries
      )
      .subscribe(
        rs => {
          if (!!rs.success) {
            this.htmlData = rs.data;
            console.log('getCollectionTabDataByAlias experiences');
            if (
              this.htmlData.list_experiences &&
              this.htmlData.list_experiences.length > 0
            ) {
              if (isPlatformBrowser(this.platformId)) {
                this.currentUserSubscription = this.bookmarkService
                  .bookmarkTransformDataStream()
                  .subscribe(bookmarkItem => {
                    const list_experiences = this.htmlData.list_experiences;
                    list_experiences.map(story => {
                      if (bookmarkItem.oid === story.id) {
                        story.bookmarked = true;
                        story.bookmark_list_id = bookmarkItem.lid;
                      }
                    });
                  });
              }
            }

            // Set Pager
            if (
              this.htmlData.current_page ===
              parseInt(this.htmlData.current_page, 10)
            ) {
              this.currentPage = this.htmlData.current_page;
            }
            if (this.htmlData.page_size) {
              this.page_size = this.htmlData.page_size;
            }

            this.setPage(this.currentPage);
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

  /**
   * Funct handle pagination
   * @param page
   * Return pager obj and update component.
   */
  setPage(currentPage: number) {
    this.pager = this.pagerService.getPager(
      this.htmlData.total,
      currentPage,
      this.page_size
    );
    // console.log('[setPage] pager: ', this.pager);
  }

  goToRelative(link: any) {
    // console.log('link: ', link);
    this.router.navigate(['../', link], {
      relativeTo: this.activatedRoute
    });
  }

  onSelectedCountries(countries: any) {
    // console.log('onSelectedCountries', countries);

    const idListNew =
      !countries || countries.length < 1
        ? ''
        : countries
            .map(x => x.id)
            .sort()
            .reduce((x, y) => x + ',' + y, '');
    const idListOld =
      !this.previousSelect || this.previousSelect.length < 1
        ? ''
        : this.previousSelect
            .map(x => x.id)
            .sort()
            .reduce((x, y) => x + ',' + y, '');
    // console.log('idListNew', idListNew);
    // console.log('idListOld', idListOld);
    if (idListNew === idListOld) {
      // console.log('onSelectedCountries', idListNew);
      // do not call update data if no change value
      return;
    }

    this.previousSelect = this.selectedCountries;
    this.selectedCountries = countries;
    this.localStorage.setItem(
      'countries-collection-experience-' + this.alias,
      JSON.stringify(this.selectedCountries)
    );
    this.getCollectionTabDataByAlias(
      this.alias,
      this.currentPage,
      this.selectedCountries
    );
  }
}
