import {useEffect,useMemo,useRef,useLayoutEffect} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useTexture,useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {segment,ease} from './timeline';

// High-fidelity Volumetric Sun Shaft / God Ray Shader
const sunShaftVertex = `
varying vec3 vWorldPos;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const sunShaftFragment = `
varying vec3 vWorldPos;
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;

void main() {
  // Cylindrical beam falloff: soft gaussian beam with tender perimeter
  float beam = smoothstep(0.5, 0.08, abs(vUv.x - 0.5));
  // Vertical attenuation: brighter near canopy origin, fading softly toward ground
  float vert = smoothstep(0.0, 0.22, vUv.y) * (1.0 - smoothstep(0.78, 1.0, vUv.y));
  
  // Subtle atmospheric wisps and wave modulation
  float wisp = sin(vUv.x * 5.0 + uTime * 0.15) * cos(vUv.y * 3.5 - uTime * 0.1) * 0.12;
  float intensity = beam * vert * (0.88 + wisp) * 0.35;
  if (intensity < 0.005) discard;
  
  gl_FragColor = vec4(uColor * 1.05, intensity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Procedural Organic Branch Generator
function createBranch(points, baseRadius, tipRadius, segments = 16) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const g = new THREE.TubeGeometry(curve, segments, 1, 8, false);
  const pos = g.attributes.position;
  for (let i = 0; i <= segments; i++) {
    const center = curve.getPointAt(i / segments);
    const radius = baseRadius + (tipRadius - baseRadius) * (i / segments);
    for (let j = 0; j <= 8; j++) {
      const idx = i * 9 + j;
      if (idx < pos.count) {
        pos.setXYZ(
          idx,
          center.x + (pos.getX(idx) - center.x) * radius,
          center.y + (pos.getY(idx) - center.y) * radius,
          center.z + (pos.getZ(idx) - center.z) * radius
        );
      }
    }
  }
  g.computeVertexNormals();
  return g;
}

export default function ForestScene({progress, motion}){
  const groupRef = useRef();
  const groundRef = useRef();
  const treesGroupRef = useRef();
  const fernInstancedRef = useRef();
  const rockInstancedRef = useRef();
  const foliageInstancedRef = useRef();
  const sunShaftsGroupRef = useRef();
  const mistRef = useRef();
  const dustRef = useRef();

  const {size, gl} = useThree();
  const isMobile = size.width < 768;

  // Load photogrammetry models for rocks and ferns
  const {nodes: rockNodes} = useGLTF('/landing/moon_rock_01/moon_rock_01_2k.gltf');
  const {nodes: fernNodes} = useGLTF('/landing/fern_02/fern_02_2k.gltf');

  // Load PBR Textures
  const [rockDiff, rockNor, rockArm, fernDiffAlpha, fernNor, fernArm] = useTexture([
    '/landing/moon_rock_01/textures/moon_rock_01_diff_2k.webp',
    '/landing/moon_rock_01/textures/moon_rock_01_nor_gl_2k.webp',
    '/landing/moon_rock_01/textures/moon_rock_01_arm_2k.webp',
    '/landing/fern_02/textures/fern_02_diff_alpha_2k.webp',
    '/landing/fern_02/textures/fern_02_nor_gl_2k.webp',
    '/landing/fern_02/textures/fern_02_arm_2k.webp'
  ]);

  useEffect(()=>{
    for (const t of [rockDiff, fernDiffAlpha]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
    }
    for (const t of [rockNor, rockArm, fernNor, fernArm]) {
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
    }
  }, [rockDiff, rockNor, rockArm, fernDiffAlpha, fernNor, fernArm, gl]);

  // Wind uniform for vegetation sway
  const windUniform = useMemo(()=>({time: {value: 0}, strength: {value: 0.85}}), []);

  // Photogrammetry Rock Material with upward velvety moss gradient
  const rockMaterial = useMemo(()=>{
    const m = new THREE.MeshStandardMaterial({
      map: rockDiff,
      normalMap: rockNor,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: rockArm,
      roughness: 0.88,
      metalness: 0.04,
      color: '#a0a89d'
    });
    m.onBeforeCompile = shader => {
      shader.vertexShader = `varying vec3 vWorldNormal;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\nvWorldNormal = normalize(mat3(modelMatrix) * normal);`
      );
      shader.fragmentShader = `varying vec3 vWorldNormal;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        // Velvety green moss layer on upward-facing rock surfaces
        float mossiness = smoothstep(0.48, 0.80, vWorldNormal.y);
        vec3 mossColor = vec3(0.22, 0.35, 0.15);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, mossColor, mossiness * 0.7);
        `
      );
    };
    return m;
  }, [rockDiff, rockNor, rockArm]);

  // Photogrammetry Fern Material with wind flutter and alpha testing
  const fernMaterial = useMemo(()=>{
    const m = new THREE.MeshStandardMaterial({
      map: fernDiffAlpha,
      normalMap: fernNor,
      normalScale: new THREE.Vector2(1.1, 1.1),
      roughnessMap: fernArm,
      roughness: 0.62,
      metalness: 0.02,
      alphaTest: 0.45,
      transparent: true,
      side: THREE.DoubleSide
    });
    m.onBeforeCompile = shader => {
      shader.uniforms.uWindTime = windUniform.time;
      shader.uniforms.uWindStrength = windUniform.strength;
      shader.vertexShader = `
        uniform float uWindTime;
        uniform float uWindStrength;
      \n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        // Natural organic wind flutter on fern tips
        float tip = smoothstep(0.1, 0.9, length(position.xz));
        float sway = sin(uWindTime * 2.2 + instanceMatrix[3].x * 1.5 + instanceMatrix[3].z * 1.2) * 0.12 * tip * uWindStrength;
        float flutter = cos(uWindTime * 4.5 + position.x * 8.0) * 0.04 * tip;
        transformed.x += sway + flutter;
        transformed.y -= abs(sway) * 0.22;
        transformed.z += flutter * 0.8;
        `
      );
    };
    return m;
  }, [fernDiffAlpha, fernNor, fernArm, windUniform]);

  // Forest Floor Organic Soil Material
  const soilMaterial = useMemo(()=>{
    return new THREE.MeshStandardMaterial({
      color: '#182416',
      roughness: 0.94,
      metalness: 0.02
    });
  }, []);

  // Canopy Leaf Foliage Material with wind sway
  const foliageMaterial = useMemo(()=>{
    const m = new THREE.MeshStandardMaterial({
      color: '#768f3e',
      roughness: 0.65,
      side: THREE.DoubleSide
    });
    m.onBeforeCompile = shader => {
      shader.uniforms.uWindTime = windUniform.time;
      shader.vertexShader = `uniform float uWindTime;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        transformed.x += sin(uWindTime * 2.4 + instanceMatrix[3].x * 2.0) * 0.08 * position.y;
        transformed.y += cos(uWindTime * 2.0 + instanceMatrix[3].z * 1.8) * 0.05 * position.y;
        `
      );
    };
    return m;
  }, [windUniform]);

  // Sun Shaft Beam Material
  const sunShaftMaterial = useMemo(()=>new THREE.ShaderMaterial({
    vertexShader: sunShaftVertex,
    fragmentShader: sunShaftFragment,
    uniforms: {
      uTime: {value: 0},
      uColor: {value: new THREE.Vector3(1.15, 0.98, 0.65)}
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  }), []);

  // Rolling Ground Mist Material
  const mistMaterial = useMemo(()=>{
    return new THREE.MeshBasicMaterial({
      color: '#2a4230',
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }, []);

  // Undulating Terrain Geometry
  const terrainGeo = useMemo(()=>{
    const g = new THREE.PlaneGeometry(50, 60, 32, 32);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.18) * 0.35 + Math.cos(z * 0.14) * 0.42 + Math.sin(x * 0.4 + z * 0.3) * 0.12;
      pos.setY(i, y);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  // Photogrammetry Rock Geometry from Poly Haven GLTF LOD1/LOD2 with fallback
  const rockGeo = useMemo(()=>{
    if (rockNodes?.moon_rock_01_LOD1?.geometry) {
      return rockNodes.moon_rock_01_LOD1.geometry.clone();
    }
    if (rockNodes?.moon_rock_01_LOD2?.geometry) {
      return rockNodes.moon_rock_01_LOD2.geometry.clone();
    }
    const g = new THREE.DodecahedronGeometry(1.0, 3);
    g.computeVertexNormals();
    return g;
  }, [rockNodes]);

  // Fern Leaf Frond Geometry from Poly Haven GLTF with fallback
  const fernGeo = useMemo(()=>{
    if (fernNodes?.fern_02_a?.geometry) {
      return fernNodes.fern_02_a.geometry.clone();
    }
    if (fernNodes?.fern_02_b?.geometry) {
      return fernNodes.fern_02_b.geometry.clone();
    }
    const g = new THREE.PlaneGeometry(0.85, 1.35, 6, 8);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) + 0.675;
      const frac = y / 1.35;
      const curl = frac * frac * 0.35;
      pos.setZ(i, pos.getZ(i) - curl);
      pos.setY(i, pos.getY(i) - curl * 0.4);
    }
    g.computeVertexNormals();
    return g;
  }, [fernNodes]);

  // Canopy Leaf Cluster Geometry
  const leafClusterGeo = useMemo(()=>{
    const g = new THREE.SphereGeometry(1.2, 8, 6);
    g.scale(1.4, 0.75, 1.4);
    return g;
  }, []);

  // Forest corridor procedural trees (Framing, Midground, Far)
  const {treeMeshes, foliageTransforms} = useMemo(()=>{
    const branches = [];
    const foliage = [];
    let seed = 9912;
    const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    const treePositions = [
      // Left foreground framing tree (gnarled oak)
      {x: -3.8, z: 6, h: 9.5, r: 0.42},
      // Right foreground framing tree
      {x: 3.5, z: 4, h: 9.0, r: 0.38},
      // Left midground trees
      {x: -5.8, z: -2, h: 11.0, r: 0.32},
      {x: -3.2, z: -8, h: 10.5, r: 0.28},
      {x: -5.2, z: -16, h: 12.0, r: 0.34},
      // Right midground trees
      {x: 4.8, z: -4, h: 10.0, r: 0.30},
      {x: 2.8, z: -11, h: 11.5, r: 0.32},
      {x: 5.4, z: -18, h: 12.5, r: 0.35},
      // Deep corridor background trees
      {x: -1.8, z: -22, h: 13.0, r: 0.32},
      {x: 1.4, z: -25, h: 13.5, r: 0.34},
      {x: -4.0, z: -29, h: 14.0, r: 0.36},
      {x: 4.2, z: -30, h: 13.8, r: 0.35},
      {x: 0.0, z: -35, h: 14.5, r: 0.38}
    ];

    treePositions.forEach((tree, idx) => {
      const leanX = (r() - 0.5) * 0.6;
      const leanZ = (r() - 0.5) * 0.6;
      const trunkPts = [
        [tree.x, -0.2, tree.z],
        [tree.x + leanX * 0.3, tree.h * 0.35, tree.z + leanZ * 0.3],
        [tree.x + leanX * 0.7, tree.h * 0.7, tree.z + leanZ * 0.7],
        [tree.x + leanX, tree.h, tree.z + leanZ]
      ];
      branches.push(createBranch(trunkPts, tree.r, tree.r * 0.22, 14));

      for (let b = 0; b < 5; b++) {
        const angle = b * 1.35 + idx;
        const bHeight = tree.h * (0.6 + b * 0.08);
        const bLen = 2.2 + r() * 1.5;
        const endX = tree.x + leanX + Math.cos(angle) * bLen;
        const endY = bHeight + 0.6 + r() * 0.8;
        const endZ = tree.z + leanZ + Math.sin(angle) * bLen;

        const bPts = [
          [tree.x + leanX * (bHeight / tree.h), bHeight, tree.z + leanZ * (bHeight / tree.h)],
          [tree.x + leanX + Math.cos(angle) * bLen * 0.5, bHeight + 0.4, tree.z + leanZ + Math.sin(angle) * bLen * 0.5],
          [endX, endY, endZ]
        ];
        branches.push(createBranch(bPts, tree.r * 0.22, tree.r * 0.05, 8));

        foliage.push({
          pos: [endX, endY + 0.3, endZ],
          scale: 1.2 + r() * 0.9,
          rot: [r() * 0.5, r() * Math.PI, r() * 0.5]
        });
      }
    });

    return {treeMeshes: branches, foliageTransforms: foliage};
  }, []);

  // Instanced Rocks placement along corridor (visible along path)
  const rockCount = isMobile ? 24 : 45;
  useLayoutEffect(()=>{
    if (!rockInstancedRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let seed = 3117;
    const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    for (let i = 0; i < rockCount; i++) {
      const z = THREE.MathUtils.lerp(10, -28, i / rockCount);
      // Clustered along path margins (x: -2.8 to 2.8)
      const side = (i % 2 === 0 ? 1 : -1);
      const x = side * (1.1 + r() * 2.8);
      const scale = 0.35 + r() * 1.35;
      dummy.position.set(x, scale * 0.22 - 0.05, z);
      dummy.rotation.set(r() * 0.4, r() * Math.PI * 2, r() * 0.4);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      rockInstancedRef.current.setMatrixAt(i, dummy.matrix);

      color.setHSL(0.24 + r() * 0.06, 0.18 + r() * 0.12, 0.28 + r() * 0.15);
      rockInstancedRef.current.setColorAt(i, color);
    }
    rockInstancedRef.current.instanceMatrix.needsUpdate = true;
    rockInstancedRef.current.instanceColor.needsUpdate = true;
  }, [rockCount]);

  // Instanced Ferns placement clustered around rocks and trunks
  const fernCount = isMobile ? 65 : 140;
  useLayoutEffect(()=>{
    if (!fernInstancedRef.current) return;
    const dummy = new THREE.Object3D();
    let seed = 8841;
    const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    for (let i = 0; i < fernCount; i++) {
      const z = THREE.MathUtils.lerp(12, -26, i / fernCount);
      const side = (i % 2 === 0 ? 1 : -1);
      const x = side * (0.9 + r() * 3.6);
      const scale = 0.65 + r() * 0.85;

      dummy.position.set(x, 0.05, z);
      dummy.rotation.set(-0.2 + (r() - 0.5) * 0.3, r() * Math.PI * 2, (r() - 0.5) * 0.4);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      fernInstancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    fernInstancedRef.current.instanceMatrix.needsUpdate = true;
  }, [fernCount]);

  // Instanced Foliage clusters
  useLayoutEffect(()=>{
    if (!foliageInstancedRef.current) return;
    const dummy = new THREE.Object3D();
    foliageTransforms.forEach((item, idx) => {
      dummy.position.set(...item.pos);
      dummy.rotation.set(...item.rot);
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      foliageInstancedRef.current.setMatrixAt(idx, dummy.matrix);
    });
    foliageInstancedRef.current.instanceMatrix.needsUpdate = true;
  }, [foliageTransforms]);

  // Floating forest pollen and dust motes
  const dustParticles = useMemo(()=>{
    const count = isMobile ? 60 : 130;
    const a = new Float32Array(count * 3);
    let s = 771;
    for (let i = 0; i < count; i++) {
      s = (s * 16807) % 2147483647;
      a[i * 3] = ((s / 2147483647) - 0.5) * 18;
      s = (s * 16807) % 2147483647;
      a[i * 3 + 1] = 0.4 + (s / 2147483647) * 4.5;
      s = (s * 16807) % 2147483647;
      a[i * 3 + 2] = THREE.MathUtils.lerp(10, -25, i / count);
    }
    return a;
  }, [isMobile]);

  useEffect(()=>()=>{
    rockMaterial.dispose();
    fernMaterial.dispose();
    soilMaterial.dispose();
    foliageMaterial.dispose();
    sunShaftMaterial.dispose();
    mistMaterial.dispose();
    terrainGeo.dispose();
    rockGeo.dispose();
    fernGeo.dispose();
    leafClusterGeo.dispose();
    treeMeshes.forEach(m => m.dispose());
  }, [
    rockMaterial, fernMaterial, soilMaterial, foliageMaterial, sunShaftMaterial, mistMaterial,
    terrainGeo, rockGeo, fernGeo, leafClusterGeo, treeMeshes
  ]);

  useFrame(({camera, clock}, delta)=>{
    const p = progress.current;
    // Active during forest journey (p: 0.64 to 1.0)
    const isVisible = p >= 0.64;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    // Forest travel progress
    const t = ease(segment(p, 0.68, 1.0));

    // Continuous 3D camera travel through the forest corridor
    const startCam = new THREE.Vector3(isMobile ? -2.2 : -3.6, 2.6, 12.0);
    const midCam = new THREE.Vector3(0.4, 1.7, 0.0);
    const endCam = new THREE.Vector3(isMobile ? 0.2 : 0.8, 1.15, -14.5);

    const camPos = new THREE.Vector3();
    if (t < 0.5) {
      const u = t * 2.0;
      camPos.lerpVectors(startCam, midCam, u);
    } else {
      const u = (t - 0.5) * 2.0;
      camPos.lerpVectors(midCam, endCam, u);
    }

    camera.position.copy(camPos);
    camera.lookAt(camPos.x * 0.4 + (isMobile ? 0.1 : 0.5), camPos.y * 0.85, camPos.z - 8.5);

    // Update wind time
    if (motion) {
      windUniform.time.value = clock.elapsedTime;
      sunShaftMaterial.uniforms.uTime.value = clock.elapsedTime;
    }

    // Drifting ground mist
    if (mistRef.current) {
      mistRef.current.position.set(camPos.x * 0.3, 0.45, camPos.z - 4.0);
      mistRef.current.rotation.z = motion ? clock.elapsedTime * 0.015 : 0;
    }

    // Floating pollen motes gentle turbulence
    if (motion && dustRef.current) {
      dustRef.current.rotation.y = clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Cinematic Forest Lighting: Golden canopy sun & emerald ambient fill */}
      <ambientLight intensity={0.48} color="#4b6b40" />
      <directionalLight
        position={[9, 18, -4]}
        intensity={3.6}
        color="#fff1c4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 4, 8]} intensity={0.65} color="#547858" />

      {/* Undulating Forest Ground Terrain */}
      <mesh ref={groundRef} geometry={terrainGeo} material={soilMaterial} receiveShadow />

      {/* 3D Forest Corridor Tree Trunks & Branches */}
      <group ref={treesGroupRef}>
        {treeMeshes.map((geo, i) => (
          <mesh key={i} geometry={geo} castShadow receiveShadow>
            <meshStandardMaterial color="#30261c" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* Instanced Canopy Leaves */}
      <instancedMesh
        ref={foliageInstancedRef}
        args={[leafClusterGeo, foliageMaterial, foliageTransforms.length]}
        castShadow
      />

      {/* Instanced Photogrammetry Rocks with Moss */}
      <instancedMesh
        ref={rockInstancedRef}
        args={[rockGeo, rockMaterial, rockCount]}
        castShadow
        receiveShadow
      />

      {/* Instanced Photogrammetry Ferns with Wind Flutter */}
      <instancedMesh
        ref={fernInstancedRef}
        args={[fernGeo, fernMaterial, fernCount]}
        castShadow
        receiveShadow
      />

      {/* Volumetric God Rays / Sun Shafts streaming through canopy */}
      <group ref={sunShaftsGroupRef}>
        {[
          {pos: [-1.5, 6.5, 3.0], rot: [0.35, 0.45, -0.42], scale: [3.8, 12, 1]},
          {pos: [2.8, 7.2, -5.0], rot: [0.38, 0.52, -0.45], scale: [4.2, 14, 1]},
          {pos: [0.5, 8.0, -14.0], rot: [0.32, 0.40, -0.38], scale: [4.5, 15, 1]}
        ].map((shaft, i) => (
          <mesh
            key={i}
            position={shaft.pos}
            rotation={shaft.rot}
            scale={shaft.scale}
            material={sunShaftMaterial}
          >
            <planeGeometry args={[1, 1]} />
          </mesh>
        ))}
      </group>

      {/* Layered Rolling Ground Mist */}
      <mesh ref={mistRef} rotation={[-Math.PI / 2, 0, 0]} material={mistMaterial}>
        <planeGeometry args={[35, 35]} />
      </mesh>

      {/* Floating Golden Pollen / Forest Spores */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.042}
          color="#f4e5a3"
          transparent
          opacity={0.68}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
