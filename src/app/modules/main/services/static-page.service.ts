import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/services/api.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaticPageService {
  constructor(private APIService: ApiService) {}

  getFAQ(): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIStatic}${environment.APIFaq}`
    );
  }

  getPrivacy(): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIStatic}${environment.APIPrivacy}`
    );
  }

  getTerms(): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIStatic}${environment.APITerms}`
    );
  }
}
