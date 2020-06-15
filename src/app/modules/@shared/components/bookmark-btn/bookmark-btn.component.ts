import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';

import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';

import { BookmarkService } from '../../../main/services/bookmark.service';
import { UserService } from '../../../@core/services/user.service';
import { AuthService } from '../../../@auth/services/auth.service';

import {
  DialogTextFieldComponent,
  DialogBookmarkAddItemComponent,
  DialogBookmarkRequireAuthComponent,
  DialogBookmarkRequireConnectionComponent
} from '../../dialogs';

import { User, SpotlightItemData, BookmarkItem } from '../../../@core/models';
import { environment } from '../../../../../environments/environment';
import { BookmarkBtnService } from '../../services/bookmark-btn.service';
import { ConnectionService } from '../../../@core/services/connection.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'k-bookmark-btn',
  templateUrl: './bookmark-btn.component.html',
  styleUrls: ['./bookmark-btn.component.scss']
})
export class BookmarkBtnComponent implements OnInit, OnDestroy {
  newList: string;
  currentUserData: User;
  listItems: BookmarkItem[];
  listIds: string[];
  openLoginPanel: boolean;
  isOnline: boolean;
  connectionSubcription: Subscription;

  @Input() item: SpotlightItemData;
  @Input() btnType: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private userService: UserService,

