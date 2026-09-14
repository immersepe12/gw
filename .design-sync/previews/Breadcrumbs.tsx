import * as React from 'react';
import { Breadcrumbs } from 'generations-wellness-ds';

export const TwoLevel = () => (
  <div className="section--dark" style={{ padding: 32 }}>
    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Benefits' }]} />
  </div>
);

export const ThreeLevel = () => (
  <div className="section--dark" style={{ padding: 32 }}>
    <Breadcrumbs
      items={[
        { label: 'Home', href: '/' },
        { label: 'Hyperbaric Oxygen Therapy', href: '/hyperbaric-oxygen-therapy/' },
        { label: 'What to Expect' },
      ]}
    />
  </div>
);
