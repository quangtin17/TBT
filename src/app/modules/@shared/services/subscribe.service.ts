import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/services/api.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  constructor(private APIService: ApiService) {}

  postSubscribeForm(subscribeData: any): Observable<any> {
    return this.APIService.POST(
      `${environment.APIEndpointOBWStg}${environment.APIFormSubscribe}`,
      subscribeData
    );
  }
}
