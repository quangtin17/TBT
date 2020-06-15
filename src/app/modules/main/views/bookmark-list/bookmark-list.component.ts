import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BookmarkData } from '../../../@core/models/bookmarkData';

@Component({
  selector: 'k-bookmark-list',
  templateUrl: './bookmark-list.component.html',
  styleUrls: ['./bookmark-list.component.scss']
})
export class BookmarkListComponent implements OnInit {
  @Input() bookmarkList: BookmarkData[];
  @Output() onBookmarkListSelected: EventEmitter<BookmarkData>;
  @Output() onCreateBookmarkList: EventEmitter<string>;
  private currentBookmark: BookmarkData;
  constructor() {
    this.onBookmarkListSelected = new EventEmitter();
    this.onCreateBookmarkList = new EventEmitter();
  }
  ngOnInit() {
    // console.log('BookmarkListComponent:', this.bookmarkList);
  }
  createNewBookmarkList(): void {
    // console.log('create new here');
    this.onCreateBookmarkList.emit('creating');
  }

  clicked(bookmark: BookmarkData): void {
    this.currentBookmark = bookmark;
    this.onBookmarkListSelected.emit(bookmark);
  }
  isSelected(bookmark: BookmarkData): boolean {
    if (!bookmark || !this.currentBookmark) {
      return false;
    }
    return bookmark.id === this.currentBookmark.id;
  }
}
