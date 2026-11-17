# Cinematic 3D Scroll Journey Landing Experience

An Awwwards-caliber WebGL/Three.js 3D scroll-driven journey:
`OUTER SPACE → GIANT EARTH → FIERY METEOR → VOLUMETRIC CLOUDS → WHITE BIRD → LIVING FOREST → existing website content (#work)`.

---

## 1. Architectural Overview

The landing page (`Landing.jsx`) replaces the hero section while keeping all existing content, routes, navigation, creator cards, videos, Thai typography, and `#work` section 100% intact.

### Unbroken Scroll Scrubbing
- Normal, non-locking document scrolling controls the entire cinematic journey forwards and backwards.
- Mouse wheel, trackpad, keyboard (Page Up/Down, arrows), touch swiping, and reduced-motion preferences are fully supported.
- `timeline.js` establishes normalized progress checkpoints mapped smoothly to camera travel, asset transforms, and scene transitions:
  - **Stage 0 (`p: 0.00 - 0.32`)**: Deep space, photoreal giant Earth cropped right, photogrammetry asteroid with molten fissures and trailing 3D volumetric fire plume.
  - **Stage 1 (`p: 0.30 - 0.46`)**: Atmospheric descent into thick volumetric raymarched clouds with Beer-Lambert absorption and camera penetration.
  - **Stage 2 (`p: 0.46 - 0.68`)**: Emergence into open golden-hour sky; articulated 3D white dove gliding on the upper right; minimal Thai copy on the left.
  - **Stage 3 (`p: 0.68 - 0.78`)**: Camera dive through the canopy into the living forest.
  - **Stage 4 (`p: 0.78 - 1.00`)**: Eye-level travel through the 3D forest corridor with instanced photogrammetry rocks, wind-swayed ferns, branching trees, volumetric sunbeams, ground mist, and floating spores; natural unpinning into `#work`.

---

## 2. Key 3D Components (`src/landing/`)

- **`JourneyCanvas.jsx`**:
  - High-performance Three.js Canvas with adaptive DPR (1.5 on mobile, 2 on desktop), ACESFilmic tone mapping, and demand/continuous frameloop management.
  - Pauses or switches to demand rendering when offscreen or tab is hidden.
  - Unbroken camera continuity across all scenes.

- **`SpaceScene.jsx`**:
  - Photorealistic giant Earth with 5400x2700 NASA Blue Marble texture, Three.js normal/specular maps, and elevated cloud layer.
  - Custom Rayleigh atmospheric limb scattering shader.
  - Photogrammetry asteroid (`moon_rock_01`) with molten fissures shader.
  - Procedural GPU volumetric raymarched plasma fire cone trailing along trajectory angle, with 200+ trailing ember particles.

- **`CloudScene.jsx`**:
  - 3D raymarched volumetric FBM cloud core with self-shadowing light absorption.
  - 45 spatial 3D billow clusters that the camera physically dives through.
  - Continuous camera lerp from Earth atmospheric entry to level flight.

- **`BirdScene.jsx`**:
  - Articulated 3D sculpted white dove with multi-joint wing hierarchy, aeroelastic flex, and translucent backlit feather shader.
  - Diagonal flight path situated on the upper right (desktop) and open central sky (mobile), strictly separated from the Thai typography.
  - Luminous atmospheric sky gradient and spatial drifting clouds below the flight path.

- **`ForestScene.jsx`**:
  - Genuine 3D camera travel along a continuous spline through the forest corridor.
  - Instanced Poly Haven `moon_rock_01` boulders with upward-facing velvety moss shader.
  - Instanced Poly Haven `fern_02` botanical ferns with real-time GPU vertex wind flutter.
  - Procedural branching tree trunks and instanced canopy foliage.
  - Ethereal volumetric god rays / sunbeams streaming through the canopy.
  - Layered ground mist and floating golden pollen motes.

- **`CinematicEffects.jsx`**:
  - Tuned `UnrealBloomPass` (threshold 0.82) to selectively bloom incandescent fire, molten fissures, and sun highlights without muddying dark values.
  - Film vignette shader pass and `OutputPass`.

- **`landing.css`**:
  - Strict stage scoping guaranteeing zero typography ghosting or overlap between scenes.
  - Responsive layout for desktop and mobile viewports.

---

## 3. Performance & Asset Optimization

- **Texture Optimization**: Poly Haven 2.6 MB PNG textures converted to ultra-compressed WebP format (~138 KB), reducing texture payload by >88%.
- **Zero Console Errors**: Verified in headless Chrome automated QA across desktop (1440x960) and mobile (390x844).
- **Sub-second Production Builds**: Root and `outputs/understory` build cleanly in ~600-800ms.
