import {
  Component,
  OnInit,
  Inject,
  HostListener,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LOCAL_STORAGE, WINDOW } from '@ng-toolkit/universal';
import { Subscription } from 'rxjs';
import { NbMenuItem } from '@nebular/theme';
import { distinctUntilChanged, share } from 'rxjs/operators';

import { HeaderMenuService } from '../../services/header-menu.service';
import { AuthService } from '../../../@auth/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'k-header-lower',
  templateUrl: './header-lower.component.html',
  styleUrls: ['./header-lower.component.scss']
})
export class HeaderLowerComponent implements OnInit {
  @ViewChild('searchButton') searchBtn;
  openMenu: boolean;
  searchText: string;
  isMobile: boolean;
  public MenuItems: NbMenuItem[]; // Declare Array MenuItems to receive value from subcription & render HTML
  private menuItemsSubcription: Subscription; // Declare a subcription for MenuItem

  @HostListener('click')
  clickSearchButton() {
    if (this.searchBtn.nativeElement) {
      // console.log('this is search button desktop');
    }
  }

  @HostListener('document:click')
  clickOutSideSearchButton() {}

  constructor(
    private router: Router,
    private headerMenuService: HeaderMenuService,
    private authService: AuthService,
    @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(WINDOW) private window: Window,
    private deviceService: DeviceDetectorService
  ) {
    this.headerMenuService.menuState.subscribe(rs => (this.openMenu = rs));
    this.searchText = '';

    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
    this.menuItemsSubcription = this.headerMenuService.menuItems
      .pipe(distinctUntilChanged())
      .subscribe(items => {
        if (items !== null) {
          this.MenuItems = this.convertParentMenu(items);
          // this.MenuItems = items;
          // console.log('[MenuItems]', this.MenuItems);
        }
      });
  }

  /**
   * Funct handle click on Menu Button
   * Call Service to open/close menu
   */
  clickMenuBtn() {
    this.headerMenuService.toggleMenu(!this.openMenu);
  }

  clickSeachBtn() {
    let storyTypeList = ['journey', 'meet'];
    let typeList = ['stories'];
    this.router.navigate(['/search'], {
      queryParams: { term: '', type: typeList, search: true }
    });
    // this.router.navigate(['/search']);
  }

  clickLoginBtn() {
    this.authService.autoLogin();
  }

  clickSeachBtnDesktop() {
    this.router.navigate(['/search'], {
      queryParams: { term: this.searchText, search: true }
    });
  }

  convertParentMenu(inputList): any[] {
    const newParentMenu = [];

    for (const menu of inputList) {
      let newMenuObj = {
        title: '',
        relative: '',
        absolute: '',
        type: '',
        external: '',
        below: []
      };
      newMenuObj.title = menu.title;
      newMenuObj.relative = menu.relative;
      newMenuObj.absolute = menu.absolute;
      newMenuObj.type =
        (menu.options && menu.options.query && menu.options.query.type) || '';
      newMenuObj.external = (menu.options && menu.options.external) || false;

      if (menu.below && menu.below.length > 0) {
        for (const submenu of menu.below) {
          let newSubMenuObj = {
            type: '',
            country: '',
            story_type: '',
            activity: '',
            title: '',
            relative: '',
            absolute: '',
            external: ''
          };

          newSubMenuObj.type =
            (submenu.options &&
              submenu.options.query &&
              submenu.options.query.type) ||
            '';
          newSubMenuObj.country =
            (submenu.options &&
              submenu.options.query &&
              submenu.options.query.country) ||
            '';
          newSubMenuObj.story_type =
            (submenu.options &&
              submenu.options.query &&
              submenu.options.query.story_type) ||
            '';
          newSubMenuObj.activity =
            (submenu.options &&
              submenu.options.query &&
              submenu.options.query.activity) ||
            '';
          newSubMenuObj.title = submenu.title || '';
          newSubMenuObj.relative = submenu.relative || '';
          newSubMenuObj.absolute = submenu.absolute || '';
          newSubMenuObj.external = submenu.external || false;

          newMenuObj.below.push(newSubMenuObj);
        }
      } else {
        newMenuObj.below = [];
      }

      newParentMenu.push(newMenuObj);
    }

    return newParentMenu;
  }
}
