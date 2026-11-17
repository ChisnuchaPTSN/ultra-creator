import {useEffect,useRef,useState} from 'react';
import {creators} from '../showcaseData';
import VideoCard from './VideoCard';

function CountUp({value,active,motion,label}){
 const [count,setCount]=useState(0),done=useRef(false);
 useEffect(()=>{
   if(!active||done.current)return;
   if(!motion){setCount(value);done.current=true;return;}
   let raf,start;
   const tick=t=>{
     start??=t;
     const p=Math.min(1,(t-start)/1450);
     setCount(Math.round(value*(1-Math.pow(1-p,3))));
     if(p<1)raf=requestAnimationFrame(tick);
     else done.current=true;
   };
   raf=requestAnimationFrame(tick);
   return()=>cancelAnimationFrame(raf);
 },[active,value,motion]);
 return <><span aria-hidden="true">{count.toLocaleString('en-US')}</span><span className="sr-only">{label || 'ยอดวิวสะสม'} {value.toLocaleString('en-US')}</span></>;
}

export default function Creators({motion,onOpen,t}){
 const cs = t?.creatorsSec;
 const root=useRef(),rail=useRef(),gesture=useRef(null),ignoreClick=useRef(false),activeRef=useRef(0);
 const touchStartRef=useRef({x:0,y:0,time:0,isHorizontal:false,isVertical:false});
 const [active,setActive]=useState(0),[visible,setVisible]=useState(false),[dragging,setDragging]=useState(false);
 const last=creators.length-1;

 const position=i=>{
   if(!rail.current)return 0;
   return i*(rail.current.scrollWidth-rail.current.clientWidth)/last;
 };

 function select(i,animate=motion){
   i=Math.max(0,Math.min(last,i));
   activeRef.current=i;
   setActive(i);
   if(rail.current){
     rail.current.scrollTo({left:position(i),behavior:animate?'smooth':'instant'});
   }
 }

 useEffect(()=>{
   const o=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.06});
   if(root.current) o.observe(root.current);
   return()=>o.disconnect();
 },[]);

 // Sync resize and wheel
 useEffect(()=>{
   const el=rail.current;
   if(!el)return;
   const resize=()=>select(activeRef.current,false);
   let timer,locked=false,total=0;
   const wheel=e=>{
     if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;
     e.preventDefault();
     clearTimeout(timer);
     timer=setTimeout(()=>{locked=false;total=0;},180);
     if(locked)return;
     total+=e.deltaX;
     if(Math.abs(total)>35){
       select(activeRef.current+Math.sign(total));
       locked=true;
     }
   };
   window.addEventListener('resize',resize);
   el.addEventListener('wheel',wheel,{passive:false});
   return()=>{
     window.removeEventListener('resize',resize);
     el.removeEventListener('wheel',wheel);
     clearTimeout(timer);
   };
 },[motion]);

 // Sync active on native touch scroll
 const handleScroll=()=>{
   if(!rail.current)return;
   const scrollLeft=rail.current.scrollLeft;
   const maxScroll=rail.current.scrollWidth-rail.current.clientWidth;
   if(maxScroll<=0)return;
   const nearest=Math.round((scrollLeft/maxScroll)*last);
   if(nearest!==activeRef.current&&nearest>=0&&nearest<=last){
     activeRef.current=nearest;
     setActive(nearest);
   }
 };

 // Dedicated Mobile Touch Handlers
 function onTouchStart(e){
   if(e.touches.length!==1)return;
   ignoreClick.current=false;
   const t=e.touches[0];
   touchStartRef.current={
     x:t.clientX,
     y:t.clientY,
     time:Date.now(),
     isHorizontal:false,
     isVertical:false,
   };
 }

 function onTouchMove(e){
   if(e.touches.length!==1)return;
   const t=e.touches[0];
   const dx=t.clientX-touchStartRef.current.x;
   const dy=t.clientY-touchStartRef.current.y;

   if(!touchStartRef.current.isHorizontal&&!touchStartRef.current.isVertical){
     if(Math.abs(dx)>8||Math.abs(dy)>8){
       if(Math.abs(dx)>=Math.abs(dy)){
         touchStartRef.current.isHorizontal=true;
       }else{
         touchStartRef.current.isVertical=true;
       }
     }
   }

   if(touchStartRef.current.isHorizontal){
     // Horizontal swipe in progress: prevent vertical page scroll
     if(e.cancelable) e.preventDefault();
     ignoreClick.current=true;
   }
 }

 function onTouchEnd(e){
   if(!touchStartRef.current.isHorizontal){
     touchStartRef.current.isHorizontal=false;
     touchStartRef.current.isVertical=false;
     return;
   }
   const t=e.changedTouches[0];
   const dx=t.clientX-touchStartRef.current.x;
   const dt=Date.now()-touchStartRef.current.time;

   // Detect swipe threshold: distance > 35px or flick swipe (> 20px in < 300ms)
   if(dx<-35||(dx<-20&&dt<300)){
     select(activeRef.current+1);
   }else if(dx>35||(dx>20&&dt<300)){
     select(activeRef.current-1);
   }
   touchStartRef.current.isHorizontal=false;
   touchStartRef.current.isVertical=false;
 }

 // Desktop pointer handlers (mouse only)
 function down(e){
   if(e.pointerType==='touch')return; // Touch handled by dedicated touch listeners
   if(e.button!==0||e.isPrimary===false)return;
   ignoreClick.current=false;
   gesture.current={id:e.pointerId,x:e.clientX,y:e.clientY,index:activeRef.current,left:position(activeRef.current),dx:0,horizontal:false};
 }
 function move(e){
   if(e.pointerType==='touch')return;
   const g=gesture.current;
   if(!g||g.id!==e.pointerId)return;
   const dx=e.clientX-g.x,dy=e.clientY-g.y;
   if(!g.horizontal){
     if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){gesture.current=null;return;}
     if(Math.abs(dx)<10)return;
     g.horizontal=true;
     setDragging(true);
     rail.current.setPointerCapture(e.pointerId);
   }
   e.preventDefault();
   g.dx=dx;
   ignoreClick.current=true;
   const step=position(1);
   rail.current.scrollLeft=g.left-Math.max(-step,Math.min(step,dx));
 }
 function finish(e,cancelled=false){
   if(e.pointerType==='touch')return;
   const g=gesture.current;
   if(!g||g.id!==e.pointerId)return;
   gesture.current=null;
   setDragging(false);
   if(rail.current.hasPointerCapture(e.pointerId))rail.current.releasePointerCapture(e.pointerId);
   if(g.horizontal)select(g.index+(!cancelled&&Math.abs(g.dx)>40?-Math.sign(g.dx):0));
 }

 return <section ref={root} id="creators" className={`creators-section ${motion?'':'no-motion'}`} aria-labelledby="creators-title"><div className="creators-sticky">
 <div className="creators-heading"><p className="eyebrow">{cs?.eyebrow || '02 / คนที่เราเล่าเรื่องไปด้วยกัน'}</p><h2 id="creators-title" className="supertext-title heading-fade-up">{cs?.title || 'ครีเอเตอร์แต่ละคน'}<br className="mobile-break"/> <em className="supertext-em">{cs?.titleEm || 'มีเรื่องที่ต่างกัน'}</em></h2><p className="demo-caption">{cs?.caption || 'ผลงานการเติบโตของครีเอเตอร์ที่เราดูแล'}</p></div>
 <div className={`creator-rail ${dragging?'is-dragging':''}`} ref={rail} role="region" aria-label={cs?.hint || 'การ์ดครีเอเตอร์ ลากหรือใช้ปุ่มลูกศรเพื่อเลื่อน'} tabIndex="0" data-lenis-prevent-horizontal onScroll={handleScroll} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onPointerDown={down} onPointerMove={move} onPointerUp={finish} onPointerCancel={e=>finish(e,true)} onLostPointerCapture={e=>finish(e,true)} onDragStart={e=>e.preventDefault()} onClickCapture={e=>{if(ignoreClick.current){e.preventDefault();e.stopPropagation();ignoreClick.current=false;}}} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(activeRef.current+(e.key==='ArrowRight'?1:-1));}}}>
 <div className="creator-track">{creators.map((person,i)=><article key={person.id} className={`creator-card ${active===i?'is-active':''} ${person.type==='brand'?'is-brand-card':'is-person-card'}`} style={{'--card-color':person.color}} aria-label={`${person.name} (${i+1}/${creators.length})`}>{person.type==='brand'?(<div className={`creator-logo-sticker sticker-${person.id}`} aria-hidden="true"><div className="creator-logo-sticker-inner"><img src={person.portraitImg} alt={person.name} loading="lazy"/></div></div>):(<div className={`creator-portrait portrait-${i} is-cutout`} role="img" aria-label={`Portrait ${person.name}`}><img src={person.portraitImg} alt={person.name} loading="lazy"/></div>)}<div className="creator-profile"><p className="creator-role">{cs?.roles?.[person.id] || person.role}</p><h3><button onClick={()=>select(i)} tabIndex={active===i?0:-1}>{person.name}</button></h3><div className="creator-count"><CountUp value={person.views} active={active===i&&visible} motion={motion} label={cs?.viewsLabel}/></div><p className="count-label">{cs?.viewsLabel || 'ยอดวิวสะสม'}</p></div><div className="creator-films">{person.clips.map(clip=><VideoCard key={clip.id} clip={clip} onOpen={onOpen} enabled={active===i&&!dragging} motion={motion}/>)}</div><div className="creator-card-foot"><span>{cs?.curatedClips || 'คลิปที่คัดมาให้ดู'}</span><span>0{i+1} / 0{creators.length}</span></div></article>)}</div></div>
 <div className="creator-controls"><button onClick={()=>select(activeRef.current-1)} disabled={active===0} aria-label={cs?.prevAria || 'ครีเอเตอร์คนก่อนหน้า'}>←</button><div className="creator-dots">{creators.map((c,i)=><button key={c.id} onClick={()=>select(i)} aria-label={`ดู ${c.name}`} aria-current={active===i?'true':undefined}><span/></button>)}</div><button onClick={()=>select(activeRef.current+1)} disabled={active===last} aria-label={cs?.nextAria || 'ครีเอเตอร์คนถัดไป'}>→</button></div><p className="creator-hint">{cs?.hint || 'ลากด้วยเมาส์ หรือปัดซ้าย–ขวา เพื่อดูทีละคน'}</p><p className="sr-only" aria-live="polite">{creators[active].name} ({active+1}/4)</p></div></section>;
}
