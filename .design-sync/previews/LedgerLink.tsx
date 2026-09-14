import * as React from 'react';
import { LedgerLink } from 'generations-wellness-ds';

export const OnLight = () => (
  <div style={{ padding: 24 }}>
    <LedgerLink href="/benefits/">See the full picture of who may benefit from HBOT →</LedgerLink>
  </div>
);

export const OnEmerald = () => (
  <div className="section--dark" style={{ padding: 32 }}>
    <LedgerLink onDark href="/faq/">Read common questions about HBOT, cost, and safety →</LedgerLink>
  </div>
);
