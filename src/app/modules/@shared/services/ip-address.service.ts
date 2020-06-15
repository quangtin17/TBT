import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../@core/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {
  constructor(private APIService: ApiService, private http: HttpClient) {}

  getIpAddress(): Observable<any> {
    // console.log('[getIpAddress] url', environment.APIEndpointIpAddress);
    // return this.APIService.GET(`${environment.APIEndpointIpAddress}`);
    return this.http.get(`${environment.APIEndpointIpAddress}`);
  }
}
