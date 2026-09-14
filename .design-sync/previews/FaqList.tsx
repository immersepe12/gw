import * as React from 'react';
import { FaqList, FaqItem } from 'generations-wellness-ds';

export const Closed = () => (
  <FaqList>
    <FaqItem question="What is hyperbaric oxygen therapy (HBOT)?">
      <p>Hyperbaric oxygen therapy is an advanced, oxygen-based therapy in which you breathe a higher concentration of oxygen inside a pressurized chamber. The increased pressure allows your blood to carry more oxygen to your tissues, which may support the body's natural healing response.</p>
    </FaqItem>
    <FaqItem question="How does hyperbaric oxygen therapy work?">
      <p>Under gently increased pressure, your lungs take in more oxygen than they can at normal air pressure, and that extra oxygen dissolves directly into your blood plasma.</p>
    </FaqItem>
    <FaqItem question="How long does a session last?">
      <p>A typical session lasts about 90 minutes to two hours, including the time it takes to gradually pressurize and depressurize the chamber.</p>
    </FaqItem>
  </FaqList>
);

export const FirstAnswerOpen = () => (
  <FaqList>
    <FaqItem defaultOpen question="What does an HBOT session feel like?">
      <p>Most people compare the start of a session to an airplane taking off: you feel gentle pressure in your ears, which you can relieve by swallowing or yawning. Once the chamber reaches pressure, you simply rest — many patients nap, listen to music, or watch a show. You are in contact with our staff for the entire session.</p>
    </FaqItem>
    <FaqItem question="How many sessions will I need?">
      <p>Many patients complete a course of 20–40 sessions. Your physician sets the exact number as part of your care plan.</p>
    </FaqItem>
  </FaqList>
);

export const AnswerWithLink = () => (
  <FaqList>
    <FaqItem defaultOpen question="Is HBOT covered by insurance?">
      <p>Coverage depends on your plan and the condition being treated. The FDA has cleared hyperbaric chambers for specific conditions, and insurers generally follow that list. We will tell you plainly what we know about your situation before you commit to a course.</p>
      <p>For the full walkthrough, see <a href="/hyperbaric-oxygen-therapy/">what a full session looks like</a>.</p>
    </FaqItem>
  </FaqList>
);
