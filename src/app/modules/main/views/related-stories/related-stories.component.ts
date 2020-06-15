import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'k-related-stories',
  templateUrl: './related-stories.component.html',
  styleUrls: ['./related-stories.component.scss']
})
export class RelatedStoriesComponent implements OnInit, OnDestroy {
  @Input() relatedStoriesInput: any;
  @Input() relatedStoriesType: any;
  currentUserSubscription: Subscription;
  public relatedStories: any;
  constructor(private bookmarkService: BookmarkService) {
    this.relatedStories = this.relatedStoriesInput;
  }

  ngOnInit() {
    this.relatedStories = this.relatedStoriesInput;
    // console.log('related stories', this.relatedStories);
    if (!!this.relatedStories && !!this.relatedStories.list_stories) {
      // console.log("Set spotlight data",rs.data, this.spotlightData);
      this.currentUserSubscription = this.bookmarkService
        .bookmarkTransformDataStream()
        .subscribe(bookmarkItem => {
          const list_stories = this.relatedStories.list_stories;
          list_stories.map(story => {
            if (bookmarkItem.oid === story.id) {
              story.bookmarked = true;
              story.bookmark_list_id = bookmarkItem.lid;
            }
          });
        });
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (!!this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

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
