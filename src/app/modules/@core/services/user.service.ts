// Core
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';

// Custom
import { Login, User } from '../models';
import { ApiService } from './api.service';
import { environment } from '../../../../environments/environment';
// import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User>; // Use for local
  public currentUser: Observable<User>; // User Observable for other components subcribe
  private isAuthenticatedSubject: ReplaySubject<boolean>;
  public isAuthenticated: Observable<Boolean>;

  constructor(
    @Inject(LOCAL_STORAGE) private localStorage: any,
    private APIService: ApiService // private angularFireAuth: AngularFireAuth
  ) {
    // load from Local Storage first
    const userLocal = this.localStorage.getItem(environment.CredentialsKey);
    if (!!userLocal) {
      this.currentUserSubject = new BehaviorSubject<User>(
        JSON.parse(userLocal)
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
  }

  // Set Authentication
  setAuth(user: any) {
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);

    // console.log('setAuth: ', user);

    // Store user details and jwt token in local storage to keep user logged in between page refreshes
    this.localStorage.setItem(environment.CredentialsKey, JSON.stringify(user));

    // Store roles
    if (user.roles && user.roles.length > 0) {
      this.localStorage.setItem(
        environment.RolesKey,
        JSON.stringify(user.roles)
      );
    }
    // // Store Bookmark
    // if (user.recent_bookmark_items && user.recent_bookmark_items.length > 0) {
    //   this.localStorage.setItem(
    //     environment.BookmarkListKey,
    //     JSON.stringify(user.recent_bookmark_items)
    //   );
    // }

    // Store Bookmark Recent
    if (user.recent_bookmark_items && user.recent_bookmark_items.length > 0) {
      this.localStorage.setItem(
        environment.BookmarkRecentKey,
        JSON.stringify(user.recent_bookmark_items)
      );
    }

    // Set current user data into observable
    this.currentUserSubject.next(user);
    // console.log('[User Service] Set Auth: ', this.currentUserSubject.value);
  }

  // Clean current Authentication
  cleanAuth() {
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);

    // Remove user details and jwt token in local storage to keep user logged in between page refreshes
    this.localStorage.removeItem(environment.CredentialsKey);

    // Remove roles
    this.localStorage.removeItem(environment.RolesKey);

    // Remove Bookmark recent
    this.localStorage.removeItem(environment.BookmarkRecentKey);

    // Set current user to an empty object
    this.currentUserSubject.next(null);
    // console.log('[User Service] Clean Auth: ', this.currentUserSubject.value);

    this.localStorage.removeItem(`${environment.AccessToken}`);
    this.localStorage.removeItem(`${environment.RefreshToken}`);
    this.localStorage.removeItem(`${environment.SessionToken}`);
  }

  // Method [GET] current user value
  public get getCurrentUser() {
    // console.log('getCurrentUser: ', this.currentUserSubject.value);
    return this.currentUserSubject.value;
  }

  // Method [GET] current user value
  public get getAllBookmarkItem() {
    // console.log('getCurrentUser: ', this.currentUserSubject.value);
    let listBookmark = [];
    if (
      !!this.currentUserSubject.value &&
      !!this.currentUserSubject.value.bookmark_lists
    ) {
      this.currentUserSubject.value.bookmark_lists.forEach(el => {
        listBookmark = [...listBookmark, ...el.bookmark_items];
      });
    }
    //console.log('getAllBookmarkItem: ', listBookmark);

    return listBookmark;
  }

  // Method [GET] current user value
  public get isAuthenticatedUser() {
    // console.log('getCurrentUser: ', this.currentUserSubject.value);
    return (
      this.currentUserSubject.value &&
      this.currentUserSubject.value.roles.includes('authenticated')
    );
  }

  login(loginData: Login): Observable<User> {
    return this.APIService.POST(environment.APILogin, loginData).pipe(
      // use pipe to link operators together
      map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.csrf_token) {
          this.setAuth(data);
        }

        return data;
      })
    );
  }

  register(registerData: any): Observable<User> {
    return this.APIService.POST(environment.APIResister, registerData).pipe(
      // use pipe to link operators together
      map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.csrf_token) {
          this.setAuth(data);
        }
        return data;
      })
    );
  }

  logout() {
    const path = `${environment.APIEndpointOBWStg}${environment.APIPrefix}${environment.APIVersion}${environment.APILogout}`;
    return this.APIService.POST(path);
  }
}
