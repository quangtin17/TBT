import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/services';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  constructor(private APIService: ApiService) {}

  /**
   * Get ExperienceId Data by Alias
   * @param ExperienceAlias
   * Return ExperienceId detail data JSON
   */
  getExperienceData(ExperienceAlias: string): Observable<any> {
    console.log(`[ExperienceService] ${environment.APIEndpointTBT}${environment.APIPrefix}${
      environment.APIVersion
    }${environment.APIExperience}/${ExperienceAlias}`);

    return this.APIService.GET(
      `${environment.APIEndpointTBT}${environment.APIPrefix}${
        environment.APIVersion
      }${environment.APIExperience}/${ExperienceAlias}`
    );
  }
}
