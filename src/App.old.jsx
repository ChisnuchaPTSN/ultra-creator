import {lazy,Suspense,useState} from 'react';
import Work from './components/Work';
import Story from './components/Story';
import Collective from './components/Collective';
import ProjectDialog from './components/ProjectDialog';
import FireflyCursor from './components/FireflyCursor';
import Creators from './components/Creators';
import ClientLogos from './components/ClientLogos';
import ShortShowcase from './components/ShortShowcase';
import VideoDialog from './components/VideoDialog';
import './showcase.css';
import useExperience from './hooks/useExperience';
import Landing from './landing/Landing';
const Scene=lazy(()=>import('./scene/Scene'));
export default function App(){const {progress,motion,setMotion}=useExperience();const [project,setProject]=useState(null);const [clip,setClip]=useState(null);return <>
  <a className="skip-link" href="#work">ข้ามไปดูผลงาน</a>
  <Suspense fallback={<div className="scene scene-fallback"/>}><Scene progress={progress} motion={motion}/></Suspense>
  <header className="header"><a className="wordmark" href="#home"><span className="brand-mark">✳</span> UNDERSTORY<span className="brand-dot">®</span></a><nav aria-label="เมนูหลัก"><a href="#work">ผลงาน <span>03</span></a><a href="#story">ขั้นตอนทำงาน</a><a className="nav-contact" href="#collective">ทีมของเรา ↗</a></nav></header>
  <main><Landing motion={motion}/><Work onSelect={setProject}/><Story/><Creators motion={motion} onOpen={setClip}/><ClientLogos motion={motion}/><ShortShowcase motion={motion} onOpen={setClip}/><Collective/></main>
  <button className="motion-toggle" aria-pressed={motion} onClick={()=>setMotion(!motion)}><span aria-hidden="true">{motion?'Ⅱ':'▷'}</span> แอนิเมชัน {motion?'เปิด':'ปิด'}</button>
  <ProjectDialog project={project} onClose={()=>setProject(null)}/>
  <VideoDialog clip={clip} onClose={()=>setClip(null)}/>
  <FireflyCursor enabled={motion && !project && !clip}/>
</>;}
