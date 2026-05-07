// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  sweBibleSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Tech Stack & Architecture',
      link: {
        type: 'generated-index',
        description:
          'The standard tech stack for web applications, curated for seamless production integration.',
      },
      items: [
        'tech-stack/tech-stack-overview',
        'tech-stack/backend',
        'tech-stack/frontend',
        'tech-stack/keycloak',
        'tech-stack/database',
        'tech-stack/object-storage',
        'tech-stack/infrastructure',
        'tech-stack/code-quality-tools',
      ],
    },
    {
      type: 'doc',
      id: 'developer-roles',
      label: 'Developer Roles',
    },
    {
      type: 'category',
      label: 'Best Practices & Architecture',
      link: {
        type: 'generated-index',
        description:
          'Clean code architecture, design patterns, and file structure for the backend and frontend.',
      },
      items: [
        'architecture/architecture-overview',
        'architecture/backend-architecture',
        'architecture/frontend-architecture',
      ],
    },
    {
      type: 'doc',
      id: 'logging',
      label: 'Logging',
    },
    {
      type: 'doc',
      id: 'code-quality-enforcement',
      label: 'Code Quality Enforcement',
    },
    {
      type: 'doc',
      id: 'scalability',
      label: 'Scalability',
    },
    {
      type: 'doc',
      id: 'testing',
      label: 'Testing',
    },
    {
      type: 'doc',
      id: 'security',
      label: 'Security',
    },
    {
      type: 'category',
      label: 'Deployment & CI/CD',
      link: {
        type: 'generated-index',
        description:
          'Deployment checklists, Helm chart guides, CI/CD setup, and production readiness requirements.',
      },
      items: [
        'deployment/deployment-overview',
        'deployment/helm-charts',
      ],
    },
    {
      type: 'doc',
      id: 'maintenance',
      label: 'Maintenance',
    },
    {
      type: 'doc',
      id: 'appendix',
      label: 'Appendix / Onboarding',
    },
  ],
};

module.exports = sidebars;
