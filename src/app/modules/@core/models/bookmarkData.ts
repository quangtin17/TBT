export class BookmarkData {
  public id: string;
  public title: string;
  public bookmark_items: Array<BookmarkItem>;
}

export class BookmarkItem {
  type: string;
  oid: string; //object id, story, experience id from TBT
  alias: string;
  bid: string; //bookmark id from OBW
  lid: string; //list id from OBW
}
