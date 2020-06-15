import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/services/api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DialogsService {
  ShareEmailData: any;
  public accountExistsMessage: Observable<string>;
  private accountExistsMessageSubject: BehaviorSubject<string>;
  private idSubject = new BehaviorSubject(0);
  public id = this.idSubject.asObservable();
  constructor(private APIService: ApiService) {
    this.accountExistsMessageSubject = new BehaviorSubject<string>('');
    this.accountExistsMessage = this.accountExistsMessageSubject.asObservable();
  }

  setId(newId: number) {
    this.idSubject.next(newId);
  }

  setAccountExistsMessage(message: string) {
    this.accountExistsMessageSubject.next(message);
  }

  postEnquiryForm(data: any): Observable<any> {
    // console.log('[DialogsService] postEnquiryForm: ', data);
    return this.APIService.POST(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIFormEnquiry}`,
      data
    );
  }

  postRegisterEnquiryForm(registerData: any): Observable<any> {
    // console.log('[DialogsService] postRegisterEnquiryForm', registerData);
    const path = `${environment.APIEndpointOBWStg}${environment.APIResister}`;
    // console.log('[DialogsService] path', path);
    return this.APIService.POST(path, registerData);
  }

  postShareByEmailForm(formData: any): Observable<any> {
    // console.log('[DialogsService] postRegisterEnquiryForm', registerData);
    const path = `${environment.APIEndpointOBWStg}${environment.APIFormShareByEmail}`;
    return this.APIService.POST(path, formData);
  }

  setShareEmailData(data: any) {
    this.ShareEmailData = data;
  }
}
