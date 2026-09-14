import * as React from 'react';
import { Chips } from 'generations-wellness-ds';

export const ClearedIndications = () => (
  <div style={{ padding: 24 }}>
    <Chips
      items={[
        'Select non-healing diabetic wounds',
        'Delayed radiation injury (soft tissue & bone)',
        'Compromised skin grafts and flaps',
        'Certain serious infections',
        'Crush injury',
        'Carbon monoxide poisoning',
      ]}
    />
  </div>
);

export const OnEmerald = () => (
  <div className="section--dark" style={{ padding: 32 }}>
    <Chips
      onDark
      items={['Turlock', 'Ceres', 'Manteca', 'Ripon', 'Riverbank', 'Oakdale', 'Stockton']}
    />
  </div>
);
