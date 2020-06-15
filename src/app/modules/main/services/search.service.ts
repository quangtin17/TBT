import { Injectable } from '@angular/core';

import { ApiService } from '../../@core/services';
import { Observable } from 'rxjs';

import { Filter } from '../../@core/models/filter';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private APIService: ApiService) {}

  searchAndFilter(filter?: Filter, page?: number): Observable<any> {
    // // This is because HTTPParams is immutable, and its API methods do not cause object mutation

    let paramStr = '?';
    if (!!filter.term) {
      paramStr += `term=${filter.term}&`;
    }
    if (!!filter.type) {
      paramStr += `type[]=${filter.type}&`;
    }
    if (!!filter.tag && filter.tag.length > 0) {
      filter.tag.forEach(tag => {
        paramStr += `tag[]=${tag}&`;
      });
    }
    if (!!filter.country && filter.country.length > 0) {
      filter.country.forEach(country => {
        paramStr += `country[]=${country}&`;
      });
    }

    if (filter.type === 'stories') {
      if (!!filter.story_type && filter.story_type.length > 0) {
        filter.story_type.forEach(type => {
          paramStr += `story_type[]=${type}&`;
        });
      }
    } else {
      if (!!filter.activity && filter.activity.length > 0) {
        filter.activity.forEach(activity => {
          paramStr += `activity[]=${activity}&`;
        });
      }
    }

    if (!!filter.page_size) {
      paramStr += `page_size=${filter.page_size}&`;
    }
    if (!!page) {
      paramStr += `page=${page}`;
    } else {
      paramStr += `page=0`;
    }
    // console.log('[searchAndFilter] params: ', paramStr);

    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APISearch}${paramStr}`;

    return this.APIService.GET(path);
  }
}
