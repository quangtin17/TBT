import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-related-topic',
  templateUrl: './related-topic.component.html',
  styleUrls: ['./related-topic.component.scss']
})
export class RelatedTopicComponent implements OnInit {
  @Input() list: any;
  @Input() type: any;
  constructor() {}

  ngOnInit() {
    // console.log('item : ', this.type);
  }
}
