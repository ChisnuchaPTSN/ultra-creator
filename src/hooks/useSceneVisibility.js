import {useEffect,useState} from 'react';
export default function useSceneVisibility(){
  const [visible,setVisible]=useState(true);
  useEffect(()=>{
    const update=()=>{const section=document.getElementById('creators'),home=document.getElementById('home');const covered=home?.classList.contains('journey-home')&&home.getBoundingClientRect().bottom>window.innerHeight*1.15;setVisible(!covered&&(!section||section.getBoundingClientRect().top>0));};
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
    return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
  },[]);
  return visible;
}
