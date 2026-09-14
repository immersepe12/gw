import * as React from 'react';
import { MapFrame } from 'generations-wellness-ds';

export const ModestoCenter = () => (
  <div style={{ padding: 24 }}>
    <MapFrame />
    <p className="small mt-4" style={{ color: 'var(--ink-600)' }}>
      Suite C-1 at 1801 H Street, in downtown Modesto — street and nearby lot parking available.
      If you have mobility needs, call ahead and we'll meet you at the entrance.
    </p>
  </div>
);
