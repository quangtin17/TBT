import {
  Component,
  OnInit,
  NgZone,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '../../../@core/services/meta.service';
import { Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Location, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { PageScrollService } from 'ngx-page-scroll-core';
import { filter } from 'rxjs/operators';

import { Pager } from '../../../@core/models/pager';
import { PagerService } from '../../../@core/services/pager.service';
import { SearchService } from '../../services/search.service';
import { UserService, FilterService } from '../../../@core';
import { ShareGroupService } from '../../../@shared/services/share-group.service';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'k-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  isMobile: boolean;
  htmlData: any;
  currentPage: any;
  hiddenShareButton = true;
  currentRouter: string;
  searchTermUrl: RegExpMatchArray;
  // searchInput: string;
  filter: any;
  rsCount: number;
  showFilterMobile: boolean;
  showSearchBar: boolean;

  flagFilterTag: boolean;
  flagFilterSearch: boolean;

  optionsType = [
    { id: 'stories', label: 'Show stories', checked: false },
    { id: 'experiences', label: 'Show experiences', checked: false }
  ];

  optionsCountry: Array<any>;
  optionsStoryType: Array<any>;
  optionsActivity: Array<any>;
  optionsTags: Array<any>;
  defaultListTags: Array<any>;

  // pager object
  pager: Pager;
  page_size: number;

  currentUserSubscription: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private filterService: FilterService,
    private pagerService: PagerService,
    private metaService: MetaService,
    private titleService: Title,
    private deviceService: DeviceDetectorService,
    private searchService: SearchService,
    private pageScrollService: PageScrollService,
    private shareGroupService: ShareGroupService,
    private bookmarkService: BookmarkService
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.currentPage = 0;
    this.rsCount = 0;
    this.showFilterMobile = false;
    this.showSearchBar = false;

    this.currentRouter = this.router.url;
    this.filter = {
      term: '',
      type: 'stories',
      story_type: [],
      country: [],
      activity: [],
      tag: []
    };
    this.defaultListTags = [];
    this.metaService.removeCurrentTag(); // Remove Metatags
  }

  ngOnInit() {
    this.titleService.setTitle('Search | The Better Traveller');

    // setTimeout(() => {
    this.optionsCountry = JSON.parse(
      JSON.stringify(this.filterService.optionsCountry)
    );
    this.optionsStoryType = JSON.parse(
      JSON.stringify(this.filterService.optionsStoryType)
    );
    // console.log('optionsStoryType: ', this.optionsStoryType);

    this.optionsActivity = JSON.parse(
      JSON.stringify(this.filterService.optionsActivity)
    );
    this.optionsTags = JSON.parse(
      JSON.stringify(this.filterService.optionsTags)
    );
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.getFilterFromParam(params);
        // console.log('filter: ', this.filter);

        this.updateOptionsFromFilter();
        this.searchAndFilter();
      },
      err => console.log(err)
    );
    this.shareGroupService.setHiddenStatus(false);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (!!this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
    }
  }

  toggleFilter() {
    this.showFilterMobile = !this.showFilterMobile;
  }

  cbChange(item: any, filter: any) {
    // console.log('item: ', item);
    if (item.checked) {
      if (!filter.includes(item.id)) {
        filter.push(item.id);
      }
    } else {
      if (filter.includes(item.id)) {
        let index = filter.indexOf(item.id);
        filter.splice(index, 1);
      }
    }
    // console.log('filter: ', filter);
  }

  mutiselectChange(listItem: any) {
    this.filter.tag = listItem.map(el => {
      return el.id;
    });
    // console.log('[mutiselectChange] listItem: ', listItem);
  }

  getFilterFromParam(params: any) {
    this.filter = {
      term: '',
      type: 'stories',
      story_type: [],
      country: [],
      activity: [],
      tag: []
    };
    //  Type : stories or experiences
    if (!!params.search) {
      this.showSearchBar = true;
    } else {
      this.showSearchBar = false;
    }
    // console.log('params.search', params.search);

    this.showSearchBar = params.search ? true : false;
    if (!!params.type && typeof params.type == 'string') {
      this.filter.type = params.type;
    }

    // Story Type : Journey, Wod, Meet
    if (!!params.story_type) {
      if (typeof params.story_type == 'string') {
        this.filter.story_type.push(params.story_type);
      } else if (typeof params.story_type == 'object') {
        params.story_type.forEach(storyType => {
          this.filter.story_type.push(storyType);
        });
      }
    }

    // Country
    if (!!params.country) {
      if (typeof params.country == 'string') {
        this.filter.country.push(params.country);
      } else if (typeof params.country == 'object') {
        params.country.forEach(country => {
          this.filter.country.push(country);
        });
      }
    }

    // Activity
    if (!!params.activity) {
      if (typeof params.activity == 'string') {
        this.filter.activity.push(params.activity);
      } else if (typeof params.activity == 'object') {
        params.activity.forEach(activity => {
          this.filter.activity.push(activity);
        });
      }
    }

    if (!!params.tag) {
      if (typeof params.tag == 'string') {
        this.filter.tag.push(params.tag);
      } else if (typeof params.tag == 'object') {
        params.tag.forEach(tag => {
          this.filter.tag.push(tag);
        });
      }
    }

    if (!!params.page) {
      this.currentPage = parseInt(params.page);
    }
    if (!!params.term) {
      this.filter.term = params.term;
    }
  }

  updateOptionsFromFilter() {
    // console.log('update');
    this.optionsType.map(el => {
      if (el.id == this.filter.type) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    });

    // Clean checkbox
    this.optionsCountry.forEach(el => {
      el.checked = false;
    });

    this.optionsCountry.map(el => {
      this.filter.country.forEach(element => {
        if (el.id == element) {
          el.checked = true;
        }
      });
    });

    // Clean checkbox
    this.optionsStoryType.forEach(el => {
      el.checked = false;
    });

    this.optionsStoryType.map(el => {
      this.filter.story_type.forEach(element => {
        if (el.id == element) {
          el.checked = true;
        }
      });
    });

    // Clean checkbox
    this.optionsActivity.forEach(el => {
      el.checked = false;
    });
    this.optionsActivity.map(el => {
      this.filter.activity.forEach(element => {
        if (el.id == element) {
          el.checked = true;
        }
      });
    });
    this.setDefaultTag();
  }

  setDefaultTag() {
    this.optionsTags.forEach(el => {
      if (this.filter.tag.includes(el.id)) {
        // console.log('filter.tag.include : ', el.id);
        this.defaultListTags.push(el);
      }
    });
    // console.log('defaultListTags : ', this.defaultListTags);
  }

  radioChange(event: any) {
    // Must use setTimeout to Update DOM,
    // if not -> DOM not change until Observerble on searchAndFilter func complete

    this.filter.type = event;
    // console.log('filter.type :', this.filter.type);
    setTimeout(() => {
      this.searchAndFilter();
    });
  }

  searchByRouting() {
    let newParam = { ...this.filter };
    this.router.navigate(['/search'], {
      queryParams: newParam
    });
  }

  searchAndFilter(page: number = 0, changeLocation: boolean = false) {
    let newParam = { ...this.filter, search: this.showSearchBar };
    // console.log('NewParam: ', newParam);

    // Remove empty params
    Object.keys(newParam).forEach(
      key =>
        (newParam[key] == null || newParam[key].length == 0) &&
        delete newParam[key]
    );
    // console.log('NewParam after: ', newParam);

    // Re-write url
    const url = this.router
      .createUrlTree([], {
        relativeTo: this.activatedRoute,
        queryParams: newParam
      })
      .toString();

    // Check change locartion flag
    if (changeLocation) {
      this.location.go(url);
    }
    if (isPlatformBrowser(this.platformId)) {
      this.searchService.searchAndFilter(newParam, page).subscribe(rs => {
        // console.log('[searchAndFilter] rs: ', rs);

        if (!!rs.success) {
          this.htmlData = rs.data;

          this.rsCount =
            this.htmlData.page_size > this.htmlData.total
              ? this.htmlData.total
              : this.htmlData.page_size;
          // console.log('getCollectionTabDataByAlias experiences')
          if (this.htmlData.results && this.htmlData.results.length > 0) {
            this.currentUserSubscription = this.bookmarkService
              .bookmarkTransformDataStream()
              .subscribe(bookmarkItem => {
                const list_stories = this.htmlData.results;
                list_stories.map(story => {
                  if (bookmarkItem.oid === story.id) {
                    story.bookmarked = true;
                    story.bookmark_list_id = bookmarkItem.lid;
                  }
                });
              });
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

          // Scroll To Top
          setTimeout(() => {
            this.pageScrollService.scroll({
              document: this.document,
              scrollTarget: '.layout-container'
            });
          }, 400);
        }
      });
    }
  }

  /**
   * Funct handle pagination
   * @param page
   * Return pager obj and update component.
   */
  setPage(page: number) {
    this.pager = this.pagerService.getPager(
      this.htmlData.total,
      page,
      this.page_size
    );
  }

  clickSeachBtn() {
    // Clear filter
    this.filter.story_type = [];
    this.filter.country = [];
    this.filter.activity = [];

    this.updateOptionsFromFilter(); // Update Option checkboxs

    this.searchAndFilter(); // Call Search
  }

  clickFilterBtn() {
    this.searchAndFilter(0, true); // Call Search param: Page 0, changeLocation : true
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
