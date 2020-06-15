import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { FooterMenuService } from '../../services/footer-menu.service';

@Component({
  selector: 'k-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public MenuItems: NbMenuItem[]; // Declare Array MenuItems to receive value from subcription & render HTML
  private menuItemsSubcription: Subscription; // Declare a subcription for MenuItem
  constructor(private footerMenuService: FooterMenuService) {}

  ngOnInit() {
    this.menuItemsSubcription = this.footerMenuService.menuItems
      .pipe(distinctUntilChanged())
      .subscribe(items => {
        if (items !== null) {
          this.MenuItems = this.convertParentMenu(items);
          // console.log(
          //   '[FooterMenuDropdownComponent] MenuItems: ',
          //   this.MenuItems
          // );
        }
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
