import * as React from 'react';
import { ContactGrid, NapPanel, MapFrame, Callout } from 'generations-wellness-ds';

export const ContactPage = () => (
  <ContactGrid>
    <div>
      <NapPanel
        entries={[
          {
            icon: 'phone',
            title: 'Call us',
            body: <><a href="tel:+13692220979">(369) 222-0979</a><br />The fastest way to get answers and book your assessment.</>,
          },
          {
            icon: 'mail',
            title: 'Email us',
            body: <><a href="mailto:marketing@generationswellness.net">marketing@generationswellness.net</a><br />Tell us a little about your situation and the best time to call you back.</>,
          },
          {
            icon: 'pin',
            title: 'Visit our Modesto center',
            address: true,
            body: <>Generations Wellness<br />1801 H Street, Suite C-1<br />Modesto, CA 95354</>,
          },
        ]}
      />
      <Callout className="mt-8">
        A physician assessment is required before beginning HBOT. Prefer to read first? See{' '}
        <a href="/faq/">answers to common questions before you call</a>.
      </Callout>
    </div>
    <div>
      <MapFrame />
      <p className="small mt-4" style={{ color: 'var(--ink-600)' }}>
        Suite C-1 at 1801 H Street, in downtown Modesto — street and nearby lot parking available.
      </p>
    </div>
  </ContactGrid>
);
