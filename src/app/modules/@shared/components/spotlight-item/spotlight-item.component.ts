import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  NgxGalleryImage,
  NgxGalleryOptions,
  NgxGalleryAnimation
} from 'ngx-gallery';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SpotlightItemData } from '../../../@core/models/spotlightItemData';

@Component({
  selector: 'k-spotlight-item',
  templateUrl: './spotlight-item.component.html',
  styleUrls: ['./spotlight-item.component.scss']
})
export class SpotlightItemComponent implements OnInit {
  @Input() item: SpotlightItemData;
  @Input() isSpotlight: boolean;
  @Input() isShowCountry: boolean;
  @Input() isShowShortDesc: boolean;
  @Input() isShowExperienceLink: boolean;
  @Input() target: string;
  @Input() isShowPublish: boolean;
  @Input() isShowSocialEnterprise: boolean;

  @Output() bookmarkedAnItem: EventEmitter<SpotlightItemData>;

  isMobile: boolean;
  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.bookmarkedAnItem = new EventEmitter();
    this.isSpotlight = false;
    this.isShowShortDesc = false;
    this.isShowCountry = true;
    this.isShowExperienceLink = false;
    this.target = '_self';
    this.isShowPublish = true;
    this.isShowSocialEnterprise = false;
  }

  ngOnInit() {}
  bookmark(item: SpotlightItemData) {
    item.bookmarked = !item.bookmarked;
    console.log('bookmark', item);
    this.bookmarkedAnItem.emit(item);
  }
}
