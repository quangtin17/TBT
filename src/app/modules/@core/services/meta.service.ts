import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  currentList: any;
  defaultMetaTags: Array<any>;

  constructor(@Inject(DOCUMENT) private document, private meta: Meta) {
    this.currentList = [];
    this.defaultMetaTags = [
      { name: 'title', content: '' },
      { name: 'description', content: '' },

      { name: 'twitter:card', content: '' },
      { name: 'twitter:title', content: '' },
      { name: 'twitter:description', content: '' },
      { name: 'twitter:url', content: '' },
      { name: 'twitter:image:alt', content: '' },
      { name: 'twitter:image', content: '' },

      { property: 'og:site_name', content: '' },
      { property: 'og:type', content: '' },
      { property: 'og:url', content: '' },
      { property: 'og:title', content: '' },
      { property: 'og:description', content: '' },
      { property: 'og:image', content: '' },
      { property: 'og:image:url', content: '' },
      { property: 'og:image:secure_url', content: '' },
      { property: 'og:image:alt', content: '' },

      { property: 'pin:media', content: '' },
      { property: 'pin:url', content: '' },
      { property: 'pin:description', content: '' }
    ];
  }

  createCanonicalURL() {
    // Check current 'canonical link'
    let currentlink = this.document.head.querySelector(`link[rel="canonical"]`);
    // console.log('currentlink: ', currentlink);

    if (!currentlink) {
      // Create new 'canonical link'

      let link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
      link.setAttribute('href', this.document.URL);
    } else {
      // Update 'canonical link' href

      currentlink.setAttribute('href', this.document.URL);
    }
  }

  setMetaTags(inputList, type?) {
    // console.log('Start setMetaTags: ', inputList);
    // console.log('currentList MetaTags: ', this.currentList);
    // this.removeCurrentTag(); // Remove Current tag before add
    this.createCanonicalURL(); // Call funct modify 'canonical link'

    // Set type custom if inputList is Array -> case 'custom'
    if (!Array.isArray(inputList) && (type === '' || type == null)) {
      type = 'custom';
    }
    switch (type) {
      case 'raw':
        // Case meta Obj from BE is the same structure with FE (HTMLMetaElement)
        this.meta.addTags(inputList);
        this.currentList = inputList;
        break;
      case 'custom':
        // Case List All Countries/Collections
        const transformedCustomList = this.transformCustomList(inputList);
        this.meta.addTags(transformedCustomList);
        this.currentList = transformedCustomList;
        break;
      default:
        // Case Detail page
        const transformedDetailList = this.transformListDetail(inputList);
        this.meta.addTags(transformedDetailList);
        this.currentList = transformedDetailList;
        break;
    }
  }

  removeCurrentTag() {
    this.currentList.forEach(el => {
      if ('property' in el) {
        this.meta.removeTag(`property="${el.property}"`);
      }
      if ('name' in el) {
        this.meta.removeTag(`name="${el.name}"`);
      }
    });
  }

  transformListDetail(inputList: Array<any>) {
    // console.log('[Metatransform] inputList: ', inputList);

    // tranform to array values
    let arrTags = [...this.defaultMetaTags];
    // console.log('[Metatransform] metaList Before: ', arrTags);

    inputList.forEach(el => {
      // Get list Meta tag
      if (el['tag'] === 'meta') {
        if ('property' in el['attributes']) {
          // change BE url to current FE url
          if (
            el['attributes']['property'].endsWith(':url') &&
            el['attributes']['property'] !== 'og:image:url' // Exclude 'og:image:url'
          ) {
            // console.log(":url", el['attributes']['property']);
            el['attributes']['content'] = this.document.URL;
          }

          // // Add og:image for Pinterest share : https://github.com/MurhafSousli/ngx-sharebuttons/issues/372
          // if (el['attributes']['property'].includes('pin:media')) {
          //   let newObj = {
          //     property: 'og:image',
          //     content: el['attributes']['content']
          //   };
          //   arrTags.push(newObj);
          // }

          let obj = arrTags.find(
            o => o.property === el['attributes']['property']
          );
          if (!!obj) {
            obj.content = el['attributes']['content'];
          }
        }

        if ('name' in el['attributes']) {
          if (el['attributes']['name'].endsWith(':url')) {
            // console.log(":url", el['attributes']['property']);
            el['attributes']['content'] = this.document.URL;
          }

          let obj = arrTags.find(o => o.name === el['attributes']['name']);
          if (!!obj) {
            obj.content = el['attributes']['content'];
          }
        }

        // arrTags.push(el['attributes']);
      }
    });
    // console.log('[Metatransform] metaList after: ', arrTags);

    arrTags.forEach(el => {
      this.meta.updateTag(el);
    });
    return arrTags;
  }

  changeContent;

  transformCustomList(inputList) {
    // transform '_' to ':'
    const metaTagDefault = {
      description: {
        name: 'description',
        content: ''
      },
      og_description: {
        property: 'og:description',
        content: ''
      },
      og_image: {
        property: 'og:image',
        content: ''
      },
      og_url: {
        property: 'og:url',
        content: ''
      },
      og_image_alt: {
        property: 'og:image:alt',
        content: ''
      },
      og_image_secure_url: {
        property: 'og:image:secure_url',
        content: ''
      },
      og_image_url: {
        content: '',
        property: 'og:image:url'
      },
      og_site_name: {
        property: 'og:site:name',
        content: ''
      },
      og_title: {
        property: 'og:title',
        content: ''
      },
      og_type: {
        property: 'og:type',
        content: ''
      },
      title: {
        name: 'title',
        content: ''
      },
      twitter_cards_image: {
        name: 'twitter:cards:image',
        content: ''
      },
      twitter_cards_page_url: {
        name: 'twitter:cards:page:url',
        content: ''
      },
      twitter_cards_title: {
        name: 'twitter:cards:title',
        content: ''
      },
      twitter_cards_type: {
        name: 'twitter:cards:type',
        content: ''
      }
    };
    let arrTags = [];

    for (let key in inputList) {
      if (inputList.hasOwnProperty(key)) {
        let element = inputList[key]; // obj from input list

        if (metaTagDefault[key] !== undefined) {
          // check existed obj with the same key in default metaTag list
          let newObj = Object.assign({}, metaTagDefault[key]); // clone obj
          newObj.content = element; // set new value for obj
          arrTags.push(newObj); // push to new list
        }
      }
    }
    // console.log('After transformCustomList: ', arrTags);
    // update metatag form new list
    arrTags.forEach(el => {
      this.meta.updateTag(el);
    });
    return arrTags;
  }
}
