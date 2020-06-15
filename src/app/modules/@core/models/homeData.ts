import { SpotlightItemData } from './spotlightItemData';

export class HomeData {
  public selectors: Selector;
  public collections: ListCollections;
  public inspirations: ListInspirations;
  public forums: ListForums;
  public countries: ListCountries;
  public metatags: Array<any>;
  public title: string;
}

export class Selector {
  placeholder: string;
  list_countries: Array<Country>;
}

export class Country {
  name: string;
  code: string;
  img_url?: string;
  constructor(name: string, code: string, img_url?: string) {
    this.name = name;
    this.code = code;
    this.img_url = img_url;
  }
}
export class ListCollections {
  title: string;
  description: string;
  list_countries: Array<Collection>;
}
export class Collection {
  title: string;
  img_url: string;
  count: number;
  id: string;
}

export class ListInspirations {
  title: string;
  list_inspirations: Array<SpotlightItemData>;
}

export class ListForums {
  title: string;
  description: string;
  list_forums: Array<Forum>;
}

export class Forum {
  title: string;
  img_url: string;
  link: string;
}

export class ListCountries {
  title: string;
  list_countries: Array<Country>;
}
