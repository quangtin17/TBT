import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BookmarkService } from '../../services/bookmark.service';
import { UserService } from '../../../@core';

@Component({
  selector: 'k-related-stories-custom',
  templateUrl: './related-stories-custom.component.html',
  styleUrls: ['./related-stories-custom.component.scss']
})
export class RelatedStoriesCustomComponent implements OnInit {
  @Input() relatedStoriesInput: any;
  @Input() relatedStoriesType: any;
  currentUserSubscription: Subscription;
  public relatedStoriesCustom: any;
  constructor(private bookmarkService: BookmarkService) {
    this.relatedStoriesCustom = this.relatedStoriesInput;
  }

  ngOnInit() {
    this.relatedStoriesCustom = this.relatedStoriesInput;
    // console.log('related stories', this.relatedStoriesCustom);
    if (
      !!this.relatedStoriesCustom &&
      !!this.relatedStoriesCustom.list_stories
    ) {
      this.currentUserSubscription = this.bookmarkService
        .bookmarkTransformDataStream()
        .subscribe(bookmarkItem => {
          const list_stories = this.relatedStoriesCustom.list_stories;
          list_stories.map(story => {
            if (bookmarkItem.oid === story.id) {
              story.bookmarked = true;
              story.bookmark_list_id = bookmarkItem.lid;
            }
          });
        });
      // console.log("Set spotlight data",rs.data, this.spotlightData);
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
