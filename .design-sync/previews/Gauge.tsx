import * as React from 'react';
import { Gauge } from 'generations-wellness-ds';

export const TypicalCourse = () => (
  <div className="section--dark" style={{ padding: 40 }}>
    <Gauge
      primary={{ value: '20–40', label: 'Sessions in a typical course' }}
      stats={[
        { value: '90–120', label: 'Minutes per session' },
        { value: '100%', label: 'Oxygen-based therapy' },
        { value: '1st', label: 'Step is always a physician assessment' },
      ]}
      note="Session counts, lengths, and pressures are set individually by a physician — these figures describe a typical physician-directed course."
    />
  </div>
);

export const PrimaryOnly = () => (
  <div className="section--dark" style={{ padding: 40 }}>
    <Gauge
      primary={{ value: '1st', label: 'Step is always a physician assessment' }}
      note="A physician assessment is mandatory before starting HBOT — for everyone, without exception."
    />
  </div>
);
