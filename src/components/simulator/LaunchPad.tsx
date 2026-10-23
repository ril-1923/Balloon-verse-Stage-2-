import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime, windAt } from '../../simulation/flightController';
import type { WorldDefinition } from '../../simulation/worldDefinitions';
import { getVisuals } from './worldVisuals';

/** Circular launch platform with a windsock that points downwind. */
export function LaunchPad({ world }: { world: WorldDefinition }) {
  const sock = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!sock.current) return;
    const w = windAt(runtime.world, runtime.time);
    const target = -w.direction;
    sock.current.rotation.y += Math.atan2(Math.sin(target - sock.current.rotation.y), Math.cos(target - sock.current.rotation.y)) * 0.08;
  });
  const { x, z, height } = world.launch;
  const pad = getVisuals(world.id).launchPad;
  return (
    <group position={[x, height, z]}>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[9, 10, 0.5, 28]} />
        <meshStandardMaterial color={pad.stone} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.2, 7, 40]} />
        <meshStandardMaterial color={pad.ring} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 2.1, 32]} />
        <meshStandardMaterial color={pad.inner} roughness={0.8} />
      </mesh>
      {/* windsock */}
      <group position={[11, 0, -4]}>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 6, 8]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.6} />
        </mesh>
        <group ref={sock} position={[0, 5.8, 0]}>
          <mesh position={[0, 0, -1.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.55, 2.2, 10, 1, true]} />
            <meshStandardMaterial color="#ff7a2f" side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
