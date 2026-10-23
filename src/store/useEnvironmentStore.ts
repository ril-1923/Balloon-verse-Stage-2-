import { create } from 'zustand';
import { getWorld } from '../simulation/worldDefinitions';
import type { TimeOfDay, Weather, WorldId } from '../types/environment';

interface EnvironmentState {
  worldId: WorldId;
  timeOfDay: TimeOfDay;
  weather: Weather;
  /** User wind overrides. null means "automatic" (world wind scaled by weather). */
  windDirectionDeg: number | null;
  windStrength: number | null;
  /** Switches world and adopts that world's suggested time of day and weather. */
  selectWorld: (id: WorldId) => void;
  setTimeOfDay: (t: TimeOfDay) => void;
  setWeather: (w: Weather) => void;
  setWindDirection: (deg: number | null) => void;
  setWindStrength: (v: number | null) => void;
}

const start = getWorld('mountain-valley');

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  worldId: start.id,
  timeOfDay: start.defaults.timeOfDay,
  weather: start.defaults.weather,
  windDirectionDeg: null,
  windStrength: null,
  selectWorld: (id) => {
    const w = getWorld(id);
    set({ worldId: w.id, timeOfDay: w.defaults.timeOfDay, weather: w.defaults.weather, windDirectionDeg: null, windStrength: null });
  },
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setWeather: (weather) => set({ weather }),
  setWindDirection: (windDirectionDeg) => set({ windDirectionDeg }),
  setWindStrength: (windStrength) => set({ windStrength }),
}));
