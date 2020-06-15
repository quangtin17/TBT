import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ImageKit } from '../../../@core/helpers';

@Component({
  selector: 'k-img-lazyload',
  templateUrl: './img-lazyload.component.html',
  styleUrls: ['./img-lazyload.component.scss']
})
export class ImgLazyloadComponent implements OnInit {
  @Input() src: string;
  @Input() alt: string;
  @Input() class: string;
  @Input() device: string = 'unknow';

  defaultImage = '/assets/images/noimage.jpg';
  isMobile: boolean;
  show: boolean;
  imagekitSrc: string;

  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
    this.show = this.mobileShow() || this.desktopShow() || this.isUnknowDevice();
  }

  ngOnChanges(changes: SimpleChanges) {
    let currentSrc: string = changes.src.currentValue;
    this.imagekitSrc = this.getImagekitSrc(currentSrc);
  }

  getImagekitSrc(src: string): string {
    let currentSrcObj = new URL(src);
    let optimizeFormat = ImageKit.detectFormatImage();

    // https://leads.ourbetterworld.org/sites/default/files/styles/thumbnail_600x400/public/spotlight-thumbnail2019-08/SG_Hero_edited_Credit-min.jpg?itok=3pAXN-ji
    if (currentSrcObj.hostname === 'leads.ourbetterworld.org') {
      return 'https://ik.imagekit.io/congtran/tbt' + '/tr:f-' + optimizeFormat + currentSrcObj.pathname;
    }
    return src;
  }

  mobileShow() {
    return this.isMobile && this.device === 'mobile';
  }

  desktopShow() {
    return !this.isMobile && this.device === 'desktop';
  }

  isUnknowDevice() {
    return this.device === 'unknow';
  }
}
