import * as React from 'react';
import { BreathRings } from './Hero';

/**
 * The closing band: emerald, breath rings, a poster-small headline, and the
 * booking actions with the phone number beside them.
 *
 * It is self-sufficient by design — it carries its own surface and never relies
 * on the section above it — so it can end any page. One per page, always last
 * before the footer.
 */
export interface CtaBandProps extends React.HTMLAttributes<HTMLElement> {
  /** Eyebrow above the headline. */
  kicker?: string;
  /** The headline — pass a `<PosterHeading size="poster-sm" as="h2">`. */
  heading: React.ReactNode;
  /** A sentence of framing, usually with one link out. */
  lead?: React.ReactNode;
  /** Buttons: one `primary`, one `secondary-on-dark`. */
  actions?: React.ReactNode;
  /** Displayed phone number. @default '(369) 222-0979' */
  phone?: string;
}

export function CtaBand({
  kicker,
  heading,
  lead,
  actions,
  phone = '(369) 222-0979',
  className,
  ...rest
}: CtaBandProps) {
  const tel = `tel:+1${phone.replace(/\D/g, '')}`;
  return (
    <section className={['cta-band', 'section--dark', className].filter(Boolean).join(' ')} data-breathe {...rest}>
      <BreathRings />
      <div className="container">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        {heading}
        {lead ? <p className="lead">{lead}</p> : null}
        <div className="cta-base">
          {actions ? <div className="hero-actions">{actions}</div> : null}
          <p className="cta-phone">
            Prefer to talk?{' '}
            <a href={tel}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="20" height="20">
                <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
              {phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
