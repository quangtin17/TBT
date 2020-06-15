import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Pager } from '../../../@core/models/pager';
import { PagerService } from '../../../@core/services/pager.service';

import { MetaService } from '../../../@core/services/meta.service';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'k-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  htmlData: any;

  totalItems: number;
  currentPage: number;
  pageSize: number;
  pager: Pager; // Object return from Pager Services,
  hiddenShareButton = true;

  constructor(
    private countryService: CountryService,
    private pagerService: PagerService,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.currentPage = parseInt(params.page) || 0;
        // console.log('[CountryListComponent] currentPage: ', this.currentPage);
        this.getCountriesListData(this.currentPage);
      },
      err => console.log(err)
    );
  }

  /**
   * Funct Call API get list of countries data
   * @param page // default value is 0
   * Assign data result to htmlData
   * Init Paging with currentPage value
   */
  getCountriesListData(page: number) {
    this.countryService.getCountriesList(page).subscribe(
      rs => {
        if (!!rs.success) {
          this.htmlData = rs.data;
          // console.log('[Country-list Component] htmlData: ', this.htmlData);
          this.metaService.setMetaTags(this.htmlData.metatags);
          // this.pagedItems = this.htmlData.list_countries;
          this.totalItems = parseInt(this.htmlData.total) || 0;
          this.currentPage = parseInt(this.htmlData.current_page) || 0;
          this.pageSize = parseInt(this.htmlData.page_size) || 8;

          // set page to htmlData.currentPage
          this.setPage(this.currentPage);
        }

        // Set Title
        if (!!this.htmlData.banner.title) {
          this.titleService.setTitle(
            this.htmlData.banner.title + ' | The Better Traveller'
          );
        }
      },
      err => console.log(err)
    );
  }

  /**
   * Funct handle pagination
   * @param page
   * Return pager obj and update component.
   */
  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.totalItems,
      page,
      this.pageSize
    );
    console.log('[Collection List] Return Pager : ', this.pager);
  }
}
