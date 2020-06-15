import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/services';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  constructor(private APIService: ApiService) {}
  id: string;
  getHomeForum(): Observable<any> {
    // console.log(
    //   `${environment.APIEndpointForum}${environment.APIPrefix}${
    //     environment.APIForumHomePage
    //   }`
    // );

    return this.APIService.GET(
      `${environment.APIEndpointForum}${environment.APIPrefix}${environment.APIForumHomePage}`
    );
  }

  getStoryForum(storyId: number): Observable<any> {
    // console.log(
    //   `Story forum data: ${environment.APIEndpointForum}${
    //     environment.APIPrefix
    //   }${environment.APIForumVersion}${environment.APIForumStory}/${storyId}`
    // );

    return this.APIService.GET(
      `${environment.APIEndpointForum}${environment.APIPrefix}${environment.APIForumVersion}${environment.APIForumStory}/${storyId}`
    );
  }

  getCountryForum(countryCode: string): Observable<any> {
    // console.log(
    //   `[getCountryForum] url: ${environment.APIEndpointForum}${environment.APIPrefix}${environment.APIForumVersion}${environment.APICountryForum}/${countryCode}`
    // );

    return this.APIService.GET(
      `${environment.APIEndpointForum}${environment.APIPrefix}${environment.APIForumVersion}${environment.APICountryForum}/${countryCode}`
    );
  }
}
