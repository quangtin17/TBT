import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ApiService } from './api.service';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public optionsCountry: Array<any> = [];
  public optionsStoryType: Array<any> = [];
  public optionsActivity: Array<any> = [];
  public optionsTags: Array<any> = [];
  constructor(
    private APIService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  initFilter() {
    return new Promise<void>((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        // Load Filter if browser
        // console.log('AppInitService.init() called');
        this.getFilters(loadDone);
      } else {
        resolve();
      }

      function loadDone() {
        // Do resolve if Load done callback call
        resolve();
      }
    });
  }

  getFilters(loadDone) {
    let loadSearchDone = false;
    let loadTagsDone = false;
    this.getFilterSearch().subscribe(rs => {
      if (!!rs.success) {
        if (!!rs.data.countries && rs.data.countries.length > 0) {
          rs.data.countries.forEach(el => {
            el.checked = false;
          });
          this.optionsCountry = [...rs.data.countries];
          // console.log(
          //   '[getFilterSearch] optionsCountry: ',
          //   this.optionsCountry
          // );
        }
        if (!!rs.data.story_types && rs.data.story_types.length > 0) {
          rs.data.story_types.forEach(el => {
            el.checked = false;
          });
          this.optionsStoryType = [...rs.data.story_types];
          // console.log(
          //   '[getFilterSearch] optionsStoryType: ',
          //   this.optionsStoryType
          // );
        }
        if (!!rs.data.activities && rs.data.activities.length > 0) {
          rs.data.activities.forEach(el => {
            el.checked = false;
          });
          this.optionsActivity = [...rs.data.activities];
          // console.log(
          //   '[getFilterSearch] optionsActivity: ',
          //   this.optionsActivity
          // );
        }
        loadSearchDone = true; // Set flag true
      }
      if (loadSearchDone && loadTagsDone) {
        loadDone(); // Do Callback if Load done
      }
    });

    this.getFilterTags().subscribe(rs => {
      if (!!rs.success) {
        if (!!rs.data && rs.data.length > 0) {
          rs.data.forEach(el => {
            el.checked = false;
          });
          this.optionsTags = [...rs.data];
          // console.log('[getFilterTags] optionsTags: ', this.optionsTags);
        }
        loadTagsDone = true; // Set flag true
      }
      if (loadSearchDone && loadTagsDone) {
        loadDone(); // Do Callback if Load done
      }
    });
  }

  getFilterTags(): Observable<any> {
    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIFilterTags}`;

    return this.APIService.GET(path);
  }
  getFilterSearch(): Observable<any> {
    const path = `${environment.APIEndpointTBT}${environment.APIPrefix}${environment.APIVersion}${environment.APIFilterSearch}`;

    return this.APIService.GET(path);
  }
}
