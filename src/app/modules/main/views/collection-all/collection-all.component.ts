import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Pager } from '../../../@core/models/pager';
import { PagerService } from '../../../@core/services/pager.service';

import { DeviceDetectorService } from 'ngx-device-detector';
import { MetaService } from '../../../@core/services/meta.service';

@Component({
  selector: 'k-collection-all',
  templateUrl: './collection-all.component.html',
  styleUrls: ['./collection-all.component.scss']
})
export class CollectionAllComponent implements OnInit {
  htmlData: any;
  currentPage: any;

  // pager object
  pager: Pager;
  isMobile: boolean;

  constructor(
    private collectionService: CollectionService,
    private pagerService: PagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private metaService: MetaService,
    private titleService: Title
  ) {
    this.currentPage = 0;
    this.isMobile = this.deviceService.isMobile();

    this.activatedRoute.queryParams.subscribe(params => {
      if (!!params.page) {
        this.currentPage = parseInt(params.page);
      }
    });
  }

  ngOnInit() {
    this.getCollectionListData(this.currentPage);
  }

  /**
   * Funct Call API get list collections data
   * @param page // default value is 0
   * Assign data result to htmlData
   * Init Paging with currentPage value
   */
  getCollectionListData(page: number = 0) {
    // console.log('[Collection List] Get Data Page: ', this.currentPage);
    this.collectionService.getCollectionList(page).subscribe(
      rs => {
        if (!!rs.success) {
          // Set HTML
          this.htmlData = rs.data;

          // Set Title
          if (!!this.htmlData.metatags.title) {
            this.titleService.setTitle(
              this.htmlData.metatags.title + ' | The Better Traveller'
            );
          }

          // Set Meta Tags
          this.metaService.setMetaTags(this.htmlData.metatags);

          this.currentPage = this.htmlData.current_page;
          // console.log('[Collection List] htmlData: ', this.htmlData);
          // set page to htmlData.currentPage
          this.setPage(this.currentPage);
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
    this.pager = this.pagerService.getPager(this.htmlData.total, page);
    // console.log('[Collection List] setPage : ', this.pager);
  }
}
