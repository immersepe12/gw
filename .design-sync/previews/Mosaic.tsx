import * as React from 'react';
import { Mosaic, Card, ChipIcon, Icon } from 'generations-wellness-ds';

export const FourUp = () => (
  <Mosaic>
    <Card variant="featured" icon={<ChipIcon><Icon name="caduceus" /></ChipIcon>} heading="Physician-Directed">
      <p>A physician assessment is mandatory before starting HBOT. Treatment begins only after medical review confirms it's appropriate for your condition.</p>
    </Card>
    <Card icon={<ChipIcon><Icon name="shield-check" /></ChipIcon>} heading="Safety &amp; Screening First">
      <p>Medical screening, chamber safety protocols, and ongoing monitoring throughout your entire course of therapy.</p>
    </Card>
    <Card icon={<ChipIcon><Icon name="document" /></ChipIcon>} heading="Honest, Evidence-Consistent Guidance">
      <p>We're candid about what HBOT is cleared for, what it may support, and what it is not — so you can decide with clear eyes.</p>
    </Card>
    <Card icon={<ChipIcon><Icon name="people" /></ChipIcon>} heading="Every Stage of Life">
      <p>Holistic health, for every stage of life — care designed around your family's healing journey, not a one-size-fits-all protocol.</p>
    </Card>
  </Mosaic>
);
