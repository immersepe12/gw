import * as React from 'react';
import { Steps } from 'generations-wellness-ds';

export const GettingStarted = () => (
  <Steps
    items={[
      {
        title: 'Reach out',
        body: <>Call <a href="tel:+13692220979">(369)&nbsp;222-0979</a> or email us. A brief conversation helps us understand your situation and answer first questions.</>,
      },
      {
        title: 'Physician assessment',
        body: 'A physician reviews your medical history and confirms whether HBOT is appropriate for your condition. This step is mandatory — for everyone.',
      },
      {
        title: 'Your personalized plan',
        body: 'If HBOT is right for you, your physician designs a session plan — typically 20–40 sessions — and monitors your progress throughout.',
      },
    ]}
  />
);

export const TwoSteps = () => (
  <Steps
    items={[
      { title: 'Screening call', body: 'We ask about your condition, your medical history, and what your own doctors have already tried.' },
      { title: 'In-person assessment', body: 'A physician confirms whether HBOT is appropriate before any course is scheduled.' },
    ]}
  />
);
