import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'k-dropdown-select-country',
  templateUrl: './dropdown-select-country.component.html',
  styleUrls: ['./dropdown-select-country.component.scss']
})
export class DropdownSelectCountryComponent implements OnInit {
  showDropdown: boolean;
  @Input() listCountries: any;

  constructor(private router: Router) {
    this.showDropdown = false;
  }

  ngOnInit() {
    // console.log('[Dropdown] listCountries: ', this.listCountries);
  }

  openDropdown() {
    this.showDropdown = true;
  }

  closeDropdown() {
    this.showDropdown = false;
  }
  gotoCountry(countryAlias: string) {
    if (countryAlias) {
      this.router.navigate(['/all-countries/', countryAlias]);
    }
  }
}
