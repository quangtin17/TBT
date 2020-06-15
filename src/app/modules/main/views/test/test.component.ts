import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from '../../../@core/services/meta.service';
import { Meta } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { HomeService } from '../../services/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'k-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public listCKEditor: any;
  public listMetaTags: Array<any>;
  constructor(
    private homeService: HomeService,
    private metaService: MetaService,
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.listCKEditor = [
      {
        title: 'CKEditor A',
        editorData: '<p>Hello, A!</p>'
      },
      {
        title: 'CKEditor B',
        editorData: '<p>Hello, B!</p>'
      }
    ];
  }

  ngOnInit() {
    this.titleService.setTitle('TBT Test Page');

    this.meta.updateTag({
      property: 'og:image',
      itemprop: 'image',
      content:
        // 'http://winninggoals.com.ng/wp-content/uploads/2018/09/AC-Milan-300x300.jpg'
        // 'https://making-the-web.com/sites/default/files/clipart/143308/unicorn-cliparts-143308-23128.jpg'
        // 'https://static01.nyt.com/images/2019/09/11/us/politics/11dc-storm/merlin_160185513_67fdfae8-7a88-46b2-ac45-cd0894051eb2-articleLarge.jpg'
        'https://leads.ourbetterworld.org/sites/default/files/styles/banner_600x315/public/spotlight-thumbnail2019-09/Apani_Dhani-min.jpg?itok=RJ46gHyC'
    });
    this.homeService.getPageHome().subscribe(rs => {
      if (!!rs.success) {
      }
    });
  }

  review() {
    console.log('review: ', this.listCKEditor);
  }
}
