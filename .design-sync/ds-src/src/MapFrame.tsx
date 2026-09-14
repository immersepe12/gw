import * as React from 'react';

/**
 * The framed map embed beside the contact panel. Supplies the border, radius,
 * and aspect ratio the raw iframe lacks.
 *
 * Always give the iframe a `title` describing the location — it is the only
 * thing a screen-reader user gets from a map.
 */
export interface MapFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Map embed URL. Defaults to the Modesto clinic. */
  src?: string;
  /** Accessible name for the embed. */
  title?: string;
}

export function MapFrame({
  src = 'https://www.google.com/maps?q=1801+H+Street+Suite+C-1,+Modesto,+CA+95354&output=embed',
  title = 'Map showing Generations Wellness at 1801 H Street, Suite C-1, Modesto, CA 95354',
  className,
  ...rest
}: MapFrameProps) {
  return (
    <div className={['map-frame', className].filter(Boolean).join(' ')} {...rest}>
      <iframe src={src} width={600} height={460} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={title} />
    </div>
  );
}
