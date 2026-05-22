import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  BookOpen,
  Layers,
  Server,
  Shield,
  Rocket,
  FlaskConical,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import styles from './index.module.css';

const HIGHLIGHTS = [
  {
    icon: Layers,
    title: 'Tech Stack & Architecture',
    desc: 'A curated, opinionated stack for production web apps.',
    href: '/tech-stack/tech-stack-overview',
  },
  {
    icon: Server,
    title: 'Backend Patterns',
    desc: 'Clean code, design patterns, and file structure.',
    href: '/architecture/architecture-overview',
  },
  {
    icon: Shield,
    title: 'Security & Quality',
    desc: 'Hardening, code-quality enforcement, and reviews.',
    href: '/security',
  },
  {
    icon: Rocket,
    title: 'Deployment & CI/CD',
    desc: 'Helm charts, pipelines, and production readiness.',
    href: '/deployment/deployment-overview',
  },
  {
    icon: FlaskConical,
    title: 'Testing',
    desc: 'Strategy, coverage, and what to test (and skip).',
    href: '/testing',
  },
  {
    icon: BookOpen,
    title: 'Onboarding',
    desc: 'Get new engineers productive fast.',
    href: '/appendix',
  },
];

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <main className={styles.home}>
        <section className={styles.hero}>
          <span className={styles.kicker}>
            <Sparkles size={14} strokeWidth={2.2} />
            A field guide for production web apps
          </span>
          <h1 className={styles.title}>
            Software Engineering <span className={styles.titleAccent}>Bible</span>
          </h1>
          <p className={styles.subtitle}>{siteConfig.tagline}</p>
          <div className={styles.ctaRow}>
            <Link
              to="/intro"
              className={styles.primaryCta}>
              Get Started
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
            <Link
              to="/tech-stack/tech-stack-overview"
              className={styles.secondaryCta}>
              Explore the Stack
            </Link>
          </div>
        </section>

        <section className={styles.grid}>
          {HIGHLIGHTS.map(({icon: Icon, title, desc, href}, i) => (
            <Link key={title} to={href} className={`${styles.card} ${styles[`card${i % 6}`]}`}>
              <span className={styles.cardIcon} aria-hidden="true">
                <Icon size={18} strokeWidth={2} />
              </span>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{desc}</p>
              </div>
              <ArrowRight
                className={styles.cardArrow}
                size={16}
                strokeWidth={2}
              />
            </Link>
          ))}
        </section>

        <footer className={styles.signature}>
          Written by <strong>@DIK</strong> · Co-authored by{' '}
          <strong>@DuenoHfao</strong>
        </footer>
      </main>
    </Layout>
  );
}
