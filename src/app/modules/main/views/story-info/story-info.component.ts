import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-story-info',
  templateUrl: './story-info.component.html',
  styleUrls: ['./story-info.component.scss']
})
export class StoryInfoComponent implements OnInit {
  @Input() info;
  constructor() {}

  ngOnInit() {}
}
