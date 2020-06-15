import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-difference-you-make',
  templateUrl: './difference-you-make.component.html',
  styleUrls: ['./difference-you-make.component.scss']
})
export class DifferenceYouMakeComponent implements OnInit {
  @Input() differenceYouMake;
  constructor() {}

  ngOnInit() {}
}
