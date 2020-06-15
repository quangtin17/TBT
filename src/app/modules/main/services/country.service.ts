import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/services';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private APIService: ApiService) {}

  /**
   * Get List All Countries
   * @param page
   * Return list of countries data JSON, with paging.
   */
  getCountriesList(page: number): Observable<any> {
    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${
      environment.APIVersion
    }${environment.APICountryList}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('_format', 'json');
    // console.log('[CountryService] getCountriesList : ', params);
    return this.APIService.GET(path, params);
  }

  /**
   * Get Country Detail by Alias
   * @param CountryId
   * Return country data JSON
   */
  getCountryByAlias(CountryAlias: string): Observable<any> {
    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${
        environment.APIVersion
      }${environment.APICountry}/${CountryAlias}`
    );
  }
}
