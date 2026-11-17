import {Component,useState,useRef,useEffect} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {Sparkles} from '@react-three/drei';
import * as THREE from 'three';
import Seedling from './Seedling';
import Ground from './Ground';
import Tree from './Tree';
import {studio} from '../data';
import useSceneVisibility from '../hooks/useSceneVisibility';
import useLeafPointer from './useLeafPointer';
class SceneBoundary extends Component {state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<div className="scene-fallback"/>:this.props.children;}}
function InvalidateOnScroll({active}) {
  const invalidate=useThree(state=>state.invalidate);
  useEffect(()=>{if(!active)return;window.addEventListener('scroll',invalidate,{passive:true});return()=>window.removeEventListener('scroll',invalidate);},[invalidate,active]);
  return null;
}
function Growth({progress,motion,compact,pointer}) {
  const seed=useRef(),tree=useRef(),forest=useRef();
  const target=new THREE.Vector3();
  useFrame(({camera,clock},delta)=>{
    const p=progress.current;
    const grow=THREE.MathUtils.smoothstep(p,.2,.72);
    seed.current.visible=p<.4;
    seed.current.scale.setScalar((1+p*1.8)*(1-THREE.MathUtils.smoothstep(p,.32,.4)));
    tree.current.visible=p>.23;
    tree.current.scale.setScalar(.001+grow*1.25);
    tree.current.rotation.z=motion?Math.sin(clock.elapsedTime*.35)*.004:0;
    forest.current.visible=p>.7;
    forest.current.scale.setScalar(.001+THREE.MathUtils.smoothstep(p,.7,1));
    const distance=THREE.MathUtils.smoothstep(p,.12,.85);
    const alpha=motion?1-Math.exp(-delta*3):1;
    target.set(4+distance*2,(compact?2.7:2.4)+distance*3.6,(compact?8.2:7)+distance*7);
    camera.position.lerp(target,alpha);
    camera.lookAt(compact?.2:-.8,1+distance*1.5,0);
  });
  return <><group ref={seed} position={[1.1,0,0]}><Seedling modelUrl={studio.modelUrl} motion={motion} pointer={pointer}/></group><group ref={tree} position={[1.1,0,0]}><Tree compact={compact} pointer={pointer} motion={motion}/></group><group ref={forest}>
    {[[-5,0,-5,1.5],[5,0,-8,1.8],[-1,0,-11,2],[9,0,-4,1.65],[-8,0,-11,2.1],[2,0,-15,1.8]].map(([x,y,z,s],i)=><group key={i} position={[x,y,z]} scale={s} rotation={[0,i*1.2,0]}><Tree compact/></group>)}
  </group></>;
}
function Environment({motion,compact,progress,active,pointer}) {return <>
  <InvalidateOnScroll active={active}/><color attach="background" args={['#17241a']}/><fog attach="fog" args={['#17241a',7,27]}/>
  <ambientLight intensity={.6} color="#afbea0"/><hemisphereLight args={['#c5d2b0','#252317',1.1]}/>
  <directionalLight position={[3.5,7,-2]} color="#ffe0a0" intensity={2.8} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-normalBias={.035} shadow-bias={-.0002}/>
  <directionalLight position={[-4,3,4]} color="#b5c99d" intensity={.55}/>
  <Ground motion={motion} compact={compact}/><Growth progress={progress} motion={motion} compact={compact} pointer={pointer}/>
  {Array.from({length:22},(_,i)=><mesh key={i} position={[(i%8-3.5)*3.8,5,-9-Math.floor(i/8)*6]} rotation={[0,0,Math.sin(i)*.035]}><cylinderGeometry args={[.12+(i%3)*.12,.24+(i%3)*.12,13,9]}/><meshStandardMaterial color={i%2?'#253123':'#30382a'} roughness={1}/></mesh>)}
  <Sparkles count={compact?18:45} scale={[11,5,8]} size={1.4} speed={motion?.12:0} opacity={.23} color="#e6d9a4" position={[0,2,0]}/>
  </>;}
export default function Scene({motion=true,progress}) {const active=useSceneVisibility();const pointer=useLeafPointer(motion&&active);const [compact]=useState(()=>window.innerWidth<768);return <div className="scene" aria-hidden="true"><SceneBoundary><Canvas shadows frameloop={motion&&active?'always':'demand'} dpr={[1,compact?1.2:1.6]} camera={{position:compact?[4,2.7,8.2]:[4,2.4,7],fov:35,near:.1,far:65}} gl={{antialias:true,alpha:false,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.05}} onCreated={({camera})=>camera.lookAt(compact?.2:-.8,1,0)}><Environment motion={motion} compact={compact} progress={progress} active={active} pointer={pointer}/></Canvas></SceneBoundary><div className="scene-shade"/></div>;}

