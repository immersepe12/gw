import * as React from 'react';
import { Lead } from 'generations-wellness-ds';

export const OnLight = () => (
  <div style={{ padding: 24 }}>
    <Lead>Hyperbaric oxygen therapy helps deliver higher levels of oxygen to the body's tissues in a pressurized chamber. That increased oxygen availability may support the body's natural healing response.</Lead>
  </div>
);

export const OnEmerald = () => (
  <div className="section--dark" style={{ padding: 32 }}>
    <Lead>Advanced oxygen-based therapy designed to support healing, recovery, and tissue wellness — delivered as part of a physician-directed care plan, in the heart of downtown Modesto.</Lead>
  </div>
);

export const WithLink = () => (
  <div style={{ padding: 24 }}>
    <Lead>Talk to us about whether physician-directed hyperbaric oxygen therapy fits your care plan — or start with <a href="/faq/">common questions about HBOT, cost, and safety</a>.</Lead>
  </div>
);
