import {useEffect,useMemo} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import * as THREE from 'three';

// Film vignette and warm-tinted contrast grading shader
const FilmGradeShader = {
  uniforms: {
    tDiffuse: {value: null},
    uVignette: {value: 0.65},
    uExposure: {value: 1.05}
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uVignette;
    uniform float uExposure;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      // Delicate lens vignette
      vec2 coord = (vUv - 0.5) * 1.8;
      float rf = sqrt(dot(coord, coord)) * uVignette;
      float rf2_1 = rf * rf + 1.0;
      float e = 1.0 / (rf2_1 * rf2_1);
      color.rgb *= e;
      // Controlled film exposure
      color.rgb *= uExposure;
      gl_FragColor = color;
    }
  `
};

export default function CinematicEffects(){
  const {gl, scene, camera, size} = useThree();
  const isMobile = size.width < 768;

  const composer = useMemo(()=>{
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));

    // Restrained bloom only for molten fissures, fire plasma, and sun highlights
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      isMobile ? 0.22 : 0.32,  // strength
      0.55,                    // radius
      0.82                     // threshold (high threshold keeps blacks deep and clean)
    );
    c.addPass(bloom);

    const grade = new ShaderPass(FilmGradeShader);
    c.addPass(grade);

    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera, size.width, size.height, isMobile]);

  useEffect(()=>{
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(Math.min(gl.getPixelRatio(), isMobile ? 1.5 : 1.75));
  }, [composer, gl, size, isMobile]);

  useEffect(()=>()=>{
    for (const pass of composer.passes) pass.dispose?.();
    composer.dispose();
  }, [composer]);

  useFrame((_, delta)=>{
    composer.render(Math.min(delta, 0.05));
  }, 1);

  return null;
}
