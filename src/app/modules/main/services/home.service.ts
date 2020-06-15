import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/services';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private APIService: ApiService) {}

  getPageHome(): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${
        environment.APIVersion
      }${environment.APIHome}`
    );
  }
}
