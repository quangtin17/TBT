import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { WINDOW } from '@ng-toolkit/universal';

@Injectable({
  providedIn: 'root'
})
export class ShareGroupService {
  public showShare: Observable<boolean>;
  private showShareSubject: BehaviorSubject<boolean>;

  constructor() {
    // console.log('[ShareGroupService] contructor');

    this.showShareSubject = new BehaviorSubject<boolean>(true);
    this.showShare = this.showShareSubject.asObservable();
  }

  setHiddenStatus(status: boolean) {
    // console.log('[ShareGroupService] setHiddenStatus: ', status);
    this.showShareSubject.next(status);
  }
}
