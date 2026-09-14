import * as React from 'react';
import { NapPanel } from 'generations-wellness-ds';

const ENTRIES = [
  {
    icon: 'phone' as const,
    title: 'Call us',
    body: <><a href="tel:+13692220979">(369) 222-0979</a><br />The fastest way to get answers and book your assessment.</>,
  },
  {
    icon: 'mail' as const,
    title: 'Email us',
    body: <><a href="mailto:marketing@generationswellness.net">marketing@generationswellness.net</a><br />Tell us a little about your situation and the best time to call you back.</>,
  },
  {
    icon: 'pin' as const,
    title: 'Visit our Modesto center',
    address: true,
    body: <>Generations Wellness<br />1801 H Street, Suite C-1<br />Modesto, CA 95354<br /><a href="https://www.google.com/maps/search/?api=1&query=Generations+Wellness+1801+H+Street+Suite+C-1+Modesto+CA+95354" rel="noopener">Get directions</a></>,
  },
  {
    icon: 'clock' as const,
    title: 'Hours',
    body: "Sessions are scheduled by appointment. Call us and we'll find a time that fits your week — courses run best on a consistent schedule.",
  },
];

export const FullPanel = () => <NapPanel entries={ENTRIES} />;

export const PhoneAndAddressOnly = () => <NapPanel entries={[ENTRIES[0], ENTRIES[2]]} />;
