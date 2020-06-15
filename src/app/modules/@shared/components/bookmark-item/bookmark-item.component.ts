import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BookmarkItem, SpotlightItemData } from '../../../@core/models';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'k-bookmark-item',
  templateUrl: './bookmark-item.component.html',
  styleUrls: ['./bookmark-item.component.scss']
})
export class BookmarkItemComponent implements OnInit {
  @Input() item: SpotlightItemData;
  @Output() onBookmarkedAnItem: EventEmitter<SpotlightItemData>;
  isMobile: boolean;
  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.onBookmarkedAnItem = new EventEmitter();
  }
  ngOnInit() {}
  bookmark(item: SpotlightItemData) {
    item.bookmarked = !item.bookmarked;
    // console.log('bookmark toggle', item);
    this.onBookmarkedAnItem.emit(item);
  }
}
