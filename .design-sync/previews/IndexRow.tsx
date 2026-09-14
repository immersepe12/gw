import * as React from 'react';
import { IndexList, IndexRow, ChipIcon, Icon } from 'generations-wellness-ds';

export const SingleRow = () => (
  <IndexList>
    <IndexRow
      href="/benefits/"
      icon={<ChipIcon><Icon name="leaf" /></ChipIcon>}
      title="Wound Healing and Tissue Recovery"
      description="Supports wound healing and tissue recovery by improving the oxygen supply that healing tissue depends on."
    />
  </IndexList>
);

export const WithoutDescription = () => (
  <IndexList>
    <IndexRow href="/about/" icon={<ChipIcon><Icon name="people" /></ChipIcon>} title="Our Physician-Directed Approach" />
    <IndexRow href="/contact/" icon={<ChipIcon><Icon name="pin" /></ChipIcon>} title="Directions to the Modesto Center" />
  </IndexList>
);
