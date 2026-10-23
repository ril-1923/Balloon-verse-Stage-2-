import { describe, expect, it } from 'vitest';
import { buildEnvelopeGeometry, ENVELOPE_HEIGHT, ENVELOPE_RADIUS } from './BalloonEnvelope';
import { DEFAULT_BALLOON, type BalloonConfig } from '../../types/balloon';
import { compassLabel, degrees, formatDistance, formatDuration } from '../../utils/formatters';

function distinctColours(config: BalloonConfig): Set<string> {
  const geo = buildEnvelopeGeometry(config);
  const col = geo.getAttribute('color');
  const set = new Set<string>();
  for (let i = 0; i < col.count; i++) {
    set.add([col.getX(i), col.getY(i), col.getZ(i)].map((v) => v.toFixed(3)).join(','));
  }
  geo.dispose();
  return set;
}

describe('balloon envelope geometry', () => {
  it('has the expected size and finite vertices', () => {
    const geo = buildEnvelopeGeometry(DEFAULT_BALLOON);
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    expect(box.min.y).toBeCloseTo(0, 5);
    expect(box.max.y).toBeCloseTo(ENVELOPE_HEIGHT, 3);
    expect(box.max.x).toBeLessThanOrEqual(ENVELOPE_RADIUS + 0.01);
    expect(box.max.x).toBeGreaterThan(ENVELOPE_RADIUS * 0.9);
    for (const v of geo.getAttribute('position').array) expect(Number.isFinite(v)).toBe(true);
    geo.dispose();
  });

  it('colours panels according to the chosen pattern', () => {
    const base = { ...DEFAULT_BALLOON, colors: ['#ff0000', '#00ff00', '#0000ff'] };
    const solid = distinctColours({ ...base, pattern: 'solid' });
    const vertical = distinctColours({ ...base, pattern: 'vertical' });
    const alternating = distinctColours({ ...base, pattern: 'alternating' });
    // solid: body colour plus the skirt trim colour only
    expect(solid.size).toBe(2);
    expect(vertical.size).toBeGreaterThan(solid.size);
    expect(alternating.size).toBeGreaterThanOrEqual(2);
  });

  it('changes colours when the config changes (so presets are visible)', () => {
    const gold = distinctColours(DEFAULT_BALLOON);
    const blue = distinctColours({ ...DEFAULT_BALLOON, colors: ['#0a6fb5', '#74d0ff', '#ffffff'] });
    expect([...gold].some((c) => blue.has(c))).toBe(false);
  });
});

describe('formatters', () => {
  it('formats durations and distances', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(75.9)).toBe('01:15');
    expect(formatDuration(-5)).toBe('00:00');
    expect(formatDistance(420.4)).toBe('420 m');
    expect(formatDistance(2500)).toBe('2.50 km');
  });
  it('converts headings to compass directions', () => {
    expect(compassLabel(0)).toBe('N');
    expect(compassLabel(Math.PI / 2)).toBe('E');
    expect(compassLabel(Math.PI)).toBe('S');
    expect(compassLabel(-Math.PI / 2)).toBe('W');
    expect(degrees(-Math.PI / 2)).toBe(270);
  });
});
