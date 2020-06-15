import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { UserService } from '../../../@core/services/user.service';

import { BookmarkData } from '../../../@core/models';

@Component({
  selector: 'k-dialog-bookmark-add-item',
  templateUrl: './dialog-bookmark-add-item.component.html',
  styleUrls: ['./dialog-bookmark-add-item.component.scss']
})
export class DialogBookmarkAddItemComponent implements OnInit {
  bookmarkList: BookmarkData[];
  currentBookmark: BookmarkData;

  constructor(
    private userService: UserService,
    private dialogRef: NbDialogRef<any>
  ) {}

  ngOnInit() {
    let user = this.userService.getCurrentUser;
    if (!!user && !!user.bookmark_lists) {
      this.bookmarkList = user.bookmark_lists;
    }
  }

  addToBookmarkList(listId: string) {
    this.dialogRef.close({
      isCreate: false,
      data: listId
    });
  }

  createNewBookmarkList() {
    this.dialogRef.close({
      isCreate: true
    });
  }
  closeDialog(rs: any) {
    this.dialogRef.close(rs);
  }
}
