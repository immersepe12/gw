import * as React from 'react';

/**
 * The full-bleed photographic band with a panel of copy floated over it — used
 * once per page at most, for the block that places the clinic somewhere real.
 *
 * The photograph is darkened behind the panel so cream text clears contrast;
 * choose an image with a calm area where the panel lands.
 */
export interface ValleyPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** Background photograph. Pass an `<img>`. */
  media?: React.ReactNode;
  /** Rotated label up the right edge. */
  label?: string;
  /** Eyebrow inside the panel. */
  kicker?: string;
  /** Panel heading. Renders as `<h2>`. */
  heading?: React.ReactNode;
  /** Panel body — paragraphs, and often a `Callout`. */
  children?: React.ReactNode;
}

export function ValleyPanel({ media, label, kicker, heading, className, children, ...rest }: ValleyPanelProps) {
  return (
    <section className={['valley', className].filter(Boolean).join(' ')} {...rest}>
      {media ? <div className="valley-bg">{media}</div> : null}
      {label ? <span className="vlabel vlabel--right vlabel--on-dark" aria-hidden="true" data-label={label} /> : null}
      <div className="container">
        <div className="valley-panel">
          {kicker ? <p className="kicker">{kicker}</p> : null}
          {heading ? <h2>{heading}</h2> : null}
          {children}
        </div>
      </div>
    </section>
  );
}
