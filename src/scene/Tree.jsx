import {useMemo,useRef,useLayoutEffect} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';
import {leafGeometry,random} from './geometry';

function branch(points,base,tip,segments=14){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const g=new THREE.TubeGeometry(curve,segments,1,7,false),position=g.attributes.position;
  for(let i=0;i<=segments;i++){
    const center=curve.getPointAt(i/segments),radius=base+(tip-base)*i/segments;
    for(let j=0;j<=7;j++){const n=i*8+j;position.setXYZ(n,center.x+(position.getX(n)-center.x)*radius,center.y+(position.getY(n)-center.y)*radius,center.z+(position.getZ(n)-center.z)*radius);}
  }
  g.computeVertexNormals();return g;
}
export default function Tree({compact=false,pointer,motion=true}){
  const leaves=useRef(),count=compact?680:1800;
  const breeze=useMemo(()=>({time:{value:0},strength:{value:0},screen:new THREE.Vector3()}),[]);
  const foliage=useMemo(()=>{
    const material=new THREE.MeshStandardMaterial({color:'#c9d6ab',roughness:.66,side:THREE.DoubleSide});
    material.onBeforeCompile=shader=>{shader.uniforms.uLeafTime=breeze.time;shader.uniforms.uLeafStrength=breeze.strength;shader.vertexShader='uniform float uLeafTime; uniform float uLeafStrength;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      transformed.y += sin(uLeafTime*5.0 + instanceMatrix[3].x*3.0 + instanceMatrix[3].y*2.0) * position.x * uLeafStrength * .42;
    `);};
    return material;
  },[breeze]);
  useFrame(({camera,clock},delta)=>{
    if(!pointer)return;
    breeze.screen.set(0,3,0);leaves.current.localToWorld(breeze.screen);breeze.screen.project(camera);
    const p=pointer.current,near=motion&&p.active?Math.max(0,1-Math.hypot(breeze.screen.x-p.x,breeze.screen.y-p.y)/.9):0;
    breeze.strength.value=THREE.MathUtils.damp(breeze.strength.value,near,6,delta);breeze.time.value=clock.elapsedTime;
  });
  const {branches,clusters,leaf}=useMemo(()=>{
    const branches=[branch([[0,0,0],[.06,1.1,.03],[-.08,2.2,0],[.15,3.35,-.04],[.11,4.1,0]],.19,.012,24)],clusters=[];
    for(let i=0;i<15;i++){
      const a=i*2.39996,h=1.45+i/15*2.1,r=1.25+Math.sin(i/15*Math.PI)*.6;
      const end=[Math.cos(a)*r,h+.8,Math.sin(a)*r];
      branches.push(branch([[0,h,0],[end[0]*.45,h+.3,end[2]*.45],end],.055,.006));
      clusters.push([end[0]*.85,end[1]+.18,end[2]*.85]);
      const off=a+.6;
      branches.push(branch([[end[0]*.55,h+.4,end[2]*.55],[Math.cos(off)*r*.85,h+.75,Math.sin(off)*r*.85]],.022,.003,8));
    }
    clusters.push([0,4.15,0]);
    for(let i=0;i<6;i++){const a=i*Math.PI/3;branches.push(branch([[Math.cos(a)*.65,0,Math.sin(a)*.65],[Math.cos(a)*.24,.12,Math.sin(a)*.24],[0,.5,0]],.025,.09,9));}
    return {branches,clusters,leaf:leafGeometry(.34,.135,8,4)};
  },[]);
  useLayoutEffect(()=>{
    const rand=random(301),dummy=new THREE.Object3D(),color=new THREE.Color();
    for(let i=0;i<count;i++){
      const c=clusters[i%clusters.length],a=rand()*Math.PI*2,u=rand()*2-1,r=Math.cbrt(rand()),s=Math.sqrt(1-u*u);
      dummy.position.set(c[0]+Math.cos(a)*r*s*.78,c[1]+u*r*.7,c[2]+Math.sin(a)*r*s*.78);
      dummy.rotation.set((rand()-.5)*2.7,rand()*Math.PI*2,(rand()-.5)*2.3);dummy.scale.setScalar(.8+rand()*.75);dummy.updateMatrix();leaves.current.setMatrixAt(i,dummy.matrix);
      color.setHSL(.21+rand()*.075,.35+rand()*.22,.22+rand()*.18);leaves.current.setColorAt(i,color);
    }
    leaves.current.instanceMatrix.needsUpdate=true;leaves.current.instanceColor.needsUpdate=true;
  },[count,clusters]);
  return <group>{branches.map((g,i)=><mesh key={i} geometry={g} castShadow receiveShadow><meshStandardMaterial color="#655b43" roughness={.94}/></mesh>)}<instancedMesh ref={leaves} args={[leaf,null,count]} castShadow receiveShadow><primitive object={foliage} attach="material"/></instancedMesh></group>;
}
