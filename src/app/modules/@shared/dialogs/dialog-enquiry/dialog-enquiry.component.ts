import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { NbDialogRef } from "@nebular/theme";
import { LOCAL_STORAGE, WINDOW } from "@ng-toolkit/universal";
import { AuthService } from "../../../@auth/services/auth.service";
import { CountriesCodeJSON } from "../../../@core/mock/countriesCodeData";
import { UserService } from "../../../@core/services/user.service";
import { DialogsService } from "../../services/dialogs.service";
import { IpAddressService } from "../../services/ip-address.service";

@Component({
  selector: "k-dialog-enquiry",
  templateUrl: "./dialog-enquiry.component.html",
  styleUrls: ["./dialog-enquiry.component.scss"]
})
export class DialogEnquiryComponent implements OnInit {
  listCountries: Array<any>;
  enquiryForm: FormGroup;
  enquiryFormInvalid: FormGroup;
  currentUserData: any;
  formData: any;
  selectedCountry: any[];
  storyId: number;
  ipAddress: string;

  submitted: boolean;
  entity_type: string;
  entity_id: string;
  host_id: string;
  ac_campaign_id: string;
  ac_tag: string;
  confirm_title: string;
  confirm_message: string;
  token: string;
  form_id: string;
  host: number;
  accountCreatedTitle: string;
  accountCreatedMessage: string;
  intro_text: string;
  createdSuccess: boolean;
  accountExistsText: string;
  sync_to_ac_form_id: string;

  constructor(
    private dialogRef: NbDialogRef<any>,
    private fb: FormBuilder,
    private dialogsService: DialogsService,
    private userService: UserService,
    private titleService: Title,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private ipAddressService: IpAddressService
  ) {
    this.listCountries = CountriesCodeJSON;
    this.submitted = false;
    this.currentUserData = this.userService.getCurrentUser;

    this.ipAddressService.getIpAddress().subscribe(ipRes => {
      this.ipAddress = ipRes.ip;
      console.log("[DialogEnquiryComponent] client ip", this.ipAddress);
    });
  }

