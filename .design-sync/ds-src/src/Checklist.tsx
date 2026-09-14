import * as React from 'react';
import { Icon } from './Icon';

/**
 * A list of qualifying points, each opened by a check mark. Used for who HBOT
 * may help and for the standards of care.
 *
 * Lead each item with a bolded phrase and follow it with the qualification —
 * `<strong>Chronic and non-healing wounds</strong> that have stalled despite
 * good wound care.` The bold carries the scan; the tail keeps it honest.
 */
export interface ChecklistProps extends React.HTMLAttributes<HTMLUListElement> {
  /** One entry per point. */
  items: React.ReactNode[];
}

export function Checklist({ items, className, ...rest }: ChecklistProps) {
  return (
    <ul className={['checklist', className].filter(Boolean).join(' ')} {...rest}>
      {items.map((item, i) => (
        <li key={i}><Icon name="check-circle" />{item}</li>
      ))}
    </ul>
  );
}

/**
 * Compact pills for a plain enumeration — the FDA-cleared indications, for
 * instance — where each entry is a term rather than a sentence.
 */
export interface ChipsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: React.ReactNode[];
  /** Sits on an emerald surface. @default false */
  onDark?: boolean;
}

export function Chips({ items, onDark = false, className, ...rest }: ChipsProps) {
  const cls = ['chips', onDark ? 'chips--on-dark' : null, className].filter(Boolean).join(' ');
  return <ul className={cls} {...rest}>{items.map((c, i) => <li key={i}>{c}</li>)}</ul>;
}
