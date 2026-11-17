import { Component, useMemo, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { leafGeometry } from './geometry';
class ModelBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<SeedlingPlaceholder/>:this.props.children;}
}
function SeedlingAsset({url}) {
  const {scene}=useGLTF(url);
  const model=useMemo(()=>{const clone=scene.clone(true);clone.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return clone;},[scene]);
  return <primitive object={model}/>;
}
export function SeedlingPlaceholder({pointer,motion=true}) {
  const leafGroups=useRef([]),screen=useMemo(()=>new THREE.Vector3(),[]);
  useFrame(({camera,clock},delta)=>{leafGroups.current.forEach((group,i)=>{if(!group)return;group.getWorldPosition(screen);screen.project(camera);const p=pointer?.current;const near=motion&&p?.active?Math.max(0,1-Math.hypot(screen.x-p.x,screen.y-p.y)/.55):0;const target=leaves[i].r[2]+near*(.12+Math.sin(clock.elapsedTime*5+i)*.08);group.rotation.z=THREE.MathUtils.damp(group.rotation.z,target,7,delta);});});
  const {leaf,stem,material,vein}=useMemo(()=>{
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,0),new THREE.Vector3(-.055,.45,.012),new THREE.Vector3(.05,.95,0),new THREE.Vector3(.035,1.42,.015),new THREE.Vector3(.09,1.84,0)]);
    const material=new THREE.MeshPhysicalMaterial({color:'#527c30',roughness:.5,side:THREE.DoubleSide,clearcoat:.3,clearcoatRoughness:.42});
    material.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 vLeafUv;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvLeafUv=uv;');
      shader.fragmentShader='varying vec2 vLeafUv;\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float center=exp(-abs(vLeafUv.y-.5)*110.);
        float branch=pow(max(0.,cos((vLeafUv.x-abs(vLeafUv.y-.5)*.63)*105.)),20.)*.16;
        float grain=fract(sin(dot(vLeafUv,vec2(129.1,311.7)))*43758.5)*.045;
        diffuseColor.rgb*=.80+.23*sin(vLeafUv.x*3.14)+grain;
        diffuseColor.rgb+=vec3(.13,.16,.025)*(center*.48+branch);
      `);
    };
    return {leaf:leafGeometry(.95,.4),stem:new THREE.TubeGeometry(curve,32,.022,10,false),material,vein:new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(),new THREE.Vector3(.43,.17,0),new THREE.Vector3(.9,-.02,0)]),16,.003,5,false)};
  },[]);
  const leaves=[{p:[-.02,.55,0],r:[.5,.55,.08],s:.5},{p:[-.015,.78,0],r:[.72,.15,.20],s:.83},{p:[.02,1.02,0],r:[-.72,Math.PI+.12,.2],s:.91},{p:[.04,1.32,.015],r:[.60,-.4,.32],s:.85},{p:[.06,1.56,0],r:[-.65,2.85,.42],s:.64},{p:[.09,1.8,0],r:[.3,-1.1,.85],s:.34}];
  return <group><mesh geometry={stem} castShadow><meshStandardMaterial color="#647637" roughness={.7}/></mesh>{leaves.map((l,i)=><group ref={el=>{leafGroups.current[i]=el;}} key={i} position={l.p} rotation={l.r} scale={l.s}><mesh geometry={leaf} material={material} castShadow receiveShadow/><mesh geometry={vein}><meshStandardMaterial color="#a7ad57" roughness={.8}/></mesh></group>)}</group>;
}
export default function Seedling({modelUrl,motion=true,pointer}) {
  const group=useRef();useFrame(({clock})=>{if(motion&&group.current){group.current.rotation.z=Math.sin(clock.elapsedTime*.65)*.016;group.current.rotation.y=Math.sin(clock.elapsedTime*.32)*.035;}});
  return <group ref={group}><ModelBoundary key={modelUrl}><Suspense fallback={<SeedlingPlaceholder pointer={pointer} motion={motion}/>}>{modelUrl?<SeedlingAsset url={modelUrl}/>:<SeedlingPlaceholder pointer={pointer} motion={motion}/>}</Suspense></ModelBoundary></group>;
}
