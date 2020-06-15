import {
  Component,
  OnInit,
  Input,
  Inject,
  PLATFORM_ID,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { environment } from '../../../../../environments/environment';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'k-story-forum',
  templateUrl: './story-forum.component.html',
  styleUrls: ['./story-forum.component.scss']
})
export class StoryForumComponent implements OnInit, OnChanges {
  htmlForumData: any;
  alias: string;
  environmentBaseUrl: string;
  environmentForumUrl: string;
  getWindowHref: string;
  @Input() storyId: number;
  constructor(
    private forumService: ForumService,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.environmentBaseUrl = environment.APIEndpointForum;
    if (isPlatformBrowser(this.platformId)) {
      this.getWindowHref = this.window.location.href;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const storyId: SimpleChange = changes.storyId;

    if (storyId.currentValue) {
      this.forumService.getStoryForum(storyId.currentValue).subscribe(story => {
        this.htmlForumData = story.payload;
        // console.log(this.htmlForumData.created);
      });
    }
  }

  ngOnInit() {
    this.forumService.getStoryForum(this.storyId).subscribe(story => {
      this.htmlForumData = story.payload;
      // console.log(this.htmlForumData.created);
    });
  }
}
