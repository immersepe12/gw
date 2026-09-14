import * as React from 'react';

export interface FooterLink {
  label: string;
  href: string;
}

/**
 * The full site footer: emblem and wordmark, three link columns, the medical
 * disclaimer, and the copyright bar. The word "Generations" is set as an
 * oversized ghost behind the columns.
 *
 * The disclaimer is a compliance requirement, not decoration — it states that
 * HBOT is physician-assessed, complements rather than replaces treatment, and
 * is FDA-cleared only for specific conditions. Keep it on every page.
 */
export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** "Explore" column. Defaults to the site's own six pages. */
  exploreLinks?: FooterLink[];
  /** Displayed phone number. @default '(369) 222-0979' */
  phone?: string;
  /** @default 'marketing@generationswellness.net' */
  email?: string;
  /** Replace the medical disclaimer body. Leave unset to keep the approved copy. */
  disclaimer?: React.ReactNode;
  /** @default '© 2026 Generations Wellness · Modesto, California' */
  copyright?: string;
  /** Gold emblem image. @default '/assets/img/emblem-gold-160.webp' */
  emblemSrc?: string;
}

const DEFAULT_EXPLORE: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Hyperbaric Oxygen Therapy', href: '/hyperbaric-oxygen-therapy/' },
  { label: 'Benefits & Who It Helps', href: '/benefits/' },
  { label: 'About Us', href: '/about/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Contact', href: '/contact/' },
];

const DEFAULT_DISCLAIMER = (
  <>
    The information on this website is provided for general educational purposes only and is not
    medical advice, diagnosis, or treatment. Hyperbaric oxygen therapy (HBOT) at Generations
    Wellness is provided only after an assessment by a physician, who determines whether HBOT is
    appropriate as part of your care plan. HBOT complements — and never replaces — the medical
    treatment prescribed by your doctors. The FDA has cleared hyperbaric chambers for specific
    conditions; HBOT has not been proven safe or effective for other conditions. Individual results
    vary, and no outcome is guaranteed. If you believe you have a medical emergency, call 911.
  </>
);

export function SiteFooter({
  exploreLinks = DEFAULT_EXPLORE,
  phone = '(369) 222-0979',
  email = 'marketing@generationswellness.net',
  disclaimer = DEFAULT_DISCLAIMER,
  copyright = '© 2026 Generations Wellness · Modesto, California',
  emblemSrc = '/assets/img/emblem-gold-160.webp',
  className,
  ...rest
}: SiteFooterProps) {
  const tel = `tel:+1${phone.replace(/\D/g, '')}`;
  return (
    <footer className={['site-footer', className].filter(Boolean).join(' ')} {...rest}>
      <div className="footer-divider" aria-hidden="true" />
      <div className="footer-main">
        <div className="footer-ghost" aria-hidden="true" data-word="Generations" />
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src={emblemSrc} alt="" width={72} height={74} loading="lazy" />
              <p className="footer-wordmark">Generations<span>Wellness</span></p>
              <p className="footer-tagline">Holistic Health, For Every Stage of Life</p>
            </div>
            <nav className="footer-col" aria-label="Footer">
              <span className="kicker">Explore</span>
              <ul>
                {exploreLinks.map((l) => (
                  <li key={l.href}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </nav>
            <div className="footer-col">
              <span className="kicker">Visit</span>
              <address>
                Generations Wellness<br />
                1801 H Street, Suite C-1<br />
                Modesto, CA 95354<br />
                <a href="https://www.google.com/maps/search/?api=1&query=Generations+Wellness+1801+H+Street+Suite+C-1+Modesto+CA+95354" rel="noopener">Get directions</a>
              </address>
              <p className="small mt-4">Sessions by appointment.</p>
            </div>
            <div className="footer-col">
              <span className="kicker">Contact</span>
              <ul>
                <li><a href={tel}>{phone}</a></li>
                <li><a href={`mailto:${email}`}>{email}</a></li>
                <li><a href="/contact/">Book a physician consultation</a></li>
              </ul>
              <p className="small mt-4">Physicians: we welcome referrals and will coordinate care with your office.</p>
            </div>
          </div>
          <p className="footer-disclaimer"><strong>Medical Disclaimer:</strong> {disclaimer}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>{copyright}</span>
          <span><a href="https://www.generationswellness.net/">www.generationswellness.net</a></span>
        </div>
      </div>
    </footer>
  );
}
