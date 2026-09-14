import * as React from 'react';

/**
 * The standard block opener: kicker, heading, and the short gold rule that
 * closes it. Every `Section` on the site starts with one.
 *
 * Pass `deck` to get the two-column variant, where a lead paragraph sits
 * beside the heading instead of under it — used when the block needs a
 * sentence of framing before its content.
 *
 * Italicise one or two words inside `heading` with `<em>` for the display-serif
 * accent; wrap a word in `<em className="text-gold-gradient">` for the gold.
 */
export interface SectionHeadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Eyebrow above the heading. */
  kicker?: string;
  /** The heading itself. Renders as `<h2>`. */
  heading: React.ReactNode;
  /** Lead paragraph. With `deck`, it sits in the second column. */
  lead?: React.ReactNode;
  /** Two-column layout with the lead beside the heading. @default false */
  deck?: boolean;
  /** Centre the head. @default false */
  centered?: boolean;
}

export function SectionHead({
  kicker,
  heading,
  lead,
  deck = false,
  centered = false,
  className,
  ...rest
}: SectionHeadProps) {
  const cls = ['section-head', deck ? 'section-head--deck' : null, centered ? 'section-head--center' : null, className]
    .filter(Boolean)
    .join(' ');
  const head = (
    <>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2>{heading}</h2>
      <span className="gold-rule" />
    </>
  );
  return (
    <div className={cls} {...rest}>
      {deck ? <div className="head-main">{head}</div> : head}
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}
