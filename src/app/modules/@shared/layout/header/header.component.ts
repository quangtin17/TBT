import { Component, OnInit } from '@angular/core';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'k-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private menuService: NbMenuService) {}

  ngOnInit() {}
  goToHome() {
    this.menuService.navigateHome();
  }
}
