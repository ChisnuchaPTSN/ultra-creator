import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {segment,ease} from './timeline';

// High-fidelity Volumetric Raymarched Cloud Shader with self-shadowing and Mie scattering
const cloudVertex = `
varying vec3 vOrigin;
varying vec3 vPosition;
void main() {
  vOrigin = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudFragment = `
precision highp float;
varying vec3 vOrigin;
varying vec3 vPosition;
uniform float uTime;
uniform float uProgress;
uniform float uDensity;
uniform float uSteps;
uniform vec3 uSunDir;

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
  return 0.54 * noise3(p) + 0.28 * noise3(p * 2.04) + 0.14 * noise3(p * 4.08) + 0.04 * noise3(p * 8.16);
}

vec2 hitBox(vec3 ro, vec3 rd) {
  vec3 inv = 1.0 / rd;
  vec3 a = (-vec3(0.5) - ro) * inv;
  vec3 b = (vec3(0.5) - ro) * inv;
  vec3 lo = min(a, b);
  vec3 hi = max(a, b);
  return vec2(max(max(lo.x, lo.y), lo.z), min(min(hi.x, hi.y), hi.z));
}

// 3D Procedural cloud density with billowing towers and soft wisps
float sampleCloud(vec3 p) {
  vec3 q = p * vec3(3.8, 3.2, 3.8) + vec3(uTime * 0.04, 0.0, uProgress * 2.8);
  float n = fbm(q);
  // Layered vertical altitude profile: thick central billows, wispy top & bottom
  float alt = 1.0 - smoothstep(0.12, 0.48, abs(p.y));
  float d = max(0.0, n - 0.35) * alt * 5.6 * uDensity;
  return d;
}

