import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../../@core/services/user.service';
import { BookmarkService } from '../../services/bookmark.service';

import { DialogTextFieldComponent } from '../../../@shared/dialogs/dialog-text-field/dialog-text-field.component';
import {
  BookmarkData,
  BookmarkItem,
  SpotlightItemData
} from '../../../@core/models';
import { environment } from '../../../../../environments/environment.prod';
import { Title } from '@angular/platform-browser';
import { ShareGroupService } from '../../../@shared/services/share-group.service';
import { AuthService } from '../../../@auth/services/auth.service';

@Component({
  selector: 'k-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit, OnDestroy {
  currentUserSubscription: Subscription;

  bookmarkList: BookmarkData[];
  recentItemList: BookmarkItem[];
  htmlData: any;
  currentUserID: string;

  constructor(
    private bookmarkService: BookmarkService,
    private toastrService: ToastrService,
    private nbDialogService: NbDialogService,
    private router: Router,
    private userService: UserService,

    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title,
    private shareGroupService: ShareGroupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      // Assign Subscription to watch userService.currentUser value.
      // this.currentUserSubscription = this.userService.currentUser.subscribe(
      //   rs => {
      //     console.log('[BookmarkComponent] currentUserSubscription: ', rs);
      //     // Set new BookmarkList to User Observable

      //     if (!!rs) {
      //       // have user observable
      //       this.currentUserID = rs.id;
      //       if (!!rs.bookmark_lists) {
      //         // User observable has bookmark list
      //         this.bookmarkList = rs.bookmark_lists;
      //         console.log(
      //           '[BookmarkComponent] -> [ngOnInit] bookmarkList',
      //           this.bookmarkList
      //         );
      //       }
      //     } else {
      //       // not have user or user logout
      //       // console.log('[BookmarkComponent] No User -> Redirect to Home page');
      //       this.router.navigate(['/home']);
      //     }
      //   }
      // );

      this.currentUserSubscription = this.authService
        .getUser()
        .subscribe(user => {
          console.log('[BookmarkComponent] currentUserSubscription: ', user);
          // Set new BookmarkList to User Observable

          if (!!user) {
            // have user observable
            this.currentUserID = user.id;
            if (!!user.bookmark_lists) {
              // User observable has bookmark list
              this.bookmarkList = user.bookmark_lists;
              console.log(
                '[BookmarkComponent] -> [ngOnInit] bookmarkList',
                this.bookmarkList
              );
            }
          } else {
            // not have user or user logout
            // console.log('[BookmarkComponent] No User -> Redirect to Home page');
            this.router.navigate(['/home']);
          }
        });
    }

    this.titleService.setTitle('My Bookmarks | The Better Traveller');

    this.shareGroupService.setHiddenStatus(false);
  }

  ngOnDestroy(): void {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      // Unsubscribe for
      this.currentUserSubscription.unsubscribe();
    }
  }

  handleEventCreateBookmarkList(name: string): void {
    // Receive Emit from Bookmarklist Component
    console.log('Received Emit from Bookmarklist Component -> name: ', name);

    this.nbDialogService
      .open(DialogTextFieldComponent, {
        context: {
          isCreate: true,
          btnText: 'Create',
          excludeValues: this.bookmarkList.map(x => x.title)
        }
      })
      .onClose.subscribe(rs => {
        // Receive Data from Create Bookmark Dialog
        console.log('Receive Data from Create Bookmark Dialog -> rs: ', rs);

        if (rs.isCreate) {
          this.createNewBookmarkList(rs.data);
        }
      });
  }

  createNewBookmarkList(data: any) {
    this.bookmarkService.postCreateBookmarkListForm(data).subscribe(rs => {
      console.log(
        '[createNewBookmarkList] -> [postCreateBookmarkListForm] rs',
        rs
      );

      if (!!rs.success) {
        setTimeout(() =>
          this.toastrService.success('Create bookmark list successfully!')
        );
        // Set new BookmarkList Local variable
        this.bookmarkList = rs.data.bookmark_lists;
        console.log(
          '[BookmarkComponent] -> [createNewBookmarkList] -> bookmarkList',
          this.bookmarkList
        );

        // Set new BookmarkList to User Observable
        const user = this.userService.getCurrentUser;
        if (!!user) {
          this.currentUserID = user.id;
          if (!!user.bookmark_lists) {
            user.bookmark_lists = rs.data.bookmark_lists;
            console.log(
              '[BookmarkComponent] -> [createNewBookmarkList] user',
              user
            );
            this.userService.setAuth(user); // set new User -> show new list on refresh
          }
        }
      } else {
        console.log('[postCreateBookmarkListForm] Fail !');
      }
    });
  }

  bookmarkListSelected(bookmark: BookmarkData): void {
    console.log('Bookmark list clicked: ', bookmark);
  }

  unBookMarkItem(item: SpotlightItemData) {
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
      list_id: '',
      new_list: false
    };
    // console.log('unBookMarkItem Recent list postData', postData);
    this.bookmarkService.postUpdateItemToBookmarkList(postData).subscribe(
      rs => {
        console.log('postAddRemoveItemToBookmarkList', rs);
        if (!!rs) {
          // Set new BookmarkList to User Observable
          const user = this.userService.getCurrentUser;

          if (!!user) {
            this.recentItemList = rs.data.recent_bookmark_items;
            // console.log(
            //   '[BookmarkComponent] recentItemList update: ',
            //   this.recentItemList
            // );
            const listIDs = this.recentItemList
              .map(x => x.oid)
              .filter(x => x !== undefined);
            // console.log('listIDs: ', listIDs);
            if (!!listIDs && listIDs.length > 0) {
              this.bookmarkService.getBookmarkTabDataByAlias(listIDs).subscribe(
                storiesData => {
                  console.log('recent bookmark data', storiesData);
                  if (!!storiesData.success) {
                    this.htmlData = storiesData.data;
                  }
                },
                err => console.log(err)
              );
            } else {
              this.htmlData = undefined;
            }

            if (!!user.bookmark_lists) {
              user.bookmark_lists = rs.data.bookmark_lists;
            }
            if (!!user.recent_bookmark_items) {
              user.recent_bookmark_items = rs.data.recent_bookmark_items;
            }
            // console.log('[ Set new BookmarkList]', user);
            // observable execution
            this.userService.setAuth(user); // set new User -> show new list on refresh
          }
        } else {
          // not have user or user logout
          // console.log('[BookmarkComponent] No User -> Redirect to Home page');
          this.router.navigate(['/home']);
        }
      },
      err => console.log(err)
    );
  }
}
