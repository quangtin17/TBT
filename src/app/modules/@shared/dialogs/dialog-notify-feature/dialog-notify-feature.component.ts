import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'k-dialog-notify-feature',
  templateUrl: './dialog-notify-feature.component.html',
  styleUrls: ['./dialog-notify-feature.component.scss']
})
export class DialogNotifyFeatureComponent implements OnInit {
  constructor(private dialogRef: NbDialogRef<any>) {}

  ngOnInit() {}
  closeDialog() {
    this.dialogRef.close();
  }
}
