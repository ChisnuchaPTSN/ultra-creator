import {useEffect,useRef} from 'react';
export default function useLeafPointer(enabled){
 const pointer=useRef({x:0,y:0,active:false});
 useEffect(()=>{
  if(!enabled){pointer.current.active=false;return;}
  const move=e=>{const p=pointer.current;p.active=e.pointerType==='mouse'&&!e.target.closest('button,a,dialog');p.x=e.clientX/window.innerWidth*2-1;p.y=1-e.clientY/window.innerHeight*2;};
  const leave=()=>{pointer.current.active=false;};
  window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);
  return()=>{window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);window.removeEventListener('blur',leave);pointer.current.active=false;};
 },[enabled]);
 return pointer;
}
