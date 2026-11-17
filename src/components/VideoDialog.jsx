import {useEffect,useRef,useState} from 'react';
import {formatViews} from '../showcaseData';
export default function VideoDialog({clip,onClose,t}){
  const dialog=useRef(),video=useRef();const [failed,setFailed]=useState(false);
  const cm = t?.common;
  useEffect(()=>{
    if(!clip)return;setFailed(false);const previous=document.activeElement,old=document.body.style.overflow;
    document.body.style.overflow='hidden';dialog.current.showModal();
    video.current?.play().catch(()=>{});
    return()=>{video.current?.pause();document.body.style.overflow=old;previous?.focus();};
  },[clip]);
  if(!clip)return null;
  return <dialog ref={dialog} className="video-dialog" aria-labelledby="video-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}} data-lenis-prevent>
    <div className="video-dialog-inner"><button className="dialog-close" onClick={onClose} aria-label={cm?.videoDialogClose || 'ปิดวิดีโอ (Esc)'}>✕</button>
      <video ref={video} key={clip.id} src={clip.src} controls playsInline autoPlay preload="metadata" onError={()=>setFailed(true)} aria-label={clip.title}/>
      <div className="video-detail"><p className="eyebrow">{clip.platform} · {formatViews(clip.views)} {cm?.views || 'วิว'}</p><h2 id="video-title">{clip.title}</h2><p>{cm?.videoDialogSub || 'ผลงานการตัดต่อ เกรดสี และการวาง Pacing โดยทีม Ultra Creator'}</p>{failed&&<p role="alert">{cm?.videoDialogFailed || 'โหลดวิดีโอไม่ได้ กรุณาลองใหม่อีกครั้ง'}</p>}{clip.platformUrl&&<a href={clip.platformUrl} target="_blank" rel="noreferrer">{cm?.watchOn || 'ดูบน'} {clip.platform} ↗</a>}<p className="video-description">{clip.description}</p></div>
    </div>
  </dialog>;
}
