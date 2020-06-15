import { Component, OnInit, Input } from '@angular/core';

import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from 'ngx-gallery';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  activeIndex: number;
  defaultGalleryOptions = [
    {
      width: '960px',
      height: '640px',
      imageDescription: true,
      thumbnails: false,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      previewZoom: true
    },
    // max-width 800
    {
      breakpoint: 800,
      width: '730px',
      height: '400px',
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20
    },
    // max-width 600
    {
      breakpoint: 600,
      imageDescription: false,

      width: '100%',
      height: '200px',
      preview: true,
      thumbnails: false,
      previewSwipe: true,
      previewFullscreen: true,
      previewZoom: true
    }
  ];

  @Input() galleryOptions: NgxGalleryOptions[] = this.defaultGalleryOptions;
  @Input() galleryImages: NgxGalleryImage[];
  constructor() {
    this.activeIndex = 0;
  }

  ngOnInit() {
    // console.log('NgxGalleryImage: ', this.galleryImages);
  }
  eventChange(event: any) {
    console.log('eventChange:', event);
    if (!!event.index) {
      this.activeIndex = event.index;
    }
  }
}
