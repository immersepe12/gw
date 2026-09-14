import * as React from 'react';
import { Kicker } from 'generations-wellness-ds';

export const OnLight = () => (
  <div style={{ padding: 24 }}>
    <Kicker>The Therapy</Kicker>
    <Kicker>Why Oxygen Matters</Kicker>
    <Kicker>Getting Started</Kicker>
  </div>
);

export const OnEmerald = () => (
  <div className="section--dark" style={{ padding: 24 }}>
    <Kicker onDark>Physician-Directed Hyperbaric Medicine · Modesto, CA</Kicker>
    <Kicker onDark>Our Story &amp; Standards</Kicker>
  </div>
);

export const AsSpanInAColumn = () => (
  <div className="site-footer" style={{ padding: 24 }}>
    <div className="footer-col">
      <Kicker as="span">Explore</Kicker>
      <ul>
        <li><a href="/benefits/">Benefits &amp; Who It Helps</a></li>
        <li><a href="/faq/">FAQ</a></li>
      </ul>
    </div>
  </div>
);
