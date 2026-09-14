import * as React from 'react';
import { ValleyPanel, Callout, GoldText } from 'generations-wellness-ds';
import { careTeam } from './_assets';

export const CentralValley = () => (
  <ValleyPanel
    media={<img src={careTeam} width={715} height={430} alt="Care team member talking with a smiling patient beside a hyperbaric chamber" />}
    label="Rooted in the Central Valley"
    kicker="Rooted in the Central Valley"
    heading={<>Serving Modesto <GoldText>and</GoldText> the Central Valley</>}
  >
    <p>Our center sits on H Street in downtown Modesto, a short drive from anywhere in Stanislaus County via Highway 99. Patients visit us from Turlock, Ceres, Manteca, Ripon, Riverbank, Oakdale, and the Stockton area — many within a 15–40 minute drive.</p>
    <p>Read about <a href="/about/">our physician-directed approach</a>, or find <a href="/contact/">directions to our Modesto center</a>.</p>
    <Callout className="mt-6">
      HBOT is typically used as part of a comprehensive care plan and is not a replacement for your physician's medical treatment.
    </Callout>
  </ValleyPanel>
);
