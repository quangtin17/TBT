import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-story-amenities',
  templateUrl: './story-amenities.component.html',
  styleUrls: ['./story-amenities.component.scss']
})
export class StoryAmenitiesComponent implements OnInit {
  @Input() amenities;
  constructor() {}

  ngOnInit() {}
}
