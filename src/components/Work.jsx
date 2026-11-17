import React, { useEffect, useRef, useState } from 'react';

const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
const asset = (p) => `${base}${p.startsWith('/') ? p : '/' + p}`;

const testimonials = [
  {
    id: 'test-sol',
    name: 'ทีมผู้บริหาร SOL Dental Studio',
    role: 'คลินิกทันตกรรม & สุขภาพความงาม',
    channel: 'Dental & Healthcare Brand · Verified Partner',
    metric: 'Content ลงสม่ำเสมอทุกวัน',
    stat: 'Reach & ลูกค้าใหม่โตจริง',
    quote: '“หลังจากร่วมงานกับ Ultra Creator พอเรามี Content ลงอย่างต่อเนื่องทุกวัน คนไข้และลูกค้าเห็นช่องเยอะขึ้นชัดเจน ผลลัพธ์โตขึ้นจริง และที่สำคัญคือราคาสมเหตุสมผล คุ้มค่ามากครับ”',
    clip: {
      id: 'testimonial-sol',
      title: 'รีวิวความประทับใจจาก SOL Dental Studio',
      platform: 'TikTok & Reels',
      views: 1850000,
      poster: '/images/posters/testimonial-tc1.jpg',
      src: '/videos/testimonials/tc1.mp4',
      description: 'บทสัมภาษณ์ความประทับใจจริง: ความสำคัญของคอนเทนต์ที่สม่ำเสมอต่อการเติบโตและการเข้าถึงคนไข้ใหม่ของคลินิก โดยทีม Ultra Creator',
    },
  },
  {
    id: 'test-1',
    name: 'คุณพัชรินทร์ (May)',
    role: 'เจ้าของแบรนด์สกินแคร์ & Lifestyle Creator',
    channel: 'TikTok @may.lifestyle · ผู้ติดตาม 450K',
    metric: '+400% ยอดวิวเติบโต',
    stat: '4.2M วิวรวม',
    quote: '“ตั้งแต่ให้ Ultra Creator ดูแลการตัดต่อและวางแผนคอนเทนต์ ยอดวิวโตขึ้นกว่า 400% คลิปไวรัลง่ายขึ้นมาก และทีมงานส่งงานตรงเวลาทุกรอบ ประหยัดเวลาไปได้เยอะมากค่ะ”',
    clip: {
      id: 'testimonial-may',
      title: 'รีวิวจากคุณพัชรินทร์ (แบรนด์สกินแคร์)',
      platform: 'TikTok',
      views: 4200000,
      poster: '/images/forest.jpg',
      src: '/videos/demo-forest.mp4',
      description: 'บทสัมภาษณ์ความประทับใจ: การเติบโตของช่อง TikTok จาก 50K สู่ 450K ผู้ติดตาม ด้วยกลยุทธ์คลิปสั้น',
    },
  },
  {
    id: 'test-2',
    name: 'คุณธนกฤต (Bank)',
    role: 'Tech & Finance Creator',
    channel: 'YouTube Shorts & Reels · ผู้ติดตาม 320K',
    metric: '+85,000 ผู้ติดตามใหม่',
    stat: '1.8M วิวต่อเดือน',
    quote: '“สคริปต์ Hook 3 วินาทีแรกคมมาก ดึงดูดคนดูได้ดีขึ้นชัดเจน จังหวะการเล่าเรื่องและการตัดต่อกระชับ ไม่น่าเบื่อ ทำให้ช่องเติบโตอย่างมั่นคงมากครับ”',
    clip: {
      id: 'testimonial-bank',
      title: 'รีวิวจากคุณธนกฤต (Tech & Finance)',
      platform: 'Shorts',
      views: 1800000,
      poster: '/images/ocean.jpg',
      src: '/videos/demo-nature.mp4',
      description: 'บทสัมภาษณ์ความประทับใจ: การปรับรูปแบบการเล่าเรื่องในคลิปสั้นเพื่อเข้าถึงกลุ่มคนรุ่นใหม่',
    },
  },
  {
    id: 'test-3',
    name: 'คุณณิชาภัทร (Fern)',
    role: 'Food & Travel Vlogger',
    channel: 'Instagram Reels & TikTok · ผู้ติดตาม 600K',
    metric: '+280% Engagement Rate',
    stat: '3.5M วิวสูงสุด',
    quote: '“เกรดสีและซาวด์ดีไซน์ระดับพรีเมียมจริง ๆ คลิปดูแพงขึ้นทันที ลูกค้าและสปอนเซอร์ทักตลอดว่างานดูเหมือนซีรีส์คุณภาพสูง ประทับใจมากค่ะ”',
    clip: {
      id: 'testimonial-fern',
      title: 'รีวิวจากคุณณิชาภัทร (Food & Travel)',
      platform: 'Reels',
      views: 3500000,
      poster: '/images/desert.jpg',
      src: '/videos/demo-forest.mp4',
      description: 'บทสัมภาษณ์ความประทับใจ: เทคนิคการใช้สีและเสียงดนตรีเพื่อยกระดับคลิปอาหารและท่องเที่ยวสู่ระดับพรีเมียม',
    },
  },
  {
    id: 'test-4',
    name: 'คุณศุภกร (Oak)',
    role: 'Founder & SME Business Channel',
    channel: 'Omnichannel Creator · ผู้ติดตาม 280K',
    metric: '50+ คลิปต่อเนื่อง',
    stat: '2.4M วิวสะสม',
    quote: '“ตอบโจทย์คนทำธุรกิจที่อยากสร้างตัวตนบนโลก Social แต่ไม่มีเวลาตัดต่อ ทีมงานเข้าใจอัลกอริทึมของแต่ละแพลตฟอร์มอย่างลึกซึ้ง แนะนำเลยครับ”',
    clip: {
      id: 'testimonial-oak',
      title: 'รีวิวจากคุณศุภกร (Founder & SME)',
      platform: 'TikTok',
      views: 2400000,
      poster: '/images/ocean.jpg',
      src: '/videos/demo-nature.mp4',
      description: 'บทสัมภาษณ์ความประทับใจ: การสร้างตัวตนเจ้าของแบรนด์ให้เข้าถึงใจลูกค้าด้วยคอนเทนต์ที่สม่ำเสมอ',
    },
  },
];

