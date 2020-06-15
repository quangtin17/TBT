import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../services/collection.service';
import { Title } from '@angular/platform-browser';

import { Pager } from '../../../@core/models/pager';
import { PagerService } from '../../../@core/services/pager.service';
import { MetaService } from '../../../@core/services/meta.service';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'k-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  htmlData: any;
  alias: string;
  currentPage: any;

  options = [
    { value: 'stories', label: 'Show stories' },
    { value: 'experiences', label: 'Show experiences' }
  ];

  // pager object
  pager: Pager;
  pagedItems: any[];
  isMobile: boolean;

  constructor(
    private collectionService: CollectionService,
    private pagerService: PagerService,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private router: Router,
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
    this.activatedRoute.paramMap.subscribe(
      params => {
        this.alias = `${params.get('alias')}`;
        this.getCollectionByAlias(this.alias);
      },
      err => console.log(err)
    );
  }

  getCollectionByAlias(collectionAlias: string, page: number = 0) {
    this.collectionService
      .getCollectionByAlias(collectionAlias, page)
      .subscribe(
        rs => {
          if (!!rs.success) {
            this.htmlData = rs.data;
            // console.log('[getCollectionByAlias] data ', this.htmlData);
            this.metaService.setMetaTags(this.htmlData.metatags);
            // Set Pager
            this.pagedItems = this.htmlData.list_collections;
            this.currentPage = this.htmlData.current_page;
            this.setPage(this.currentPage);
            // Set Title
            if (this.htmlData.banner && this.htmlData.banner.title) {
              this.titleService.setTitle(
                this.htmlData.banner.title + ' | The Better Traveller'
              );
            }
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

  /**
   * Funct handle click bookmark button.
   * @param item
   * Output: Change 'bookmarked' status of item.
   */
  bookmark(item: any) {
    // console.log('[Bookmark] Item Title: ', item.title);
    item.bookmarked = !item.bookmarked;
    // console.log('[Bookmark] Item bookmarked: ', item.bookmarked);
  }

  radioChange(event: any) {
    // console.log('event :', event);
    // console.log('selectedOption :', this.options); // not change with event involke
    setTimeout(() => {
      console.log('selectedOption Time out:', this.options);
    }, 0);
    this.router.navigate([event], { relativeTo: this.activatedRoute });
  }
}
