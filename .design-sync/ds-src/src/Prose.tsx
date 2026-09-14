import * as React from 'react';

/**
 * The long-form reading block. Constrains the measure and restores the vertical
 * rhythm for plain `<p>`, `<h2>`, `<ul>` and links, so body copy can be written
 * as ordinary markup with no per-element classes.
 */
export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Prose({ className, children, ...rest }: ProseProps) {
  return <div className={['prose', className].filter(Boolean).join(' ')} {...rest}>{children}</div>;
}

/**
 * The standalone lead paragraph — one size up from body copy, used directly
 * under a headline to carry the summary sentence.
 */
export function Lead({ className, children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={['lead', className].filter(Boolean).join(' ')} {...rest}>{children}</p>;
}
