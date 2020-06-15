import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { JwtService } from './jwt.service';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Http Options default
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true'
    })
  };

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  private formatErrors(error: any) {
    // console.log('[formatErrors] error: ', error);
    // return throwError(error.error);
    return throwError(error);
  }

  GETTEXT(
    path: string,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<any> {
    return this.http.get(path, {
      headers,
      params,
      responseType: 'text',
      withCredentials: true
    });
    // .pipe(catchError(this.formatErrors));
  }
  GET(
    path: string,
    params: HttpParams = new HttpParams(),
    headers: HttpHeaders = new HttpHeaders()
  ): Observable<any> {
    return this.http.get(path, { headers, params, withCredentials: true });
    // .pipe(catchError(this.formatErrors));
  }

  PUT(path: string, body: any = {}): Observable<any> {
    return this.http.put(path, JSON.stringify(body));
    // .pipe(catchError(this.formatErrors));
  }

  POST(path: string, body: any = {}): Observable<any> {
    return this.http.post(path, JSON.stringify(body), {
      headers: this.httpOptions.headers
    });
    // .pipe(catchError(this.formatErrors));
  }

  POST_FORM_DATA(path: string, formData: any): Observable<any> {
    var headersForm = new HttpHeaders();
    headersForm.append('Content-Type', 'application/form-data');

    return this.http
      .post(path, formData, { headers: headersForm })
      .pipe(catchError(this.formatErrors));
  }

  DELETE(path: string): Observable<any> {
    return this.http.delete(path);
    // .pipe(catchError(this.formatErrors));
  }

  PATCH(path: string, body: any = {}): Observable<any> {
    return this.http.patch(path, JSON.stringify(body), this.httpOptions);
    // .pipe(catchError(this.formatErrors));
  }
}
