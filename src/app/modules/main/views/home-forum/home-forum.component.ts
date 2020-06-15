import { Component, OnInit, Inject } from '@angular/core';

import { ForumService } from '../../services/forum.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'k-home-forum',
  templateUrl: './home-forum.component.html',
  styleUrls: ['./home-forum.component.scss']
})
export class HomeForumComponent implements OnInit {
  htmlTopicData: any;
  environmentBaseUrl: string;

  constructor(private forumService: ForumService) {
    this.environmentBaseUrl = environment.APIEndpointForum;
  }

  ngOnInit() {
    this.forumService.getHomeForum().subscribe(topic => {
      this.htmlTopicData = topic.payload.showTopics;
      // console.log('Home page data: ', this.htmlTopicData);
    });
  }
}
