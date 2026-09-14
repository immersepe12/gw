import * as React from 'react';
import { BreathRings } from 'generations-wellness-ds';

export const OnEmerald = () => (
  <div className="section--dark depth" style={{ position: 'relative', minHeight: 320, overflow: 'hidden' }}>
    <BreathRings />
    <div className="container" style={{ position: 'relative', paddingTop: 96, paddingBottom: 96 }}>
      <p className="kicker kicker--on-dark">Physician-Directed Hyperbaric Medicine</p>
      <p className="lead">The rings sit behind the content on every emerald stage — the hero, the closing band, and the contact panel.</p>
    </div>
  </div>
);
