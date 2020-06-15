import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { WINDOW } from '@ng-toolkit/universal';

import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { DialogsService } from '../../services/dialogs.service';
import { UserService } from '../../../@core/services/user.service';
import { isPlatformBrowser } from '@angular/common';

// tslint:disable-next-line: max-line-length
import { DialogShareByEmailSuccessComponent } from '../../../@shared/dialogs/dialog-share-by-email-success/dialog-share-by-email-success.component';
import { IpAddressService } from '../../services/ip-address.service';

@Component({
  selector: 'k-dialog-share-by-email',
  templateUrl: './dialog-share-by-email.component.html',
  styleUrls: ['./dialog-share-by-email.component.scss']
})
export class DialogShareByEmailComponent implements OnInit {
  shareForm: FormGroup;
  submitted: boolean;
  currentUserData: any;
  title: string;
  currentHref: string;
  descriptionEmail: string;
  ipAddress: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<any>,
    private dialogsService: DialogsService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    public toastrService: ToastrService,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: any,
    private dialogService: NbDialogService,
    private ipAddressService: IpAddressService
  ) {
    this.submitted = false;
    this.currentUserData = this.userService.getCurrentUser;
    this.title = this.titleService.getTitle();

    if (isPlatformBrowser(this.platformId)) {
      this.currentHref = this.window.location.href;
    }

    if (!this.currentUserData) {
      this.descriptionEmail = '(email address stated above)';
    } else {
      this.descriptionEmail = this.currentUserData.email;
    }

    this.ipAddressService.getIpAddress().subscribe(ipRes => {
      this.ipAddress = ipRes.ip;
      // console.log('[DialogShareByEmailComponent] client ip', this.ipAddress);
    });
  }

  ngOnInit() {
    this.shareForm = this.fb.group({
      to: this.fb.control('', [Validators.required, Validators.email]),
      from: this.fb.control(
        `${
          !!this.currentUserData && this.currentUserData.email
            ? this.currentUserData.email
            : ''
        }`,
        [Validators.required, Validators.email]
      ),
      subject: this.fb.control(`${!!this.title ? this.title : ''}`, [
        Validators.required
      ]),
      note: this.fb.control(''),
      browser_ip_address: this.ipAddress
    });
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() {
    return this.shareForm.controls;
  }

  closeDialog(rs: any) {
    this.dialogRef.close(rs);
  }

  /**
   * Funct handle submit action
   * Post Form Values to server
   */
  submitForm() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.shareForm.invalid) {
      // console.log('[postShareForm] shareForm is invalid !');
      return;
    }

    const postData = {
      ...this.shareForm.value,
      webform_id: 'tbt_share_via_email',
      site_domain: this.window.location.origin,
      story_url: this.window.location.pathname,
      story_title: this.title || ''
    };
    console.log('[postShareForm] postData: ', postData);
    if (isPlatformBrowser(this.platformId)) {
      this.dialogsService
        .postShareByEmailForm(postData)
        // .pipe(first())
        .subscribe(rs => {
          // console.log('rs : ', rs);

          if (!!rs.sid) {
            // console.log('[postShareByEmailForm] Success: ', rs);
            // setTimeout(() =>
            //   this.toastrService.success('Share by email successfully!')
            // );
            this.dialogRef.close({});
            this.dialogService.open(DialogShareByEmailSuccessComponent);
          } else {
            this.toastrService.success('Share by email fail!');
          }
        });
    }
  }

  onUpdateEmailFrom(event: Event) {
    this.descriptionEmail = (<HTMLInputElement>event.target).value;
  }
}
