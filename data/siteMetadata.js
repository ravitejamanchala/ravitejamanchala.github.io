/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Manchala Raviteja',
  author: 'Manchala Raviteja',
  headerTitle: 'MANCHALA RAVITEJA',
  description:
    'Portfolio and blog of Manchala Raviteja, a Senior Frontend Developer specializing in React, TypeScript, and Next.js.',
  language: 'en-us',
  theme: 'light', // system, dark, or light
  siteUrl: 'https://ravitejamanchala.github.io/',
  siteRepo: 'https://github.com/ravitejamanchala',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'raviteja0024@gmail.com',
  github: 'https://github.com/ravitejamanchala',
  linkedin: 'https://www.linkedin.com/in/raviteja-manchala-55590ba4/',
  behance: 'https://www.behance.net/manchala008d55',
  codepen: 'https://codepen.io/manchala',
  blog: 'https://ravitejamanchala.github.io/',
  mastodon: '', // Add if applicable
  threads: '', // Add if applicable
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    googleAnalytics: {
      googleAnalyticsId: 'G-XXXXXXXXXX', // Add your Google Analytics ID
    },
  },
  newsletter: {
    provider: '', // Specify if applicable (e.g., mailchimp, buttondown)
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: 'ravitejamanchala/blog-repo',
      repositoryId: 'repository-id', // Add your Giscus repository ID
      category: 'Announcements',
      categoryId: 'category-id', // Add your Giscus category ID
      mapping: 'pathname',
      reactions: '1', // Emoji reactions enabled
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: '/search.json',
    },
  },
}

module.exports = siteMetadata
