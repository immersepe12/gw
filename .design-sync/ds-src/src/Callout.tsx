import * as React from 'react';
import { Icon } from './Icon';

/**
 * The two standing notices the site uses to keep its claims qualified.
 *
 * `careplan` is the quiet sage aside — "HBOT is typically used as part of a
 * comprehensive care plan and is not a replacement for your physician's medical
 * treatment." `important` is the heavier framed block reserved for the
 * mandatory-assessment rule.
 *
 * Reach for these whenever a page makes a claim about what HBOT may do. Under
 * the site's content rules a benefit is always written as *supports* or *may
 * help*, and a qualifying notice belongs on the same screen.
 */
export interface CalloutProps extends React.HTMLAttributes<HTMLElement> {
  /** @default 'careplan' */
  variant?: 'careplan' | 'important';
  /** Heading — `important` only. @default 'Important' */
  title?: string;
  children?: React.ReactNode;
}

export function Callout({ variant = 'careplan', title = 'Important', className, children, ...rest }: CalloutProps) {
  if (variant === 'important') {
    return (
      <div className={['note-important', className].filter(Boolean).join(' ')} role="note" {...rest}>
        <span className="note-icon" aria-hidden="true"><Icon name="warning" /></span>
        <div>
          <p className="h6-style">{title}</p>
          <p>{children}</p>
        </div>
      </div>
    );
  }
  return (
    <aside className={['note-careplan', className].filter(Boolean).join(' ')} role="note" {...rest}>
      <Icon name="shield-alert" />
      <span>{children}</span>
    </aside>
  );
}
