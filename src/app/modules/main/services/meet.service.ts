import { Injectable } from '@angular/core';
import { ApiService } from '../../@core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MeetService {
  constructor(private APIService: ApiService) {}

  /**
   * Get Meet Data by Id
   * @param MeetId
   *  Return Meet detail data JSON
   */
  getMeetData(MeetAlias: string): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${
        environment.APIVersion
      }${environment.APIMeet}/${MeetAlias}`
    );
  }
}
