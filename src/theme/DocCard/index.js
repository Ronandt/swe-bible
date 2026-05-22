import React from 'react';
import Link from '@docusaurus/Link';
import {
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {extractLeadingEmoji} from '@docusaurus/theme-common/internal';
import {
  Server,
  Monitor,
  KeyRound,
  Database,
  HardDrive,
  Network,
  CheckCircle2,
  Layers,
  BookOpen,
  Rocket,
  FlaskConical,
  ScrollText,
  TrendingUp,
  Shield,
  Wrench,
  Anchor,
  Files,
  Users,
  Boxes,
  FileText,
  Code2,
  Settings,
  Globe,
} from 'lucide-react';

function pickIcon(title) {
  const t = (title || '').toLowerCase();
  if (/overview|introduction|purpose/.test(t)) return BookOpen;
  if (/backend/.test(t)) return Server;
  if (/frontend/.test(t)) return Monitor;
  if (/keycloak|auth/.test(t)) return KeyRound;
  if (/database/.test(t)) return Database;
  if (/object\s*storage|storage/.test(t)) return HardDrive;
  if (/infrastructure|infra/.test(t)) return Network;
  if (/code\s*quality|quality/.test(t)) return CheckCircle2;
  if (/architecture/.test(t)) return Layers;
  if (/helm/.test(t)) return Anchor;
  if (/deployment|deploy|ci\/cd/.test(t)) return Rocket;
  if (/test/.test(t)) return FlaskConical;
  if (/logging|\blog\b/.test(t)) return ScrollText;
  if (/scalab/.test(t)) return TrendingUp;
  if (/security/.test(t)) return Shield;
  if (/maintenance/.test(t)) return Wrench;
  if (/role/.test(t)) return Users;
  if (/appendix|onboard/.test(t)) return Files;
  if (/tools|setting/.test(t)) return Settings;
  if (/web|http|api/.test(t)) return Globe;
  if (/component|module/.test(t)) return Boxes;
  if (/code/.test(t)) return Code2;
  return FileText;
}

function getCleanTitle(label) {
  const extracted = extractLeadingEmoji(label || '');
  return (extracted.rest || label || '').trim();
}

function Card({href, title, variant}) {
  const Icon = pickIcon(title);
  return (
    <Link
      href={href}
      className={`card swe-card swe-card--v${variant}`}>
      <span className="swe-card__icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </span>
      <h2 className="swe-card__title">{title}</h2>
    </Link>
  );
}

function CardCategory({item, variant}) {
  const href = findFirstSidebarItemLink(item);
  if (!href) return null;
  return (
    <Card
      href={href}
      title={getCleanTitle(item.label)}
      variant={variant}
    />
  );
}

function CardLink({item, variant}) {
  return (
    <Card
      href={item.href}
      title={getCleanTitle(item.label)}
      variant={variant}
    />
  );
}

function variantFromKey(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 6;
}

export default function DocCard({item}) {
  // Deterministic hue per item — same card always gets the same color
  const key = item.label || item.href || item.docId || '';
  const variant = variantFromKey(key);
  switch (item.type) {
    case 'link':
      return <CardLink item={item} variant={variant} />;
    case 'category':
      return <CardCategory item={item} variant={variant} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
