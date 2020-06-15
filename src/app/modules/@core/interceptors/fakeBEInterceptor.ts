import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import {
  MenuDataJSON,
  HomeDataJSON,
  CountryListDataJSON,
  CountryListPage2Data,
  CountryDataJSON,
  CollectionDataJSON,
  CollectionListDataJSON,
  CollectionListPage2DataJSON,
  JourneyDataType1JSON,
  JourneyDataType2JSON,
  JourneyDataType3JSON,
  MeetDataType1,
  MeetDataType2,
  MeetDataType3,
  WeekendDataType1JSON,
  WeekendDataType2JSON,
  WeekendDataType3JSON,
  ExperienceDataType1,
  ExperienceDataType2,
  ExperienceDataType3,
  JourneyInfoData,
  JourneyStoryData,
  CollectionStoriesTabData,
  CollectionExperiencesTabData,
  BookmarkDetailTabData,
  FaqData,
  PrivacyData,
  TermsData
} from '../mock';
import { environment } from '../../../../environments/environment';
// array in local storage for registered users

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  // users = JSON.parse(localStorage.getItem('users')) || [];

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body, urlWithParams } = request;

    const token: string = localStorage.getItem(`${environment.AccessToken}`);

    if (token && !request.url.includes(environment.APIEndpointForum)) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
    }

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      console.log('[Fake BE] handleRoute: ', urlWithParams);
      let params = [];
      let page = '0';
      try {
        params = urlWithParams.split('?')[1].split('&');
        if (params.length > 0) {
          params.forEach(el => {
            let param = el.split('=');
            if (param[0] == 'page') {
              page = param[1];
            }
          });
        }
      } catch (error) {
        console.log('[Fake BE] No params');
      }
      let id = /[^/]*$/.exec(url).toString();
      switch (true) {
        // case url.endsWith('/menu') && method === 'GET':
        //   return getMenuData();
        // case url.endsWith('/homepage') && method === 'GET':
        //   return getHomeData();
        // case url.endsWith('/all-countries') && method === 'GET':
        //   return getCountriesList(parseInt(page));
        // case url.match(/\/country\/\w+$/) && method === 'GET':
        //   return getCountryById();
        // case url.endsWith('/get-articles-spotlight') && method === 'POST':
        //   return getBookmarkDetailTabData();
        // case url.endsWith('/collections') && method === 'GET':
        //   return getCollectionListData(parseInt(page));
        // case url.match(/\/collection\/\w+$/) && method === 'GET':
        //   console.log('collectionId: ', id);
        //   return getCollectionById(id);
        // case url.match(/\/journey\/\w+$/) && method === 'GET':
        //   // console.log('Journey type: ', id);
        //   return getJourneyById(id);
        // case url.match(/\/wog\/\w+$/) && method === 'GET':
        //   return getWeekendById(id);
        // case url.match(/\/meet\/\w+$/) && method === 'GET':
        //   // console.log('Meet type: ', id);
        //   return getMeetById(id);
        // case url.match(/\/experience\/\w+$/) && method === 'GET':
        //   // console.log('Meet type: ', id);
        //   return getExperienceById(id);
        // case url.match('/faq') && method === 'GET':
        //   // console.log('Meet type: ', id);
        //   return getFaq();
        // case url.match('/privacy') && method === 'GET':
        //   // console.log('Meet type: ', id);
        //   return getPrivacy();
        // case url.match('/terms') && method === 'GET':
        //   // console.log('Meet type: ', id);
        //   return getTerms();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions
    function getBookmarkDetailTabData() {
      console.log('getBookmarkDetailTabData');

      return ok(BookmarkDetailTabData);
    }

    function getMenuData() {
      return ok(MenuDataJSON);
    }

    function getHomeData() {
      //   if (!isLoggedIn()) return unauthorized();
      return ok(HomeDataJSON);
    }
    function getCountriesList(page: number) {
      if (page === 1) {
        return ok(CountryListPage2Data);
      } else {
        return ok(CountryListDataJSON);
      }
    }

    function getCountryById() {
      return ok(CountryDataJSON);
    }

    function getCollectionById(id: string) {
      return ok(CollectionDataJSON);
    }

    function getCollectionListData(page: number) {
      if (page === 1) {
        return ok(CollectionListPage2DataJSON);
      } else {
        return ok(CollectionListDataJSON);
      }
    }
    function getJourneyById(type) {
      if (type == '1') {
        return ok(JourneyDataType1JSON);
      } else if (type == '2') {
        return ok(JourneyDataType2JSON);
      } else {
        return ok(JourneyDataType3JSON);
      }
    }

    function getWeekendById(type: string) {
      console.log('getWeekendById type: ', type);

      if (type == '1') {
        return ok(WeekendDataType1JSON);
      } else if (type == '2') {
        return ok(WeekendDataType2JSON);
      } else {
        return ok(WeekendDataType3JSON);
      }
    }

    function getMeetById(type) {
      if (type === '1') {
        return ok(MeetDataType1);
      } else if (type === '2') {
        return ok(MeetDataType2);
      } else {
        return ok(MeetDataType3);
      }
    }

    function getExperienceById(type) {
      if (type === '1') {
        return ok(ExperienceDataType1);
      } else if (type === '2') {
        return ok(ExperienceDataType2);
      } else {
        return ok(ExperienceDataType3);
      }
    }

    function getFaq() {
      return ok(FaqData);
    }

    function getPrivacy() {
      return ok(PrivacyData);
    }

    function getTerms() {
      return ok(TermsData);
    }

    // helper functions

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
