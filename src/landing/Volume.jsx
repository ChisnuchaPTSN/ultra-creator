import {useEffect,useMemo,useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {segment} from './timeline';

const noise=`
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){return .57*noise3(p)+.28*noise3(p*2.03)+.15*noise3(p*4.11);}
vec2 hitBox(vec3 ro,vec3 rd){vec3 inv=1./rd;vec3 a=(-.5-ro)*inv,b=(.5-ro)*inv;vec3 lo=min(a,b),hi=max(a,b);return vec2(max(max(lo.x,lo.y),lo.z),min(min(hi.x,hi.y),hi.z));}
`;
const vertex=`varying vec3 vOrigin;varying vec3 vPosition;void main(){vOrigin=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fireFragment=`
precision highp float;varying vec3 vOrigin;varying vec3 vPosition;uniform float uTime;
${noise}
void main(){
 vec3 rd=normalize(vPosition-vOrigin);vec2 hit=hitBox(vOrigin,rd);float start=max(hit.x,0.);if(hit.y<=start)discard;
 float stepSize=(hit.y-start)/48.;vec4 sum=vec4(0.);
 for(int i=0;i<48;i++){
  vec3 p=vOrigin+rd*(start+(float(i)+.5)*stepSize);float head=p.x+.5;
  vec3 q=p*vec3(8.,7.,7.)+vec3(uTime*2.6,0.,0.);float turb=fbm(q);
  float radius=.055+.30*pow(head,.7);float dist=length(p.yz+vec2(sin(p.x*11.+uTime*2.)*.018,0.));
  float envelope=smoothstep(radius,radius*.12,dist)*smoothstep(0.,.24,head)*(1.-smoothstep(.88,1.,head));
  float density=max(0.,envelope-(1.-turb)*.48);float alpha=1.-exp(-density*stepSize*11.);
  float heat=clamp(density*.9+head*.28,0.,1.);vec3 c=mix(vec3(.9,.055,.006),vec3(3.,.75,.05),smoothstep(.12,.52,heat));c=mix(c,vec3(4.,2.7,1.2),smoothstep(.6,.94,heat));
  sum.rgb+=(1.-sum.a)*alpha*c;sum.a+=(1.-sum.a)*alpha;if(sum.a>.98)break;
 }
 if(sum.a<.008)discard;gl_FragColor=vec4(sum.rgb/max(sum.a,.001),sum.a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
const cloudFragment=`
precision highp float;varying vec3 vOrigin;varying vec3 vPosition;uniform float uTime;uniform float uTravel;uniform float uCover;uniform float uSky;uniform float uSteps;
${noise}
float density(vec3 p){
 vec3 q=p*vec3(7.,4.,7.)+vec3(uTime*.025,0.,uTravel);
 float n=fbm(q);float profile=1.-smoothstep(.18,.5,abs(p.y));
 float banks=mix(.53,.35,uCover);float d=max(0.,n-banks)*profile*5.;
 // Clear corridor in the bird scene; billowing banks have physical depth.
 d*=mix(1.,smoothstep(.10,.28,abs(p.y)),uSky);return d;
}
void main(){
 vec3 rd=normalize(vPosition-vOrigin);vec2 hit=hitBox(vOrigin,rd);float start=max(hit.x,0.);if(hit.y<=start)discard;
 float stepSize=(hit.y-start)/uSteps;vec4 sum=vec4(0.);
 for(int i=0;i<40;i++){
  if(float(i)>=uSteps)break;vec3 p=vOrigin+rd*(start+(float(i)+.5)*stepSize);float d=density(p);
  if(d>.005){float shadow=density(p+vec3(.06,.10,-.04));float light=clamp(.65+(d-shadow)*1.8,.15,1.25);
   vec3 c=mix(vec3(.24,.36,.44),vec3(1.12,1.08,.96),light);float alpha=1.-exp(-d*stepSize*15.);
   sum.rgb+=(1.-sum.a)*alpha*c;sum.a+=(1.-sum.a)*alpha;if(sum.a>.985)break;}
 }
 if(sum.a<.002)discard;gl_FragColor=vec4(sum.rgb/max(sum.a,.001),sum.a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

export function MeteorFire({motion}){
 const material=useMemo(()=>new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fireFragment,uniforms:{uTime:{value:0}},transparent:true,depthWrite:false,side:THREE.BackSide}),[]);
 useFrame(({clock})=>{material.uniforms.uTime.value=motion?clock.elapsedTime:0;});
 useEffect(()=>()=>material.dispose(),[material]);
 return <mesh position={[-2.25,0,0]} scale={[5.1,1.7,1.7]} material={material}><boxGeometry args={[1,1,1]}/></mesh>;
}

export default function CloudVolume({progress,motion,sky=false}){
 const group=useRef();const {size}=useThree();
 const material=useMemo(()=>new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:cloudFragment,uniforms:{uTime:{value:0},uTravel:{value:0},uCover:{value:0},uSky:{value:sky?1:0},uSteps:{value:32}},transparent:true,depthWrite:false,depthTest:false,side:THREE.BackSide}),[sky]);
 useEffect(()=>()=>material.dispose(),[material]);
 useFrame(({camera,clock})=>{
  const p=progress.current,second=p>.6,u=segment(p,second?.65:.30,second?.805:.52);
  group.current.visible=sky?p>=.43&&p<.72:u>0&&u<1;if(!group.current.visible)return;
  const fov=2*Math.tan(camera.fov*Math.PI/360),height=fov*15,width=height*size.width/size.height;
  group.current.position.set(0,0,-15).applyQuaternion(camera.quaternion).add(camera.position);group.current.quaternion.copy(camera.quaternion);group.current.scale.set(Math.max(width*1.65,12),height*1.65,15);
  material.uniforms.uTime.value=motion?clock.elapsedTime:0;
  material.uniforms.uCover.value=sky?.05:Math.sin(u*Math.PI);
  material.uniforms.uTravel.value=sky?p*4:u*3;
  material.uniforms.uSteps.value=size.width<768?24:36;
  material.opacity=1;
  // Fade density at the first/last few percent, not a flat white overlay.
  material.uniforms.uCover.value*=sky?1:Math.min(1,u/.12,(1-u)/.12);
 });
 return <mesh ref={group} material={material} renderOrder={sky?2:90} visible={false}><boxGeometry args={[1,1,1]}/></mesh>;
}
