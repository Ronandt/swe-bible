import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '822'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '412'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '137'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '381'),
            routes: [
              {
                path: '/appendix',
                component: ComponentCreator('/appendix', 'e24'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/architecture/architecture-overview',
                component: ComponentCreator('/architecture/architecture-overview', 'c46'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/architecture/backend-architecture',
                component: ComponentCreator('/architecture/backend-architecture', '3b5'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/architecture/frontend-architecture',
                component: ComponentCreator('/architecture/frontend-architecture', 'd19'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/category/best-practices--architecture',
                component: ComponentCreator('/category/best-practices--architecture', 'f4b'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/category/deployment--cicd',
                component: ComponentCreator('/category/deployment--cicd', 'f03'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/category/tech-stack--architecture',
                component: ComponentCreator('/category/tech-stack--architecture', 'cf4'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/code-quality-enforcement',
                component: ComponentCreator('/code-quality-enforcement', '9b9'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/deployment/deployment-overview',
                component: ComponentCreator('/deployment/deployment-overview', '613'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/deployment/helm-charts',
                component: ComponentCreator('/deployment/helm-charts', 'ef9'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/developer-roles',
                component: ComponentCreator('/developer-roles', '2ca'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/intro',
                component: ComponentCreator('/intro', 'b6d'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/logging',
                component: ComponentCreator('/logging', '305'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/maintenance',
                component: ComponentCreator('/maintenance', 'ad5'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/scalability',
                component: ComponentCreator('/scalability', '921'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/security',
                component: ComponentCreator('/security', 'dd9'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/backend',
                component: ComponentCreator('/tech-stack/backend', '65a'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/code-quality-tools',
                component: ComponentCreator('/tech-stack/code-quality-tools', 'b7d'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/database',
                component: ComponentCreator('/tech-stack/database', '993'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/frontend',
                component: ComponentCreator('/tech-stack/frontend', '905'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/infrastructure',
                component: ComponentCreator('/tech-stack/infrastructure', '28f'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/keycloak',
                component: ComponentCreator('/tech-stack/keycloak', 'd34'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/object-storage',
                component: ComponentCreator('/tech-stack/object-storage', 'bae'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/tech-stack/tech-stack-overview',
                component: ComponentCreator('/tech-stack/tech-stack-overview', '07e'),
                exact: true,
                sidebar: "sweBibleSidebar"
              },
              {
                path: '/testing',
                component: ComponentCreator('/testing', 'c86'),
                exact: true,
                sidebar: "sweBibleSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
