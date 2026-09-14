import * as React from 'react';
import { ChipIcon, Icon } from 'generations-wellness-ds';

export const OnLight = () => (
  <div style={{ display: 'flex', gap: 16, padding: 24, flexWrap: 'wrap' }}>
    <ChipIcon><Icon name="leaf" /></ChipIcon>
    <ChipIcon><Icon name="cells" /></ChipIcon>
    <ChipIcon><Icon name="shield-check" /></ChipIcon>
    <ChipIcon><Icon name="caduceus" /></ChipIcon>
  </div>
);

export const Large = () => (
  <div style={{ display: 'flex', gap: 16, padding: 24, alignItems: 'center' }}>
    <ChipIcon size="lg"><Icon name="calendar-check" /></ChipIcon>
    <ChipIcon><Icon name="calendar-check" /></ChipIcon>
  </div>
);

export const OnEmerald = () => (
  <div className="nap-panel depth" style={{ display: 'flex', gap: 16, padding: 24, flexWrap: 'wrap' }}>
    <ChipIcon tone="light"><Icon name="phone" /></ChipIcon>
    <ChipIcon tone="light"><Icon name="mail" /></ChipIcon>
    <ChipIcon tone="light"><Icon name="pin" /></ChipIcon>
    <ChipIcon tone="light"><Icon name="clock" /></ChipIcon>
  </div>
);
