import { Component, OnInit, Input, Inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WINDOW } from '@ng-toolkit/universal';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
@Component({
  selector: 'k-story-travellver-note',
  templateUrl: './story-travellver-note.component.html',
  styleUrls: ['./story-travellver-note.component.scss']
})
export class StoryTravellverNoteComponent implements OnInit {
  @Input() travellverNote;
  showCount: number;
  isDesktop: boolean;
  constructor(
    private deviceService: DeviceDetectorService,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isDesktop = this.deviceService.isDesktop();
    this.showCount = 4;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.window.matchMedia('(min-width: 920px)').matches) {
        this.showCount = this.travellverNote.list.length;
      }
    }
  }
}
