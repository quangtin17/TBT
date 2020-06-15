export class ForumData {
  public homeforum: HomeForum;
}

export class HomeForumTopic {
  title: string;
  viewcount: number;
  upvotes: number;
  postcount: number;
}

export class HomeForum {
  title: string;
  topics: Array<HomeForumTopic>;
}