void main() {
  vec3 rd = normalize(vPosition - vOrigin);
  vec2 hit = hitBox(vOrigin, rd);
  float start = max(hit.x, 0.0);
  if (hit.y <= start) discard;

  float stepSize = (hit.y - start) / uSteps;
  vec4 sum = vec4(0.0);

  // Henyey-Greenstein forward phase scattering
  float cosTheta = dot(rd, uSunDir);
  float hg = 0.25 * (1.0 - 0.16) / pow(1.0 + 0.16 - 0.8 * cosTheta, 1.5);

  for (int i = 0; i < 40; i++) {
    if (float(i) >= uSteps) break;
    vec3 p = vOrigin + rd * (start + (float(i) + 0.5) * stepSize);
    float d = sampleCloud(p);
    
    if (d > 0.008) {
      // Soft self-shadowing light probe towards sun
      vec3 lightProbe = p + uSunDir * 0.14;
      float shadowSample = sampleCloud(lightProbe);
      float shadow = exp(-shadowSample * 3.8);
      
      // Dual-tone lighting: warm golden sunlight on top, atmospheric blue-grey on base
      float sunIllum = clamp(shadow * 1.45 + hg * 0.9, 0.2, 2.0);
      vec3 sunColor = vec3(1.24, 1.18, 1.05);
      vec3 skyColor = vec3(0.42, 0.56, 0.72);
      vec3 col = mix(skyColor, sunColor, clamp(sunIllum, 0.0, 1.0));
      
      // Beer-Lambert volume extinction
      float alpha = 1.0 - exp(-d * stepSize * 20.0);
      sum.rgb += (1.0 - sum.a) * alpha * col;
      sum.a += (1.0 - sum.a) * alpha;
      if (sum.a > 0.985) break;
    }
  }

  if (sum.a < 0.005) discard;
  gl_FragColor = vec4(sum.rgb / max(sum.a, 0.001), sum.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export default function CloudScene({progress, motion}){
  const groupRef = useRef();
  const volumeMeshRef = useRef();
  const billowsGroupRef = useRef();
  const {size} = useThree();
  const isMobile = size.width < 768;

  const sunDir = useMemo(()=>new THREE.Vector3(0.5, 0.8, 0.35).normalize(), []);

  // Raymarched volume material
  const volumeMaterial = useMemo(()=>new THREE.ShaderMaterial({
    vertexShader: cloudVertex,
    fragmentShader: cloudFragment,
    uniforms: {
      uTime: {value: 0},
      uProgress: {value: 0},
      uDensity: {value: 0},
      uSteps: {value: isMobile ? 22 : 38},
      uSunDir: {value: sunDir}
    },
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide
  }), [isMobile, sunDir]);

  // Spatial 3D Cloud Billows passing the camera
  const billowInstances = useMemo(()=>{
    const count = isMobile ? 24 : 45;
    const items = [];
    let seed = 1209;
    const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    for (let i = 0; i < count; i++) {
      const z = THREE.MathUtils.lerp(4, -26, i / count);
      const angle = r() * Math.PI * 2;
      const radius = 1.5 + r() * 5.0;
      const x = Math.cos(angle) * radius;
      const y = (r() - 0.5) * 4.2;
      const scale = 2.8 + r() * 4.5;
      items.push({pos: [x, y, z], scale, rot: r() * Math.PI, speed: 0.2 + r() * 0.5});
    }
    return items;
  }, [isMobile]);

  // Soft spherical cloud billow material with sunlit rim and self-shadowing
  const billowMaterial = useMemo(()=>{
    return new THREE.MeshStandardMaterial({
      color: '#f4f8fd',
      roughness: 0.96,
      metalness: 0.0,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
  }, []);

  const billowGeo = useMemo(()=>new THREE.SphereGeometry(1, 16, 12), []);

  useEffect(()=>()=>{
    volumeMaterial.dispose();
    billowMaterial.dispose();
    billowGeo.dispose();
  }, [volumeMaterial, billowMaterial, billowGeo]);

  useFrame(({camera, clock})=>{
    const p = progress.current;
    // Active during atmospheric descent (p: 0.28 to 0.48)
    const isVisible = p >= 0.27 && p <= 0.49;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    // Transition envelope: dives into thick clouds, then emerges into clear sky
    const u = segment(p, 0.28, 0.46);
    const dive = ease(segment(p, 0.30, 0.44));
    // Smooth camera dive from Earth atmosphere down through clouds into level flight
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(21)) * 14 * size.width / size.height;
    const globeX = halfWidth * (isMobile ? 0.72 : 0.68);
    const globeRadius = isMobile ? 3.5 : 5.25;
    const globeY = isMobile ? -0.65 : 0;

    const startCamX = globeX * 0.88;
    const startCamY = globeY;
    const startCamZ = globeRadius + 3.85;

    const targetCamX = 0;
    const targetCamY = 0.4;
    const targetCamZ = 10.5;

    const camX = THREE.MathUtils.lerp(startCamX, targetCamX, dive);
    const camY = THREE.MathUtils.lerp(startCamY, targetCamY, dive);
    const camZ = THREE.MathUtils.lerp(startCamZ, targetCamZ, dive);
    camera.position.set(camX, camY, camZ);

    const lookX = THREE.MathUtils.lerp(globeX, 0, dive);
    const lookY = THREE.MathUtils.lerp(globeY, 0.4, dive);
    const lookZ = THREE.MathUtils.lerp(0, 0, dive);
    camera.lookAt(lookX, lookY, lookZ);

    // Position the raymarching volume directly around the camera
    const fov = 2 * Math.tan(camera.fov * Math.PI / 360);
    const h = fov * 12;
    const w = h * size.width / size.height;

    volumeMeshRef.current.position.set(0, 0, -4).applyQuaternion(camera.quaternion).add(camera.position);
    volumeMeshRef.current.quaternion.copy(camera.quaternion);
    volumeMeshRef.current.scale.set(Math.max(w * 1.6, 14), h * 1.6, 16);

    // Peak density in the middle of cloud passage (p ~ 0.35 to 0.40)
    const densityEnvelope = Math.sin(u * Math.PI);
    volumeMaterial.uniforms.uDensity.value = densityEnvelope * 2.2;
    volumeMaterial.uniforms.uProgress.value = dive;
    volumeMaterial.uniforms.uTime.value = motion ? clock.elapsedTime : 0;

    // Move spatial billows past the camera along Z to create visceral 3D flight through clouds
    if (billowsGroupRef.current) {
      billowsGroupRef.current.position.copy(camera.position);
      billowsGroupRef.current.quaternion.copy(camera.quaternion);

      billowsGroupRef.current.children.forEach((mesh, idx) => {
        const item = billowInstances[idx];
        if (!item) return;
        const zPos = item.pos[2] + (dive - 0.5) * 36.0;
        mesh.position.set(
          item.pos[0] + (dive - 0.5) * (idx % 2 === 0 ? 2.5 : -2.5),
          item.pos[1] + (motion ? Math.sin(clock.elapsedTime * 0.35 + idx) * 0.12 : 0),
          zPos
        );
        const distFromLens = Math.abs(zPos);
        const billowAlpha = densityEnvelope * smoothstep(18.0, 10.0, distFromLens) * smoothstep(0.4, 2.0, distFromLens);
        mesh.material.opacity = billowAlpha * 0.88;
      });
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Sunlight inside the clouds */}
      <directionalLight position={[6, 12, 4]} intensity={2.5} color="#fff8e8" />
      <ambientLight intensity={0.65} color="#a6bed4" />

      {/* Volumetric Raymarched Cloud Core */}
      <mesh ref={volumeMeshRef} material={volumeMaterial}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* Spatial 3D Cloud Billows rushing past camera */}
      <group ref={billowsGroupRef}>
        {billowInstances.map((item, i) => (
          <mesh
            key={i}
            geometry={billowGeo}
            material={billowMaterial}
            scale={item.scale}
            rotation={[0, item.rot, 0]}
          />
        ))}
      </group>
    </group>
  );
}

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}