    private nbDialogService: NbDialogService,
    private bookmarkService: BookmarkService,
    private toastrService: ToastrService,
    private bookmarkBtnService: BookmarkBtnService,
    private connectionService: ConnectionService
  ) {
    // this.currentUserData = this.userService.getCurrentUser;
    this.openLoginPanel = false;
  }

  ngOnInit() {
    // let a = this.userService.getAllBookmarkItem;
    // console.log('[getAllBookmarkItem] ', a);
    if (isPlatformBrowser(this.platformId)) {
      this.connectionSubcription = this.connectionService
        .createOnline()
        .subscribe(isOnline => {
          this.isOnline = isOnline;
        });
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (!!this.connectionSubcription) {
      this.connectionSubcription.unsubscribe();
    }
  }

  bookmark(item: SpotlightItemData) {
    // item.bookmarked = !item.bookmarked;
    // console.log('TCL: BookmarkBtnComponent -> isOnline', this.isOnline);
    // console.log('[bookmark] item', item);
    // this.onBookmarkedAnItem.emit(item);

    // get current User data
    this.currentUserData = this.userService.getCurrentUser;
    if (!this.isOnline) {
      this.nbDialogService.open(DialogBookmarkRequireConnectionComponent);
    } else if (!this.currentUserData && this.isOnline) {
      this.nbDialogService.open(DialogBookmarkRequireAuthComponent);
    } else if (this.currentUserData && this.isOnline) {
      // have user
      if (!item.bookmarked) {
        // show Dialog Add bookmark
        this.nbDialogService
          .open(DialogBookmarkAddItemComponent)
          .onClose.subscribe(rs => {
            // Receive Data from Create Bookmark Dialog
            // console.log('[Receive Data from Create Bookmark Dialog] :', rs);

            if (rs.isCreate) {
              // Create New
              this.openDialogInputNewListName(item);
            } else {
              if (!!rs.data) {
                // console.log('Add item to list ', rs.data);
                // Add to Existed List
                this.addItemToBookmarkList(item, rs.data, '', false);

                this.bookmarkBtnService.saveDataToIndexedDB(item);
              }
            }
          });
      } else {
        this.remmoveItemFromBookmarkList(item);
      }
    }
  }

  openDialogInputNewListName(item: SpotlightItemData) {
    this.nbDialogService
      .open(DialogTextFieldComponent, {
        context: {
          isCreate: true,
          btnText: 'Create',
          excludeValues: this.currentUserData.bookmark_lists.map(x => x.title)
        }
      })
      .onClose.subscribe(rs => {
        // Receive Data from Create Bookmark Dialog
        if (rs.isCreate) {
          if (!!rs.data) {
            console.log('Create new list to list', rs.data);
            // Add to New List
            this.addItemToBookmarkList(item, '', rs.data.list_name, true);
          }
          // this.callAPICreateNewList(rs.data).subscribe(data=>{
          //   console.log('after call api', data);
          // });
        }
      });
  }

  callAPICreateNewList(data: any): void {
    console.log(`[callAPICreateNewList] data: `, data);

    this.bookmarkService.postCreateBookmarkListForm(data).subscribe(rs => {
      console.log('[postCreateBookmarkListForm] rs: ', rs);

      if (!!rs.success) {
        setTimeout(() =>
          this.toastrService.success('Create bookmark list successfully!')
        );

        // Set new BookmarkList to User Observable
        let user = this.userService.getCurrentUser;
        if (!!user && !!user.bookmark_lists) {
          user.bookmark_lists = rs.data.bookmark_lists;
          console.log('[postCreateBookmarkListForm]', user);
          this.userService.setAuth(user); // set new User -> show new list on refresh
        }
      } else {
        console.log('[postCreateBookmarkListForm] Fail !');
      }
    });
  }

  addItemToBookmarkList(
    item: SpotlightItemData,
    listId: string,
    listName: string,
    is_new: boolean
  ) {
    const countryCode = !!item.country_code ? '|' + item.country_code : '';
    const postData = {
      site_domain: `${environment.APIEndpointTBT}`,
      obj_url: item.alias,
      user_id: this.currentUserData.id,
      obj_title: item.title,
      obj_type: 'node',
      obj_subtype: `${item.type}${countryCode}`,
      obj_id: item.id,
      action_type: 'bookmark',
      action_status: 'add',
      list_id: listId,
      list_name: listName,
      new_list: is_new
    };
    // console.log(`[addItemToBookmarkList] item: `, item);

    this.bookmarkService.postUpdateItemToBookmarkList(postData).subscribe(
      rs => {
        // console.log(`[postUpdateItemToBookmarkList] rs: `, rs);
        if (!!rs.success) {
          item.bookmarked = true;
          // Set new BookmarkList to User Observable
          let user = this.userService.getCurrentUser;
          if (!!user) {
            if (!!user.bookmark_lists) {
              user.bookmark_lists = rs.data.bookmark_lists;
            }
            if (!!user.recent_bookmark_items) {
              user.recent_bookmark_items = rs.data.recent_bookmark_items;
            }
            // console.log('[Set new BookmarkList] user: ', user);
            // observable execution
            this.userService.setAuth(user); // set new User -> show new list on refresh
            setTimeout(() =>
              this.toastrService.success(
                'Add item to bookmark list successfully!'
              )
            );
          }
        } else {
          console.log(`[postUpdateItemToBookmarkList] Fail !`);
        }
      },
      err => console.log(err)
    );
  }

  remmoveItemFromBookmarkList(item: SpotlightItemData) {
    // console.log('[remmoveItemFromBookmarkList] item: ', item);

    const countryCode = !!item.country_code ? '|' + item.country_code : '';
    const postData = {
      site_domain: `${environment.APIEndpointTBT}`,
      obj_url: item.alias,
      user_id: this.currentUserData.id,
      obj_title: item.title,
      obj_type: 'node',
      obj_subtype: `${item.type}${countryCode}`,
      obj_id: item.id,
      action_type: 'bookmark',
      action_status: 'remove',
      list_id: '',
      new_list: false
    };
    this.bookmarkService.postUpdateItemToBookmarkList(postData).subscribe(
      rs => {
        // console.log('postAddItemToBookmarkList', rs);
        if (!!rs.success) {
          // Set new BookmarkList to User Observable
          let user = this.userService.getCurrentUser;
          if (!!user) {
            if (!!user.bookmark_lists) {
              user.bookmark_lists = rs.data.bookmark_lists;
            }
            if (!!user.recent_bookmark_items) {
              user.recent_bookmark_items = rs.data.recent_bookmark_items;
            }
            // console.log('[ Set new BookmarkList after remove]', user);
            // observable execution
            this.userService.setAuth(user); // set new User -> show new list on refresh

            setTimeout(() =>
              this.toastrService.success(
                'Remove item from bookmark list successfully!'
              )
            );
          }
          item.bookmarked = false;

          this.bookmarkBtnService.deleteBookmarkItem(item.alias);
        } else {
          console.log('[remmoveItemFromBookmarkList] Fail !');
        }
      },
      err => console.log(err)
    );
  }
}
