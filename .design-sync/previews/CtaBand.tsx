import * as React from 'react';
import { CtaBand, PosterHeading, Button, GoldText } from 'generations-wellness-ds';

export const PageClosing = () => (
  <CtaBand
    kicker="Healing Starts With Oxygen"
    heading={<PosterHeading as="h2" size="poster-sm" lines={['Your Body. ', <GoldText>Our Mission.</GoldText>]} />}
    lead={<>Talk to us about whether physician-directed hyperbaric oxygen therapy fits your care plan — or start with <a href="/faq/">common questions about HBOT, cost, and safety</a>.</>}
    actions={
      <>
        <Button href="/contact/">Request a Physician Consultation</Button>
        <Button variant="secondary-on-dark" href="/faq/">Read the FAQ</Button>
      </>
    }
  />
);

export const SingleAction = () => (
  <CtaBand
    kicker="Getting Started"
    heading={<PosterHeading as="h2" size="poster-sm" lines={[<>Begin With an <GoldText>Assessment</GoldText></>]} />}
    lead="A physician reviews your history and confirms whether HBOT is appropriate before any course begins."
    actions={<Button href="/contact/">Book an Assessment</Button>}
  />
);
