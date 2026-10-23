import { PHYSICS } from '../../simulation/flightPhysics';
import { compassLabel, degrees } from '../../utils/formatters';

/** Compass ring that rotates so the balloon's heading is always at the top. */
export function Compass({ heading }: { heading: number }) {
  const rot = (-heading * 180) / Math.PI;
  return (
    <svg className="instrument" viewBox="-50 -50 100 100" role="img" aria-label={`Heading ${degrees(heading)} degrees ${compassLabel(heading)}`}>
      <circle r="46" className="inst-ring" />
      <g transform={`rotate(${rot})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="0" y1="-46" x2="0" y2={i % 3 === 0 ? -38 : -42} className="inst-tick" transform={`rotate(${i * 30})`} />
        ))}
        <text y="-26" className="inst-n" textAnchor="middle">N</text>
        <text x="28" y="4" className="inst-label" textAnchor="middle">E</text>
        <text y="34" className="inst-label" textAnchor="middle">S</text>
        <text x="-28" y="4" className="inst-label" textAnchor="middle">W</text>
      </g>
      <path d="M0 -50 L5 -42 L-5 -42 Z" className="inst-pointer" />
      <text y="6" className="inst-heading" textAnchor="middle">{degrees(heading)}°</text>
    </svg>
  );
}

/** Arrow showing where the wind is blowing relative to the balloon's heading. */
export function WindDial({ heading, windDirection, speed }: { heading: number; windDirection: number; speed: number }) {
  const rel = ((windDirection - heading) * 180) / Math.PI;
  return (
    <svg className="instrument" viewBox="-50 -50 100 100" role="img" aria-label={`Wind ${speed.toFixed(1)} metres per second from the ${compassLabel(windDirection + Math.PI)}`}>
      <circle r="46" className="inst-ring" />
      <g transform={`rotate(${rel})`}>
        <path d="M0 -34 L11 -8 L3 -8 L3 30 L-3 30 L-3 -8 L-11 -8 Z" className="inst-wind" />
      </g>
      <text y="44" className="inst-label" textAnchor="middle" style={{ display: 'none' }}>wind</text>
    </svg>
  );
}

/** Vertical altitude ladder with a marker for the current altitude and the best altitude so far. */
export function AltitudeLadder({ altitude, max }: { altitude: number; max: number }) {
  const top = PHYSICS.ceiling;
  const pct = (v: number) => `${Math.min(100, Math.max(0, (v / top) * 100))}%`;
  return (
    <div className="ladder" role="img" aria-label={`Altitude ${Math.round(altitude)} metres`}>
      <div className="ladder__track">
        <div className="ladder__fill" style={{ height: pct(altitude) }} />
        <div className="ladder__max" style={{ bottom: pct(max) }} />
        <div className="ladder__marker" style={{ bottom: pct(altitude) }} />
      </div>
      <div className="ladder__scale" aria-hidden>
        <span>{top}</span>
        <span>{Math.round(top / 2)}</span>
        <span>0</span>
      </div>
    </div>
  );
}
