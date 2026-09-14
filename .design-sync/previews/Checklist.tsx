import * as React from 'react';
import { Checklist } from 'generations-wellness-ds';

export const WhoItMayHelp = () => (
  <div style={{ padding: 24 }}>
    <Checklist
      items={[
        <><strong>Chronic and non-healing wounds</strong> that have stalled despite good wound care.</>,
        <><strong>Radiation-related tissue injury</strong> — delayed soft-tissue or bone injury after radiation therapy.</>,
        <><strong>Selected diabetic foot wounds</strong>, where oxygen supply is a limiting factor in recovery.</>,
        <><strong>Compromised skin grafts or flaps</strong> that need extra support to take hold.</>,
        <><strong>Other difficult healing conditions</strong> — as determined by a physician after assessment.</>,
      ]}
    />
  </div>
);

export const StandardsOfCare = () => (
  <div style={{ padding: 24 }}>
    <Checklist
      items={[
        <><strong>Assessment before every course.</strong> A physician reviews your history and condition before you ever enter the chamber. If HBOT isn't appropriate for you, we'll say so plainly.</>,
        <><strong>Medical oversight throughout.</strong> Your session plan — typically 20–40 sessions — is set, monitored, and adjusted by a physician as your tissue responds.</>,
        <><strong>Coordination with your doctors.</strong> With your permission, we keep your existing providers informed so HBOT complements — never replaces — your medical treatment.</>,
      ]}
    />
  </div>
);
