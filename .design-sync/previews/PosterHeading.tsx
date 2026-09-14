import * as React from 'react';
import { PosterHeading, GoldText } from 'generations-wellness-ds';

export const HeroScale = () => (
  <div className="section--dark" style={{ padding: 40 }}>
    <PosterHeading
      lines={['Physician-Directed', <><GoldText>Hyperbaric</GoldText> Oxygen</>, 'Therapy in Modesto']}
    />
  </div>
);

export const CtaScale = () => (
  <div className="section--dark" style={{ padding: 40 }}>
    <PosterHeading as="h2" size="poster-sm" lines={['Your Body. ', <GoldText>Our Mission.</GoldText>]} />
  </div>
);

export const OnCream = () => (
  <div style={{ padding: 40 }}>
    <PosterHeading as="h2" size="poster-sm" lines={['Holistic Health,', <>For <em>Every</em> Stage of Life</>]} />
  </div>
);
