import { useEffect, useRef } from 'react';
import { clips } from '../showcaseData';
import VideoCard from './VideoCard';

export default function ShortShowcase({ onOpen, motion, t }) {
  const ss = t?.shortsSec;
  const rail = useRef();
  const isHovered = useRef(false);

  const move = (direction) => {
    if (!rail.current) return;
    rail.current.scrollBy({
      left: direction * rail.current.clientWidth * 0.72,
      behavior: motion ? 'smooth' : 'instant',
    });
  };

  // Auto-slide without needing to click buttons
  useEffect(() => {
    if (!motion) return;
    const interval = setInterval(() => {
      const el = rail.current;
      if (!el || isHovered.current) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const step = Math.max(280, el.clientWidth * 0.45);
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3400);

    return () => clearInterval(interval);
  }, [motion]);

  return (
    <section className="shorts-section section" id="shorts" aria-labelledby="shorts-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{ss?.eyebrow || '03 / คลิปสั้น เล่าได้มากกว่า'}</p>
          <h2 id="shorts-title" className="supertext-title heading-fade-up">
            {ss?.title || 'คอนเทนต์ที่อยากให้'}{' '}
            <em className="supertext-em">{ss?.titleEm || 'ดูต่อ'}</em>
          </h2>
        </div>
        <div className="shorts-header-right">
          <p>{ss?.sub || 'รวมไอเดียสำหรับ TikTok, Reels และ Shorts'}</p>
          <div className="shorts-arrows">
            <button type="button" onClick={() => move(-1)} aria-label={ss?.prevAria || 'เลื่อนคลิปไปทางซ้าย'}>
              ←
            </button>
            <button type="button" onClick={() => move(1)} aria-label={ss?.nextAria || 'เลื่อนคลิปไปทางขวา'}>
              →
            </button>
          </div>
        </div>
      </div>
      <div
        ref={rail}
        className="shorts-rail"
        data-lenis-prevent-horizontal
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={() => {
          isHovered.current = false;
        }}
        onTouchStart={() => {
          isHovered.current = true;
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            isHovered.current = false;
          }, 2000);
        }}
      >
        {clips.map((clip) => (
          <VideoCard key={clip.id} clip={clip} onOpen={onOpen} motion={motion} />
        ))}
      </div>
      <p className="demo-caption">ผลงานคลิปสั้นคัดสรร · กดเพื่อรับชมและฟังเสียง</p>
    </section>
  );
}
