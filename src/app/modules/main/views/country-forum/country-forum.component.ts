import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  SimpleChange,
  OnDestroy
} from '@angular/core';
import { ForumService } from '../../services/forum.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'k-country-forum',
  templateUrl: './country-forum.component.html',
  styleUrls: ['./country-forum.component.scss']
})
export class CountryForumComponent implements OnInit, OnChanges {
  @Input() countryCode: string;
  @Input() countryName: number;
  htmlTopicData: any;
  environmentBaseUrl: string;
  getWindowHref: string;
  constructor(private forumService: ForumService) {
    this.environmentBaseUrl = environment.APIEndpointForum;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const countryCode: SimpleChange = changes.countryCode;

    if (countryCode.currentValue) {
      this.forumService
        .getCountryForum(countryCode.currentValue)
        .subscribe(topic => {
          this.htmlTopicData = topic.payload.showTopics;
        });
    }
  }

  ngOnInit() {
    this.forumService.getCountryForum(this.countryCode).subscribe(topic => {
      this.htmlTopicData = topic.payload.showTopics;
    });
  }
}
