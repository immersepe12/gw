import * as React from 'react';

export interface GaugeStat {
  /** The figure. Ranges are written with an en dash: "20–40". */
  value: string;
  /** What the figure counts. */
  label: string;
}

/**
 * The statistics band — one headline figure beside three supporting ones, on
 * emerald, with a qualifying note underneath.
 *
 * The note is not optional decoration. Every figure here describes a *typical*
 * physician-directed course, and the note is what keeps the claim honest; write
 * one whenever you change the numbers.
 */
export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline figure. */
  primary: GaugeStat;
  /** Supporting figures. Three reads best. */
  stats?: GaugeStat[];
  /** The qualifying sentence under the figures. */
  note?: React.ReactNode;
}

export function Gauge({ primary, stats = [], note, className, ...rest }: GaugeProps) {
  return (
    <div className={['gauge', className].filter(Boolean).join(' ')} {...rest}>
      <div className="gauge-primary">
        <span className="stat-number text-gold-gradient"><span className="stat-real">{primary.value}</span></span>
        <span className="stat-label">{primary.label}</span>
      </div>
      <div className="gauge-list">
        {stats.map((s) => (
          <div className="gauge-item" key={s.label}>
            <span className="stat-number text-gold-gradient"><span className="stat-real">{s.value}</span></span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      {note ? <p className="stat-note">{note}</p> : null}
    </div>
  );
}
