import { Component, OnInit, PLATFORM_ID, Inject } from "@angular/core";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { isPlatformBrowser } from "@angular/common";
import { WINDOW } from "@ng-toolkit/universal";

import { NbDialogRef } from "@nebular/theme";
import { SubscribeService } from "../../services/subscribe.service";
import { IpAddressService } from "../../services/ip-address.service";

@Component({
  selector: "k-form-subscribe",
  templateUrl: "./form-subscribe.component.html",
  styleUrls: ["./form-subscribe.component.scss"]
})
export class FormSubscribeComponent implements OnInit {
  subscribeForm: FormGroup;
  subscribeFormInvalid: FormGroup;
  submitted: boolean;
  showSuccess = false;
  showEmailSubmittedMessage: string = null;
  ipAddress: string;
  constructor(
    // private dialogRef: NbDialogRef<any>,
    private fb: FormBuilder,
    private subscribesService: SubscribeService,
    private ipAddressService: IpAddressService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(WINDOW) private window: Window
  ) {
    this.submitted = false;

    this.ipAddressService.getIpAddress().subscribe(ipRes => {
      this.ipAddress = ipRes.ip;
    });
  }

  ngOnInit() {
    // console.log(this.submitted);
    if (isPlatformBrowser(this.platformId)) {
      this.subscribeForm = this.fb.group({
        email: this.fb.control("", [
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,}$"
          )
        ]),
        sign_up_for_obw_newsletter: this.fb.control(false, []),
        signup_source_tbt: this.window.location.href
      });
    }
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() {
    return this.subscribeForm.controls;
  }

  submitForm() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.subscribeForm.invalid) {
      return;
    }

    const postData = {
      ...this.subscribeForm.value,
      webform_id: "subscribe_to_newsletter_tbt",
      browser_ip_address: this.ipAddress
    };
    if (isPlatformBrowser(this.platformId)) {
      this.subscribesService.postSubscribeForm(postData).subscribe(
        subData => {
          if (!!subData.sid) {
            this.showSuccess = true;
          } else {
            this.showEmailSubmittedMessage = `This email address ${postData.email} has been submitted before.`;
          }
        },
        error => {
          console.log("[postRegisterEnquiryForm] error: ", error);
        }
      );
    }
  }
}
