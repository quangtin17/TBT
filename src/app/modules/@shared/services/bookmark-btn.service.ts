import { Injectable, Inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { WINDOW } from '@ng-toolkit/universal';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { WeekendOfGoodService } from '../../main/services/weekend-of-good.service';
import { MeetService } from '../../main/services/meet.service';
import { JourneyService } from '../../main/services/journey.service';
import { IndexedDbService } from '../../@core/services/indexed-db.service';
import { ExperienceService } from '../../main/services/experience.service';
import { UserService } from '../../@core/services/user.service';
import { User } from '../../@core/models/user';
import { ConnectionService } from '../../@core/services/connection.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarkBtnService {
  currentUserData: User;
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
    private weekendOfGoodService: WeekendOfGoodService,
    private meetService: MeetService,
    private journeyService: JourneyService,
    private experienceService: ExperienceService,
    private indexedDbService: IndexedDbService,
    private userService: UserService,
    private connectionService: ConnectionService
  ) {
    this.currentUserData = this.userService.getCurrentUser;
  }

  saveDataToIndexedDB(data: any) {
    this.connectionService.createOnline().subscribe(isOnline => {
      if (isPlatformBrowser(this.platformId) && isOnline) {
        switch (data.type) {
          case 'weekend-of-good':
            this.getWeekendOfGoodData(data);
            break;
          case 'meet':
            this.getMeetData(data);
            break;
          case 'journey':
            this.getJourneyData(data);
            break;
          case 'experiences':
            this.getExperiencesData(data);
            break;
          default:
            console.log(
              'BookmarkBtnService -> saveDataToIndexedDB There is no data to get'
            );
            break;
        }
      }
    });
  }

  getWeekendOfGoodData(data: any) {
    this.weekendOfGoodService
      .getWeekendDataByAlias(data.alias)
      .subscribe(response => {
        this.indexedDbService.addItem(data.alias, {
          ...response.data,
          alias: data.alias
        });
      });
  }

  getMeetData(data: any) {
    this.meetService.getMeetData(data.alias).subscribe(response => {
      this.indexedDbService.addItem(data.alias, {
        ...response.data,
        alias: data.alias
      });
    });
  }

  getJourneyData(data: any) {
    const journeyAPIArray = this.journeyService.getAllJourneyByAlias(
      data.alias
    );

    forkJoin(journeyAPIArray).subscribe(response => {
      let journeytData: {} = {};
      journeytData = {
        ...response[0].data,
        ...response[1].data,
        ...response[2].data,
        alias: data.alias
      };
      this.indexedDbService.addItem(data.alias, journeytData);
    });
  }

  getExperiencesData(data: any) {
    this.experienceService.getExperienceData(data.alias).subscribe(response => {
      this.indexedDbService.addItem(data.alias, {
        ...response.data,
        alias: data.alias
      });
    });
  }

  deleteBookmarkItem(alias: string) {
    this.indexedDbService.deleteItem(alias);
  }

  getImageUrl(obj: any) {
    const proto = Object.prototype;
    const toString = proto.toString;
    const hasOwn = proto.hasOwnProperty.bind(obj);
    const URL = (this.window as any).URL;

    for (const prop in obj) {
      if (hasOwn(prop)) {
        if (prop === 'img_url' || prop === 'img_url_mobile') {
          this.dataURItoBase64(
            'https://images.unsplash.com/photo-1570121962635-3552954619a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
          ).then(dataurl => {
            // obj[prop] = URL.createObjectURL(this.dataURIToBlob(dataurl));
            obj[prop] = dataurl;
          });
          // this.dataURIToBlob(obj[prop]);
        } else if (
          '[object Array]' === toString.call(obj[prop]) ||
          '[object Object]' === toString.call(obj[prop])
        ) {
          this.getImageUrl(obj[prop]);
        }
      }
    }
    return obj;
  }

  dataURItoBase64(dataURI: string): Promise<any> {
    return fetch(dataURI)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  }

  dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const _ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
    }

    const dataView = new DataView(arrayBuffer);
    const blob = new Blob([dataView], { type: mimeString });
    return blob;
  }

  clearAllBookmarks() {
    this.indexedDbService.clearAllItems();
  }
}
