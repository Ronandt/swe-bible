// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Software Engineering Bible',
  tagline: 'Tech stack, architecture, and best practices for production web applications.',

  url: 'https://your-site.example.com',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'SWE Bible',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'sweBibleSidebar',
            position: 'left',
            label: 'Docs',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Written by @DIK · Co-authored by @DuenoHfao`,
      },
      prism: {
        additionalLanguages: ['python', 'bash', 'yaml', 'typescript', 'tsx'],
      },
    }),
};

module.exports = config;
