import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { PageScrollService } from 'ngx-page-scroll-core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  constructor(
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private pageScrollService: PageScrollService
  ) {}

  scrollToTarget() {
    if (isPlatformBrowser(this.platformId)) {
      // document.querySelector('#bannerId').scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      //   inline: 'end'
      // });
      this.pageScrollService.scroll({
        document: this.document,
        scrollTarget: '#bannerId',
        scrollOffset: 200
      });
    }
  }
}
