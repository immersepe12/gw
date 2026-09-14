import * as React from 'react';
import { Callout } from 'generations-wellness-ds';

export const CarePlan = () => (
  <div style={{ padding: 24 }}>
    <Callout>
      HBOT is typically used as part of a comprehensive care plan and is not a replacement for your
      physician's medical treatment.
    </Callout>
  </div>
);

export const Important = () => (
  <div style={{ padding: 24 }}>
    <Callout variant="important">
      A physician assessment is mandatory before starting HBOT. Treatment is provided only after
      medical review confirms that HBOT is appropriate for your condition.
    </Callout>
  </div>
);

export const CarePlanWithLink = () => (
  <div style={{ padding: 24 }}>
    <Callout>
      A physician assessment is required before beginning HBOT. Prefer to read first? See{' '}
      <a href="/faq/">answers to common questions before you call</a>.
    </Callout>
  </div>
);
