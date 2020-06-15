import { BookmarkData, BookmarkItem } from './bookmarkData';

export class User {
  // Old Info
  id: string;
  email: string;
  name: string;
  picture: string;
  firstName: string;
  lastName: string;
  authToken: string;
  username: string;
  uuid: string;
  role: string;
  roles: Array<string>;
  bookmark_lists: BookmarkData[];
  recent_bookmark_items: BookmarkItem[];

  // // Firebase Authen
  // displayName: string;
  // email: string;
  // phoneNumber: string;
  // photoURL: string;
  // providerData?: any; // Provider info


}
