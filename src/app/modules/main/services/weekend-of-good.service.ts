import { Injectable } from '@angular/core';
import { ApiService } from '../../@core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeekendOfGoodService {
  constructor(private APIService: ApiService) {}

  /**
   * Get Weekend of Good data by alias
   * @param WeekendAlias
   * Return Weekend of Good detail data JSON
   */
  getWeekendDataByAlias(WeekendAlias: string): Observable<any> {
    // return this.APIService.GET(`${environment.APIWeekend}/${WeekendAlias}`);
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIWeekend}/${WeekendAlias}`
    );
  }
}
