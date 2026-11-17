import {Suspense,useEffect,useRef} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import SpaceScene from './SpaceScene';
import CloudScene from './CloudScene';
import BirdScene from './BirdScene';
import ForestScene from './ForestScene';
import CinematicEffects from './CinematicEffects';

function DynamicSceneAtmosphere({progress}){
  const {scene} = useThree();
  const forestFog = useRef(new THREE.FogExp2('#0a170f', 0.032));

  useFrame(()=>{
    const p = progress.current;
    if (p >= 0.65) {
      scene.fog = forestFog.current;
    } else {
      scene.fog = null;
    }
  });

  return null;
}

function RenderOnScroll({active}){
  const invalidate = useThree(s => s.invalidate);
  useEffect(()=>{
    const update = () => invalidate();
    if (active) {
      window.addEventListener('scroll', update, {passive: true});
      invalidate();
    }
    return () => window.removeEventListener('scroll', update);
  }, [active, invalidate]);
  return null;
}

export default function JourneyCanvas({progress, motion, active}){
  return (
    <Canvas
      className="journey-canvas"
      aria-hidden="true"
      frameloop={motion && active ? 'always' : 'demand'}
      dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 2]}
      camera={{position: [0, 0, 14], fov: 40, near: 0.05, far: 220}}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1
      }}
    >
      <color attach="background" args={['#02060b']} />
      <DynamicSceneAtmosphere progress={progress} />
      <RenderOnScroll active={active} />

      <Suspense fallback={null}>
        <SpaceScene progress={progress} motion={motion} />
        <CloudScene progress={progress} motion={motion} />
        <BirdScene progress={progress} motion={motion} />
        <ForestScene progress={progress} motion={motion} />
        <CinematicEffects />
      </Suspense>
    </Canvas>
  );
}
