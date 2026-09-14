import * as React from 'react';
import { ChipIcon } from './ChipIcon';
import { Icon, type IconName } from './Icon';

export interface ContactEntry {
  /** Which glyph opens the row. */
  icon: IconName;
  /** Row heading — "Call us", "Visit our Modesto center". */
  title: string;
  /** The detail itself, usually with a `tel:`, `mailto:` or maps link. */
  body: React.ReactNode;
  /** Wrap the body in `<address>`. Use for the postal entry. @default false */
  address?: boolean;
}

/**
 * The name-address-phone panel: a dark emerald card holding the clinic's
 * canonical contact details.
 *
 * These details are the same ones carried in the page's structured data and in
 * local directory listings, so they have to match character for character —
 * "1801 H Street, Suite C-1", not "Ste C1". Editing them here means editing
 * them everywhere.
 */
export interface NapPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Contact rows, in priority order. */
  entries: ContactEntry[];
}

export function NapPanel({ entries, className, ...rest }: NapPanelProps) {
  return (
    <div className={['nap-panel', 'depth', className].filter(Boolean).join(' ')} {...rest}>
      <div className="rings-static" aria-hidden="true" />
      <ul className="contact-list">
        {entries.map((e) => (
          <li key={e.title}>
            <ChipIcon tone="light"><Icon name={e.icon} /></ChipIcon>
            <div>
              <h3 className="h6-style">{e.title}</h3>
              {e.address ? <address><p>{e.body}</p></address> : <p>{e.body}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The two-column contact layout: the `NapPanel` on the left, a `MapFrame` on the right. */
export function ContactGrid({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={['contact-grid', className].filter(Boolean).join(' ')} {...rest}>{children}</div>;
}
