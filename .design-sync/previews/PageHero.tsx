import * as React from 'react';
import { PageHero, GoldText } from 'generations-wellness-ds';

export const AboutPage = () => (
  <PageHero
    numeral="04"
    crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
    kicker="Our Story & Standards"
    heading={<>About <GoldText>Generations</GoldText> Wellness</>}
    lead="A physician-directed hyperbaric oxygen therapy center in downtown Modesto — built on the belief that honest medicine and warm care belong in the same room."
  />
);

export const TherapyPage = () => (
  <PageHero
    numeral="01"
    crumbs={[{ label: 'Home', href: '/' }, { label: 'Hyperbaric Oxygen Therapy' }]}
    kicker="The Therapy"
    heading={<>What Hyperbaric Oxygen Therapy <GoldText>Actually</GoldText> Does</>}
    lead="Inside a pressurized chamber you breathe a higher concentration of oxygen, and that extra oxygen dissolves directly into your blood plasma — reaching tissues where healing may be compromised."
  />
);

export const MinimalNoBreadcrumbs = () => (
  <PageHero
    kicker="Contact"
    heading={<>Book a Physician Consultation</>}
    lead="Call us, email us, or visit the center on H Street. A physician assessment is the first step for everyone."
  />
);
