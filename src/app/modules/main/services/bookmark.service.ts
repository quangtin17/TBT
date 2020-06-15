import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';

import { Observable, BehaviorSubject, from } from 'rxjs';
import { filter, map, flatMap } from 'rxjs/operators';

import { ApiService, UserService } from '../../@core/services';
import { BookmarkItem, User, BookmarkData } from '../../@core/models';
import { environment } from '../../../../environments/environment';
import { NbDialogService } from '@nebular/theme';
import { DialogNotifyFeatureComponent } from '../../@shared/dialogs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private listBookmarkedOfflineSubject: BehaviorSubject<any>; // Use for local
  public bookmarkItemData: Observable<BookmarkItem>;
  public listBookmarkedOffline: Observable<any>;
  currentUserData: User;
  bookmarkLists: BookmarkData[];
  constructor(
    private APIService: ApiService,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private dialogService: NbDialogService,
    private userService: UserService
  ) {
    this.currentUserData = this.userService.getCurrentUser;
    if (this.currentUserData) {
      this.bookmarkLists = this.currentUserData.bookmark_lists;
    }
    // load from Local Storage first
    const bookmarkItems = this.localStorage.getItem(
      environment.BookmarkItemsKey
    );

    if (!!bookmarkItems) {
      this.listBookmarkedOfflineSubject = new BehaviorSubject<any>(
        JSON.parse(bookmarkItems)
      );
    } else {
      this.listBookmarkedOfflineSubject = new BehaviorSubject<any>([]);
    }
  }

  /**
   * Method [GET] current bookmark value
   */
  public get getCurrentBookmarkOffline() {
    // console.log('getCurrentUser: ', this.currentUserSubject.value);
    return this.listBookmarkedOfflineSubject.value;
  }

  /**
   * Funct handle add item to current Bookmark List
   * @param item
   */
  addItemToListBookmark(alias: string, listItems: Array<any>) {
    let currentList = this.listBookmarkedOfflineSubject.value;
    const index = currentList
      .map(el => {
        return el.alias;
      })
      .indexOf(alias);
    // console.log('[addItemToListBookmark] index: ', index);

    if (index >= 0) {
      // Update list to alias
      // console.log(
      //   `[addItemToListBookmark] Found List-> Update item to list [${alias}].`
      // );
      // currentList[index].listItems = listItems;

      listItems.forEach(item => {
        const indexItem = currentList[index].listItems
          .map(el => {
            return el.id;
          })
          .indexOf(item.id);
        if (indexItem >= 0) {
          // found item -> update
          // console.log(
          //   `[addItemToListBookmark] Found Item-> Update item in list [${alias}].`
          // );
          currentList[index].listItems[indexItem] = item;
        } else {
          console.log(
            `[addItemToListBookmark] Not Found Item-> Add item in list [${alias}].`
          );
          currentList[index].listItems.push(item);
        }
      });
    } else {
      console.log(
        `[addItemToListBookmark] Not Found List->  Add list [${alias}].`
      );

      currentList.push({
        alias,
        listItems
      });
    }
    console.log('[addItemToListBookmark] currentList: ', currentList);

    // Save new Bookmark List
    this.listBookmarkedOfflineSubject.next(currentList);
    this.localStorage.setItem(
      environment.BookmarkItemsKey,
      JSON.stringify(currentList)
    );
  }

  getItemFromListBookmark(alias: any) {
    let currentList = this.listBookmarkedOfflineSubject.value;
    const index = currentList
      .map(el => {
        return el.alias;
      })
      .indexOf(alias);
    console.log('[getItemFromListBookmark] index: ', index);
    if (index >= 0) {
      return currentList[index];
    } else {
      return [];
    }
  }

  getBookmarkTabDataByAlias(listQuery: string[]): Observable<any> {
    console.log('[getBookmarkTabDataByAlias] listQuery: ', listQuery);

    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIGetArticleSpotlight}`;
    const postData = {
      ids: listQuery
    };
    return this.APIService.POST(path, postData);
  }
  deleteBookmarkById(id: string): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const path = `${environment.APIEndpointOBWStg}${environment.APIPrefix}${environment.APIVersion}${environment.APIFormDeleteBookmarkList}/${id}`;
    // console.log('deleteBookmarkById  ', path);

    return this.APIService.DELETE(path);
  }

  patchBookmarkById(patchData: any): Observable<any> {
    // console.log('patchBookmarkById', patchData);
    // tslint:disable-next-line: max-line-length
    const path = `${environment.APIEndpointOBWStg}${environment.APIPrefix}${environment.APIVersion}${environment.APIFormUpdateBookmarkList}`;
    return this.APIService.PATCH(path, patchData);
  }

  postCreateBookmarkListForm(formData: any): Observable<any> {
    // tslint:disable-next-line: max-line-length
    const path = `${environment.APIEndpointOBWStg}${environment.APIPrefix}${environment.APIVersion}${environment.APIFormCreateBookmarkList}`;
    return this.APIService.POST(path, formData);
  }

  postUpdateItemToBookmarkList(formData: any): Observable<any> {
    const path = `${environment.APIEndpointOBWStg}${environment.APIAddItemToBookmarkList}`;
    return this.APIService.POST(path, formData);
  }

  openNotifyFeaturesDialog() {
    this.dialogService.open(DialogNotifyFeatureComponent, {
      hasBackdrop: true
    });
  }

  bookmarkTransformDataStream(): Observable<BookmarkItem> {
    return this.userService.currentUser.pipe(
      filter(rs => !!rs),
      flatMap(rs => from(rs.bookmark_lists)),
      flatMap(bookmark => from(bookmark.bookmark_items))
    );
  }
}
