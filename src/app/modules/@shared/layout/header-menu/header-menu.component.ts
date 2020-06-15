import { Component, OnInit } from '@angular/core';
import { HeaderMenuService } from '../../services/header-menu.service';

@Component({
  selector: 'k-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
  openMenu: boolean;

  constructor(private headerMenuService: HeaderMenuService) {
    this.headerMenuService.menuState.subscribe(rs => (this.openMenu = rs));
  }

  ngOnInit() {}
}
