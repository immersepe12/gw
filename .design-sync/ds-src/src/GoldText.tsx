import * as React from 'react';

/**
 * The gold gradient lettering — the system's scarcest resource.
 *
 * Use it on one phrase per screen, inside a headline or a statistic, and never
 * on body copy: the gradient is a fill, so it carries no reliable contrast
 * ratio at text sizes. If a word needs emphasis and the gold is already spent,
 * plain `<em>` in the display serif is the correct alternative.
 */
export interface GoldTextProps extends React.HTMLAttributes<HTMLElement> {
  /** `em` keeps the serif italic; `span` stays upright. @default 'em' */
  as?: 'em' | 'span';
  children?: React.ReactNode;
}

export function GoldText({ as = 'em', className, children, ...rest }: GoldTextProps) {
  const Tag = as;
  return <Tag className={['text-gold-gradient', className].filter(Boolean).join(' ')} {...rest}>{children}</Tag>;
}
