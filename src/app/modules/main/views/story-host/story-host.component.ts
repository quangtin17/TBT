import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-story-host',
  templateUrl: './story-host.component.html',
  styleUrls: ['./story-host.component.scss']
})
export class StoryHostComponent implements OnInit {
  @Input() aboutHost;
  @Input() ExperienceAboutHost;
  constructor() {}

  ngOnInit() {}
}
