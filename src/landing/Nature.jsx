import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {clamp,ease,segment} from './timeline';

// Screen-framed image planes have real Z separation and remain inside the camera
// frustum on portrait displays. The forest uses different travel at each depth.
export default function Nature({progress,motion}){
 const group=useRef(),forest=useRef(),bird=useRef(),near=useRef(),skyClouds=useRef(),mist=useRef(),dust=useRef();
 const {size,gl}=useThree();const mobile=size.width<768;
 const [forestMap,birdMap,cloudMap,foregroundMap]=useTexture(['forest','bird','cloud','foreground'].map(n=>'/landing/'+n+'.webp'));
 useEffect(()=>{for(const t of [forestMap,birdMap,cloudMap,foregroundMap]){t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,gl.capabilities.getMaxAnisotropy());t.needsUpdate=true;}},[forestMap,birdMap,cloudMap,foregroundMap,gl]);
 const wing=useMemo(()=>({value:0}),[]);
 const birdMaterial=useMemo(()=>{
  const m=new THREE.MeshBasicMaterial({map:birdMap,transparent:true,depthWrite:false,alphaTest:.025,side:THREE.DoubleSide,toneMapped:false});
  m.onBeforeCompile=s=>{s.uniforms.uWing=wing;s.vertexShader='uniform float uWing;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat edge=smoothstep(.08,.5,abs(uv.x-.5)); transformed.y+=edge*uWing*.17; transformed.z+=edge*abs(uWing)*.12;');};return m;
 },[birdMap,wing]);
 const skyMaterial=useMemo(()=>new THREE.ShaderMaterial({depthWrite:false,uniforms:{},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){vec3 c=mix(vec3(.73,.82,.81),vec3(.16,.36,.45),smoothstep(0.,1.,vUv.y));float sun=exp(-length((vUv-vec2(.78,.76))*vec2(1.,.8))*7.);gl_FragColor=vec4(c+vec3(.23,.20,.13)*sun,1.);}'}),[]);
 const particles=useMemo(()=>{const a=new Float32Array(80*3);for(let i=0;i<80;i++){a[i*3]=Math.sin(i*53.9)*10;a[i*3+1]=Math.sin(i*17.2)*5;a[i*3+2]=Math.cos(i*83.2)*2+1;}return a;},[]);
 useEffect(()=>()=>{birdMaterial.dispose();skyMaterial.dispose();},[birdMaterial,skyMaterial]);
 useFrame(({camera,clock})=>{
  const p=progress.current;group.current.visible=p>=.43;
  if(p<.43)return;
  camera.position.set(0,0,10);camera.lookAt(0,0,0);
  const h=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*10,w=h*size.width/size.height,t=ease(segment(p,.73,1));
  const isForest=p>=.72;forest.current.visible=near.current.visible=isForest;
  skyClouds.current.visible=bird.current.visible=!isForest;
  const fw=Math.max(w*1.2,h*1.5*1.02),fh=fw/1.5;
  forest.current.scale.set(fw,fh,1);forest.current.position.set((.5-t)*w*.16,0,0);
  near.current.scale.set(fw*1.1,fh*1.1,1);near.current.position.set((.2-t)*w*.5,h*.05,1.2);
  near.current.rotation.z=motion?Math.sin(clock.elapsedTime*.35)*.002:0;
  const b=segment(p,.43,.72),bw=mobile?w*.66:w*.36;
  bird.current.scale.set(bw,bw/1.5,1);bird.current.position.set(mobile?Math.sin(b*2)*w*.025:w*(.1+b*.09),mobile?-h*.06:h*(.07+b*.025),2);
  bird.current.rotation.z=-.08+Math.sin(b*3)*.08;
  wing.value=motion?Math.sin(clock.elapsedTime*2.1)*.6:0;
  group.current.children[0].scale.set(w*1.15,h*1.15,1);
  skyClouds.current.children.forEach((mesh,i)=>{const cw=Math.max(w*(.8+i*.1),h*.95);mesh.scale.set(cw,cw/1.5,1);mesh.position.set((i%2?-.3:.3)*w+(b-.5)*w*(i%2?.2:-.18),h*(-.43+i*.43),.2+i*.22);});
  const mw=Math.max(w*1.8,h*1.5);mist.current.visible=isForest;mist.current.scale.set(mw,mw/1.5,1);mist.current.position.set((.5-t)*w*.38,-h*.25,2);
  dust.current.visible=isForest;dust.current.rotation.z=motion?clock.elapsedTime*.006:0;
 });
 return <group ref={group} visible={false}>
  <mesh position={[0,0,-.5]} material={skyMaterial}><planeGeometry args={[1,1]}/></mesh>
  <group ref={skyClouds}>{[0,1,2].map(i=><mesh key={i}><planeGeometry args={[1,1]}/><meshBasicMaterial map={cloudMap} transparent opacity={i===1?.52:.9} depthWrite={false} toneMapped={false}/></mesh>)}</group>
  <mesh ref={bird} material={birdMaterial}><planeGeometry args={[1,1,48,20]}/></mesh>
  <mesh ref={forest}><planeGeometry args={[1,1]}/><meshBasicMaterial map={forestMap} toneMapped={false}/></mesh>
  <mesh ref={near}><planeGeometry args={[1,1,12,8]}/><meshBasicMaterial map={foregroundMap} transparent depthWrite={false} toneMapped={false}/></mesh>
  <mesh ref={mist}><planeGeometry args={[1,1]}/><meshBasicMaterial map={cloudMap} transparent opacity={.018} depthWrite={false} toneMapped={false} color="#bac5b1"/></mesh>
  <points ref={dust}><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles,3]}/></bufferGeometry><pointsMaterial size={.018} color="#e9d5a0" transparent opacity={.48} depthWrite={false}/></points>
 </group>;
}

export function CloudPassage({progress}){
 const group=useRef();const map=useTexture('/landing/cloud.webp');map.colorSpace=THREE.SRGBColorSpace;
 const {size}=useThree();
 useFrame(({camera})=>{
  const p=progress.current,second=p>.58;
  const u=segment(p,second?.625:.31,second?.805:.53),on=u>0&&u<1;
  group.current.visible=on;if(!on)return;
  const h=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*3,w=h*size.width/size.height;
  group.current.position.set(0,0,-3).applyQuaternion(camera.quaternion).add(camera.position);group.current.quaternion.copy(camera.quaternion);
  // Each layer approaches the lens, expands to surround it, then passes sideways.
  group.current.children.forEach((mesh,i)=>{
   const q=clamp(u+(i-1)*.035),cover=Math.sin(q*Math.PI),grow=.65+cover*1.9;
   const cw=Math.max(w,h*1.5)*grow;mesh.scale.set(cw,cw/1.5,1);
   mesh.position.set((i-1)*w*.18+(q<.5?(.5-q)*w*.9:(q-.5)*w*(i%2?-4:4)),(i-1)*h*.27,h*.03*i);
   mesh.material.opacity=Math.min(1,Math.min(q/.2,(1-q)/.24));
   mesh.rotation.z=(i-1)*.18;
  });
 });
 return <group ref={group} visible={false} renderOrder={90}>{[0,1,2].map(i=><mesh key={i} renderOrder={90+i}><planeGeometry args={[1,1]}/><meshBasicMaterial map={map} transparent depthTest={false} depthWrite={false} toneMapped={false} color={i===1?'#e9eeed':'#c4d0d4'}/></mesh>)}</group>;
}
