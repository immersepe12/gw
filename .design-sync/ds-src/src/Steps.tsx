import * as React from 'react';

export interface Step {
  /** Short imperative title — "Reach out", "Physician assessment". */
  title: React.ReactNode;
  /** What happens at this step. */
  body: React.ReactNode;
}

/**
 * The numbered path through a process, drawn as an ordered list against a rule
 * that fills as you scroll. Each step carries a ghost numeral behind its title.
 *
 * Three steps is the pattern the site uses everywhere; more than four and the
 * rule stops reading as a single journey.
 */
export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Step[];
}

export function Steps({ items, className, ...rest }: StepsProps) {
  return (
    <div className={['steps-wrap', className].filter(Boolean).join(' ')} data-inview {...rest}>
      <div className="steps-track" aria-hidden="true"><div className="steps-fill" /></div>
      <ol className="steps">
        {items.map((s, i) => (
          <li key={i}>
            <span className="step-ghost" aria-hidden="true" />
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
