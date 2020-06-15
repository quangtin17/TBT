import { Component, OnInit } from '@angular/core';

import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'k-dialog-bookmark-require-connection',
  templateUrl: './dialog-bookmark-require-connection.component.html',
  styleUrls: ['./dialog-bookmark-require-connection.component.scss']
})
export class DialogBookmarkRequireConnectionComponent implements OnInit {
  constructor(private dialogRef: NbDialogRef<any>) {}

  ngOnInit() {}

  clickCloseLoginBtn() {
    this.dialogRef.close();
  }
}
