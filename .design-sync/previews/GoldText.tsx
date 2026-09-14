import * as React from 'react';
import { GoldText } from 'generations-wellness-ds';

export const InAHeadline = () => (
  <div style={{ padding: 24 }}>
    <h2>Advanced <GoldText>Oxygen-Based</GoldText> Therapy for Healing and Recovery</h2>
  </div>
);

export const OnEmerald = () => (
  <div className="section--dark" style={{ padding: 32 }}>
    <h2>Your Body. <GoldText>Our Mission.</GoldText></h2>
  </div>
);

export const UprightInAStatistic = () => (
  <div className="section--dark" style={{ padding: 32 }}>
    <span className="stat-number"><GoldText as="span">20–40</GoldText></span>
    <span className="stat-label" style={{ display: 'block' }}>Sessions in a typical course</span>
  </div>
);
