import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { AuthService } from '../../@auth/services/auth.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  notificationURL = `${environment.APIEndpointOBWStg}/subscribe`;
  currentUser: User;
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.currentUser = this.userService.getCurrentUser;
  }

  postSubscription(sub: PushSubscription) {
    return this.http.post(this.notificationURL, {
      sub,
      id: !this.currentUser ? '0' : this.currentUser.id
    });
  }

  listenServiceWorkerMessages() {
    console.log('Listen from service worker.....');

    const serviceWorker: any = navigator.serviceWorker;
    const handler = event => {
      const notifiedData = event.data;
      console.log('[listenServiceWorkerMessages] notifiedData', notifiedData);
      if (this.isNotificationLogout(notifiedData)) {
        console.log(
          '[listenServiceWorkerMessages] logout data',
          notifiedData.data.notification
        );
        this.clickLogout();
      } else if (this.isNotificationUpdateProfile(notifiedData)) {
        console.log(
          '[listenServiceWorkerMessages] profile data',
          notifiedData.data.notification
        );
        this.updateProfile();
      }
    };

    serviceWorker.addEventListener('message', handler);
  }

  isNotificationLogout(notifiedData) {
    return (
      this.hasNotification(notifiedData) &&
      notifiedData.data.notification.type === 'logout'
    );
  }

  isNotificationUpdateProfile(notifiedData) {
    return (
      this.hasNotification(notifiedData) &&
      notifiedData.data.notification.type === 'update_profile'
    );
  }

  hasNotification(notifiedData) {
    return notifiedData.data && notifiedData.data.notification;
  }

  clickLogout() {
    this.userService.logout().subscribe(
      rs => {
        console.log('log out data: ', rs);
        if (!!rs.success) {
          this.userService.cleanAuth();
        }
      },
      error => {
        console.log('Cannot post log out to server, so just clean auth');
        this.userService.cleanAuth();
      }
    );
  }

  updateProfile() {
    this.authService.getUser().subscribe(
      user => {
        console.log('[updateProfile] rs: ', user);
        if (!!user) {
          this.userService.setAuth(user);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
