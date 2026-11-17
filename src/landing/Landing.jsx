import {Component,lazy,Suspense,useEffect,useRef,useState} from 'react';
import {journey} from './timeline';
import './landing.css';
const JourneyCanvas=lazy(()=>import('./JourneyCanvas'));
class VisualBoundary extends Component{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="journey-fallback" aria-hidden="true"/>:this.props.children;}
}
export default function Landing({motion}){
 const root=useRef(),progress=useRef(0),[active,setActive]=useState(true),[stage,setStage]=useState(0);
 useEffect(()=>{
  const update=()=>{const el=root.current,r=el.getBoundingClientRect();progress.current=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight)));setStage(journey(progress.current).stage);el.style.setProperty('--journey-progress',progress.current);setActive(r.bottom>0&&r.top<innerHeight&&!document.hidden);};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);document.addEventListener('visibilitychange',update);
  return()=>{window.removeEventListener('scroll',update);window.removeEventListener('resize',update);document.removeEventListener('visibilitychange',update);};
 },[]);
 return <section id="home" ref={root} className={`journey-home ${motion?'':'journey-reduced'}`} aria-label="การเดินทางจากอวกาศสู่ธรรมชาติ" data-stage={stage}>
  <div className="journey-sticky">
   <VisualBoundary><Suspense fallback={<div className="journey-loading" aria-hidden="true"/>}><JourneyCanvas progress={progress} motion={motion} active={active}/></Suspense></VisualBoundary>
   <div className="journey-vignette" aria-hidden="true"/>
   <div className={`journey-bird-copy ${stage===2?'is-visible':''}`} aria-hidden={stage!==2}><p className="journey-eyebrow">พื้นที่เล็ก ๆ ของชีวิต</p><h2>โลกที่มีชีวิต<br/>มีเรื่องให้เล่าเสมอ</h2></div>
   <div className={`journey-forest-copy ${stage===4?'is-visible':''}`} aria-hidden={stage!==4}><p className="journey-eyebrow">กลับสู่ธรรมชาติของเรื่องราว</p><h2>ให้ทุกเรื่อง<br/><em>เติบโตไปด้วยกัน</em></h2><a className="round-link" href="#work" tabIndex={stage===4?0:-1}><span className="round-arrow">↘</span> ดูผลงานของเรา</a></div>
   {stage>0&&<div className="journey-bottom"><span>{['','02 / ผ่านชั้นเมฆ','03 / อิสระ','04 / สู่ผืนป่า','05 / หยั่งราก'][stage]}</span><span className="journey-scroll-hint">{stage===4?'เลื่อนต่อเพื่อดูผลงาน':'เลื่อนเพื่อเดินทาง'} <span aria-hidden="true">↓</span></span><span className="journey-track" aria-hidden="true"><span/></span></div>}
  </div>
 </section>;
}
