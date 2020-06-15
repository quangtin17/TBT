import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import {
  NgxGalleryImage,
  NgxGalleryOptions,
  NgxGalleryAnimation,
  NgxGalleryAction
} from 'ngx-gallery';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'k-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnChanges {
  @Input() bannerData: any;

  gallery: NgxGalleryImage[];
  galleryOptions: NgxGalleryOptions[];
  galleryActions: NgxGalleryAction[];
  player: YT.Player;

  playedVideo: boolean;
  isMobile: boolean;
  constructor(private deviceService: DeviceDetectorService) {
    this.playedVideo = false;
    this.isMobile = this.deviceService.isMobile();

    this.galleryOptions = [
      {
        width: '100%',
        height: '450px',
        imageDescription: false,
        thumbnails: false,
        // thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        previewZoom: true,
        previewArrows: true
      },
      {
        breakpoint: 768,
        // imageDescription: false,
        width: '100%',
        height: '260px',
        preview: true,
        thumbnails: false,
        previewSwipe: true,
        previewFullscreen: true,
        previewZoom: true
      },
      {
        breakpoint: 991
        // imageDescription: true
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges) {
    const bannerData: SimpleChange = changes.bannerData;
    // console.log('prev value: ', bannerData.previousValue);
    // console.log('got name: ', bannerData.currentValue);
    if (
      bannerData.currentValue.gallery &&
      bannerData.currentValue.gallery.length > 0
    ) {
      this.gallery = bannerData.currentValue.gallery.map(el => {
        return {
          big: el.img_url ? el.img_url : el.img_url_mobile,
          medium: this.isMobile ? el.img_url_mobile : el.img_url,
          small: this.isMobile ? el.img_url_mobile : el.img_url,
          description: el.title
        };
      });
    }
  }
  ngOnInit() {
    if (this.bannerData.gallery && this.bannerData.gallery.length > 0) {
      this.gallery = this.bannerData.gallery.map(el => {
        return {
          big: el.img_url ? el.img_url : el.img_url_mobile,
          medium: this.isMobile ? el.img_url_mobile : el.img_url,
          small: this.isMobile ? el.img_url_mobile : el.img_url,
          description: el.title
        };
      });
    }
  }

  clickOverlay() {
    this.playedVideo = true;
    this.player.playVideo();
  }

  savePlayer(player) {
    this.player = player;
    // console.log('player instance', player);
  }
  onStateChange(event) {
    // console.log('player state', event.data);
  }
}
