import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'k-dialog-share-by-email-success',
  templateUrl: './dialog-share-by-email-success.component.html',
  styleUrls: ['./dialog-share-by-email-success.component.scss']
})
export class DialogShareByEmailSuccessComponent implements OnInit {
  constructor(private dialogRef: NbDialogRef<any>) {}

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close();
  }
}
