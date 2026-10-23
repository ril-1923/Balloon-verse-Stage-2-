import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createRng } from '../../utils/random';
import { atmosphereState } from './atmosphereState';

const RADIUS = 4200;

/** Stars and moon. They follow the camera so they always sit at "infinity". Visibility comes from the atmosphere. */
export function StarField({ moonDir }: { moonDir: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const rng = createRng(2024);
    const n = 1600;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      // uniform on the upper hemisphere (plus a little below the horizon)
      const y = rng() * 1.15 - 0.15;
      const a = rng() * Math.PI * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      pos[i * 3] = Math.cos(a) * r * RADIUS;
      pos[i * 3 + 1] = y * RADIUS;
      pos[i * 3 + 2] = Math.sin(a) * r * RADIUS;
      c.setHSL(0.58 + rng() * 0.12, 0.35, 0.72 + rng() * 0.28);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);
  const starMat = useMemo(
    () => new THREE.PointsMaterial({ size: 2.4, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, fog: false }),
    [],
  );
  const moonMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f6f3e6', fog: false, transparent: true, opacity: 0, depthWrite: false }), []);
  const haloMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#9bb8ff', fog: false, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      starMat.dispose();
      moonMat.dispose();
      haloMat.dispose();
    },
    [geometry, starMat, moonMat, haloMat],
  );

  useFrame(({ camera }) => {
    const g = group.current;
    if (!g) return;
    const s = atmosphereState.stars;
    g.visible = s > 0.01;
    if (!g.visible) return;
    g.position.copy(camera.position);
    starMat.opacity = s;
    moonMat.opacity = Math.min(1, s * 1.2) * (atmosphereState.night > 0.4 ? 1 : 0.0);
    haloMat.opacity = moonMat.opacity * 0.18;
  });

  const moonPos = moonDir.clone().multiplyScalar(RADIUS * 0.95).toArray();
  return (
    <group ref={group} visible={false} renderOrder={-1}>
      <points geometry={geometry} material={starMat} frustumCulled={false} />
      <mesh position={moonPos} material={moonMat}>
        <sphereGeometry args={[85, 24, 16]} />
      </mesh>
      <mesh position={moonPos} material={haloMat}>
        <sphereGeometry args={[190, 24, 16]} />
      </mesh>
    </group>
  );
}
