import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService, UserService, User } from '../../@core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NbDialogService } from '@nebular/theme';
import { Location, isPlatformBrowser } from '@angular/common';

import { DialogEnquiryComponent } from '../../@shared/dialogs/dialog-enquiry/dialog-enquiry.component';
import { DialogThankyouComponent } from '../../@shared/dialogs/dialog-thankyou/dialog-thankyou.component';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JourneyService {
  journeyHTMLData: any;
  formDataLocalStorage: any;
  urlNoParams: string;
  isBookmarked: boolean;

  private journeyObj: any;

  public journeyData: Observable<any>;
  private journeyDataSubject: BehaviorSubject<any>;
  private currentUser: User;

  private idSubject = new BehaviorSubject(0);
  public id = this.idSubject.asObservable();
  constructor(
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private APIService: ApiService,
    private dialogService: NbDialogService,
    private userService: UserService,
    private toastService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.journeyObj = {
      alias: '',
      // isBookmarked: '',
      id: '',
      enquiry: ''
    };
    this.journeyDataSubject = new BehaviorSubject<any>(this.journeyObj);
    this.journeyData = this.journeyDataSubject.asObservable();
    this.urlNoParams = this.router.url.split('?')[0] || '';

    const storedData = this.localStorage.getItem('FormData');
    if (!!storedData) {
      this.formDataLocalStorage = JSON.parse(storedData);
    }
  }

  setAlias(newAlias: string) {
    this.journeyObj.alias = newAlias;
    this.journeyDataSubject.next(this.journeyObj);
  }

  setBookmark(isBookmarked: boolean) {
    this.journeyObj.isBookmarked = isBookmarked;
    this.journeyDataSubject.next(this.journeyObj);
  }

  setEnquiry(hasEnquiry: boolean) {
    this.journeyObj.enquiry = hasEnquiry;
    this.journeyDataSubject.next(this.journeyObj);
  }

  setId(newId: number) {
    this.journeyObj.id = newId;
    this.journeyDataSubject.next(this.journeyObj);

    this.idSubject.next(newId);
  }
  /**
   * Get Journey Data by Alias
   * @param JourneyAlias
   *  Return Journey detail data JSON
   */
  getJourneyDataByAlias(JourneyAlias: string): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIJourney}/${JourneyAlias}`
    );
  }

  getJourneyTabDataByAlias(
    JourneyAlias: string,
    TabName: string
  ): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIJourney}/${JourneyAlias}${TabName}`
    );
  }

  postUpdateEnquiryForm(data: any) {
    return this.APIService.POST(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIUpdateEnquiry}`,
      data
    );
  }
  /**
   * Set Journey Data to this service.
   * Journey Info + Journey Story can access by this service.
   */
  setHTMLData(data: any) {
    this.journeyHTMLData = data;
  }

  openDialogThankYou(queryParams: any) {
    this.currentUser = this.userService.getCurrentUser;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {},
      replaceUrl: true
      // queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
    // this.location.go(this.urlNoParams);
    if (
      !!queryParams.get('uid') &&
      !!queryParams.get('sid') &&
      !!this.currentUser &&
      queryParams.get('uid') === this.currentUser.id
    ) {
      // console.log('[thankyou for] existed account', this.currentUser.id);
      const msgArr = this.journeyHTMLData.enquiry_form.confirm_message.split(
        '|'
      );
      let confirmMsg = msgArr.length > 1 ? msgArr[1] : msgArr[0];
      const currentAction = queryParams.get('action');
      // console.log('currentAction', currentAction);

      if (!!currentAction && currentAction === 'enquiryNewAccount') {
        // show default thankyou msg
        let host_name = !!this.journeyHTMLData.enquiry_form.host_name
          ? ` to ${this.journeyHTMLData.enquiry_form.host_name}`
          : '';
        confirmMsg = `Your account has been set up and your enquiry has been sent${host_name}. They will get in touch with you soon.`;
        // if form has custom message show that message
        confirmMsg = !!this.journeyHTMLData.enquiry_form.new_account_message
          ? this.journeyHTMLData.enquiry_form.new_account_message
          : confirmMsg;

        this.dialogService.open(DialogThankyouComponent, {
          context: {
            success: true,
            confirm_title: this.journeyHTMLData.enquiry_form.confirm_title,
            confirm_message: confirmMsg,
            firstName: this.currentUser.firstName,
            created: true,
            existed: false,
            redirectParams: {
              action: 'enquiry-finish'
            }
          }
        });
      } else if (currentAction === 'enquiry-in-progress') {
        // action = enquiryInprogress post data and get thankyou
        const postData = {
          uid: queryParams.get('uid'),
          sid: queryParams.get('sid')
        };
        this.postUpdateEnquiryForm(postData).subscribe(
          data => {
            // console.log('[openDialogThankYou] Post Success, rs: ', data);
            this.dialogService.open(DialogThankyouComponent, {
              context: {
                success: true,
                confirm_title: this.journeyHTMLData.enquiry_form.confirm_title,
                confirm_message: confirmMsg,
                firstName: this.currentUser.firstName,
                created: true,
                existed: false,
                redirectParams: {
                  action: 'enquiry-finish'
                }
              }
            });
          },
          error => {
            // console.log('[openDialogThankYou] Post error: ', error.error);
            let errorMsg = error.statusText;
            if (!!error.error.data && !!error.error.data.message) {
              errorMsg = error.error.data.message;
            }
            this.toastService.error(errorMsg, 'Error Submit the Enquiry', {
              timeOut: 2000
            });
            this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: {},
              replaceUrl: true
              // queryParamsHandling: 'merge', // remove to replace all query params by provided
            });
          }
        );
      }
    }
  }

  openEnquiryDialog() {
    // console.log(
    //   '[openEnquiryDialog] enquiry_form: ',
    //   this.journeyHTMLData.enquiry_form
    // );
    this.dialogService
      .open(DialogEnquiryComponent, {
        hasBackdrop: true,
        context: {
          entity_type: this.journeyHTMLData.enquiry_form.entity_type,
          entity_id: this.journeyHTMLData.enquiry_form.entity_id,
          host_id: this.journeyHTMLData.enquiry_form.host_id,
          ac_campaign_id: this.journeyHTMLData.enquiry_form.ac_campaign_id,
          ac_tag: this.journeyHTMLData.enquiry_form.ac_tag,
          confirm_title: this.journeyHTMLData.enquiry_form.confirm_title,
          confirm_message: this.journeyHTMLData.enquiry_form.confirm_message,
          token: this.journeyHTMLData.enquiry_form.token,
          form_id: this.journeyHTMLData.enquiry_form.form_id,
          host: +this.journeyHTMLData.enquiry_form.host_id, // convert to number,
          intro_text: this.journeyHTMLData.enquiry_form.intro_text
        }
      })
      .onClose.subscribe(rs => {
        if (!!rs.success) {
          // console.log(
          //   '[closeEnquiryDialog] data close create new account:',
          //   rs
          // );
          const confirmMsg =
            rs.created && !!rs.created
              ? this.journeyHTMLData.enquiry_form.confirm_message.split('|')[0]
              : this.journeyHTMLData.enquiry_form.confirm_message.split('|')[1];

          this.dialogService.open(DialogThankyouComponent, {
            context: {
              success: rs.success,
              confirm_title: this.journeyHTMLData.enquiry_form.confirm_title,
              confirm_message: confirmMsg,
              firstName: rs.firstName,
              created: rs.created,
              redirectParams: {
                uid: rs.uid,
                sid: rs.sid,
                action: rs.action
              }
            }
          });
        } else if (!!rs.existed) {
          // console.log('[closeEnquiryDialog] data close existed account', rs);
          const msgArr = this.journeyHTMLData.enquiry_form.confirm_message.split(
            '|'
          );
          const confirmMsg = msgArr.length > 1 ? msgArr[1] : msgArr[0];

          this.dialogService.open(DialogThankyouComponent, {
            context: {
              success: rs.success,
              confirm_title: this.journeyHTMLData.enquiry_form.confirm_title,
              confirm_message: confirmMsg,
              firstName: rs.firstName,
              created: rs.created,
              existed: rs.existed,
              redirectParams: {
                uid: rs.uid,
                sid: rs.sid,
                action: rs.action
              }
            }
          });
        }
      });
  }

  getAllJourneyByAlias(JourneyAlias: string) {
    const journeyMain = this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIJourney}/${JourneyAlias}`
    );
    const journeyStory = this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIJourney}/${JourneyAlias}${environment.APIJourneyStory}`
    );
    const journeyInfo = this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIJourney}/${JourneyAlias}${environment.APIJourneyInfo}`
    );
    return [journeyMain, journeyStory, journeyInfo];
    // forkJoin = PromiseAll
  }
}
