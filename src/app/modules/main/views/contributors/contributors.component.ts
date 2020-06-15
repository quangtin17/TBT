import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-contributors',
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.scss']
})
export class ContributorsComponent implements OnInit {
  @Input() listContributors: any;
  constructor() {}

  ngOnInit() {}
}
