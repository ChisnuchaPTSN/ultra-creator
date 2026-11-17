import {useEffect,useRef,useState} from 'react';
import {formatViews} from '../showcaseData';

export default function VideoCard({clip,onOpen,enabled=true,motion=true}){
  const video=useRef(),hovered=useRef(false),[playing,setPlaying]=useState(false);
  const stop=()=>{hovered.current=false;video.current?.pause();setPlaying(false);};
  useEffect(()=>{if(!enabled||!motion)stop();},[enabled,motion]);
  useEffect(()=>{
    const el=video.current;
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)stop();});observer.observe(el);
    const hide=()=>{if(document.hidden)stop();};document.addEventListener('visibilitychange',hide);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide);el.pause();};
  },[]);
  async function preview(e){
    if(e.pointerType!=='mouse'||!enabled||!motion||!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    hovered.current=true;const el=video.current;
    if(!el.getAttribute('src'))el.src=clip.src;
    el.muted=true;
    try{await el.play();if(hovered.current)setPlaying(true);else el.pause();}catch{setPlaying(false);}
  }
  return <button className={`short-card ${playing?'is-playing':''}`} disabled={!enabled} onPointerEnter={preview} onPointerLeave={stop} onBlur={stop} onClick={()=>{stop();onOpen(clip);}} aria-label={`เล่น ${clip.title}, ยอดวิว ${formatViews(clip.views)}`}>
    <img src={clip.poster} alt="" loading="lazy"/>
    <video ref={video} muted playsInline loop preload="none" aria-hidden="true"/>
    <span className="short-platform">{clip.platform}</span><span className="short-play" aria-hidden="true">▷</span>
    <span className="short-info"><strong>{formatViews(clip.views)} <small>วิว</small></strong><span>{clip.title}</span></span>
  </button>;
}
