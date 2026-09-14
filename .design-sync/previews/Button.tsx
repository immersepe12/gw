import * as React from 'react';
import { Button } from 'generations-wellness-ds';

export const Primary = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button href="/contact/">Book a Physician Consultation</Button>
    <Button href="/contact/" small>Book an Assessment</Button>
  </div>
);

export const SecondaryOnLight = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button variant="secondary" href="/hyperbaric-oxygen-therapy/">
      Learn how hyperbaric oxygen therapy works
    </Button>
    <Button variant="secondary" href="/faq/" small>Read the FAQ</Button>
  </div>
);

export const OnEmerald = () => (
  <div className="section--dark" style={{ padding: 32, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button href="/contact/">Request a Physician Consultation</Button>
    <Button variant="secondary-on-dark" href="/faq/">Read the FAQ</Button>
  </div>
);

export const AsButtonElement = () => (
  <Button as="button" type="submit">Send my question</Button>
);
