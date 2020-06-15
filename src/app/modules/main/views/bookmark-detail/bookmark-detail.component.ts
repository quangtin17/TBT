import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Subscription } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';

import { UserService, Pager, PagerService } from '../../../@core';
import { BookmarkService } from '../../services/bookmark.service';

import {
  DialogConfirmComponent,
  DialogTextFieldComponent
} from '../../../@shared/dialogs';
import { User, BookmarkData } from '../../../@core/models';
import { ShareGroupService } from '../../../@shared/services/share-group.service';

@Component({
  selector: 'k-bookmark-detail',
  templateUrl: './bookmark-detail.component.html',
  styleUrls: ['./bookmark-detail.component.scss']
})
export class BookmarkDetailComponent implements OnInit {
  currentUserSubscription: Subscription;

  openBookmarkEditPanel = false;
  bookmarkList: BookmarkData[];
  bookmarkItem: BookmarkData;
  htmlData: any;

  currentUserData: User;
  bookmarkId: string;
  currentPage: number;

  // pager object
  pager: Pager;
  pagedItems: any[];
  options = [
    { value: 'stories', label: 'Show stories' },
    { value: 'experiences', label: 'Show experiences' }
  ];

  constructor(
    private userService: UserService,
    private dialogService: NbDialogService,
    private pagerService: PagerService,
    private activatedRoute: ActivatedRoute,
    private bookmarkService: BookmarkService,
    private toastrService: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private shareGroupService: ShareGroupService
  ) {
    this.currentUserData = this.userService.getCurrentUser;
    this.currentPage = 0;

    this.activatedRoute.queryParams.subscribe(params => {
      if (!!params.page) {
        this.currentPage = parseInt(params.page);
      }
    });

    this.activatedRoute.paramMap.subscribe(params => {
      this.bookmarkId = `${params.get('alias')}`; // Get Id from URL
    });
  }

  ngOnInit() {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      // Assign Subscription to watch userService.currentUser value.
      this.currentUserSubscription = this.userService.currentUser.subscribe(
        rs => {
          // console.log(
          //   '[BookmarkDetailComponent] currentUserSubscription: ',
          //   rs
          // );
          if (!!rs) {
            // have user observable
            if (!!rs.bookmark_lists) {
              // User observable has bookmark list
              this.bookmarkList = rs.bookmark_lists;
              // console.log(
              //   '[BookmarkDetailComponent] bookmarkList: ',
              //   this.bookmarkList
              // );
              this.bookmarkItem = this.bookmarkList.filter(
                // Get Data from User Observable
                x => x.id == this.bookmarkId
              )[0];
            }
          } else {
            // not have user or user logout
            // console.log(
            //   '[BookmarkDetailComponent] No User -> Redirect to Home page'
            // );
            this.router.navigate(['/home']);
          }
        }
      );
    }

    this.shareGroupService.setHiddenStatus(false);
  }

  ngOnDestroy(): void {
    // check is Browser
    if (isPlatformBrowser(this.platformId)) {
      // Unsubscribe for
      this.currentUserSubscription.unsubscribe();
    }
  }

  /**
   * Funct handle click bookmark edit button.
   * Output: toggle panel edit.
   */
  clickEditBookmarkToggle() {
    this.openBookmarkEditPanel = !this.openBookmarkEditPanel;
  }

  clickRenameBtn() {
    this.dialogService
      .open(DialogTextFieldComponent, {
        hasBackdrop: true,
        context: {
          isCreate: false,
          defaultValue: this.bookmarkItem.title,
          btnText: 'Rename',
          excludeValues: this.bookmarkList.map(x => x.title)
        }
      })
      .onClose.subscribe(rs => {
        if (rs.isCreate === false) {
          // console.log('[DialogText onClose] bookmarkId: ', this.bookmarkId);
          // console.log('[DialogText onClose] new value: ', rs);
          const patchData = {
            ...rs.data,
            list_id: this.bookmarkId
          };

          this.bookmarkService.patchBookmarkById(patchData).subscribe(rs => {
            // TODO rename in User Obs
            setTimeout(() =>
              this.toastrService.success('editBookmark successfully!')
            );
            this.bookmarkItem.title = patchData.list_name;
            this.bookmarkList
              .filter(x => x.id === this.bookmarkItem.id)
              .map(x => (x = this.bookmarkItem));
            const user = this.userService.getCurrentUser;
            if (!!user.bookmark_lists) {
              user.bookmark_lists = this.bookmarkList;
            }
            this.userService.setAuth(user); // set new User
          });
        }
      });
  }

  removecurrentBookmarkItem(data: any) {
    // remove id in the list
    const user = this.userService.getCurrentUser;
    if (!!user) {
      if (!!user.bookmark_lists) {
        user.bookmark_lists = data.bookmark_lists;
      }
      if (!!user.recent_bookmark_items) {
        user.recent_bookmark_items = data.recent_bookmark_items;
      }
      this.userService.setAuth(user); // set new User
    }
  }

  clickDeleteBtn() {
    console.log('[clickDeleteBtn]');
    this.dialogService
      .open(DialogConfirmComponent, {
        hasBackdrop: true,
        context: {
          message: 'Are you sure you want to delete this list?'
        }
      })
      .onClose.subscribe(rs => {
        if (rs.confirm) {
          console.log('[Delete List] Item Id: ', this.bookmarkId);
          this.bookmarkService
            .deleteBookmarkById(this.bookmarkId)
            .subscribe(rs => {
              console.log('[deleteBookmarkById]', rs);
              if (!!rs.success) {
                this.removecurrentBookmarkItem(rs.data); // Remove List in User Obser
                this.router.navigate(['/bookmark-list']).then(rs => {
                  setTimeout(() =>
                    this.toastrService.success(
                      'Delete bookmark list successfully!'
                    )
                  );
                });
              } else {
                console.log('[deleteBookmarkById] Fail !');
              }
            });
        }
      });
  }

  onOpenNotifyFeaturesDialog() {
    this.bookmarkService.openNotifyFeaturesDialog();
  }
}
