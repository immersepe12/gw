import * as React from 'react';

/**
 * The ivory panel used for the "why choose us" mosaic and the protocol block:
 * a `ChipIcon`, a heading, and a short paragraph.
 *
 * `featured` promotes the first card in a mosaic to the wider, gold-edged
 * treatment. `protocol` is the single large card used on the therapy page,
 * where the heading is an `h2` at `h4-style` and a `protocol-number` carries
 * the figure.
 */
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'default' */
  variant?: 'default' | 'featured' | 'protocol';
  /** A `<ChipIcon>`. */
  icon?: React.ReactNode;
  /** Eyebrow — used by the protocol variant. */
  kicker?: string;
  /** Card heading. */
  heading?: React.ReactNode;
  /** Body copy, or any children. */
  children?: React.ReactNode;
}

export function Card({ variant = 'default', icon, kicker, heading, className, children, ...rest }: CardProps) {
  const cls = ['card', variant !== 'default' ? `card--${variant}` : null, className].filter(Boolean).join(' ');
  return (
    <article className={cls} {...rest}>
      {icon}
      {kicker ? <span className="kicker">{kicker}</span> : null}
      {heading ? (variant === 'protocol' ? <h2 className="h4-style">{heading}</h2> : <h3>{heading}</h3>) : null}
      {children}
    </article>
  );
}

/**
 * The four-up grid the cards sit in. The first child is usually the `featured`
 * card and spans wider than the rest.
 */
export interface MosaicProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Mosaic({ className, children, ...rest }: MosaicProps) {
  return <div className={['mosaic', className].filter(Boolean).join(' ')} {...rest}>{children}</div>;
}

/**
 * The oversized figure inside a protocol card — "20–40 sessions". Set in the
 * display serif so the number reads as a fact, not a headline.
 */
export function ProtocolNumber({ children, className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={['protocol-number', className].filter(Boolean).join(' ')} {...rest}>{children}</span>;
}
