import React from 'react';

const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
const asset = (p) => `${base}${p.startsWith('/') ? p : '/' + p}`;

export default function Collective({ t }) {
  const c = t?.collectiveSec;
  return (
    <section className="collective section" id="collective" aria-labelledby="collective-title">
      {/* 05 / One Team, Complete Production */}
      <div className="collective-intro" data-reveal>
        <p className="eyebrow">{c?.eyebrow || '05 / ทีมเดียว ดูแลครบ'}</p>
        <h2 id="collective-title" className="supertext-title heading-fade-up">
          {c?.title || 'เรื่องของคุณ'}<br />
          <em className="supertext-em">{c?.titleEm || 'ให้ทีมเราดูแล'}</em>
        </h2>
        <p>
          {c?.sub || 'ตั้งแต่หาไอเดีย เขียนสคริปต์ จนถึงคลิปพร้อมลง เราทำงานร่วมกับคุณให้ทุกชิ้นมีทิศทาง และสื่อสารในแบบที่แบรนด์เป็น'}
        </p>
      </div>

      {/* Workflow Section Removed per instruction 4 */}

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content-wrap">
          {/* Left Side: Brand and Tagline */}
          <div className="footer-brand-side">
            <a className="wordmark flex items-center gap-3" href="#home">
              <img
                src={asset('/brand/uc-logo-white.png')}
                alt="Ultra Creator Logo"
                className="w-8 h-8 object-contain"
              />
              <span>ULTRA CREATOR</span>
            </a>
            <p className="footer-tagline">{c?.tagline || 'ให้ทุกเรื่องราว เติบโตไปด้วยกัน'}</p>
          </div>

          {/* Right Side: Social Media Logos and Contact Links (Item 6) */}
          <div className="footer-social-side" aria-label="ช่องทางติดต่อและโซเชียลมีเดีย">
            <p className="social-side-title">{c?.socialTitle || 'ติดตามผลงานและติดต่อเรา'}</p>
            <div className="social-links-group">
              {/* TikTok */}
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="ติดต่อทาง TikTok"
              >
                <svg className="social-svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.86-4.47V8.71a8.19 8.19 0 0 0 4.91 1.63V6.89a4.83 4.83 0 0 1-1-.2z" />
                </svg>
                <span>TikTok</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="ติดต่อทาง Instagram"
              >
                <svg className="social-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                aria-label="ติดต่อทาง Facebook"
              >
                <svg className="social-svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Back to top button removed per user request */}

        <div className="footer-meta">
          <span className="inline-flex items-center gap-2">
            <img src={asset('/brand/uc-logo-white.png')} alt="UC" className="w-4 h-4 object-contain opacity-75" />
            © {new Date().getFullYear()} ULTRA CREATOR
          </span>
          <span>สตูดิโอตัดต่อวิดีโอและวางแผนคอนเทนต์ครบวงจร</span>
          <span>คิดเป็นทีม เติบโตไปด้วยกัน</span>
        </div>
      </footer>
    </section>
  );
}
