import { Component, OnInit, Input } from '@angular/core';
import { TipsListData } from '../../../@core/models/tipsListData';

@Component({
  selector: 'k-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.scss']
})
export class TipsListComponent implements OnInit {
  @Input() tipsList: TipsListData;
  constructor() {}

  ngOnInit() {
    // console.log(this.tipsList);
  }
}
