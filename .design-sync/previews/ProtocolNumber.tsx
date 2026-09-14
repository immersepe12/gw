import * as React from 'react';
import { ProtocolNumber } from 'generations-wellness-ds';

export const InProse = () => (
  <div style={{ padding: 24 }}>
    <p><ProtocolNumber>20–40 sessions</ProtocolNumber></p>
    <p>Many patients complete a course of 20–40 sessions, usually one session per day, several days a week.</p>
  </div>
);

export const Durations = () => (
  <div style={{ padding: 24, display: 'grid', gap: 20 }}>
    <p><ProtocolNumber>90–120 minutes</ProtocolNumber></p>
    <p><ProtocolNumber>1 session per day</ProtocolNumber></p>
  </div>
);
