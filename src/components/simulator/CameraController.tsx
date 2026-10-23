import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime } from '../../simulation/flightController';
import { useFlightStore } from '../../store/useFlightStore';
import type { CameraMode } from '../../types/flight';

const FOV: Record<CameraMode, number> = { chase: 58, basket: 74, side: 50, cinematic: 46 };
const POS_RATE: Record<CameraMode, number> = { chase: 3.2, basket: 9, side: 3, cinematic: 2.2 };

interface Props {
  reducedMotion?: boolean;
}

/** Custom follow camera with four modes, smooth blending between them, and ground clamping. */
export function CameraController({ reducedMotion = false }: Props) {
  const lookAt = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const initialised = useRef(false);

  useFrame(({ camera, clock, size }, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const mode = useFlightStore.getState().cameraMode;
    const s = runtime.state;
    const portrait = size.width / size.height < 1;
    const zoom = portrait ? 1.35 : 1;
    const f = new THREE.Vector3(Math.sin(s.heading), 0, -Math.cos(s.heading));
    const r = new THREE.Vector3(Math.cos(s.heading), 0, Math.sin(s.heading));
    const base = new THREE.Vector3(s.x, s.y, s.z);
    const bodyCentre = base.clone().add(new THREE.Vector3(0, 14, 0));
    const d = desired.current;
    const look = target.current;

    switch (mode) {
      case 'basket':
        d.copy(base).addScaledVector(f, 0.7).add(new THREE.Vector3(0, 2.4, 0));
        look.copy(d).addScaledVector(f, 70).add(new THREE.Vector3(0, -7, 0));
        break;
      case 'side':
        d.copy(bodyCentre).addScaledVector(r, 58 * zoom).add(new THREE.Vector3(0, -2, 0));
        look.copy(bodyCentre);
        break;
      case 'cinematic': {
        const speed = reducedMotion ? 0.03 : 0.13;
        const a = clock.elapsedTime * speed + s.heading + 2.2;
        d.set(
          bodyCentre.x + Math.sin(a) * 54 * zoom,
          bodyCentre.y + 4 + Math.sin(clock.elapsedTime * 0.19) * 7,
          bodyCentre.z + Math.cos(a) * 54 * zoom,
        );
        look.copy(bodyCentre);
        break;
      }
      case 'chase':
      default:
        d.copy(base).addScaledVector(f, -40 * zoom).add(new THREE.Vector3(0, 17 * zoom, 0));
        look.copy(bodyCentre);
        break;
    }

    // keep the camera above the terrain
    const minAbove = mode === 'basket' ? 1.2 : 4;
    d.y = Math.max(d.y, runtime.world.groundAt(d.x, d.z) + minAbove);

    if (!initialised.current) {
      camera.position.copy(d);
      lookAt.current.copy(look);
      initialised.current = true;
    }
    const kPos = 1 - Math.exp(-dt * POS_RATE[mode]);
    const kLook = 1 - Math.exp(-dt * (mode === 'basket' ? 8 : 5));
    camera.position.lerp(d, kPos);
    camera.position.y = Math.max(camera.position.y, runtime.world.groundAt(camera.position.x, camera.position.z) + minAbove);
    lookAt.current.lerp(look, kLook);
    camera.lookAt(lookAt.current);

    const persp = camera as THREE.PerspectiveCamera;
    const fov = FOV[mode] * (portrait ? 1.12 : 1);
    if (Math.abs(persp.fov - fov) > 0.01) {
      persp.fov += (fov - persp.fov) * (1 - Math.exp(-dt * 4));
      persp.updateProjectionMatrix();
    }
  });
  return null;
}
