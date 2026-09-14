import * as React from 'react';
import { Container } from 'generations-wellness-ds';

const Ruler = ({ label }: { label: string }) => (
  <div style={{ background: 'var(--sage-100)', border: '1px dashed var(--green-600)', padding: '12px 16px' }}>
    <p className="small" style={{ margin: 0, color: 'var(--green-900)' }}>{label}</p>
  </div>
);

export const Default = () => (
  <Container><Ruler label="container — the standard content measure" /></Container>
);

export const Wide = () => (
  <Container width="wide"><Ruler label="container--wide — the header and hero measure" /></Container>
);

export const TextMeasure = () => (
  <Container width="text">
    <Ruler label="container--text — the narrow reading measure for long-form prose" />
  </Container>
);
