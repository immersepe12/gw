import * as React from 'react';
import { Icon, type IconName } from 'generations-wellness-ds';

const ALL: IconName[] = [
  'phone', 'mail', 'pin', 'clock', 'shield-check', 'shield-alert', 'leaf', 'cells',
  'sun-person', 'caduceus', 'document', 'people', 'calendar-check', 'check-circle',
  'arrow-right', 'plus', 'warning', 'menu', 'close',
];

export const TheSet = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 20, padding: 24, color: 'var(--green-900)' }}>
    {ALL.map((n) => (
      <figure key={n} style={{ margin: 0, textAlign: 'center' }}>
        <Icon name={n} width={28} height={28} />
        <figcaption className="small" style={{ marginTop: 6, color: 'var(--ink-600)' }}>{n}</figcaption>
      </figure>
    ))}
  </div>
);

export const InheritsColour = () => (
  <div style={{ display: 'flex', gap: 24, padding: 24, alignItems: 'center' }}>
    <Icon name="shield-check" width={32} height={32} style={{ color: 'var(--green-900)' }} />
    <Icon name="shield-check" width={32} height={32} style={{ color: 'var(--gold-800)' }} />
    <span className="section--dark" style={{ padding: 12, display: 'inline-flex', color: 'var(--gold-300)' }}>
      <Icon name="shield-check" width={32} height={32} />
    </span>
  </div>
);
