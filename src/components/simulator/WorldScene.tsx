import type { WorldDefinition } from '../../simulation/worldDefinitions';
import type { TimeOfDay, Weather } from '../../types/environment';
import { Clouds } from './Clouds';
import { MountainRange } from './MountainRange';
import { Scatter } from './Scatter';
import { SkySystem } from './SkySystem';
import { Terrain } from './Terrain';
import { Water } from './Water';
import { WorldExtras } from './WorldExtras';
import { getVisuals } from './worldVisuals';

interface Props {
  world: WorldDefinition;
  timeOfDay: TimeOfDay;
  weather: Weather;
  /** 'hero' uses lighter terrain and fewer props for the home screen. */
  detail?: 'full' | 'hero';
  /** Clouds drift with the simulated wind (simulator) or at a fixed gentle speed (home). */
  followWind?: boolean;
}

/** Everything that makes up one world: sky, terrain, water, props, distant peaks, clouds and extras. */
export function WorldScene({ world, timeOfDay, weather, detail = 'full', followWind = true }: Props) {
  const v = getVisuals(world.id);
  const hero = detail === 'hero';
  return (
    <>
      <SkySystem world={world} timeOfDay={timeOfDay} weather={weather} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, world.lake ? -12 : -3, 0]}>
        <circleGeometry args={[5000, 32]} />
        <meshStandardMaterial color={v.horizon} roughness={1} />
      </mesh>
      <Terrain world={world} segments={hero ? 120 : 160} />
      <Water world={world} />
      {v.scatter.map((spec, i) => (
        <Scatter key={`${world.id}-${i}`} world={world} spec={spec} countScale={hero ? 0.55 : 1} />
      ))}
      <MountainRange {...v.ring} />
      <Clouds {...v.clouds} followWind={followWind} />
      <WorldExtras world={world} />
    </>
  );
}