  ngOnInit() {
    this.dialogsService.id.subscribe(idNumber => {
      this.storyId = idNumber;
    });
    console.log(
      "[DialogEnquiryComponent] current user",
      this.userService.getCurrentUser
    );
    this.dialogsService.accountExistsMessage.subscribe(text => {
      this.accountExistsText = text;
    });
    let singPattern =
      "^([(]?[\\+]?65[)]?[-|\\s]?)?[(]?[6|8|9][)]?[-|\\s]?[(]?\\d{3}[)]?[-|\\s]?[(]?\\d{4}[)]?$";
    let otherPattern =
      "^[(]?(?!\\+65)(?!65)[\\+]?\\d{1,3}[)]?([-|\\s]?[(]?\\d{1,13}[)]?)+$";
    // let otherPattern = '';//'[(]?[\\+\\d{1,3}]?[)]?[(]?([-|\\s|\\d]){1,13}[)]+';
    this.enquiryForm = this.fb.group({
      first_name: this.fb.control(
        `${
          this.currentUserData !== null && this.currentUserData
            ? this.currentUserData.firstName
            : ""
        }`,
        [Validators.required]
      ),
      last_name: this.fb.control(
        `${
          this.currentUserData !== null && this.currentUserData
            ? this.currentUserData.lastName
            : ""
        }`,
        [Validators.required]
      ),
      email: this.fb.control(
        `${
          this.currentUserData !== null && this.currentUserData
            ? this.currentUserData.email
            : ""
        }`,
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,}$")
        ]
      ),
      handphone: this.fb.control("", [
        Validators.required,
        Validators.pattern(`${singPattern}|${otherPattern}`),
        Validators.maxLength(19)
      ]),
      country: this.fb.control(null, [Validators.required]),
      message: this.fb.control("", [Validators.required]),
      i_have_read_and_agree_to_the_privacy_policy: this.fb.control("", [
        Validators.required
      ]),
      sign_up_for_newsletter: this.fb.control(true, []),

      entity_type: this.fb.control(this.entity_type),
      entity_id: this.fb.control(this.entity_id),
      host_id: this.fb.control(this.host_id),
      ac_campaign_id: this.fb.control(this.ac_campaign_id),
      sync_to_ac_form_id: this.fb.control(this.ac_campaign_id),
      ac_tag: this.fb.control(this.ac_tag),
      confirm_title: this.fb.control(this.confirm_title),
      confirm_message: this.fb.control(this.confirm_message),
      token: this.fb.control(this.token),
      form_id: this.fb.control(this.form_id),
      host: this.fb.control(this.host),
      accountCreatedTitle: this.accountCreatedTitle,
      accountCreatedMessage: this.accountCreatedMessage,
      intro_text: this.intro_text,
      recaptchaReactive: this.fb.control(null, Validators.required)
    });
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() {
    return this.enquiryForm.controls;
  }

  registerDataConvert(postData) {
    if (postData && !this.currentUserData && this.currentUserData == null) {
      const registerDataStructure = {
        field_account_submit_tbt_enquiry: [{ value: "1" }],
        field_account_first_name: [{ value: postData.first_name }],
        field_account_last_name: [{ value: postData.last_name }],
        name: [{ value: `${postData.first_name}${postData.last_name}` }],
        mail: [{ value: postData.email }],
        field_account_newsletter_tbt: [
          { value: `${postData.sign_up_for_newsletter ? "1" : "0"}` }
        ],
        field_account_accept_tnc: [
          {
            value: `${
              postData.i_have_read_and_agree_to_the_privacy_policy ? "1" : "0"
            }`
          }
        ],
        field_account_signup_url: [{ value: this.window.location.href }],
        field_account_signup_source: [
          { value: `TBT | ${this.titleService.getTitle()}` }
        ]
      };
      console.log("[registerDataConvert] register data", registerDataStructure);
      return registerDataStructure;
    }
    return;
  }

  /**
   * Funct handle submit action
   * Post Form Values to server
   */
  submitForm() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.enquiryForm.invalid) {
      console.log("[postEnquiryForm] enquiryForm is invalid !");

      return;
    }

    let postData = {
      ...this.enquiryForm.value,
      webform_id: "tbt_lead_form",
      browser_ip_address: this.ipAddress
      // sync_to_ac_form_id: 12
    };

    const postResgisterData = this.registerDataConvert(this.enquiryForm.value);
    const dataL = {
      event: "form_submit",
      eventCategory: "Stories",
      eventAction: "Registration Submit",
      eventLabel: `${this.titleService.getTitle()}`,
      timestamp: Date.now(),
      contentType: "form",
      contentName: "registration form",
      contentID: this.storyId,
      formSubmits: 1
    };
    (window as any).dataLayer.push(dataL);
    if (
      postData &&
      (!this.currentUserData || this.currentUserData == null) &&
      isPlatformBrowser(this.platformId)
    ) {
      this.dialogsService.postRegisterEnquiryForm(postResgisterData).subscribe(
        registerData => {
          console.log(
            "[postRegisterEnquiryForm] Register Success, rs: ",
            registerData
          );
          if (!!registerData.status) {
            this.accountCreatedMessage = registerData.message;
            this.createdSuccess = registerData.status;
            // trigger post data here create user set user_status =0
            postData.user_id = registerData.uid;
            postData.user_status = 0;
            this.dialogsService
              .postEnquiryForm(postData)
              // .pipe(first())
              .subscribe(
                data => {
                  console.log("[postEnquiryForm] Post Success, rs: ", data);
                  if (!!data.sid) {
                    this.closeDialog({
                      created: true,
                      success: true,
                      sid: data.sid,
                      uid: postData.user_id,
                      action: "close",
                      accountCreatedMessage: this.accountCreatedMessage,
                      firstName: postData.first_name
                    });
                  } else {
                    console.log("[postEnquiryForm] error: ", data);
                  }
                },
                error => {
                  console.log("[postEnquiryForm] error: ", error.message);
                }
              );
          } else {
            console.log(
              "[postRegisterEnquiryForm] Register Fail, rs: ",
              registerData
            );
            // the email has exist, post the data with user_status = -1
            // then redirect user to login page and show popup after login again
            if (!!registerData.uid) {
              postData.user_id = registerData.uid;
              postData.user_status = -1;
              this.dialogsService
                .postEnquiryForm(postData)
                // .pipe(first())
                .subscribe(
                  data => {
                    console.log("[postEnquiryForm] Post Success, rs: ", data);
                    if (!!data.sid) {
                      this.closeDialog({
                        existed: true,
                        sid: data.sid,
                        uid: postData.user_id,
                        action: "enquiry-in-progress"
                      });
                    } else {
                      console.log("[postEnquiryForm] error: ", data);
                    }
                  },
                  error => {
                    console.log("[postEnquiryForm] error: ", error.message);
                  }
                );
            } else {
              console.log(
                "[postEnquiryForm] error unexpected registerData: ",
                registerData
              );
            }
          }
        },
        error => {
          console.log("[postRegisterEnquiryForm] Register Fail, rs: ", error);
          // the email has exist, post the data with user_status = -1
          // then redirect user to login page and show popup after login again
          if (!!error.error.uid) {
            postData.user_id = error.error.uid;
            postData.user_status = -1;
            this.dialogsService
              .postEnquiryForm(postData)
              // .pipe(first())
              .subscribe(
                data => {
                  console.log("[postEnquiryForm] Post Success, rs: ", data);
                  if (!!data.sid) {
                    this.closeDialog({
                      existed: true,
                      sid: data.sid,
                      uid: postData.user_id,
                      action: "enquiry-in-progress"
                    });
                  } else {
                    console.log("[postEnquiryForm] error: ", data);
                  }
                },
                error1 => {
                  console.log("[postEnquiryForm] error: ", error1.message);
                }
              );
          } else {
            console.log("[postEnquiryForm] error unexpected: ", error);
          }
        }
      );
    } else {
      // user has login, just send the form
      postData.user_id = this.currentUserData.id;
      postData.user_status = 1;
      this.dialogsService.postEnquiryForm(postData).subscribe(
        data => {
          console.log(
            "[postEnquiryForm] User logged in Post Success, rs: ",
            data
          );
          if (!!data.sid) {
            this.closeDialog({
              created: false,
              success: true,
              uid: postData.uid,
              sid: data.sid,
              accountCreatedMessage: "",
              firstName: postData.first_name,
              action: "close"
            });
          } else {
            console.log("[postEnquiryForm] User logged in  error: ", data);
          }
        },
        error => {
          console.log(
            "[postEnquiryForm] User logged in  error: ",
            error.message
          );
        }
      );
    }
  }

  customSearchFunc(term: string, item) {
    term = term.toLocaleLowerCase();
    return (
      item.name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.id.toLocaleLowerCase() === term
    );
  }

  closeDialog(rs: any) {
    this.dialogRef.close(rs);
  }

  onCountrySelected(event: Event) {
    console.log("[onMenuItemSelected] Event: ", event);
  }

  loginByOAuth() {
    this.authService.autoLogin();
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}
