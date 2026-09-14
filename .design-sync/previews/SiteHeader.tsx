import * as React from 'react';
import { SiteHeader } from 'generations-wellness-ds';
import { logoCoin } from './_assets';

export const Default = () => <SiteHeader logoSrc={logoCoin} />;

export const OnTheBenefitsPage = () => (
  <SiteHeader
    logoSrc={logoCoin}
    items={[
      { label: 'Home', href: '/' },
      { label: 'Hyperbaric Therapy', href: '/hyperbaric-oxygen-therapy/' },
      { label: 'Benefits', href: '/benefits/', current: true },
      { label: 'About', href: '/about/' },
      { label: 'FAQ', href: '/faq/' },
      { label: 'Contact', href: '/contact/' },
    ]}
  />
);
