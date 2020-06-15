import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'k-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {
  submitted: boolean;
  message: string;

  constructor(
    private dialogRef: NbDialogRef<any>,
    public toastrService: ToastrService
  ) {
    this.submitted = false;
    this.message = 'Do you really want to do the action?';
  }

  ngOnInit() {}

  closeDialog(rs: any) {
    this.dialogRef.close(rs);
  }

  /**
   * Funct handle submit action
   * Post Form Values to server
   */
  submitForm(action) {
    this.submitted = true;

    const confirmData = {
      confirm: action
    };
    // console.log('confirm action:', confirmData);
    this.dialogRef.close(confirmData);
  }
}
