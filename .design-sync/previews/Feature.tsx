import * as React from 'react';
import { Feature, Kicker, GoldText } from 'generations-wellness-ds';
import { logoBadge } from './_assets';

export const CopyThenPicture = () => (
  <Feature media={<img src={logoBadge} width={999} height={821} alt="Generations Wellness emblem — gold faces of multiple generations forming a rose, on deep green" />}>
    <Kicker>Our Mission</Kicker>
    <h2>Holistic Health, For <GoldText>Every</GoldText> Stage of Life</h2>
    <p>Our name is our mission. Look closely at our emblem and you'll see it: the faces of generations — grandparents, parents, children — forming a single rose. Healing rarely involves just one person; it involves a family.</p>
    <p>Hyperbaric oxygen therapy is our craft. Honest, physician-directed care is our standard.</p>
  </Feature>
);

export const PictureFirst = () => (
  <Feature mediaFirst media={<img src={logoBadge} width={999} height={821} alt="Generations Wellness emblem on deep green" />}>
    <Kicker>Rooted in the Central Valley</Kicker>
    <h2>Built for Modesto Families</h2>
    <p>Our center sits on H Street in downtown Modesto, a short drive from anywhere in Stanislaus County via Highway 99.</p>
  </Feature>
);
