import * as React from 'react';

/**
 * The homepage hero: a deep-emerald stage with the concentric breath rings
 * behind it, the poster headline and photograph side by side, a lead paragraph
 * with its actions, and the fact strip along the bottom.
 *
 * This is the only place the full poster scale is used. Everything inside sits
 * on emerald, so any `Kicker` needs `onDark` and any secondary button must be
 * `secondary-on-dark`.
 */
export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Eyebrow above the headline. */
  kicker?: string;
  /** The poster headline — pass a `<PosterHeading>`. */
  heading: React.ReactNode;
  /** Lead paragraph under the headline. */
  lead?: React.ReactNode;
  /** Buttons. Use one `primary` and one `secondary-on-dark`. */
  actions?: React.ReactNode;
  /** Photograph. Pass an `<img>`. */
  media?: React.ReactNode;
  /** Small caption pinned to the photograph, e.g. "Physician-Directed Care". */
  mediaBadge?: React.ReactNode;
  /** Fact strip along the bottom — address, phone, a standard of care. */
  strip?: React.ReactNode[];
}

const RINGS = [
  [72, 0.2], [120, 0.16], [172, 0.13], [228, 0.1], [288, 0.08], [352, 0.06],
] as const;

/** The concentric rings behind every emerald stage. Decorative. */
export function BreathRings() {
  return (
    <svg className="rings rings--live" viewBox="0 0 720 720" fill="none" aria-hidden="true">
      {RINGS.map(([r, o]) => (
        <circle key={r} cx="360" cy="360" r={r} strokeOpacity={String(o)} />
      ))}
    </svg>
  );
}

export function Hero({
  kicker,
  heading,
  lead,
  actions,
  media,
  mediaBadge,
  strip,
  className,
  ...rest
}: HeroProps) {
  return (
    <section className={['hero', 'depth', className].filter(Boolean).join(' ')} data-breathe {...rest}>
      <BreathRings />
      <div className="container container--wide">
        {kicker ? (
          <div className="hero-ledger">
            <p className="kicker kicker--on-dark">{kicker}</p>
          </div>
        ) : null}
        <div className="hero-grid">
          {heading}
          {media ? (
            <div className="hero-media">
              {media}
              {mediaBadge ? <p className="hero-badge">{mediaBadge}</p> : null}
            </div>
          ) : null}
          <div className="hero-copy">
            {lead ? <p className="lead">{lead}</p> : null}
            {actions ? <div className="hero-actions">{actions}</div> : null}
          </div>
        </div>
        {strip && strip.length ? (
          <div className="hero-strip">
            <ul>{strip.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
