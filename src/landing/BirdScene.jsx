import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {segment,ease} from './timeline';

// Sky atmospheric gradient with warm golden sun
const skyVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const skyFragment = `
varying vec2 vUv;

void main() {
  // Luminous sky: High-altitude cerulean zenith to warm golden cream horizon
  vec3 zenith = vec3(0.20, 0.46, 0.62);
  vec3 midSky = vec3(0.58, 0.75, 0.85);
  vec3 horizon = vec3(0.92, 0.94, 0.90);
  vec3 twilight = vec3(0.98, 0.92, 0.82);
  
  float h = clamp(vUv.y, 0.0, 1.0);
  vec3 sky = mix(twilight, horizon, smoothstep(0.0, 0.25, h));
  sky = mix(sky, midSky, smoothstep(0.2, 0.7, h));
  sky = mix(sky, zenith, smoothstep(0.65, 1.0, h));
  
  // Soft golden sun disc and atmospheric corona in upper right
  vec2 sunUv = vec2(0.82, 0.82);
  float distToSun = length((vUv - sunUv) * vec2(1.1, 0.85));
  float sunDisc = exp(-distToSun * 4.8);
  float corona = exp(-distToSun * 1.5) * 0.38;
  
  vec3 finalColor = sky + vec3(0.55, 0.45, 0.25) * (sunDisc + corona);
  gl_FragColor = vec4(finalColor, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// 3D Sculpted White Bird in flight with natural flapping physics
function Bird3D({motion}){
  const birdGroup = useRef();
  const leftWingInner = useRef();
  const leftWingMid = useRef();
  const leftWingTip = useRef();
  const rightWingInner = useRef();
  const rightWingMid = useRef();
  const rightWingTip = useRef();
  const tailRef = useRef();

  // High-grade feathered white material with soft translucent rim lighting
  const featherMaterial = useMemo(()=>{
    const m = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.52,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    m.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        // Translucent feather rim glow when backlit by sun
        vec3 sunDir = normalize(vec3(0.8, 0.7, -0.6));
        float rim = pow(1.0 - max(dot(geometryNormal, -sunDir), 0.0), 2.8);
        gl_FragColor.rgb += vec3(0.65, 0.52, 0.32) * rim * 0.55;
        `
      );
    };
    return m;
  }, []);

  const beakMaterial = useMemo(()=>new THREE.MeshStandardMaterial({
    color: '#e6983b',
    roughness: 0.32
  }), []);

  const eyeMaterial = useMemo(()=>new THREE.MeshStandardMaterial({
    color: '#1a1815',
    roughness: 0.15
  }), []);

  // Sculpted anatomical dove geometries
  const bodyGeo = useMemo(()=>{
    const g = new THREE.SphereGeometry(0.32, 24, 18);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const newZ = z * 2.2;
      pos.setZ(i, newZ);
      if (newZ > 0) {
        // Taper towards tail
        const taper = Math.max(0.12, 1.0 - newZ * 0.44);
        pos.setX(i, x * taper);
        pos.setY(i, y * taper);
      } else {
        // Broaden breast & throat
        pos.setY(i, y * 1.25 - newZ * 0.16);
      }
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const headGeo = useMemo(()=>{
    const g = new THREE.SphereGeometry(0.18, 18, 14);
    g.scale(0.85, 1.02, 1.15);
    return g;
  }, []);

  const beakGeo = useMemo(()=>{
    const g = new THREE.ConeGeometry(0.045, 0.22, 10);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const eyeGeo = useMemo(()=>new THREE.SphereGeometry(0.024, 8, 8), []);

  const tailGeo = useMemo(()=>{
    const g = new THREE.PlaneGeometry(0.55, 1.05, 8, 8);
    g.rotateX(Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      if (z > 0) {
        // Graceful fanned tail shape
        pos.setX(i, pos.getX(i) * (1.0 + z * 1.6));
        pos.setY(i, Math.sin(pos.getX(i) * 3.5) * 0.04);
      }
    }
    g.computeVertexNormals();
    return g;
  }, []);

  // Aerodynamic curved dove wings
  const wingInnerGeo = useMemo(()=>{
    const g = new THREE.CylinderGeometry(0.035, 0.026, 0.95, 12, 6);
    g.rotateZ(Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) * 0.35);
      if (pos.getZ(i) > 0) {
        pos.setZ(i, pos.getZ(i) * 4.2);
      }
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const wingMidGeo = useMemo(()=>{
    const g = new THREE.CylinderGeometry(0.026, 0.018, 1.05, 12, 6);
    g.rotateZ(Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, pos.getY(i) * 0.28);
      if (pos.getZ(i) > 0) {
        pos.setZ(i, pos.getZ(i) * 3.8);
      }
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const wingTipGeo = useMemo(()=>{
    const g = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, -0.14,
      0, 0, 0.22,
      1.25, 0, 0.04,
      0, 0.022, -0.14,
      0, 0.022, 0.22,
      1.25, 0.008, 0.04
    ]);
    const indices = [
      0, 1, 2,  3, 5, 4,
      0, 3, 4,  0, 4, 1,
      1, 4, 5,  1, 5, 2,
      2, 5, 3,  2, 3, 0
    ];
    g.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);

  useEffect(()=>()=>{
    featherMaterial.dispose();
    beakMaterial.dispose();
    eyeMaterial.dispose();
    bodyGeo.dispose();
    headGeo.dispose();
    beakGeo.dispose();
    eyeGeo.dispose();
    tailGeo.dispose();
    wingInnerGeo.dispose();
    wingMidGeo.dispose();
    wingTipGeo.dispose();
  }, [featherMaterial, beakMaterial, eyeMaterial, bodyGeo, headGeo, beakGeo, eyeGeo, tailGeo, wingInnerGeo, wingMidGeo, wingTipGeo]);

  useFrame(({clock})=>{
    if (!motion) return;
    const t = clock.elapsedTime * 3.4;
    
    // Natural flapping wave with joint phase offsets
    const flapInner = Math.sin(t) * 0.44;
    const flapMid = Math.sin(t - 0.25) * 0.36;
    const flapTip = Math.sin(t - 0.52) * 0.54;
    const tipTwist = Math.cos(t - 0.52) * 0.22;

    // Left Wing
    if (leftWingInner.current) leftWingInner.current.rotation.z = flapInner;
    if (leftWingMid.current) leftWingMid.current.rotation.z = flapMid;
    if (leftWingTip.current) {
      leftWingTip.current.rotation.z = flapTip;
      leftWingTip.current.rotation.y = tipTwist;
    }

    // Right Wing (symmetric)
    if (rightWingInner.current) rightWingInner.current.rotation.z = -flapInner;
    if (rightWingMid.current) rightWingMid.current.rotation.z = -flapMid;
    if (rightWingTip.current) {
      rightWingTip.current.rotation.z = -flapTip;
      rightWingTip.current.rotation.y = -tipTwist;
    }

    // Body pitch & subtle aerodynamic heave
    if (birdGroup.current) {
      birdGroup.current.position.y = Math.sin(t) * 0.08;
      birdGroup.current.rotation.x = -0.06 + Math.cos(t) * 0.04;
      birdGroup.current.rotation.z = -0.08 + Math.sin(clock.elapsedTime * 0.5) * 0.05;
    }

    // Tail rudder trim
    if (tailRef.current) {
      tailRef.current.rotation.x = 0.08 + Math.sin(t) * 0.05;
      tailRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.05;
    }
  });

  return (
    <group ref={birdGroup}>
      {/* Torso */}
      <mesh geometry={bodyGeo} material={featherMaterial} castShadow />

      {/* Head, Beak & Eyes */}
      <group position={[0, 0.20, -0.68]}>
        <mesh geometry={headGeo} material={featherMaterial} castShadow />
        <mesh position={[0, -0.03, -0.22]} geometry={beakGeo} material={beakMaterial} />
        <mesh position={[0.13, 0.03, -0.06]} geometry={eyeGeo} material={eyeMaterial} />
        <mesh position={[-0.13, 0.03, -0.06]} geometry={eyeGeo} material={eyeMaterial} />
      </group>

      {/* Fanned Tail Feathers */}
      <mesh ref={tailRef} position={[0, 0.04, 0.72]} geometry={tailGeo} material={featherMaterial} castShadow />

      {/* Left Wing (Hierarchical joints) */}
      <group ref={leftWingInner} position={[0.24, 0.12, -0.18]}>
        <mesh position={[0.42, 0, 0]} geometry={wingInnerGeo} material={featherMaterial} castShadow />
        <group ref={leftWingMid} position={[0.84, 0, 0]}>
          <mesh position={[0.46, 0, 0]} geometry={wingMidGeo} material={featherMaterial} castShadow />
          <group ref={leftWingTip} position={[0.94, 0, 0]}>
            <mesh geometry={wingTipGeo} material={featherMaterial} castShadow />
          </group>
        </group>
      </group>

      {/* Right Wing (Hierarchical joints) */}
      <group ref={rightWingInner} position={[-0.24, 0.12, -0.18]}>
        <mesh position={[-0.42, 0, 0]} geometry={wingInnerGeo} material={featherMaterial} castShadow />
        <group ref={rightWingMid} position={[-0.84, 0, 0]}>
          <mesh position={[-0.46, 0, 0]} geometry={wingMidGeo} material={featherMaterial} castShadow />
          <group ref={rightWingTip} position={[-0.94, 0, 0]}>
            <mesh geometry={wingTipGeo} scale={[-1, 1, 1]} material={featherMaterial} castShadow />
          </group>
        </group>
      </group>
    </group>
  );
}

export default function BirdScene({progress, motion}){
  const groupRef = useRef();
  const skyMeshRef = useRef();
  const birdAnchorRef = useRef();
  const cloudsGroupRef = useRef();
  const {size} = useThree();
  const isMobile = size.width < 768;

  // Sky shader
  const skyMaterial = useMemo(()=>new THREE.ShaderMaterial({
    vertexShader: skyVertex,
    fragmentShader: skyFragment,
    depthWrite: false,
    side: THREE.BackSide
  }), []);

  // Spatial 3D drifting sea of clouds positioned below/behind the bird (y: -5 to -10, z: -18 to -44)
  const clouds = useMemo(()=>{
    const count = isMobile ? 8 : 16;
    const items = [];
    let seed = 6619;
    const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    for (let i = 0; i < count; i++) {
      const depth = THREE.MathUtils.lerp(-18, -44, i / count);
      const x = (r() - 0.5) * 36;
      // Below flight path so upper sky is clear and radiant
      const y = -6.0 - r() * 4.5;
      const scale = 5.5 + r() * 6.5;
      items.push({pos: [x, y, depth], scale, opacity: 0.65 + r() * 0.25});
    }
    return items;
  }, [isMobile]);

  const cloudGeo = useMemo(()=>new THREE.SphereGeometry(1, 16, 12), []);
  const cloudMat = useMemo(()=>new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.94,
    transparent: true,
    opacity: 0.72,
    depthWrite: false
  }), []);

  useEffect(()=>()=>{
    skyMaterial.dispose();
    cloudGeo.dispose();
    cloudMat.dispose();
  }, [skyMaterial, cloudGeo, cloudMat]);

  useFrame(({camera, clock})=>{
    const p = progress.current;
    // Active between cloud exit and forest descent (p: 0.43 to 0.73)
    const isVisible = p >= 0.43 && p <= 0.73;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    // Glide progression
    const b = segment(p, 0.46, 0.68);
    const glide = ease(b);

    // Camera transition during bird glide: from cloud level flight to forest entrance
    const fTravel = segment(p, 0.62, 0.72);
    const fT = ease(fTravel);

    const forestStartCamX = isMobile ? -2.2 : -3.6;
    const forestStartCamY = 2.6;
    const forestStartCamZ = 12.0;

    const camX = THREE.MathUtils.lerp(0, forestStartCamX, fT) + (motion ? Math.sin(clock.elapsedTime * 0.35) * 0.08 : 0);
    const camY = THREE.MathUtils.lerp(0.4, forestStartCamY, fT) + (motion ? Math.cos(clock.elapsedTime * 0.4) * 0.05 : 0);
    const camZ = THREE.MathUtils.lerp(10.5, forestStartCamZ, fT);
    camera.position.set(camX, camY, camZ);

    const lookX = THREE.MathUtils.lerp(0, forestStartCamX * 0.4 + (isMobile ? 0.1 : 0.5), fT);
    const lookY = THREE.MathUtils.lerp(0.4, forestStartCamY * 0.85, fT);
    const lookZ = THREE.MathUtils.lerp(0, forestStartCamZ - 8.5, fT);
    camera.lookAt(lookX, lookY, lookZ);

    // Keep sky dome aligned with camera
    skyMeshRef.current.position.copy(camera.position);

    // Dynamic 3D bird position & glide path (prominent in open sky, strictly avoiding text)
    const startX = isMobile ? 0.45 : 2.2;
    const endX = isMobile ? 0.75 : 2.8;
    const startY = isMobile ? 0.25 : 0.85;
    const endY = isMobile ? 0.55 : 1.35;
    const startZ = isMobile ? 4.2 : 4.2;
    const endZ = isMobile ? 3.0 : 2.8;

    birdAnchorRef.current.position.set(
      THREE.MathUtils.lerp(startX, endX, glide),
      THREE.MathUtils.lerp(startY, endY, glide) + (motion ? Math.sin(clock.elapsedTime * 1.1) * 0.08 : 0),
      THREE.MathUtils.lerp(startZ, endZ, glide)
    );
    birdAnchorRef.current.scale.setScalar(isMobile ? 0.48 : 0.76);
    birdAnchorRef.current.rotation.set(
      -0.08 + (motion ? Math.sin(clock.elapsedTime * 0.8) * 0.03 : 0),
      -0.78 + Math.sin(glide * 3.14) * 0.12,
      -0.08 + (motion ? Math.cos(clock.elapsedTime * 0.9) * 0.04 : 0)
    );

    // Parallax spatial clouds in the sky beneath the bird
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.position.copy(camera.position);
      cloudsGroupRef.current.children.forEach((mesh, idx) => {
        const item = clouds[idx];
        if (!item) return;
        const depthFactor = Math.abs(item.pos[2]) * 0.025;
        mesh.position.set(
          item.pos[0] + (glide - 0.5) * depthFactor * 5.0 + (motion ? Math.sin(clock.elapsedTime * 0.08 + idx) * 0.15 : 0),
          item.pos[1] + (motion ? Math.cos(clock.elapsedTime * 0.1 + idx) * 0.1 : 0),
          item.pos[2]
        );
      });
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Sky atmospheric background sphere */}
      <mesh ref={skyMeshRef} material={skyMaterial}>
        <sphereGeometry args={[80, 32, 24]} />
      </mesh>

      {/* Warm Golden Sunlight */}
      <directionalLight position={[10, 16, -6]} intensity={3.4} color="#fff6e2" castShadow />
      <ambientLight intensity={0.55} color="#d4e5f5" />

      {/* Spatial Drifting Clouds below flight path */}
      <group ref={cloudsGroupRef}>
        {clouds.map((item, i) => (
          <mesh
            key={i}
            geometry={cloudGeo}
            material={cloudMat}
            position={item.pos}
            scale={[item.scale * 1.8, item.scale * 0.65, item.scale * 1.2]}
          />
        ))}
      </group>

      {/* 3D Sculpted White Bird */}
      <group ref={birdAnchorRef}>
        <Bird3D motion={motion} />
      </group>
    </group>
  );
}
