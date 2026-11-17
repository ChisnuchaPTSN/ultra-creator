import {useMemo,useRef,useLayoutEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {bladeGeometry,random,soilTexture} from './geometry';
export default function Ground({motion,compact}) {
  const mesh=useRef(),count=compact?14000:38000;
  const {geometry,material,texture,time}=useMemo(()=>{
    const time={value:0},material=new THREE.MeshStandardMaterial({color:'#b3bf91',roughness:.88,side:THREE.DoubleSide});
    material.onBeforeCompile=s=>{s.uniforms.uTime=time;s.vertexShader='uniform float uTime;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      float phase=instanceMatrix[3].x*1.1+instanceMatrix[3].z*.7;
      transformed.x+=sin(uTime*.9+phase)*.085*position.y*position.y;
      transformed.z+=cos(uTime*.65+phase)*.04*position.y;`);};
    return {geometry:bladeGeometry(),material,texture:soilTexture(),time};
  },[]);
  useLayoutEffect(()=>{
    const rand=random(92),dummy=new THREE.Object3D(),color=new THREE.Color();
    for(let i=0;i<count;i++) {let x=(rand()-.5)*23,z=(rand()-.5)*18;if(Math.hypot(x-1.1,z)<.23){x+=.3;z+=.15;}
      dummy.position.set(x,-.04,z);dummy.rotation.set(0,rand()*Math.PI*2,(rand()-.5)*.45);dummy.scale.set(.7+rand()*.8,.10+Math.pow(rand(),1.7)*.38,.7+rand()*.8);dummy.updateMatrix();mesh.current.setMatrixAt(i,dummy.matrix);color.setHSL(.2+rand()*.075,.27+rand()*.26,.19+rand()*.17);mesh.current.setColorAt(i,color);
    }mesh.current.instanceMatrix.needsUpdate=true;mesh.current.instanceColor.needsUpdate=true;
  },[count]);
  useFrame(({clock})=>{time.value=motion?clock.elapsedTime:0;});
  return <group><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.045,0]} receiveShadow><planeGeometry args={[70,70]}/><meshStandardMaterial color="#4f5238" map={texture} bumpMap={texture} bumpScale={.07} roughness={1}/></mesh><instancedMesh ref={mesh} args={[geometry,material,count]} receiveShadow castShadow frustumCulled={false}/></group>;
}
