# BalloonVerse 3D — Explore Beyond the Horizon

A browser-based 3D hot air balloon flight simulator built with React, TypeScript, Three.js and React Three Fiber.

> **Status: Stage 2 of 4 (playable core + six worlds, time of day, weather and wind).** See [Implemented](#implemented) and [Not yet built](#not-yet-built) below. This README only describes what exists in this repository.

## Implemented

**Stage 1 (core)**
- Home screen with a 3D balloon over a procedural valley, pointer parallax and a no-WebGL fallback.
- Flight simulator (`#/simulator`): real-geometry balloon (lathe envelope with coloured gores, woven basket, ropes, animated burner flame), simplified flight model (heat-based buoyancy, altitude-dependent wind, steering, limits, soft world boundary), flight states Grounded → Inflating → Taking off → Flying → Descending → Landing → Landed, soft/hard landing detection, ground collision, flight timer, distance and best altitude.
- Four cameras (Chase, Basket, Side, Cinematic) with smooth blending and ground clamping.
- HUD with altitude ladder, vertical/ground speed, timer, distance, compass, wind dial, burner and air-heat gauges; collapsible; pause menu; control guide; Reset Flight; Return to Launch autopilot; keyboard, mouse and touch (pointer-event hold buttons) controls.
- *This is a game model, not physically accurate aerodynamics.*

**Stage 2 (worlds and atmosphere)**
- **Six procedural worlds**, each with its own terrain function, colour palette, props and launch pad:
  1. *Mountain Valley* — peaks, pine forests, winding river, launch platform.
  2. *Green Countryside* — rolling hills, patchwork fields, villages and barns, roads, a river and a wooden bridge where the road crosses it.
  3. *Desert Adventure* — dunes, red banded mesas, rocks, cacti.
  4. *Lake Paradise* — a large lake you can land on, surrounding mountains, shoreline trees, misty sunrise by default.
  5. *Sunset Horizon* — long golden ridges and dark distant silhouettes, sunset by default.
  6. *Night Sky* — moonlit hills, stars, moon, distant city lights and glowing balloon lanterns, night by default.
- Terrain, rivers and lakes are generated from shared height functions, so the mesh, collision and prop placement always agree. Props (pines, broadleaf trees, cacti, rocks, houses, barns) are placed deterministically and drawn with `InstancedMesh`, one draw call per prop kind.
- **Time of day**: Sunrise, Morning, Noon, Golden hour, Sunset, Night. Each changes the sky, sun/moon light, ambient light, fog colour, cloud colour, star visibility and exposure, blended smoothly over about 1.5 s.
- **Weather**: Clear, Cloudy, Misty, Windy. Weather changes fog distance, cloud cover, cloud darkness and speed, light strength, wind strength and gustiness.
- **Wind**: world base wind × weather, plus a manual override of direction and strength. Clouds and the launch-pad windsock follow the wind; the HUD shows speed, direction and a wind dial.
- **World switching without a reload**: from the World Explorer page or the in-flight conditions panel (world, time, weather, wind). Switching resets the flight at the new launch site.
- **World Explorer** (`#/worlds`): a card per world with a generated illustration, description, difficulty, suggested time, wind conditions, Select World and Launch Flight. The selection is kept while you navigate between pages (in memory).
- Water counts as ground, so you can land on a lake or river.
- Test suite (117 tests): simulation, physics limits, collisions, landings, wind and weather, atmosphere presets, all six worlds (terrain, props, water, flyability), and the environment store.

## Not yet built

- Stage 3: Balloon Studio and presets, missions and 3D checkpoints, achievements, flight history and dashboard (Recharts), LocalStorage persistence (so the selected world and conditions do **not** survive a page refresh yet).
- Stage 4: Settings page, graphics quality options, audio, final polish.

## Technology

React 18, TypeScript (strict), Vite 5, Three.js 0.169, @react-three/fiber 8, @react-three/drei 9, Zustand, React Router (HashRouter), Bootstrap 5 + custom CSS, Lucide icons, Vitest. Fonts (Fraunces, Figtree) are bundled locally via Fontsource, so there are no external requests. No backend, API keys or paid services.

## Getting started

```bash
npm install
npm run dev        # development server
npm run typecheck  # TypeScript check
npm test           # run the automated tests
npm run build      # type-check and production build into dist/
npm run preview    # serve the production build locally
```

## Controls

| Key | Action |
| --- | --- |
| W / Space / ↑ | Burner (climb). Pressing it while grounded starts the lift-off. |
| S / ↓ | Vent hot air (descend) |
| A / ← and D / → | Steer left / right |
| C | Cycle camera |
| R | Reset flight |
| P or Esc | Pause / resume |

Touch and mouse: use the on-screen Burner, Vent and arrow buttons.

**Landing tip:** keep the sink rate under about 2.5 m/s using short burner bursts. Without the burner the air keeps cooling and you will land hard.

## Deploying to GitHub Pages

1. Push this project to a GitHub repository whose default branch is `main`.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually). `.github/workflows/deploy.yml` installs, tests, builds and publishes `dist/`.

The Vite `base` is `./` and routing uses `HashRouter`, so no repository name or server rewrite rules are needed.

## Verification status

| Check | Status |
| --- | --- |
| `tsc --noEmit` (strict) | Passes |
| `vitest run` (117 tests) | Passes |
| `vite build` | Passes |
| Rendering, lighting and sky colours, controls, cameras, touch input, HUD layout in a real browser | **Not tested** — the build environment had no browser or GPU. Please run the app and check these yourself. |
| GitHub Pages workflow | **Not run** — written but never executed. |

## Known limitations

- Nothing has been seen running in a browser. Sky, light, fog and exposure values for each time of day and weather (`src/simulation/atmosphere.ts`) were tuned by reasoning, not by eye, so expect to adjust them.
- Lakes use a tinted translucent surface, not real reflections.
- Switching world regenerates the terrain on the main thread, so a short hitch is possible on slower machines.
- Rain, snow and lightning are not implemented.
- The balloon uses one fixed design (Sunrise Gold); the customisation types exist but there is no UI yet.
- Selected world, time, weather and wind are not persisted yet.
- No audio yet. Graphics quality is not user-configurable yet (counts are fixed).
- Visual tuning (camera distances, flame look, HUD spacing on small screens) has not been checked on real devices.
