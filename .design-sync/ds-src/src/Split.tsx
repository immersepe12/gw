import * as React from 'react';

/**
 * A picture beside a block of copy. `Split` puts the image first at the wider
 * proportion; `Feature` is the evenly weighted pairing used for narrative
 * blocks. Both stack to a single column on narrow viewports.
 */
export interface SplitProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The picture. Pass an `<img>`; it is framed for you. */
  media?: React.ReactNode;
  /** Kicker, heading, paragraphs, and usually a `secondary` button. */
  children?: React.ReactNode;
  /** Put the copy first and the picture second. @default false */
  reverse?: boolean;
}

export function Split({ media, reverse = false, className, children, ...rest }: SplitProps) {
  const body = <div className="split-body feature-body">{children}</div>;
  const pic = media ? <div className="split-media"><div className="feature-media">{media}</div></div> : null;
  return (
    <div className={['split', className].filter(Boolean).join(' ')} {...rest}>
      {reverse ? <>{body}{pic}</> : <>{pic}{body}</>}
    </div>
  );
}

/** The evenly weighted copy-and-picture pairing. */
export interface FeatureProps extends React.HTMLAttributes<HTMLDivElement> {
  media?: React.ReactNode;
  children?: React.ReactNode;
  /** Put the picture first. @default false */
  mediaFirst?: boolean;
}

export function Feature({ media, mediaFirst = false, className, children, ...rest }: FeatureProps) {
  const body = <div className="feature-body">{children}</div>;
  const pic = media ? <div className="feature-media">{media}</div> : null;
  return (
    <div className={['feature', className].filter(Boolean).join(' ')} {...rest}>
      {mediaFirst ? <>{pic}{body}</> : <>{body}{pic}</>}
    </div>
  );
}
