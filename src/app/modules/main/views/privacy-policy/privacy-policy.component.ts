import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MetaService } from '../../../@core/services/meta.service';
import { StaticPageService } from '../../services/static-page.service';

@Component({
  selector: 'k-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  htmlData: any;
  constructor(
    private titleService: Title,
    private staticPageService: StaticPageService,
    private metaService: MetaService
  ) {}

  ngOnInit() {
    this.staticPageService.getPrivacy().subscribe(response => {
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
