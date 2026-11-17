import React from 'react';
import { Eye, Film, Sparkles } from 'lucide-react';
import { BRAND_LOGOS } from '../brandLogos';

// 26 Brand partners arranged cleanly in 4 staggered floating rows (7, 6, 7, 6)
const row1Logos = BRAND_LOGOS.slice(0, 7);
const row2Logos = BRAND_LOGOS.slice(7, 13);
const row3Logos = BRAND_LOGOS.slice(13, 20);
const row4Logos = BRAND_LOGOS.slice(20, 26);

export default function Story({ t }) {
  const p = t?.portfolio;
  const achievements = [
    {
      icon: Eye,
      number: p?.viewsNumber || '300,000,000+',
      label: p?.viewsLabel || 'ยอดวิวกว่า 300 ล้านวิว',
      tag: p?.viewsTag || 'ORGANIC REACH & ENGAGEMENT',
      detail: p?.viewsDetail || 'ยอดการรับชมรวมของคอนเทนต์ที่สร้างยอด Engagement และเข้าถึงกลุ่มเป้าหมายอย่างแม่นยำบนทุกแพลตฟอร์ม',
    },
    {
      icon: Film,
      number: p?.vidsNumber || '1,000+',
      label: p?.vidsLabel || 'ผลิตวิดีโอมากกว่า 1,000 คลิป',
      tag: p?.vidsTag || 'SHORTS, REELS & LONG-FORM',
      detail: p?.vidsDetail || 'ครอบคลุมทั้งคลิปสั้น TikTok, Instagram Reels, YouTube Shorts และผลงานโปรดักชันระดับพรีเมียม',
    },
    {
      icon: Sparkles,
      number: p?.expNumber || '5 ปี',
      label: p?.expLabel || 'ประสบการณ์กว่า 5 ปี',
      tag: p?.expTag || 'PROFESSIONAL STORYTELLING',
      detail: p?.expDetail || 'ทีมงานมืออาชีพผู้อยู่เบื้องหลังการวางกลยุทธ์ การเล่าเรื่อง และการเติบโตอย่างยั่งยืนของหลากหลายช่องดัง',
    },
  ];

  const rows = [
    { items: row1Logos, rowClass: 'row-seven', offset: 0 },
    { items: row2Logos, rowClass: 'row-six', offset: 0.6 },
    { items: row3Logos, rowClass: 'row-seven', offset: 1.1 },
    { items: row4Logos, rowClass: 'row-six', offset: 1.6 },
  ];

  return (
    <section className="portfolio-showcase-section section" id="story" aria-labelledby="portfolio-title">
      <div className="portfolio-showcase-container">
        {/* Section Heading */}
        <div className="section-heading mb-12 sm:mb-16">
          <div>
            <p className="eyebrow">{p?.eyebrow || '01 / พอร์ตโฟลิโอและความสำเร็จ'}</p>
            <h2 id="portfolio-title" className="supertext-title heading-fade-up">
              {p?.title || 'ผลงานที่พิสูจน์ด้วย'}{' '}
              <em className="supertext-em">{p?.titleEm || 'ผลลัพธ์จริง'}</em>
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            {p?.sub || 'เบื้องหลังการเติบโตของครีเอเตอร์และแบรนด์ชั้นนำ ด้วยพลังแห่งการเล่าเรื่องและการตัดต่อคุณภาพสูง'}
          </p>
        </div>

        {/* Two-Column Layout (Balanced left-right) */}
        <div className="portfolio-equal-grid">
          {/* Left Side: Floating Brand Logos */}
          <div className="portfolio-floating-brands-side">
            <div className="floating-logos-canvas" aria-label="โลโก้แบรนด์พาร์ทเนอร์">
              {rows.map((r, rIdx) => (
                <div key={rIdx} className={`floating-logos-row ${r.rowClass}`}>
                  {r.items.map((brand, idx) => (
                    <div
                      key={brand.id}
                      className="floating-brand-image-card group"
                      style={{
                        animationDelay: `${r.offset + idx * 0.35}s`,
                        animationDuration: `${3.5 + (idx % 3) * 0.65}s`,
                      }}
                      title={brand.name}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="floating-brand-logo-img"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Ambient aesthetic glow behind logos */}
            <div className="floating-ambient-glow" aria-hidden="true" />
          </div>

          {/* Right Side: Achievements with Icons */}
          <div className="portfolio-open-achievements-side" aria-label="สถิติความสำเร็จ">
            <div className="open-achievements-list">
              {achievements.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.label} className="open-achievement-row group">
                    <div className="achievement-icon-wrapper shrink-0">
                      <IconComponent className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                    </div>

                    <div className="achievement-text-content">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="achievement-big-number font-light tracking-tight text-white font-variant-numeric tabular-nums">
                          {item.number}
                        </span>
                        <span className="text-[11px] font-mono tracking-wider text-purple-300/70 uppercase">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="achievement-title text-base sm:text-lg font-medium text-purple-100/90 mb-1.5">
                        {item.label}
                      </h3>
                      <p className="achievement-description text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
