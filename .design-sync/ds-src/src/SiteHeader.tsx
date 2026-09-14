import * as React from 'react';
import { Icon } from './Icon';

export interface NavItem {
  /** Link label. */
  label: string;
  /** Destination. */
  href: string;
  /** Marks the page you are on (`aria-current="page"`). */
  current?: boolean;
}

/**
 * The sticky site bar: emblem lockup, main navigation, a booking call-to-action,
 * and the mobile call button. The hairline under it is the scroll-progress rule.
 *
 * On the live site a script makes the bar transparent while it sits over a dark
 * hero; without that script it renders as the solid emerald bar, which is its
 * correct default and the state you should design against.
 */
export interface SiteHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation links. Defaults to the site's own six. */
  items?: NavItem[];
  /** Label on the booking button. @default 'Book an Assessment' */
  ctaLabel?: string;
  /** Booking destination. @default '/contact/' */
  ctaHref?: string;
  /** Phone number in E.164 for the call button. @default '+13692220979' */
  phone?: string;
  /** Emblem image. @default '/assets/img/logo-coin-96.png' */
  logoSrc?: string;
}

const DEFAULT_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Hyperbaric Therapy', href: '/hyperbaric-oxygen-therapy/' },
  { label: 'Benefits', href: '/benefits/' },
  { label: 'About', href: '/about/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];

export function SiteHeader({
  items = DEFAULT_ITEMS,
  ctaLabel = 'Book an Assessment',
  ctaHref = '/contact/',
  phone = '+13692220979',
  logoSrc = '/assets/img/logo-coin-96.png',
  className,
  ...rest
}: SiteHeaderProps) {
  return (
    <header className={['site-header', className].filter(Boolean).join(' ')} {...rest}>
      <div className="container container--wide header-inner">
        <a className="brand" href="/" aria-label="Generations Wellness — home">
          <img className="brand-mark" src={logoSrc} alt="" width={96} height={96} />
          <span className="brand-text">
            <span className="brand-name">Generations</span>
            <span className="brand-sub">Wellness</span>
          </span>
        </a>
        <nav id="site-nav" className="site-nav" aria-label="Main">
          <ul>
            {items.map((it) => (
              <li key={it.href}>
                <a href={it.href} aria-current={it.current ? 'page' : undefined}>{it.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-cta">
            <a className="btn btn--primary" href={ctaHref}>{ctaLabel}</a>
          </div>
        </nav>
        <a className="btn btn--primary btn--sm header-cta" href={ctaHref}>{ctaLabel}</a>
        <a className="btn btn--primary btn--sm header-call" href={`tel:${phone}`}>
          <Icon name="phone" />Call
        </a>
        <button className="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span className="visually-hidden">Menu</span>
          <Icon name="menu" className="icon-open" strokeLinejoin={undefined} />
          <Icon name="close" className="icon-close" strokeLinejoin={undefined} />
        </button>
      </div>
      <div className="progress-line" aria-hidden="true" />
    </header>
  );
}
