export const MenuDataJSON = {
  data: [
    {
      title: 'Home',
      link: '/home',
      icon: 'fal fa-home',
      home: true
    },
    {
      title: 'Countries',
      link: '/all-countries',
      children: [
        {
          title: 'Malaysia',
          link: '/all-countries/malaysia'
        },
        {
          title: 'Vietnam',
          link: '/all-countries/vietnam'
        },
        {
          title: 'Singapore',
          link: '/all-countries/singapore'
        },
        {
          title: 'Thailand',
          link: '/all-countries/thailand'
        }
      ]
    },
    {
      title: 'Stories',
      link: '/search',
      children: [
        {
          title: 'Journey',
          link: '/story/journey/1'
        },
        {
          title: 'Weekend of Good',
          link: '/story/weekend-of-good/1'
        },
        {
          title: 'Meet',
          link: '/story/meet/1'
        }
      ]
    },
    {
      title: 'Experience',
      link: '/experience/1'
    },
    {
      title: 'Our Collection',
      link: '/travel-inspiration'
    },
    {
      title: 'Community Forum',
      url: 'https://travel.ourbetterworld.org/'
    },
    {
      title: 'Contact Us',
      link: '/contact-us'
    },
    {
      title: 'FAQ',
      link: '/faqs'
    }
  ],

  success: true
};
