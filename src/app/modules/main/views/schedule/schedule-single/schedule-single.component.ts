import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SingleScheduleItem } from '../../../../@core/models/singleScheduleItem';

@Component({
  selector: 'k-schedule-single',
  templateUrl: './schedule-single.component.html',
  styleUrls: ['./schedule-single.component.scss']
})
export class ScheduleSingleComponent implements OnInit {
  @Input() event: SingleScheduleItem;
  constructor() {}

  ngOnInit() {}

  /**
   * Funct handle click bookmark button.
   * @param item
   * Output: Change 'bookmarked' status of item.
   */
  bookmark(item: any) {
    // console.log('[Bookmark] Item Title: ', item.title);
    item.bookmarked = !item.bookmarked;
    // console.log('[Bookmark] Item bookmarked: ', item.bookmarked);
  }
}
