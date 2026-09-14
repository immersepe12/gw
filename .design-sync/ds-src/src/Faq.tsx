import * as React from 'react';

/**
 * A group of disclosure rows built on native `<details>`, so every answer is in
 * the DOM and indexable whether or not it is open — which is the whole point on
 * a page that exists to rank for questions.
 */
export interface FaqListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `FaqItem` elements. */
  children?: React.ReactNode;
}

export function FaqList({ className, children, ...rest }: FaqListProps) {
  return (
    <div className={['faq-list', className].filter(Boolean).join(' ')} data-accordion {...rest}>
      {children}
    </div>
  );
}

/**
 * One question and its answer. The question is a real `<h3>` inside the
 * `<summary>`; the plus glyph rotates to a minus when open.
 */
export interface FaqItemProps extends React.HTMLAttributes<HTMLDetailsElement> {
  /** The question, phrased the way a patient would ask it. */
  question: React.ReactNode;
  /** Open on load. Use for the first item only, if at all. @default false */
  defaultOpen?: boolean;
  /** The answer — one or more `<p>`. */
  children?: React.ReactNode;
}

export function FaqItem({ question, defaultOpen = false, className, children, ...rest }: FaqItemProps) {
  return (
    <details className={className} open={defaultOpen} {...rest}>
      <summary>
        <h3>{question}</h3>
        <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <div className="faq-answer">{children}</div>
    </details>
  );
}
