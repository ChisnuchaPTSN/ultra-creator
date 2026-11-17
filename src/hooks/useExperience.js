import {useEffect,useRef,useState} from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function useExperience() {
  const progress=useRef(0);
  const [motion,setMotion]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=e=>setMotion(!e.matches);
    preference.addEventListener('change',update);return()=>preference.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    const update=()=>{const story=document.getElementById('story');if(!story)return;const start=story.offsetTop;const end=story.offsetHeight-window.innerHeight;const home=document.getElementById('home');const originalHero=Math.max(window.innerWidth<768?780:720,window.innerHeight);const added=home?.classList.contains('journey-home')?Math.max(0,home.offsetHeight-originalHero):0;progress.current=Math.max(0,Math.min(1,window.scrollY<start?Math.max(0,window.scrollY-added)/Math.max(1,start-added)*.18:.18+(window.scrollY-start)/Math.max(1,end)*.82));};
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
    let lenis,raf;
    if(motion){lenis=new Lenis({duration:1.15,smoothWheel:true,anchors:true});const tick=t=>{lenis.raf(t);raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}
    const navigate=e=>{if(lenis)lenis.scrollTo(e.detail.top,{duration:1.05,force:true});else window.scrollTo({top:e.detail.top,behavior:'instant'});};
    window.addEventListener('understory:scroll',navigate);
    const ctx=gsap.context(()=>{
      if(motion)gsap.utils.toArray('[data-reveal]').forEach(el=>gsap.fromTo(el,{opacity:.25,y:26},{opacity:1,y:0,duration:1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    });
    return()=>{window.removeEventListener('understory:scroll',navigate);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);cancelAnimationFrame(raf);lenis?.destroy();ctx.revert();};
  },[motion]);
  return {progress,motion,setMotion};
}
