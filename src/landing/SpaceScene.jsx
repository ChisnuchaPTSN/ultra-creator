import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useTexture,useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {journey} from './timeline';

// Photorealistic atmospheric Rayleigh scattering shell shader
const atmosphereVertex = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const atmosphereFragment = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec3 uSunDirection;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float cosTheta = dot(vNormal, viewDir);
  // Natural limb Fresnel - thin atmospheric veil
  float fresnel = pow(1.0 - max(cosTheta, 0.0), 3.2);
  
  // Sunlight orientation: atmospheric glow is intense on day limb, soft on twilight, absent on night
  float sunDot = dot(vNormal, uSunDirection);
  float sunScatter = smoothstep(-0.25, 0.45, sunDot);
  
  // Rayleigh blue wavelength scattering with delicate cyan/gold twilight transition
  vec3 rayleighColor = mix(vec3(0.08, 0.22, 0.45), vec3(0.35, 0.65, 1.0), fresnel);
  vec3 twilightColor = vec3(0.95, 0.55, 0.22) * smoothstep(0.15, -0.15, sunDot) * smoothstep(-0.35, 0.0, sunDot);
  
  vec3 finalColor = (rayleighColor + twilightColor * 0.7) * fresnel * sunScatter * 1.7;
  float alpha = fresnel * smoothstep(-0.3, 0.2, sunDot) * 0.88;
  
  if (alpha < 0.005) discard;
  gl_FragColor = vec4(finalColor, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// Volumetric 3D procedural fire plasma shader
const fireVertex = `
varying vec3 vOrigin;
varying vec3 vPosition;
void main() {
  vOrigin = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fireFragment = `
precision highp float;
varying vec3 vOrigin;
varying vec3 vPosition;
uniform float uTime;
uniform float uIntensity;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

float fbm(vec3 p) {
  return 0.55 * noise3(p) + 0.28 * noise3(p * 2.05) + 0.17 * noise3(p * 4.12);
}

vec2 hitBox(vec3 ro, vec3 rd) {
  vec3 inv = 1.0 / rd;
  vec3 a = (-vec3(5.0, 1.8, 1.8) - ro) * inv;
  vec3 b = (vec3(0.6, 1.8, 1.8) - ro) * inv;
  vec3 lo = min(a, b);
  vec3 hi = max(a, b);
  return vec2(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}

void main() {
  vec3 rd = normalize(vPosition - vOrigin);
  vec2 hit = hitBox(vOrigin, rd);
  float start = max(hit.x, 0.0);
  if (hit.y <= start) discard;

  float stepSize = (hit.y - start) / 36.0;
  vec4 sum = vec4(0.0);

  for (int i = 0; i < 36; i++) {
    vec3 p = vOrigin + rd * (start + (float(i) + 0.5) * stepSize);
    // Plume extends along -X from meteor head (x ~ 0) to tail (x ~ -4.8)
    float t = clamp((-p.x + 0.3) / 4.8, 0.0, 1.0);
    float radius = mix(0.48, 1.6, pow(t, 0.72));
    float dist = length(p.yz);
    
    // Turbulent flame envelope with animated vorticity
    vec3 coord = p * vec3(3.5, 4.2, 4.2) + vec3(uTime * 5.5, sin(p.x * 2.2 + uTime * 3.5) * 0.35, 0.0);
    float turb = fbm(coord);
    
    // Soft tapering: 0 at rock base, full body, smooth fade to 0 before bounding box edge
    float lengthFade = smoothstep(0.0, 0.16, t) * (1.0 - smoothstep(0.62, 0.98, t));
    float radiusFade = smoothstep(radius, radius * 0.1, dist);
    float envelope = radiusFade * lengthFade;
    float density = max(0.0, envelope * (0.45 + turb * 0.8) - 0.08) * uIntensity;
    
    if (density > 0.008) {
      float alpha = 1.0 - exp(-density * stepSize * 15.0);
      float heat = clamp(density * 1.35 + (1.0 - t) * 0.75, 0.0, 1.0);
      
      // Color ramp: Incandescent white-hot core -> luminous golden-orange -> fiery red -> cooling smoke
      vec3 col = mix(vec3(0.95, 0.1, 0.01), vec3(3.4, 1.1, 0.15), smoothstep(0.12, 0.52, heat));
      col = mix(col, vec3(5.5, 4.2, 2.5), smoothstep(0.65, 0.96, heat));
      
      sum.rgb += (1.0 - sum.a) * alpha * col;
      sum.a += (1.0 - sum.a) * alpha;
      if (sum.a > 0.97) break;
    }
  }

  if (sum.a < 0.004) discard;
  gl_FragColor = vec4(sum.rgb / max(sum.a, 0.001), sum.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export default function SpaceScene({progress, motion}){
  const spaceRef = useRef();
  const globeRef = useRef();
  const cloudsRef = useRef();
  const atmosRef = useRef();
  const meteorRef = useRef();
  const rockMeshRef = useRef();
  const firePlumeRef = useRef();
  const emberParticlesRef = useRef();

  const {size, gl} = useThree();
  const isMobile = size.width < 768;

  // Load photogrammetry asteroid model
  const {nodes: rockNodes} = useGLTF('/landing/moon_rock_01/moon_rock_01_2k.gltf');

  // High-res planetary textures
  const [dayMap, normalMap, specularMap, cloudMap, rockDiff, rockNor, rockArm] = useTexture([
    '/landing/earth-day-nasa-5400.jpg',
    '/landing/earth_normal_2048.jpg',
    '/landing/earth_specular_2048.jpg',
    '/landing/earth_clouds_1024.png',
    '/landing/moon_rock_01/textures/moon_rock_01_diff_2k.webp',
    '/landing/moon_rock_01/textures/moon_rock_01_nor_gl_2k.webp',
    '/landing/moon_rock_01/textures/moon_rock_01_arm_2k.webp'
  ]);

  useEffect(()=>{
    for (const t of [dayMap, cloudMap, rockDiff]) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
    }
    for (const t of [normalMap, specularMap, rockNor, rockArm]) {
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
    }
  }, [dayMap, normalMap, specularMap, cloudMap, rockDiff, rockNor, rockArm, gl]);

  // Sun direction in space
  const sunDirection = useMemo(()=>new THREE.Vector3(-0.7, 0.5, 0.9).normalize(), []);

  // Photorealistic atmospheric shell material
  const atmosMaterial = useMemo(()=>new THREE.ShaderMaterial({
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uSunDirection: {value: sunDirection}
    },
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  }), [sunDirection]);

  // Procedural volumetric fire material
  const fireMaterial = useMemo(()=>new THREE.ShaderMaterial({
    vertexShader: fireVertex,
    fragmentShader: fireFragment,
    uniforms: {
      uTime: {value: 0},
      uIntensity: {value: 1}
    },
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide
  }), []);

  // Photogrammetry rock geometry from GLTF LOD0 with fallback
  const asteroidGeometry = useMemo(()=>{
    if (rockNodes?.moon_rock_01_LOD0?.geometry) {
      const g = rockNodes.moon_rock_01_LOD0.geometry.clone();
      g.computeVertexNormals();
      return g;
    }
    const g = new THREE.DodecahedronGeometry(1.0, 4);
    g.computeVertexNormals();
    return g;
  }, [rockNodes]);

  // PBR Asteroid material with incandescent molten fissures
  const rockMaterial = useMemo(()=>{
    const m = new THREE.MeshStandardMaterial({
      map: rockDiff,
      normalMap: rockNor,
      normalScale: new THREE.Vector2(1.5, 1.5),
      roughnessMap: rockArm,
      roughness: 0.92,
      metalness: 0.08,
      color: '#c4bcb2'
    });
    m.onBeforeCompile = shader => {
      shader.vertexShader = `varying vec3 vLocalPos;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>\nvLocalPos = position;`
      );
      shader.fragmentShader = `varying vec3 vLocalPos;\n` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        // Intense thermal fissures in rock surface
        vec3 p = vLocalPos * 8.5;
        float fissure = abs(sin(p.x * 3.2 + sin(p.y * 3.5)) * cos(p.z * 3.4 + p.x * 1.5));
        float heat = smoothstep(0.82, 0.97, fissure);
        vec3 magma = mix(vec3(1.2, 0.25, 0.02) * 2.8, vec3(5.0, 3.8, 1.5), smoothstep(0.92, 0.99, fissure));
        totalEmissiveRadiance += magma * heat;
        `
      );
    };
    return m;
  }, [rockDiff, rockNor, rockArm]);

  // Deep field background stars
  const stars = useMemo(()=>{
    const count = isMobile ? 1200 : 2600;
    const a = new Float32Array(count * 3);
    let s = 421;
    for (let i = 0; i < count; i++) {
      s = (s * 16807) % 2147483647;
      a[i * 3] = ((s / 2147483647) - 0.5) * 220;
      s = (s * 16807) % 2147483647;
      a[i * 3 + 1] = ((s / 2147483647) - 0.5) * 130;
      s = (s * 16807) % 2147483647;
      a[i * 3 + 2] = -40 - (s / 2147483647) * 110;
    }
    return a;
  }, [isMobile]);

  // Trailing embers and sparks behind meteor
  const embers = useMemo(()=>{
    const count = isMobile ? 90 : 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const frac = i / count;
      pos[i * 3] = -0.5 - frac * 6.5;
      pos[i * 3 + 1] = (Math.sin(i * 12.3) * 0.55) * Math.sqrt(frac);
      pos[i * 3 + 2] = (Math.cos(i * 7.7) * 0.55) * Math.sqrt(frac);
    }
    return pos;
  }, [isMobile]);

  useEffect(()=>()=>{
    atmosMaterial.dispose();
    fireMaterial.dispose();
    asteroidGeometry.dispose();
    rockMaterial.dispose();
  }, [atmosMaterial, fireMaterial, asteroidGeometry, rockMaterial]);

  useFrame(({camera, clock})=>{
    const p = progress.current;
    // SpaceScene is visible during approach, dissolves into clouds at atmospheric entry (p: 0 to 0.35)
    const isVisible = p < 0.35;
    spaceRef.current.visible = isVisible;
    if (!isVisible) return;

    const {spaceApproach: a} = journey(p);
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(21)) * 14 * size.width / size.height;
    const globeX = halfWidth * (isMobile ? 0.72 : 0.68);
    const globeRadius = isMobile ? 3.5 : 5.25;
    const globeY = isMobile ? -0.65 : 0;

    // Smooth scroll camera motion tracking toward Earth
    camera.position.set(globeX * a * 0.88, globeY * a, THREE.MathUtils.lerp(14, globeRadius + 3.85, a));
    camera.lookAt(globeX * a, globeY * a, 0);

    // Giant photoreal Earth rotation
    globeRef.current.position.set(globeX, globeY, 0);
    globeRef.current.scale.setScalar(globeRadius);
    globeRef.current.rotation.y = 3.12 + p * 0.22 + (motion ? clock.elapsedTime * 0.0035 : 0);
    cloudsRef.current.rotation.y = globeRef.current.rotation.y + (motion ? clock.elapsedTime * 0.0018 : 0);

    // Meteor streak trajectory: starts prominent in left/mid space, plunges into Earth's atmosphere
    const startX = -halfWidth * (isMobile ? 0.45 : 0.38);
    const targetX = globeX - 0.5;
    const startY = isMobile ? 1.4 : 0.8;
    const targetY = globeY;
    const startZ = 3.2;
    const targetZ = globeRadius + 0.12;

    meteorRef.current.position.set(
      THREE.MathUtils.lerp(startX, targetX, a),
      THREE.MathUtils.lerp(startY, targetY, a),
      THREE.MathUtils.lerp(startZ, targetZ, a)
    );
    meteorRef.current.scale.setScalar(isMobile ? 0.8 : 1.35);

    // Rock rotation along trajectory
    rockMeshRef.current.rotation.set(0.35 + a * 1.1, 0.45 + a * 1.4, -0.3 + a * 0.7);

    // Update volumetric fire shader time & intensity
    fireMaterial.uniforms.uTime.value = motion ? clock.elapsedTime : 0;
    fireMaterial.uniforms.uIntensity.value = 1.0 + Math.sin(p * 20.0) * 0.12;

    // Fire plume points along the travel vector backwards (opposite to movement)
    const trajectoryAngle = Math.atan2(targetY - startY, targetX - startX);
    firePlumeRef.current.rotation.z = trajectoryAngle;

    // Jitter embers in useFrame
    if (motion && emberParticlesRef.current) {
      const pos = emberParticlesRef.current.geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += (Math.sin(clock.elapsedTime * 8.0 + i) * 0.003);
        pos[i * 3 + 2] += (Math.cos(clock.elapsedTime * 7.0 + i) * 0.003);
      }
      emberParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={spaceRef}>
      {/* Cinematic space lighting */}
      <ambientLight intensity={0.16} color="#455869" />
      <directionalLight position={[-7.5, 5.5, 11]} intensity={3.2} color="#fffcf5" />
      <directionalLight position={[4, -3.5, 6]} intensity={0.22} color="#6588a4" />

      {/* Deep space stars */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.048} color="#e6ecfa" sizeAttenuation transparent opacity={0.68} depthWrite={false} />
      </points>

      {/* Photoreal Giant Earth */}
      <group ref={globeRef}>
        {/* Surface terrain & ocean */}
        <mesh>
          <sphereGeometry args={[1, 128, 96]} />
          <meshPhongMaterial
            map={dayMap}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.18, 0.18)}
            specularMap={specularMap}
            specular="#121a22"
            shininess={16}
          />
        </mesh>

        {/* Elevated cloud layer with soft shadows */}
        <mesh ref={cloudsRef} scale={1.0028}>
          <sphereGeometry args={[1, 96, 64]} />
          <meshPhongMaterial
            map={cloudMap}
            transparent
            opacity={0.34}
            depthWrite={false}
          />
        </mesh>

        {/* Photorealistic Rayleigh limb glow atmosphere */}
        <mesh ref={atmosRef} scale={1.018} material={atmosMaterial} />
      </group>

      {/* Photogrammetry Asteroid with Volumetric Plasma & Embers */}
      <group ref={meteorRef}>
        {/* Volumetric procedural flame plume trailing backwards behind the asteroid */}
        <group ref={firePlumeRef}>
          <mesh position={[-2.4, 0, 0]} material={fireMaterial}>
            <boxGeometry args={[5.6, 2.2, 2.2]} />
          </mesh>
          {/* Trailing fiery ember sparks */}
          <points ref={emberParticlesRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[embers, 3]} />
            </bufferGeometry>
            <pointsMaterial
              size={0.038}
              color="#ffae45"
              transparent
              opacity={0.88}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>

        {/* Photogrammetry scanned asteroid rock with molten fissures */}
        <mesh ref={rockMeshRef} geometry={asteroidGeometry} material={rockMaterial} castShadow />

        {/* Incandescent core glow light */}
        <pointLight position={[-0.2, 0.1, 0.8]} color="#ff7a18" intensity={8.5} distance={6.0} />
      </group>
    </group>
  );
}
