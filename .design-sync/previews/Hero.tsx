import * as React from 'react';
import { Hero, PosterHeading, Button, GoldText } from 'generations-wellness-ds';
import { heroChamber } from './_assets';

export const Homepage = () => (
  <Hero
    kicker="Physician-Directed Hyperbaric Medicine · Modesto, CA"
    heading={
      <PosterHeading
        lines={[
          'Physician-Directed',
          <><GoldText>Hyperbaric</GoldText> Oxygen</>,
          'Therapy in Modesto',
        ]}
      />
    }
    lead="Advanced oxygen-based therapy designed to support healing, recovery, and tissue wellness — delivered as part of a physician-directed care plan, in the heart of downtown Modesto."
    actions={
      <>
        <Button href="/contact/">Book a Physician Consultation</Button>
        <Button variant="secondary-on-dark" href="/hyperbaric-oxygen-therapy/">How the Therapy Works</Button>
      </>
    }
    media={<img src={heroChamber} width={1502} height={1007} alt="Patient resting comfortably inside a hyperbaric oxygen chamber at Generations Wellness" />}
    mediaBadge="Physician-Directed Care"
    strip={[
      'Physician assessment before every course',
      '1801 H Street, Suite C-1',
      <a href="tel:+13692220979">(369)&nbsp;222-0979</a>,
    ]}
  />
);

export const WithoutPhotograph = () => (
  <Hero
    kicker="Benefits &amp; Who It Helps"
    heading={<PosterHeading lines={['How Oxygen', <>Supports <GoldText>Healing</GoldText></>]} />}
    lead="Every benefit below reflects the same mechanism — more oxygen, delivered where your body needs it most."
    actions={<Button href="/contact/">Book an Assessment</Button>}
  />
);
