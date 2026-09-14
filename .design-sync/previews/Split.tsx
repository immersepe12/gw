import * as React from 'react';
import { Split, Kicker, Button } from 'generations-wellness-ds';
import { oxygenCells } from './_assets';

export const MediaFirst = () => (
  <Split media={<img src={oxygenCells} width={715} height={430} alt="Illustration of oxygen molecules dissolving into the bloodstream alongside red blood cells" />}>
    <Kicker>What Is HBOT?</Kicker>
    <h2>What Is Hyperbaric Oxygen Therapy?</h2>
    <p>Inside a hyperbaric chamber, you breathe a higher concentration of oxygen under gently increased pressure. Under that pressure, extra oxygen dissolves directly into your blood plasma — reaching tissues where circulation or healing may be compromised.</p>
    <p>Sessions are calm and restful: most patients simply relax while the chamber does the work.</p>
    <Button variant="secondary" href="/hyperbaric-oxygen-therapy/">Learn how hyperbaric oxygen therapy works</Button>
  </Split>
);

export const CopyFirst = () => (
  <Split reverse media={<img src={oxygenCells} width={715} height={430} alt="Illustration of oxygen molecules dissolving into the bloodstream" />}>
    <Kicker>Your Visit</Kicker>
    <h2>What a Session Feels Like</h2>
    <p>Most people compare the start of a session to an airplane taking off: gentle pressure in the ears, relieved by swallowing or yawning. Once the chamber reaches pressure, you simply rest.</p>
  </Split>
);
