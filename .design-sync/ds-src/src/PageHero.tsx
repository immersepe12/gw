import * as React from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

/**
 * The emerald masthead every inner page opens with: breadcrumbs, kicker,
 * headline, and a lead. Shorter and quieter than the homepage `Hero` — no
 * photograph, static rings rather than live ones.
 *
 * `numeral` prints the page's ghost number in the corner, matching the numbered
 * sections further down the page.
 */
export interface PageHeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Breadcrumb trail. The last crumb should have no `href`. */
  crumbs?: Crumb[];
  /** Eyebrow above the headline. */
  kicker?: string;
  /** The headline. Renders as `<h1>`. */
  heading: React.ReactNode;
  /** Lead paragraph. */
  lead?: React.ReactNode;
  /** Ghost numeral in the corner, e.g. `"04"`. */
  numeral?: string;
}

export function PageHero({ crumbs, kicker, heading, lead, numeral, className, ...rest }: PageHeroProps) {
  return (
    <header className={['page-hero', 'depth', className].filter(Boolean).join(' ')} {...rest}>
      <div className="rings-static" aria-hidden="true" />
      <div className="container">
        {numeral ? <span className="ghost ghost--page" aria-hidden="true" data-n={numeral} /> : null}
        {crumbs && crumbs.length ? <Breadcrumbs items={crumbs} /> : null}
        {kicker ? <p className="kicker kicker--on-dark">{kicker}</p> : null}
        <h1><span className="line"><span className="line-inner">{heading}</span></span></h1>
        {lead ? <p className="lead">{lead}</p> : null}
      </div>
    </header>
  );
}
