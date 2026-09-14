import * as React from 'react';

/**
 * The Generations Wellness line-icon set, drawn at 24×24 on a 1.75 stroke.
 *
 * Every icon on the site is an inline SVG using `stroke="currentColor"`, so an
 * icon inherits colour from whatever it sits in — gold inside a `ChipIcon` on
 * light, cream inside one on dark. Icons are decorative by default
 * (`aria-hidden`); pass a `title` only when the icon is the sole carrier of
 * meaning, which on this site it never is.
 */
export type IconName =
  | 'phone'
  | 'mail'
  | 'pin'
  | 'clock'
  | 'shield-check'
  | 'shield-alert'
  | 'leaf'
  | 'cells'
  | 'sun-person'
  | 'caduceus'
  | 'document'
  | 'people'
  | 'calendar-check'
  | 'check-circle'
  | 'arrow-right'
  | 'plus'
  | 'warning'
  | 'menu'
  | 'close';

const PATHS: Record<IconName, React.ReactNode> = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  pin: <><path d="M12 21s-7-5.75-7-11a7 7 0 0 1 14 0c0 5.25-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  'shield-check': <><path d="M12 3l7 3v5c0 4.4-2.9 8.2-7 10-4.1-1.8-7-5.6-7-10V6l7-3z" /><path d="M9 12l2 2 4-4.5" /></>,
  'shield-alert': <><path d="M12 3l7 3v5c0 4.4-2.9 8.2-7 10-4.1-1.8-7-5.6-7-10V6l7-3z" /><path d="M12 8.5v4M12 15.5h.01" /></>,
  leaf: <><path d="M12 21c-4 0-6.5-2.4-6.5-5.7C5.5 11 12 3.5 12 3.5s6.5 7.5 6.5 11.8c0 3.3-2.5 5.7-6.5 5.7z" /><path d="M9.5 14.5c0 1.4 1.1 2.5 2.5 2.5" /></>,
  cells: <><circle cx="9" cy="14" r="4.5" /><circle cx="16.5" cy="8" r="3" /><circle cx="18.5" cy="15.5" r="1.75" /></>,
  'sun-person': <><path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M16.3 7.7l2.1-2.1" /><path d="M8 21a4.5 4.5 0 1 1 8 0" /><path d="M5 21h14" /></>,
  caduceus: <><path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h1v4H7a2.5 2.5 0 0 1-2.5-1.5z" /><path d="M8 3v7a4 4 0 0 0 8 0V3" /><path d="M16 3h1a2.5 2.5 0 0 1 0 5h-1" /><path d="M12 14v3a3.5 3.5 0 0 0 7 0v-1" /><circle cx="19" cy="14" r="2" /></>,
  document: <><path d="M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M9 7.5h6M9 11h6M9 14.5h3.5" /></>,
  people: <><circle cx="8.5" cy="7.5" r="2.75" /><circle cx="16.5" cy="9" r="2.25" /><path d="M3.5 20v-1.5a5 5 0 0 1 5-5 5 5 0 0 1 4.4 2.6" /><path d="M13.5 20v-1a4 4 0 0 1 7-2.6" /></>,
  'calendar-check': <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /><path d="M9.5 15.5l2 2 3.5-4" /></>,
  'check-circle': <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  warning: <><path d="M12 4L3 19h18L12 4z" /><path d="M12 10v4M12 16.75h.01" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  /** Which glyph to draw. */
  name: IconName;
  /** Accessible name. Omit for decorative icons (the default). */
  title?: string;
}

export function Icon({ name, title, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
