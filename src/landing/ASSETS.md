# 3D Assets and Provenance Documentation

All assets integrated into the cinematic 3D scroll landing experience adhere to open-source, CC0 public domain, or official NASA scientific releases.

---

## 1. Photogrammetry 3D Models (Poly Haven)

### `moon_rock_01`
- **Role**: Meteor asteroid core in Scene 1 (Space) & instanced mossy boulders in Scene 4 (Forest Corridor).
- **Source**: [Poly Haven - Moon Rock 01](https://polyhaven.com/a/moon_rock_01)
- **Authors**: Poly Haven / Rico Cilliers
- **License**: **CC0 (Public Domain)** — Free for personal and commercial use without attribution requirements.
- **Optimization**:
  - GLTF LOD1/LOD2 structure utilized for high-performance rendering.
  - Textures converted from raw 2.6 MB PNGs to ultra-optimized WebP (diffuse, normal, ARM roughness/AO/metallic), reducing download size by over 88% while preserving 2K PBR fidelity.
  - Dynamic incandescent fissure shader overlaid on vertex coordinates in Scene 1.

### `fern_02`
- **Role**: Instanced forest floor vegetation in Scene 4 (Forest Corridor).
- **Source**: [Poly Haven - Fern 02](https://polyhaven.com/a/fern_02)
- **Authors**: Poly Haven / Rico Cilliers
- **License**: **CC0 (Public Domain)** — Free for personal and commercial use without attribution requirements.
- **Optimization**:
  - 3D photogrammetry botanical plant model.
  - 2K diffuse + alpha map converted to high-quality compressed WebP with clean alpha testing (`alphaTest: 0.45`).
  - Real-time GPU vertex wind flutter shader (`uWindTime`, `uWindStrength`) animating fronds realistically with aerodynamic phase offset.

---

## 2. Planetary & Earth Textures (NASA & Three.js)

### NASA Blue Marble Earth Day Map (5400 × 2700)
- **Role**: Photorealistic Earth globe surface in Scene 1.
- **Source**: NASA Earth Observatory / Reto Stöckli, NASA Goddard Space Flight Center.
- **URL**: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/
- **License**: **Public Domain** (NASA Scientific & Educational Free Release).

### Earth Normal, Specular & Cloud Maps
- **Role**: Earth surface topology, oceanic specular reflectance, and elevated atmospheric cloud sphere.
- **Source**: Official Three.js planetary repository.
- **URL**: https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets
- **License**: **MIT License** / mrdoob Three.js contributors.

---

## 3. Procedural 3D Shaders & Geometric Assets

### True 3D Volumetric Raymarched Fire Plasma
- **Role**: Fiery plasma cone trailing behind the meteor in Scene 1.
- **Implementation**: GPU raymarched Simplex noise volume with Beer-Lambert absorption and incandescent blackbody thermal color gradient (`#ffffff` core -> `#ffd875` -> `#ff7200` -> `#8c1400` smoke). No boundary box clipping artifacts.
- **Spark Particle System**: Over 200 trailing ember particles scattered along travel trajectory.

### Earth Rayleigh Atmospheric Scattering Shell
- **Role**: Soft atmospheric limb glow and twilight terminator transition on Earth.
- **Implementation**: Custom vertex/fragment shader calculating view-normal Fresnel, sunlight vector alignment, and wavelength-dependent Rayleigh blue/twilight scattering.

### Volumetric Raymarched Clouds
- **Role**: Atmospheric entry in Scene 2.
- **Implementation**: 3D raymarched Fractional Brownian Motion (FBM) density volume with directional light probes, coupled with 45 spatial 3D billow clusters that the camera physically penetrates.

### Sculpted 3D White Dove
- **Role**: Peaceful sky flight in Scene 3.
- **Implementation**: Procedural 3D anatomical dove with aerodynamic teardrop breast, slender neck, golden beak, obsidian eyes, fanned tail feathers, and articulated 3-joint wings with aeroelastic flex, wingtip twist, and translucent sunlit rim glow.

### Volumetric God Rays / Sun Shafts
- **Role**: Atmospheric canopy sunbeams in Scene 4.
- **Implementation**: Soft cylindrical Gaussian beam shader with gentle wave modulation and vertical canopy attenuation.
