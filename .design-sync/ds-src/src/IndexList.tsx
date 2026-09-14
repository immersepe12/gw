import * as React from 'react';

/**
 * The ledger index — the system's signature navigation pattern. Each row is a
 * full-width rule with an auto-numbered gutter, an icon, a title, a sentence of
 * description, and an arrow. Rows read as a table of contents, not as cards.
 *
 * The numbers come from CSS counters on `IndexRow`, so they renumber themselves;
 * never hard-code them.
 */
export interface IndexListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** `IndexRow` elements. */
  children?: React.ReactNode;
}

export function IndexList({ className, children, ...rest }: IndexListProps) {
  return <ul className={['index', className].filter(Boolean).join(' ')} {...rest}>{children}</ul>;
}

/**
 * One row of an `IndexList`. Renders as a link — the whole row is the target.
 */
export interface IndexRowProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  /** Destination for the whole row. */
  href: string;
  /** A `<ChipIcon>`. */
  icon?: React.ReactNode;
  /** Row title. Renders as `<h3>`. */
  title: React.ReactNode;
  /** One sentence. Two at most — this is an index, not a card. */
  description?: React.ReactNode;
}

export function IndexRow({ href, icon, title, description, className, ...rest }: IndexRowProps) {
  return (
    <li className={className} {...rest}>
      <a className="index-row" href={href}>
        <span className="idx" aria-hidden="true" />
        <div className="index-title">
          {icon}
          <h3>{title}</h3>
        </div>
        {description ? <p className="index-desc">{description}</p> : null}
        <svg className="index-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </li>
  );
}

/**
 * The quiet "see everything" link that closes an index — a rule with an arrow,
 * deliberately weaker than a button so it never competes with the booking CTA.
 */
export interface LedgerLinkProps extends React.HTMLAttributes<HTMLParagraphElement> {
  href: string;
  /** Sits on an emerald surface. @default false */
  onDark?: boolean;
  children?: React.ReactNode;
}

export function LedgerLink({ href, onDark = false, className, children, ...rest }: LedgerLinkProps) {
  const cls = ['ledger-line', onDark ? 'ledger-line--on-dark' : null, className].filter(Boolean).join(' ');
  return <p className={cls} {...rest}><a href={href}>{children}</a></p>;
}
