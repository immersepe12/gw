import * as React from 'react';
import { Prose } from 'generations-wellness-ds';

export const LongForm = () => (
  <Prose>
    <h2>Holistic Health, For Every Stage of Life</h2>
    <p>Our name is our mission. Look closely at our emblem and you'll see it: the faces of generations — grandparents, parents, children — forming a single rose. Healing rarely involves just one person; it involves a family.</p>
    <p>We built Generations Wellness for the whole arc of life's healing journeys, from stubborn wounds that won't close to the long road back after radiation treatment. Hyperbaric oxygen therapy is our craft. Honest, physician-directed care is our standard.</p>
    <p>Read about <a href="/about/">our physician-directed approach</a>, or find <a href="/contact/">directions to our Modesto center</a>.</p>
  </Prose>
);

export const WithList = () => (
  <Prose>
    <h2>What to Bring to Your Assessment</h2>
    <p>The assessment goes faster when we can see the whole picture. Bring whatever you have:</p>
    <ul>
      <li>A list of current medications and doses.</li>
      <li>Recent imaging or wound-care notes, if your doctors have shared them.</li>
      <li>The name and number of the physician managing your condition.</li>
    </ul>
    <p>If you don't have all of it, come anyway — we can request records with your permission.</p>
  </Prose>
);
