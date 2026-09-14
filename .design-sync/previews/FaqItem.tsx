import * as React from 'react';
import { FaqList, FaqItem } from 'generations-wellness-ds';

export const Collapsed = () => (
  <FaqList>
    <FaqItem question="Do I need a referral from my own doctor?">
      <p>No referral is required to talk to us, but a physician assessment at Generations Wellness is mandatory before any course of HBOT begins. With your permission we will keep your existing providers informed.</p>
    </FaqItem>
  </FaqList>
);

export const Expanded = () => (
  <FaqList>
    <FaqItem defaultOpen question="Is hyperbaric oxygen therapy safe?">
      <p>Hyperbaric chambers are FDA-cleared for specific conditions, and sessions here follow chamber safety protocols with monitoring throughout. Screening exists precisely because HBOT is not appropriate for everyone — certain lung conditions and recent ear surgery are among the reasons a physician may say no.</p>
    </FaqItem>
  </FaqList>
);

export const MultiParagraphAnswer = () => (
  <FaqList>
    <FaqItem defaultOpen question="How many sessions will I need?">
      <p>Many patients complete a course of 20–40 sessions, usually one session per day, several days a week — depending on the condition being treated and your response to therapy.</p>
      <p>Consistency across the course matters more than any single session. Your physician sets and adjusts the plan as your tissue responds.</p>
    </FaqItem>
  </FaqList>
);
