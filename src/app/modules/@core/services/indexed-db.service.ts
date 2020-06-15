import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: any,
    private localStorage: LocalStorage
  ) {
    if (!('indexedDB' in this.window) && isPlatformBrowser(this.platformId)) {
      throw new Error(`This browser doesn't support IndexedDB`);
    }
  }

  addItem(alias: string, data: {}) {
    this.localStorage.setItem(alias, data).subscribe();
  }

  deleteItem(alias: string) {
    this.localStorage.removeItem(alias).subscribe();
  }

  getItem(alias: string): Observable<any> {
    return this.localStorage.getItem(alias);
  }

  clearAllItems() {
    this.localStorage.clear().subscribe();
  }
}
