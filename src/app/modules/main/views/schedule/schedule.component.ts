import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @Input() timeline: any;
  constructor() {}

  ngOnInit() {}
}
