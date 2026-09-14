import * as React from 'react';
import { IndexList, IndexRow, LedgerLink, ChipIcon, Icon } from 'generations-wellness-ds';

export const BenefitsIndex = () => (
  <>
    <IndexList>
      <IndexRow
        href="/benefits/"
        icon={<ChipIcon><Icon name="leaf" /></ChipIcon>}
        title="Wound Healing and Tissue Recovery"
        description="Supports wound healing and tissue recovery by improving the oxygen supply that healing tissue depends on — session after session."
      />
      <IndexRow
        href="/benefits/"
        icon={<ChipIcon><Icon name="cells" /></ChipIcon>}
        title="Oxygen Delivery to Compromised Tissues"
        description="Helps improve oxygen delivery to tissues where circulation is impaired — the areas that struggle most to heal on their own."
      />
      <IndexRow
        href="/benefits/"
        icon={<ChipIcon><Icon name="sun-person" /></ChipIcon>}
        title="Recovery After Radiation-Related Tissue Injury"
        description="May assist healing after radiation-related tissue injury, supporting tissue that needs long-term help rebuilding its blood supply."
      />
    </IndexList>
    <LedgerLink href="/benefits/">See the full picture of who may benefit from HBOT →</LedgerLink>
  </>
);

export const TwoRows = () => (
  <IndexList>
    <IndexRow
      href="/hyperbaric-oxygen-therapy/"
      icon={<ChipIcon><Icon name="calendar-check" /></ChipIcon>}
      title="What a Full Session Looks Like"
      description="From the first pressure change to the last, a walkthrough of the ninety minutes you spend in the chamber."
    />
    <IndexRow
      href="/faq/"
      icon={<ChipIcon><Icon name="document" /></ChipIcon>}
      title="Common Questions About Cost and Safety"
      description="What HBOT is cleared for, what insurance typically covers, and who a physician may turn away."
    />
  </IndexList>
);
