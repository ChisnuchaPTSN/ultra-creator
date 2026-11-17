import {useEffect,useRef} from 'react';
export default function ProjectDialog({project,onClose}) {
  const ref=useRef();
  useEffect(()=>{
    if(!project)return;
    const previous=document.activeElement;
    const old=document.body.style.overflow;
    document.body.style.overflow='hidden';ref.current.showModal();
    return()=>{document.body.style.overflow=old;previous?.focus();};
  },[project]);
  if(!project)return null;
  return <dialog ref={ref} className="project-dialog" aria-labelledby="project-title" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}} data-lenis-prevent>
    <div className="dialog-content"><button className="dialog-close" aria-label="ปิดรายละเอียด" onClick={onClose}>✕</button><img className="dialog-image" src={project.image} alt={project.alt}/><div className="dialog-copy"><p className="eyebrow">{project.category} / กรณีศึกษาและการผลิต</p><h2 id="project-title">{project.title}</h2><p className="dialog-intro">{project.description}</p><div className="treatment"><div><h3>แนวทางการเล่าเรื่อง</h3><p>{project.treatment}</p></div><div><h3>สิ่งที่ทีมดูแล</h3><ul>{project.services.map(s=><li key={s}>{s}</li>)}</ul></div></div><p className="concept-note">แนวทางการออกแบบ Mood & Tone การตัดต่อ และการเกรดสีเพื่อสร้างการจดจำให้ช่องและแบรนด์</p><a className="photo-credit" href={project.source} target="_blank" rel="noreferrer">ภาพโดย {project.credit} / Unsplash ↗</a></div></div>
  </dialog>;
}
