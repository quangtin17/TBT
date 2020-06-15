// Core
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

// Services
import { Pager, PagerService, UserService } from '../../../@core';
import { BookmarkService } from '../../services/bookmark.service';

// Models
import { BookmarkItem, SpotlightItemData } from '../../../@core/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'k-bookmark-detail-story',
  templateUrl: './bookmark-detail-story.component.html',
  styleUrls: ['./bookmark-detail-story.component.scss']
})
export class BookmarkDetailStoryComponent implements OnInit {
  bookmark_lists: any;
  listItems: BookmarkItem[];
  listBookmarkedItemIDs: string[];
  currentPage: any;
  alias: string;

  currentUserSubscription: Subscription;
  currentUserID: string;
  bookmarkID: string;

  // pager object
  pager: Pager;
  page_size: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private bookmarkService: BookmarkService,
    private pagerService: PagerService,

    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentPage = 0;
    this.page_size = 8;
    this.bookmark_lists = [];

    this.activatedRoute.queryParams.subscribe(params => {
      if (!!params.page) {
        this.currentPage = parseInt(params.page);
      }
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    // check is Browser
    this.activatedRoute.parent.paramMap.subscribe(
      params => {
        this.alias = params.get('alias');
        this.bookmarkID = `${params.get('alias')}`;
        if (isPlatformBrowser(this.platformId)) {
          // Assign Subscription to watch userService.currentUser value.
          this.currentUserSubscription = this.userService.currentUser.subscribe(
            rs => {
              if (!!rs) {
                this.currentUserID = rs.id;
                // have user observable
                if (!!rs.bookmark_lists) {
                  // Get bookmark list from User observable by bookmarkID
                  let bookmarkData = rs.bookmark_lists.filter(
                    x => x.id == this.bookmarkID
                  )[0];

                  if (!!bookmarkData) {
                    this.listItems = bookmarkData.bookmark_items.filter(
                      x =>
                        x.type.indexOf('story') > -1 ||
                        x.type.indexOf('journey') > -1 ||
                        x.type.indexOf('meet') > -1 ||
                        x.type.indexOf('weekend-of-good') > -1
                    );
                    // console.log('this.storyIds:', this.listItems);

                    this.listBookmarkedItemIDs = this.listItems
                      .map(x => x.oid)
                      .filter(x => {
                        return !!x;
                      });

                    // getBookmarkByAlias with start page 0
                    this.getBookmarkByAlias(0);
                  }
                }
              } else {
                // not have user or user logout
                this.router.navigate(['/home']);
              }
            }
          );
        }
      },
      err => console.log(err)
    );
  }

  /**
   * Funct Call API get list of countries data
   * @param page // default value is 0
   * Assign data result to htmlData
   * Init Paging with currentPage value
   */
  getBookmarkByAlias(page: number = 0) {
    const listQuery = this.listBookmarkedItemIDs.slice(
      page * this.page_size,
      (page + 1) * this.page_size
    );

    // Return if list empty
    if (listQuery.length == 0) {
      this.bookmark_lists = [];
      return;
    }

    console.log('[getBookmarkByAlias] listQuery stories: ', listQuery);

    // Get from Offline Storage First
    const currentList = this.bookmarkService.getItemFromListBookmark(
      this.alias
    );
    console.log('[getBookmarkByAlias] currentList stories', currentList);

    if (!!currentList && currentList.listItems) {
      this.bookmark_lists = currentList.listItems.filter(x =>
        listQuery.includes(x.id)
      );

      // Set Pager
      if (this.bookmark_lists && this.bookmark_lists.length > 0) {
        // slice to paging by page_size
        this.bookmark_lists = this.bookmark_lists.slice(
          page * this.page_size,
          (page + 1) * this.page_size
        );

        this.currentPage = page;
        this.setPage(this.currentPage);
      }
    }
    console.log(
      '[getBookmarkByAlias] bookmark_lists stories offline: ',
      this.bookmark_lists
    );

    this.bookmarkService.getBookmarkTabDataByAlias(listQuery).subscribe(
      rs => {
        console.log('[getBookmarkTabDataByAlias] data ', rs);
        console.log('[getBookmarkTabDataByAlias] alias ', this.alias);
        if (rs.data) {
          // Store
          if (rs.data.bookmark_lists) {
            this.bookmark_lists = rs.data.bookmark_lists;

            // Set Pager
            this.currentPage = page;
            this.setPage(this.currentPage);
            this.bookmarkService.addItemToListBookmark(
              this.alias,
              rs.data.bookmark_lists
            );
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
    item.bookmarked = !item.bookmarked;
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.listBookmarkedItemIDs.length,
      page,
      this.page_size
    );
    console.log('[Bookmark Detail Story] setPage : ', this.pager);
  }

  goToRelative(link: any) {
    this.router.navigate(['../', link], {
      relativeTo: this.activatedRoute
    });
  }

  unBookMarkItem(item: SpotlightItemData) {
    // console.log('unBookMarkItem', item);
    const countryCode = !!item.country_code ? '|' + item.country_code : '';
    const postData = {
      site_domain: `${environment.APIEndpointTBT}`,
      obj_url: item.alias,
      user_id: this.currentUserID,
      obj_title: item.title,
      obj_type: 'node',
      obj_subtype: `${item.type}${countryCode}`,
      obj_id: item.id,
      action_type: 'bookmark',
      action_status: 'remove',
      list_id: this.bookmarkID,
      new_list: false
    };
    this.bookmarkService.postUpdateItemToBookmarkList(postData).subscribe(
      rs => {
        // console.log('postAddRemoveItemToBookmarkList', rs);
        if (!!rs.success) {
          // Get Bookmark Data from rs by ID
          let bookmarkData = rs.data.bookmark_lists.filter(
            x => x.id == this.bookmarkID
          )[0];

          // Filter list by stories type
          this.listItems = bookmarkData.bookmark_items.filter(
            x =>
              x.type.indexOf('story') > -1 ||
              x.type.indexOf('journey') > -1 ||
              x.type.indexOf('meet') > -1 ||
              x.type.indexOf('weekend-of-good') > -1
          );

          // console.log('this.storyIds:', this.listItems);
          this.listBookmarkedItemIDs = this.listItems
            .map(x => x.oid)
            .filter(x => {
              return x != undefined;
            });
          this.getBookmarkByAlias(this.currentPage);

          // Set new BookmarkList to User Observable
          let user = this.userService.getCurrentUser;
          if (!!user && !!user.bookmark_lists) {
            user.bookmark_lists = rs.data.bookmark_lists;
            user.recent_bookmark_items = rs.data.recent_bookmark_items;
            // console.log('[ Set new BookmarkList]', user);
            this.userService.setAuth(user); // set new User -> show new list on refresh
          }
        }
      },
      err => console.log(err)
    );
  }
}
