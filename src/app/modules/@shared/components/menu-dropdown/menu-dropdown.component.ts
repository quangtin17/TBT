import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { HeaderMenuService } from '../../services/header-menu.service';
import { distinctUntilChanged, share } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'k-menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.scss']
})
export class MenuDropdownComponent implements OnInit, OnDestroy {
  @Input() isHeader: boolean;
  public MenuItems: NbMenuItem[]; // Declare Array MenuItems to receive value from subcription & render HTML
  private menuItemsSubcription: Subscription; // Declare a subcription for MenuItem
  isMobile: boolean;

  constructor(
    private headerMenuService: HeaderMenuService,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  /**
   * Subcription to headerMenuService, get menuItems value on change.
   */
  ngOnInit() {
    this.menuItemsSubcription = this.headerMenuService.menuItems
      .pipe(distinctUntilChanged())
      .subscribe(items => {
        if (items !== null) {
          this.MenuItems = this.convertParentMenu(items);
          // console.log('[MenuDropdownComponent] MenuItems: ', this.MenuItems);
        }
      });
  }

  /**
   * Unsubscribe subcriptions on destroy to prevent memory leaks
   */
  ngOnDestroy() {
    this.menuItemsSubcription.unsubscribe();
  }

  /**
   * Funct handle toggle 'expand menu' btn
   * @param menu
   * Show/hide child items
   */
  toggleMenu(menu: NbMenuItem) {
    menu.expanded = !menu.expanded;
  }

  /**
   * Funct force close menu
   * Close Menu when click on btn (navigate to link)
   */
  closeMenu() {
    this.headerMenuService.closeMenu();
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
        expanded: '',
        below: []
      };
      newMenuObj.title = menu.title;
      newMenuObj.relative = menu.relative;
      newMenuObj.absolute = menu.absolute;
      newMenuObj.expanded = menu.expanded || false;
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
            external: '',
            expanded: ''
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
          newSubMenuObj.expanded = submenu.expanded || false;

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