export default function Work({ onSelect, onOpen, motion = true, t }) {
  const ts = t?.testimonialsSec;
  const activeTestimonials = ts?.items && ts.items.length > 0 ? ts.items : testimonials;
  const root = useRef(null);
  const rail = useRef(null);
  const activeRef = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0, isHorizontal: false, isVertical: false });
  const [active, setActive] = useState(0);

  const last = activeTestimonials.length - 1;

  const position = (i) => {
    if (!rail.current) return 0;
    return (i * (rail.current.scrollWidth - rail.current.clientWidth)) / last;
  };

  const select = (i, animate = motion) => {
    i = Math.max(0, Math.min(last, i));
    activeRef.current = i;
    setActive(i);
    if (rail.current) {
      rail.current.scrollTo({ left: position(i), behavior: animate ? 'smooth' : 'instant' });
    }
  };

  // Sync active index on scroll
  const handleScroll = () => {
    if (!rail.current) return;
    const scrollLeft = rail.current.scrollLeft;
    const maxScroll = rail.current.scrollWidth - rail.current.clientWidth;
    if (maxScroll <= 0) return;
    const nearest = Math.round((scrollLeft / maxScroll) * last);
    if (nearest !== activeRef.current && nearest >= 0 && nearest <= last) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  };

  // Touch Swipe Handlers for mobile
  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartRef.current = {
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
      isHorizontal: false,
      isVertical: false,
    };
  };

  const onTouchMove = (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;

    if (!touchStartRef.current.isHorizontal && !touchStartRef.current.isVertical) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        if (Math.abs(dx) >= Math.abs(dy)) {
          touchStartRef.current.isHorizontal = true;
        } else {
          touchStartRef.current.isVertical = true;
        }
      }
    }

    if (touchStartRef.current.isHorizontal) {
      if (e.cancelable) e.preventDefault();
    }
  };

  const onTouchEnd = (e) => {
    if (!touchStartRef.current.isHorizontal) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dt = Date.now() - touchStartRef.current.time;

    if (dx < -35 || (dx < -20 && dt < 300)) {
      select(activeRef.current + 1);
    } else if (dx > 35 || (dx > 20 && dt < 300)) {
      select(activeRef.current - 1);
    }
    touchStartRef.current.isHorizontal = false;
    touchStartRef.current.isVertical = false;
  };

  const handleVideoClick = (item) => {
    const fullClip = {
      ...item.clip,
      poster: asset(item.clip.poster),
      src: asset(item.clip.src),
    };
    if (onOpen) {
      onOpen(fullClip);
    } else if (onSelect) {
      onSelect({
        id: item.clip.id,
        title: item.name,
        category: item.role,
        year: '2026',
        image: asset(item.clip.poster),
        alt: item.name,
        description: item.quote,
        services: [item.metric, item.stat],
        treatment: item.clip.description,
        credit: item.name,
        source: asset(item.clip.src),
      });
    }
  };

  return (
    <section ref={root} className="testimonials-section section" id="work" aria-labelledby="testimonials-title">
      <div className="testimonials-heading-wrap">
        <div className="section-heading mb-8 sm:mb-12">
          <div>
            <p className="eyebrow">{ts?.eyebrow || '04 / เสียงจากผู้ร่วมงานจริง'}</p>
            <h2 id="testimonials-title" className="max-w-2xl supertext-title heading-fade-up">
              {ts?.title || 'ความประทับใจ'}{' '}
              <em className="whitespace-nowrap supertext-em">{ts?.titleEm || 'ที่เติบโตไปด้วยกัน'}</em>
            </h2>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {ts?.sub || 'รีวิวและเสียงตอบรับจากครีเอเตอร์และเจ้าของแบรนด์ตัวจริง ที่ไว้วางใจให้เราเป็นพาร์ทเนอร์ดูแลคอนเทนต์'}
          </p>
        </div>
      </div>

      {/* Testimonials Rail: One card at a time carousel */}
      <div
        className="testimonials-rail"
        ref={rail}
        role="region"
        aria-label={ts?.hint || 'การ์ดรีวิว เลื่อนเพื่อดูทีละท่าน'}
        tabIndex={0}
        onScroll={handleScroll}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            select(activeRef.current + (e.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        <div className="testimonials-track">
          {activeTestimonials.map((item, i) => (
            <article
              key={item.id}
              className={`testimonial-card ${active === i ? 'is-active' : ''}`}
              aria-label={`Testimonial ${item.name} (${i + 1}/${activeTestimonials.length})`}
            >
              {/* Vertical Layout Grid */}
              <div className="testimonial-vertical-layout">
                {/* 1. Left/Primary: Vertical Video Card (9:16) */}
                <div
                  className="testimonial-video-col"
                  onClick={() => handleVideoClick(item)}
                  role="button"
                  tabIndex={active === i ? 0 : -1}
                  aria-label={`Play interview ${item.name}`}
                >
                  <div className="testimonial-video-box">
                    <img
                      src={asset(item.clip.poster)}
                      alt={item.name}
                      className="testimonial-video-poster"
                      loading="lazy"
                    />
                    <div className="testimonial-video-overlay" />
                    <span className="testimonial-platform-tag">{item.clip.platform}</span>

                    {/* Circular Play Button */}
                    <div className="testimonial-play-btn" aria-hidden="true">
                      <span>▶</span>
                    </div>

                    <div className="testimonial-video-caption">
                      <span className="testimonial-video-views">{item.stat}</span>
                      <span className="testimonial-video-tip">{ts?.clickToWatch || 'กดเพื่อดูคลิปรีวิว ↗'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Right/Secondary: Client Info, Verified Badge, Quote & Stats */}
                <div className="testimonial-info-col">
                  <div className="testimonial-header-tag">
                    <span className="testimonial-pill-tag">{ts?.spotlight || 'PARTNER SPOTLIGHT'}</span>
                    <span className="testimonial-status-verified">
                      <svg className="w-3.5 h-3.5 text-purple-300 inline mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      {ts?.verified || 'Verified Creator Collaboration'}
                    </span>
                  </div>

                  <h3 className="testimonial-name">{item.name}</h3>
                  <p className="testimonial-role">{item.role}</p>
                  <p className="testimonial-channel">{item.channel}</p>

                  <blockquote className="testimonial-quote">
                    {item.quote}
                  </blockquote>

                  <div className="testimonial-metrics-box">
                    <div className="metric-pill">
                      <span className="metric-dot" />
                      <span className="metric-text">{item.metric}</span>
                    </div>
                    <span className="metric-sub">{item.stat}</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card-foot">
                <span>{ts?.footerLabel || 'ความประทับใจจากพาร์ทเนอร์'}</span>
                <span>0{i + 1} / 0{activeTestimonials.length}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Controls: Prev/Next & Dots matching Section 02 */}
      <div className="creator-controls mt-8">
        <button
          type="button"
          onClick={() => select(activeRef.current - 1)}
          disabled={active === 0}
          aria-label={ts?.prevLabel || 'รีวิวก่อนหน้า'}
        >
          ←
        </button>
        <div className="creator-dots">
          {activeTestimonials.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => select(i)}
              aria-label={`ดูรีวิว ${c.name}`}
              aria-current={active === i ? 'true' : undefined}
            >
              <span />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => select(activeRef.current + 1)}
          disabled={active === last}
          aria-label={ts?.nextLabel || 'รีวิวถัดไป'}
        >
          →
        </button>
      </div>

      <p className="creator-hint">{ts?.hint || 'ลากด้วยเมาส์ หรือปัดซ้าย–ขวา เพื่อดูทีละคน'}</p>
    </section>
  );
}
