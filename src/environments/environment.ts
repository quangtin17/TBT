export const environment = {
  production: false,
  type: "LOCAL",

  // Local Storage Key
  AccessToken: "access_token",
  RefreshToken: "refresh_token",
  SessionToken: "session_token",
  CredentialsKey: "tbt-user",
  RolesKey: "tbt-roles",
  BookmarkItemsKey: "tbt-bookmark-items",
  BookmarkRecentKey: "tbt-bookmark-recent",
  HeaderRolesKey: "obw-user-roles",

  StorageHomePageKey: "local-homepage",
  StorageMeetKey: "local-meet",
  StorageWOGKey: "local-weekend-of-good",
  StorageExperienceKey: "local-experience",
  StorageJourneyStoryKey: "local-journey-story",
  StorageJourneyInfoKey: "local-journey-info",

  APIEndpointOBW: "https://obw-dev.kyanon.digital",
  APIEndpointOBWStg: "https://stg.ourbetterworld.org",
  APIEndpointTBT: "https://leads.ourbetterworld.org",
  APIEndpointForum: "http://stg.ourbetterworld.org/forum",
  APIEndpointForumLocal: "http://192.168.10.31:4567",
  APIEndpointIpAddress: "https://api.ipify.org?format=json",
  SiteKey: "6Lewdb0UAAAAAGlzCFgFKqi-XyMgFZSLdcWpSUd-", // Domains: localhost

  APIPrefix: "/api",
  APIVersion: "/v1",
  APIForumVersion: "/v2",
  APILogin: "/user/login",
  APIResister: "/user/register?_format=json",
  APIPostSocialLogin: "/user/login-social",
  APILogout: "/user/logout",
  APISessionToken: "/session/token",

  APIMenu: "/menu_items/main",
  APIMenuFooter: "/menu_items/footer",
  APIHome: "/landing-page/76",
  APICountryList: "/countries",
  APICountry: "/country",
  APICollectionList: "/collections",
  APICollection: "/collection",
  APIJourney: "/journey",
  APIJourneyInfo: "/info",
  APIJourneyStory: "/story",
  APIMeet: "/meet",
  APIWeekend: "/wog",
  APIExperience: "/experience",
  APISearch: "/search",
  APIFilterTags: "/filter/tags",
  APIFilterSearch: "/filter/search",
  APICountryForum: "/countries/tbt",
  APIStatic: "/static",
  APIFaq: "/faq",
  APIPrivacy: "/privacy",
  APITerms: "/terms",

  // Forum
  APIForumCategoriesCountry: "/categories/tbt/countries",
  APIForumStory: "/topics/tbt/short",
  APIForumHomePage: "/tbt/homepage",

  // Form
  APIFormEnquiry: "/enquiry/submit",
  APIUpdateEnquiry: "/enquiry/update",
  APIFormSubscribe: "/webform_rest/submit",
  APIFormShareByEmail: "/webform_rest/submit",

  // Bookmark
  APIFormCreateBookmarkList: "/bookmark-list/create",
  APIFormUpdateBookmarkList: "/bookmark-list/update",
  APIFormDeleteBookmarkList: "/bookmark-list/delete",
  APIGetArticleSpotlight: "/get-articles-spotlight",
  APIAddItemToBookmarkList: "/action/bookmark",

  // VAPID Key
  VAPID_PUBLIC_KEY:
    "BHOA3CKDQm81Wjwpr-BfUceN_hPI1YsuK9jTo_k4F1yZ9N4hXUS4YFwn4RzJkevA6BXYGmUfpMojWp0V12duoW8",

  // TBT OAuth2
  OAuth2: {
    AuthorizeEndpoint:
      "https://stg.ourbetterworld.org/user/login?destination=/oauth/authorize", // Redirect URL
    TokenEndpoint: "https://stg.ourbetterworld.org/oauth/token", // Post Form
    UserEndpoint: "https://stg.ourbetterworld.org/oauth/debug?_format=json", // Get User info
    RedirectRoute: "/auth/tbt", // route for Redirect after grand permission
    AccessTokenGrantType: "authorization_code",
    RefreshTokenGrantType: "refresh_token",
    configClient: {
      client_id: "70143cdf-fbc5-4934-aa76-0f9dabfe911d",
      client_secret: "123456"
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
