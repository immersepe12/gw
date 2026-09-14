import * as React from 'react';
import { SectionHead, GoldText } from 'generations-wellness-ds';

export const Standard = () => (
  <SectionHead
    kicker="The Generations Difference"
    heading={<>Why Choose Generations Wellness</>}
  />
);

export const WithDeck = () => (
  <SectionHead
    deck
    kicker="Why Oxygen Matters"
    heading={<>How HBOT May Support Your Healing</>}
    lead="Every benefit below reflects the same mechanism — more oxygen, delivered where your body needs it most."
  />
);

export const WithGoldAccent = () => (
  <SectionHead
    deck
    kicker="The Therapy"
    heading={<>Advanced <GoldText>Oxygen-Based</GoldText> Therapy for Healing <em>and</em> Recovery</>}
    lead="Hyperbaric oxygen therapy helps deliver higher levels of oxygen to the body's tissues in a pressurized chamber. That increased oxygen availability may support the body's natural healing response."
  />
);

export const Centered = () => (
  <SectionHead
    centered
    kicker="Getting Started"
    heading={<>Begin With a Physician Assessment</>}
  />
);
