import * as React from 'react';
import { Card, ChipIcon, Icon, ProtocolNumber } from 'generations-wellness-ds';

export const Default = () => (
  <Card icon={<ChipIcon><Icon name="shield-check" /></ChipIcon>} heading="Safety &amp; Screening First">
    <p>Medical screening, chamber safety protocols, and ongoing monitoring throughout your entire course of therapy.</p>
  </Card>
);

export const Featured = () => (
  <Card variant="featured" icon={<ChipIcon><Icon name="caduceus" /></ChipIcon>} heading="Physician-Directed">
    <p>A physician assessment is mandatory before starting HBOT. Treatment begins only after medical review confirms it's appropriate for your condition.</p>
  </Card>
);

export const Protocol = () => (
  <Card
    variant="protocol"
    icon={<ChipIcon size="lg"><Icon name="calendar-check" /></ChipIcon>}
    kicker="Typical Treatment Protocol"
    heading="How Many Sessions Will I Need?"
  >
    <p><ProtocolNumber>20–40 sessions</ProtocolNumber></p>
    <p>Many patients complete a course of 20–40 sessions, usually one session per day, several days a week — depending on the condition being treated, your response to therapy, and physician recommendations.</p>
  </Card>
);
