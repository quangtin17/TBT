import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { StaticPageService } from '../../services/static-page.service';
import { MetaService } from '../../../@core/services/meta.service';

@Component({
  selector: 'k-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  htmlData: any;
  constructor(
    private titleService: Title,
    private staticPageService: StaticPageService,
    private metaService: MetaService
  ) {}

  ngOnInit() {
    this.staticPageService.getTerms().subscribe(response => {
      this.htmlData = response.data;
      if (!!this.htmlData.title) {
        this.titleService.setTitle(
          this.htmlData.title + ' | The Better Traveller'
        );
      }
      if (!!this.htmlData.metatags) {
        this.metaService.setMetaTags(this.htmlData.metatags);
      }
    });
  }
}
