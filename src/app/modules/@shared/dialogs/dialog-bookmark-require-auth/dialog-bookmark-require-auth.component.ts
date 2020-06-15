import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../@auth/services/auth.service';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'k-dialog-bookmark-require-auth',
  templateUrl: './dialog-bookmark-require-auth.component.html',
  styleUrls: ['./dialog-bookmark-require-auth.component.scss']
})
export class DialogBookmarkRequireAuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dialogRef: NbDialogRef<any>
  ) {}

  ngOnInit() {}

  clickLoginBtn() {
    console.log('[clickLoginBtn] Auto Login.');
    this.authService.autoLogin();
  }
  clickRegisterBtn() {
    console.log('[clickRegisterBtn] go to register.');
    this.authService.autoRegister();
  }

  clickCloseLoginBtn() {
    this.dialogRef.close();
  }
}
