export const environment = {
  production: true,
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
  APIEndpointTBT: "https://tbt-stg.ourbetterworld.org",
  APIEndpointForum: "https://forum.ourbetterworld.org",
  APIEndpointForumLocal: "http://192.168.10.31:4567",
  APIEndpointIpAddress: "https://api.ipify.org?format=json",
  SiteKey: "6LfPcroUAAAAADDgMdDqTIL2_xCWQeRlh_q-lSOz", // Domains: localhost

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
      // Local build Prod -> localhost:4000
      client_id: "6ce132e8-86d1-4abe-9e40-d6270b134801",
      client_secret: "1q2w3e4r5t"
    }
  }
};
