window.klaroConfig = {
  purposes: ['marketing'],
  privacyPolicy: '/privacy',
  cookieName: 'klaro_consent',
  acceptAll: true,
  apps: [
    {
      name: 'rakuten',
      title: 'Rakuten Advertising (Affiliate)',
      purposes: ['marketing'],
      default: false,
      required: false,
    },
  ],
  translations: {
    en: {
      title: 'Rakuten Advertising (Affiliate)',
      description: 'We partner with Rakuten to manage our affiliate links for services like Udemy. If you consent, Rakuten uses cookies to track if you make a purchase after clicking a link. This helps us earn a small commission to support the blog, at no extra cost to you.',
    },
    hu: {
      title: 'Rakuten Hirdetés (Partnerprogram)',
      description: 'A Rakuten Advertisinggel működünk együtt, hogy kezeljük a Udemy-hez hasonló szolgáltatásokhoz tartozó partnerlinkjeinket. Ha hozzájárul, a Rakuten sütiket használ annak követésére, hogy vásárol-e egy linkre kattintás után. Ez segít nekünk egy kis jutalékot szerezni a blog támogatására, anélkül, hogy ez Önnek többletköltséget jelentene.',
    },
  },
};