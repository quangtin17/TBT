import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  constructor(@Inject(WINDOW) private window: Window) {}

  createOnline() {
    return merge<boolean>(
      fromEvent(this.window, 'offline').pipe(map(() => false)),
      fromEvent(this.window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(this.window.navigator.onLine);
        sub.complete();
      })
    );
  }
}
