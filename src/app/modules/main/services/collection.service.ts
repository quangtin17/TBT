import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ApiService } from '../../@core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private APIService: ApiService) {}
  /**
   * Get List All Collections
   * @param page
   * Return list of collections data JSON, with paging.
   */
  getCollectionList(page: number): Observable<any> {
    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APICollectionList}`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('_format', 'json');
    // console.log('[getCollectionList] params : ', params);
    return this.APIService.GET(path, params);
  }

  /**
   * Get Collection by Alias name
   * @param collectionAlias
   * @param page
   * Return list of article of collection data JSON, with paging.
   */
  getCollectionByAlias(alias: string, page: number): Observable<any> {
    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APICollection}/${alias}`;

    const params = new HttpParams().set('page', page.toString());

    // console.log('[getCollectionByAlias] params', params);

    return this.APIService.GET(path, params);
  }

  getCollectionTabDataByAlias(
    CollectionAlias: string,
    TabName: string,
    page: number,
    countries: any[] = null
  ): Observable<any> {
    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APICollection}/${CollectionAlias}/${TabName}`;

    // console.log('countries',countries);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('_format', 'json');
    if (!!countries && countries.length > 0) {
      const strCountries = countries
        .map(x => x.id)
        .reduce((x, y) => x + ',' + y);
      // console.log('path get countries', strCountries);
      params = new HttpParams()
        .set('page', page.toString())
        .set('_format', 'json')
        .set('countries', strCountries);
      // console.log('path get countries', countries, params);
    }
    // console.log('[getCollectionTabDataByAlias] path get collection', path, params);

    return this.APIService.GET(path, params);
  }
}
