import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AuthService } from '../../../@auth/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'k-dialog-thankyou',
  templateUrl: './dialog-thankyou.component.html',
  styleUrls: ['./dialog-thankyou.component.scss']
})
export class DialogThankyouComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dialogRef: NbDialogRef<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  confirm_title: string;
  confirm_message: string;
  accountCreatedMessage: string;
  firstName: string;
  success: boolean;
  existed: boolean;
  created: boolean;
  accountExistsText: string;
  redirectParams: any;
  ngOnInit() {
    // console.log('redirectParams', this.redirectParams );
  }
  closeDialog() {
    // console.log('closeDialog', this.redirectParams);
    this.dialogRef.close();
    if (
      !!this.redirectParams.action &&
      this.redirectParams.action === 'enquiry-finish'
    ) {
      // clear query param if has been resolve
      // console.log('closeDialog', this.redirectParams);
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {},
        replaceUrl: true
      });
    }
  }
  redirectLogin() {
    this.authService.autoLogin(this.redirectParams);
    this.dialogRef.close();
  }
}
