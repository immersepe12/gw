import * as React from 'react';
import { Section, SectionHead, Card, Mosaic, ChipIcon, Icon, GoldText } from 'generations-wellness-ds';

export const NumberedWithLabel = () => (
  <Section numeral="03" label="The Generations Difference">
    <SectionHead kicker="The Generations Difference" heading={<>Why Choose Generations Wellness</>} />
    <Mosaic>
      <Card
        variant="featured"
        icon={<ChipIcon><Icon name="caduceus" /></ChipIcon>}
        heading="Physician-Directed"
      >
        <p>A physician assessment is mandatory before starting HBOT. Treatment begins only after medical review confirms it's appropriate for your condition.</p>
      </Card>
      <Card icon={<ChipIcon><Icon name="shield-check" /></ChipIcon>} heading="Safety &amp; Screening First">
        <p>Medical screening, chamber safety protocols, and ongoing monitoring throughout your entire course of therapy.</p>
      </Card>
    </Mosaic>
  </Section>
);

export const CardSurface = () => (
  <Section tone="card-bg" numeral="02" label="Why Oxygen Matters">
    <SectionHead
      deck
      kicker="Why Oxygen Matters"
      heading={<>How HBOT May Support Your Healing</>}
      lead="Every benefit below reflects the same mechanism — more oxygen, delivered where your body needs it most."
    />
  </Section>
);

export const Emerald = () => (
  <Section tone="dark">
    <p className="kicker kicker--on-dark">Rooted in the Central Valley</p>
    <h2>Serving Modesto <GoldText>and</GoldText> the Central Valley</h2>
    <p className="lead">Our center sits on H Street in downtown Modesto, a short drive from anywhere in Stanislaus County via Highway 99.</p>
  </Section>
);
