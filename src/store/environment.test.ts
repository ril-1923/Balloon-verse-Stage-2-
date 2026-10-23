import { beforeEach, describe, expect, it } from 'vitest';
import { useEnvironmentStore } from './useEnvironmentStore';
import { getWorld, WORLDS } from '../simulation/worldDefinitions';

describe('environment store', () => {
  beforeEach(() => useEnvironmentStore.getState().selectWorld('mountain-valley'));

  it('selecting a world adopts its suggested time of day and weather', () => {
    for (const w of WORLDS) {
      useEnvironmentStore.getState().selectWorld(w.id);
      const s = useEnvironmentStore.getState();
      expect(s.worldId).toBe(w.id);
      expect(s.timeOfDay).toBe(getWorld(w.id).defaults.timeOfDay);
      expect(s.weather).toBe(getWorld(w.id).defaults.weather);
    }
  });

  it('time of day, weather and wind can be changed independently of the world', () => {
    const st = useEnvironmentStore.getState();
    st.selectWorld('desert-adventure');
    st.setTimeOfDay('sunset');
    st.setWeather('windy');
    st.setWindDirection(90);
    st.setWindStrength(6);
    const s = useEnvironmentStore.getState();
    expect(s).toMatchObject({ worldId: 'desert-adventure', timeOfDay: 'sunset', weather: 'windy', windDirectionDeg: 90, windStrength: 6 });
  });

  it('switching world clears manual wind overrides', () => {
    const st = useEnvironmentStore.getState();
    st.setWindDirection(10);
    st.setWindStrength(9);
    st.selectWorld('night-sky');
    expect(useEnvironmentStore.getState().windDirectionDeg).toBeNull();
    expect(useEnvironmentStore.getState().windStrength).toBeNull();
  });

  it('keeps the selection when other code reads it later (explorer to simulator)', () => {
    useEnvironmentStore.getState().selectWorld('lake-paradise');
    expect(useEnvironmentStore.getState().worldId).toBe('lake-paradise');
  });
});
