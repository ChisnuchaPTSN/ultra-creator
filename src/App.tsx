import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown, ChevronUp, ChevronDown, Globe, Check, Info, X, Eye, Film } from 'lucide-react';
import { useVideoScrub } from './useVideoScrub';
import Story from './components/Story';
import Creators from './components/Creators';
import ClientLogos from './components/ClientLogos';
import ShortShowcase from './components/ShortShowcase';
import Work from './components/Work';
import Collective from './components/Collective';
import ProjectDialog from './components/ProjectDialog';
import VideoDialog from './components/VideoDialog';
import FireflyCursor from './components/FireflyCursor';
import Preloader from './components/Preloader';
import ServicesPage from './pages/ServicesPage';
import ArticlesPage from './pages/ArticlesPage';
import ContactPage from './pages/ContactPage';
import { translations, Language } from './i18n';
import { BRAND_LOGOS } from './brandLogos';
import './styles.css';
import './showcase.css';
import './thai.css';

const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
const asset = (p: string) => {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p;
  if (base && p.startsWith(base)) return p;
  return `${base}${p.startsWith('/') ? p : '/' + p}`;
};

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4';

const INTRO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4';

const INTRO_POSTER_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg';

const DARK = '#290f2d';

export type PageType = 'home' | 'services' | 'articles' | 'contact';

const NAV_LINKS = [
  { label: 'หน้าแรก', id: 'home' },
  { label: 'บริการ', id: 'services' },
  { label: 'บทความ', id: 'articles' },
  { label: 'ติดต่อเรา', id: 'contact' },
];

const HERO_BRAND_LOGOS = BRAND_LOGOS;

function StatCounter({ target, suffix = '', duration = 1800, active }: { target: number; suffix?: string; duration?: number; active: boolean }) {
  const [value, setValue] = useState(0);
  const started = React.useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let startTimestamp: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(easeProgress * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, duration]);

  return (
    <span>
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

interface StaggerProps {
  visible: boolean;
  delayMs?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function Stagger({ visible, delayMs = 0, children, className = '', style }: StaggerProps) {
  return (
    <div
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  // Video scrubber configured with scrubRange [0.16, 1.0] for seamless in-place portal transition
  const { containerRef, videoRef, canvasRef, scrollProgress, canvasLive } = useVideoScrub(
    VIDEO_URL,
    [0.16, 1.0]
  );

  const introVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  // Multi-Language State (th, en, zh) with URL query & LocalStorage persistence
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const l = params.get('lang') as Language;
      if (l === 'th' || l === 'en' || l === 'zh') return l;
      const saved = localStorage.getItem('uc_lang') as Language;
      if (saved === 'th' || saved === 'en' || saved === 'zh') return saved;
    }
    return 'th';
  });
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[lang] || translations.th;

  // Deep-link / section scroll handler on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sec = params.get('section');
    if (sec === 's2' || sec === 'platforms') {
      setTimeout(() => {
        const c = containerRef.current;
        if (c) {
          const scrollSpan = c.offsetHeight - window.innerHeight;
          window.scrollTo(0, (0.16 + 0.42 * 0.84) * scrollSpan);
        }
      }, 250);
    } else if (sec === 'story' || sec === 'portfolio') {
      setTimeout(() => {
        const el = document.querySelector('#story');
        if (el) el.scrollIntoView();
      }, 250);
    } else if (sec === 'work' || sec === 'testimonials') {
      setTimeout(() => {
        const el = document.querySelector('#work');
        if (el) el.scrollIntoView();
      }, 250);
    }
  }, [containerRef]);

  // Sync document title and html lang attribute when language changes
  useEffect(() => {
    try {
      localStorage.setItem('uc_lang', lang);
      document.documentElement.lang = lang;
      if (lang === 'en') {
        document.title = 'Ultra Creator · End-to-End Video Production & Content Strategy';
      } else if (lang === 'zh') {
        document.title = 'Ultra Creator · 全案短视频剪辑与内容策略工作室';
      } else {
        document.title = 'Ultra Creator · สตูดิโอตัดต่อวิดีโอและวางแผนคอนเทนต์ครบวงจร';
      }
    } catch {}
  }, [lang]);

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langMenuOpen]);

  const [isSiteLoaded, setIsSiteLoaded] = useState(false);

  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('page');
      if (p === 'services' || p === 'articles' || p === 'contact') return p;
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'services' || hash === 'articles' || hash === 'contact') return hash as any;
      const path = window.location.pathname.replace(/\/$/, '').split('/').pop();
      if (path === 'services' || path === 'articles' || path === 'contact') return path as any;
    }
    return 'home';
  });

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const b = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const newUrl = page === 'home' ? (b ? `${b}/` : '/') : (b ? `${b}/?page=${page}` : `/?page=${page}`);
    window.history.pushState({ page }, '', newUrl);
  };

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.page) {
        setCurrentPage(e.state.page);
      } else {
        const params = new URLSearchParams(window.location.search);
        const p = params.get('page');
        const path = window.location.pathname.replace(/\/$/, '').split('/').pop();
        if (p === 'services' || p === 'articles' || p === 'contact') {
          setCurrentPage(p);
        } else if (path === 'services' || path === 'articles' || path === 'contact') {
          setCurrentPage(path as any);
        } else {
          setCurrentPage('home');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [navMounted, setNavMounted] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  // Modal and motion states for the restored website sections
  const [project, setProject] = useState<any>(null);
  const [clip, setClip] = useState<any>(null);
  const [motion, setMotion] = useState(true);

  // Sync reduced motion preference with intro background video
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const video = introVideoRef.current;
    if (!video) return;
    const sync = () => {
      if (mediaQuery.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    sync();
    mediaQuery.addEventListener?.('change', sync);
    return () => mediaQuery.removeEventListener?.('change', sync);
  }, []);

  // When preloader finishes, play intro video if motion is enabled
  useEffect(() => {
    if (isSiteLoaded && motion) {
      const video = introVideoRef.current;
      if (video) {
        video.play().catch(() => {});
      }
    }
  }, [isSiteLoaded, motion]);

  // Entrance animation for nav links after 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll reveal for section headings (.heading-fade-up)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const observeTargets = () => {
      const targets = document.querySelectorAll('.heading-fade-up');
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    observeTargets();
    const timer = setTimeout(observeTargets, 150);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [currentPage, lang]);

  // Total scroll progress in unified sticky track (0 to 1)
  const p = scrollProgress;

  // Normalized Fly-through progress (0 when in intro, scrubs 0 -> 1 during flythrough)
  const fp = Math.max(0, Math.min(1, (p - 0.16) / 0.84));

  // Track scroll position to update active nav section and navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroContainer = containerRef.current;
      const heroHeight = heroContainer ? heroContainer.offsetHeight : window.innerHeight * 6.2;
      const threshold = heroHeight - window.innerHeight;

      setIsPastHero(scrollY >= threshold * 0.98);

      if (scrollY < threshold * 0.95) {
        setActiveSection('home');
        return;
      }

      const sections = [
        { id: 'collective', selector: '#collective' },
        { id: 'articles', selector: '#work' },
        { id: 'services', selector: '#story' },
      ];

      for (let i = 0; i < sections.length; i++) {
        const item = sections[i];
        const el = document.querySelector(item.selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.50) {
            setActiveSection(item.id);
            return;
          }
        }
      }
      setActiveSection('services');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  // Body overflow hidden when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // ==========================================
  // INTRO PHASE CALCULATIONS (p in [0.0, 0.16])
  // ==========================================
  const introP = Math.min(1, p / 0.16);
  // Gentle, filmic push-in ("ให้ไม่ต้องซูมเข้าไปมาก") - max 1.18x
  const introZoom = 1 + introP * 0.18;

  // Intro text gently dissolves and glides upward with soft optical blur
  const introContentOpacity = p < 0.03 ? 1 : Math.max(0, 1 - (p - 0.03) / 0.07);
  const introTextBlur = p < 0.03 ? 0 : Math.min(8, (p - 0.03) * 35);
  const introTextLift = introP * -28;

  // Organic Ink Vignette Transition
  // Smoothly pools inward from edges to center with blur diffusion
  const inkT = p < 0.04 ? 0 : Math.min(1, (p - 0.04) / 0.10);
  const inkEased = inkT < 0.5 ? 2 * inkT * inkT : 1 - Math.pow(-2 * inkT + 2, 2) / 2;
  const inkRadius = Math.max(0, 85 * (1 - inkEased));
  const inkCenterDarkness = Math.min(1, Math.max(0, (inkT - 0.35) / 0.65));
  const inkBlur = Math.min(16, inkT * 16);
  const inkOpacity = Math.min(1, inkT * 1.15);

  // Check if deep-linked to section 2 directly via URL query
  const isSectionS2Query = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('section') === 's2';

  // Intro portal layer overall opacity (completely hides when in flythrough)
  const introLayerOpacity = isSectionS2Query ? 0 : (p < 0.16 ? 1 : Math.max(0, 1 - (p - 0.16) / 0.04));

  // ===============================================
  // FLY-THROUGH PHASE CALCULATIONS (fp in [0.0, 1.0])
  // ===============================================
  // Organic Ink Parting / Reveal when entering Fly-through video
  const flythroughInkT = Math.min(1, fp / 0.08);
  const flythroughInkOpacity = isSectionS2Query ? 0 : Math.max(0, 1 - flythroughInkT);
  const flythroughInkRadius = flythroughInkT * 100;
  const flythroughInkBlur = (1 - flythroughInkT) * 12;

  // Staggered Sequential Reveal for Section 1
  // 1. Eyebrow Tag enters at fp: 0.015 -> 0.065
  const s1EyebrowP = Math.max(0, Math.min(1, (fp - 0.015) / 0.05));
  // 2. Headline Line 1 "เปลี่ยนทุกไอเดีย" enters at fp: 0.045 -> 0.10
  const s1H1aP = Math.max(0, Math.min(1, (fp - 0.045) / 0.055));
  // 3. Headline Line 2 "เป็นคอนเทนต์ที่สะกดทุกสายตา" enters at fp: 0.075 -> 0.13
  const s1H1bP = Math.max(0, Math.min(1, (fp - 0.075) / 0.055));
  // 4. Circle Action Button enters at fp: 0.105 -> 0.16
  const s1BtnP = Math.max(0, Math.min(1, (fp - 0.105) / 0.055));
  // Section 1 Exit transition towards Section 2
  const s1Exit = isSectionS2Query ? 0 : (fp < 0.20 ? 1 : Math.max(0, 1 - (fp - 0.20) / 0.08));

  // Section 2 Opacity
  const s2Opacity = isSectionS2Query ? 1 : (
    fp < 0.32
      ? 0
      : fp < 0.40
      ? (fp - 0.32) / 0.08
      : fp < 0.55
      ? 1
      : Math.max(0, 1 - (fp - 0.55) / 0.08)
  );

  // Section 3 Opacity
  const s3Opacity = fp < 0.67 ? 0 : fp < 0.75 ? (fp - 0.67) / 0.08 : 1;

  // Navigation colors
  const isIntro = p < 0.16;
  const isSubpage = currentPage !== 'home';
  const effectiveIsPastHero = isSubpage || isPastHero;
  const isWhite = isSubpage || isIntro || fp > 0.55 || isPastHero;
  const currentNavColor = isSubpage ? '#ffffff' : isWhite ? '#ffffff' : DARK;

  const scrollToFlythrough = (targetFp: number) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollSpan = container.offsetHeight - window.innerHeight;
    const targetP = 0.16 + targetFp * 0.84;
    window.scrollTo({
      top: targetP * scrollSpan,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    navigateTo(id as PageType);
  };

  return (
    <div className="relative min-h-screen bg-[#18081a] text-[#f5f3f7] selection:bg-purple-600 selection:text-white">
      {/* Skip Link for Accessibility */}
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage !== 'home') navigateTo('home');
          setTimeout(() => {
            const el = document.querySelector('#story');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      >
        {t.common?.skipToContent || 'ข้ามไปดูเนื้อหา'}
      </a>

      {/* FIXED NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          effectiveIsPastHero
            ? 'bg-[#18081a]/95 backdrop-blur-md shadow-2xl border-b border-purple-300/15 py-4 px-6 sm:px-8 md:px-12'
            : 'bg-transparent pt-8 sm:pt-12 pb-6 px-6 sm:px-8 md:px-12'
        } flex items-center justify-between`}
      >
        {/* Desktop Left Cluster */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-9">
          {/* Brand Wordmark Button to Home */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 font-['Prompt',sans-serif] text-sm sm:text-base font-normal tracking-[0.18em] uppercase text-white hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-0 p-0 mr-4 group"
          >
            <img
              src={asset('/brand/uc-logo-white.png')}
              alt="Ultra Creator Logo"
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-semibold tracking-[0.22em] text-white">ULTRA CREATOR</span>
          </button>

          {[
            { label: t.nav.home, id: 'home' },
            { label: t.nav.services, id: 'services' },
            { label: t.nav.articles, id: 'articles' },
            { label: t.nav.contact, id: 'contact' },
          ].map((link, idx) => {
            const isActive = link.id === currentPage;
            return (
              <button
                key={link.id}
                type="button"
                onClick={(e) => handleNavClick(e, link.id)}
                className="relative text-xs tracking-[0.14em] uppercase font-medium hover:opacity-70 transition-all cursor-pointer bg-transparent border-0 p-0"
                style={{
                  color: currentNavColor,
                  opacity: navMounted ? 1 : 0,
                  transform: navMounted ? 'translateY(0)' : 'translateY(-12px)',
                  transition: `color 500ms, opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${
                    idx * 70 + 100
                  }ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 70 + 100}ms`,
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-3 left-0 w-full h-[2px] transition-colors duration-500"
                    style={{ backgroundColor: currentNavColor }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Left: Hamburger + Brand Logo (<lg) */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex flex-col justify-center items-start gap-[5px] p-2 -ml-2 cursor-pointer focus:outline-none"
            aria-label="เปิดเมนู"
          >
            <span
              className="w-6 h-[2px] transition-colors duration-500"
              style={{ backgroundColor: currentNavColor }}
            />
            <span
              className="w-6 h-[2px] transition-colors duration-500"
              style={{ backgroundColor: currentNavColor }}
            />
            <span
              className="w-4 h-[2px] transition-colors duration-500"
              style={{ backgroundColor: currentNavColor }}
            />
          </button>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
          >
            <img
              src={asset('/brand/uc-logo-white.png')}
              alt="Ultra Creator Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white">ULTRA CREATOR</span>
          </button>
        </div>

        {/* Right Cluster: Language Switcher & Menu */}
        <div
          className="flex items-center gap-3 sm:gap-5"
          style={{
            opacity: navMounted ? 1 : 0,
            transform: navMounted ? 'translateY(0)' : 'translateY(-12px)',
            transition:
              'color 500ms, opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms',
          }}
        >
          {/* Language Switcher Dropdown (Replaces "บริการ" as requested) */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="lang-switcher-btn"
              style={{
                color: currentNavColor,
                borderColor: effectiveIsPastHero ? 'rgba(255, 255, 255, 0.28)' : `${currentNavColor}4D`,
              }}
              aria-label="เปลี่ยนภาษา / Switch Language"
              aria-expanded={langMenuOpen}
            >
              <Globe size={13} style={{ color: currentNavColor }} />
              <span className="font-semibold tracking-wider">{lang.toUpperCase()}</span>
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`}
                style={{ color: currentNavColor }}
              />
            </button>

            {langMenuOpen && (
              <div className="lang-dropdown-menu">
                <button
                  type="button"
                  onClick={() => {
                    setLang('th');
                    setLangMenuOpen(false);
                  }}
                  className={`lang-option-item ${lang === 'th' ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-2">🇹🇭 <span>ไทย (TH)</span></span>
                  {lang === 'th' && <Check size={13} className="text-purple-300" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang('en');
                    setLangMenuOpen(false);
                  }}
                  className={`lang-option-item ${lang === 'en' ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-2">🇬🇧 <span>English (EN)</span></span>
                  {lang === 'en' && <Check size={13} className="text-purple-300" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLang('zh');
                    setLangMenuOpen(false);
                  }}
                  className={`lang-option-item ${lang === 'zh' ? 'active' : ''}`}
                >
                  <span className="flex items-center gap-2">🇨🇳 <span>中文 (ZH)</span></span>
                  {lang === 'zh' && <Check size={13} className="text-purple-300" />}
                </button>
              </div>
            )}
          </div>

          {/* MENU button for mobile / label for desktop */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-xs tracking-[0.15em] font-medium hover:opacity-70 transition-colors duration-500 cursor-pointer"
            style={{ color: currentNavColor }}
          >
            {t.nav.menu}
          </button>
          <span
            className="hidden lg:inline text-xs tracking-[0.15em] font-medium transition-colors duration-500 select-none"
            style={{ color: currentNavColor }}
          >
            {t.nav.menu}
          </span>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* UNIFIED CINEMATIC HERO (Single Sticky Viewport: Only on Home Page)        */}
      {/* ========================================================================= */}
      {currentPage === 'home' && (
      <div ref={containerRef} id="home" className="relative h-[620vh] w-full bg-[#100412]">
        {/* Unified Sticky Viewport: Remains permanently at top:0 during entire 520vh scroll */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          {/* 1) LOWER LAYER: Fly-Through Video Background & Canvas */}
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />

          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
              canvasLive ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />

          {/* 2) FLY-THROUGH SEQUENTIAL TEXT OVERLAYS */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* SECTION 1: Prompt font headings & refreshed copy */}
            <section
              className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-20 lg:px-32"
              style={{
                opacity: s1Exit,
                transition: 'opacity 0.1s ease-out',
                pointerEvents: s1Exit > 0.1 ? 'auto' : 'none',
                visibility: s1Exit > 0 ? 'visible' : 'hidden',
              }}
            >
              <div className="max-w-5xl text-left">
                {/* 1. Eyebrow */}
                <div
                  style={{
                    opacity: s1EyebrowP,
                    transform: `translateY(${(1 - s1EyebrowP) * 18}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
                  }}
                  className="mb-4"
                >
                  <p
                    className="text-sm tracking-[0.15em] font-medium"
                    style={{ color: `${DARK}E6` }}
                  >
                    {t.flythrough.s1Eyebrow}
                  </p>
                </div>

                {/* 2. Headline */}
                <div
                  style={{
                    opacity: s1H1aP,
                    transform: `translateY(${(1 - s1H1aP) * 26}px)`,
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out',
                  }}
                >
                  <h1
                    className="font-['Prompt',sans-serif] font-light leading-[1.2]"
                    style={{
                      fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
                      color: DARK,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {t.flythrough.s1Head}
                  </h1>
                </div>

                {/* 3. Supporting sub-line */}
                <div
                  style={{
                    opacity: s1H1bP,
                    transform: `translateY(${(1 - s1H1bP) * 26}px)`,
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out',
                  }}
                  className="mt-3"
                >
                  <p
                    className="font-['Prompt',sans-serif] font-light"
                    style={{
                      fontSize: 'clamp(1.15rem, 2.2vw, 1.85rem)',
                      color: `${DARK}D9`,
                      lineHeight: 1.5,
                    }}
                  >
                    {t.flythrough.s1Sub}
                  </p>
                </div>
              </div>

              {/* 4. Bottom-right 48px circle button */}
              <div
                className="absolute bottom-12 right-6 sm:right-8 md:right-12"
                style={{
                  opacity: s1BtnP,
                  transform: `scale(${0.85 + s1BtnP * 0.15}) translateY(${(1 - s1BtnP) * 16}px)`,
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out',
                }}
              >
                <button
                  type="button"
                  onClick={() => scrollToFlythrough(0.45)}
                  className="w-12 h-12 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer shadow-sm"
                  style={{ borderColor: `${DARK}80` }}
                  aria-label="เลื่อนดูส่วนถัดไป"
                >
                  <ArrowRight size={18} style={{ color: DARK }} />
                </button>
              </div>
            </section>

            {/* SECTION 2 (center): 3 Platform Cards (Single column on mobile, 3 cols on desktop) */}
            <section
              className="absolute inset-0 flex items-center justify-center px-4 sm:px-8"
              style={{
                opacity: s2Opacity,
                transition: 'opacity 0.1s ease-out',
                pointerEvents: s2Opacity > 0 ? 'auto' : 'none',
                visibility: s2Opacity > 0 ? 'visible' : 'hidden',
              }}
            >
              <div className="max-w-2xl text-center w-full">
                {/* 3 Luxury Glass Cards: TikTok, Instagram, Facebook */}
                <Stagger visible={s2Opacity > 0.25} delayMs={50}>
                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3.5 sm:gap-6 w-full max-w-sm sm:max-w-2xl mx-auto">
                    {/* 1. TikTok */}
                    <div className="platform-stat-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:text-center sm:aspect-square">
                      <div className="platform-icon-wrap">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.86-4.47V8.71a8.19 8.19 0 0 0 4.91 1.63V6.89a4.83 4.83 0 0 1-1-.2z" />
                        </svg>
                      </div>
                      <div className="text-left sm:text-center flex-1 sm:flex-initial px-4 sm:px-0 sm:my-2">
                        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#290f2d]">
                          TikTok
                        </p>
                        <p className="text-[11px] sm:text-xs text-[#290f2d]/70">
                          {t.flythrough.viewsLabel}
                        </p>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#290f2d] font-variant-numeric tabular-nums tracking-tight">
                          <StatCounter target={120000000} suffix="+" active={s2Opacity > 0.25} />
                        </p>
                      </div>
                    </div>

                    {/* 2. Instagram */}
                    <div className="platform-stat-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:text-center sm:aspect-square">
                      <div className="platform-icon-wrap">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 stroke-current fill-none text-white" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                      <div className="text-left sm:text-center flex-1 sm:flex-initial px-4 sm:px-0 sm:my-2">
                        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#290f2d]">
                          Instagram
                        </p>
                        <p className="text-[11px] sm:text-xs text-[#290f2d]/70">
                          {t.flythrough.viewsLabel}
                        </p>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#290f2d] font-variant-numeric tabular-nums tracking-tight">
                          <StatCounter target={50000000} suffix="+" active={s2Opacity > 0.25} />
                        </p>
                      </div>
                    </div>

                    {/* 3. Facebook */}
                    <div className="platform-stat-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-row sm:flex-col justify-between items-center sm:text-center sm:aspect-square">
                      <div className="platform-icon-wrap">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <div className="text-left sm:text-center flex-1 sm:flex-initial px-4 sm:px-0 sm:my-2">
                        <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#290f2d]">
                          Facebook
                        </p>
                        <p className="text-[11px] sm:text-xs text-[#290f2d]/70">
                          {t.flythrough.viewsLabel}
                        </p>
                      </div>
                      <div className="text-right sm:text-center">
                        <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#290f2d] font-variant-numeric tabular-nums tracking-tight">
                          <StatCounter target={30000000} suffix="+" active={s2Opacity > 0.25} />
                        </p>
                      </div>
                    </div>
                  </div>
                </Stagger>
              </div>

              {/* Right column: ArrowDown, 3 dots, ChevronUp */}
              <div className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4">
                <Stagger visible={s2Opacity > 0.3} delayMs={200}>
                  <button
                    type="button"
                    onClick={() => scrollToFlythrough(0.85)}
                    className="w-12 h-12 rounded-full border flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                    style={{ borderColor: `${DARK}66` }}
                    aria-label="เลื่อนดูส่วนถัดไป"
                  >
                    <ArrowDown size={18} style={{ color: DARK }} />
                  </button>
                </Stagger>

                <Stagger visible={s2Opacity > 0.3} delayMs={350}>
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DARK }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                  </div>
                </Stagger>

                <Stagger visible={s2Opacity > 0.3} delayMs={500}>
                  <button
                    type="button"
                    onClick={() => scrollToFlythrough(0.0)}
                    className="w-10 h-10 rounded-full border flex items-center justify-center mt-2 hover:opacity-70 transition-opacity cursor-pointer"
                    style={{ borderColor: `${DARK}4D` }}
                    aria-label="กลับสู่ด้านบน"
                  >
                    <ChevronUp size={16} style={{ color: `${DARK}CC` }} />
                  </button>
                </Stagger>
              </div>
            </section>

            {/* SECTION 3 (right aligned) - Animated Statistics (Item 8) */}
            <section
              className="absolute inset-0 flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32"
              style={{
                opacity: s3Opacity,
                transition: 'opacity 0.1s ease-out',
                pointerEvents: s3Opacity > 0 ? 'auto' : 'none',
                visibility: s3Opacity > 0 ? 'visible' : 'hidden',
              }}
            >
              <div className="max-w-2xl text-left drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
                <Stagger visible={s3Opacity > 0.3} delayMs={0}>
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-300/30 backdrop-blur-md mb-4 shadow-lg shadow-purple-950/40">
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                    <p className="text-purple-200 text-xs sm:text-sm tracking-[0.2em] font-medium uppercase">
                      {t.flythrough.s3Eyebrow}
                    </p>
                  </div>
                  <h2
                    className="font-['Prompt'] font-light text-white leading-[1.25] mb-8 supertext-title"
                    style={{
                      fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
                      textShadow: '0 2px 24px rgba(0, 0, 0, 0.95), 0 0 35px rgba(25, 8, 30, 0.9)',
                    }}
                  >
                    {t.flythrough.s3Title}
                  </h2>
                </Stagger>

                {/* Enhanced Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <Stagger visible={s3Opacity > 0.3} delayMs={100}>
                    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-900/35 via-purple-950/25 to-[#1c0822]/40 border border-purple-300/20 backdrop-blur-xl shadow-2xl shadow-black/60 hover:border-purple-300/40 transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/25 border border-purple-300/30 flex items-center justify-center shrink-0 mb-4 shadow-lg shadow-purple-950/60 group-hover:scale-110 transition-transform">
                        <Eye className="w-6 h-6 text-purple-200" />
                      </div>
                      <p className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight font-variant-numeric tabular-nums bg-gradient-to-r from-white via-purple-100 to-fuchsia-200 bg-clip-text text-transparent">
                        <StatCounter target={200000000} suffix="+" active={s3Opacity > 0.3} />
                      </p>
                      <p className="text-sm sm:text-base text-purple-200 font-medium mt-2">
                        {t.flythrough.s3ViewsLabel}
                      </p>
                      <p className="text-xs text-purple-200/60 mt-1 leading-relaxed">
                        {t.flythrough.s3ViewsSub}
                      </p>
                    </div>
                  </Stagger>

                  <Stagger visible={s3Opacity > 0.3} delayMs={200}>
                    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-900/35 via-purple-950/25 to-[#1c0822]/40 border border-purple-300/20 backdrop-blur-xl shadow-2xl shadow-black/60 hover:border-purple-300/40 transition-all duration-300 group">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/25 border border-purple-300/30 flex items-center justify-center shrink-0 mb-4 shadow-lg shadow-purple-950/60 group-hover:scale-110 transition-transform">
                        <Film className="w-6 h-6 text-purple-200" />
                      </div>
                      <p className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight font-variant-numeric tabular-nums bg-gradient-to-r from-white via-purple-100 to-fuchsia-200 bg-clip-text text-transparent">
                        <StatCounter target={2000} suffix="+" active={s3Opacity > 0.3} />
                      </p>
                      <p className="text-sm sm:text-base text-purple-200 font-medium mt-2">
                        {t.flythrough.s3VideosLabel}
                      </p>
                      <p className="text-xs text-purple-200/60 mt-1 leading-relaxed">
                        {t.flythrough.s3VideosSub}
                      </p>
                    </div>
                  </Stagger>
                </div>
              </div>
            </section>
          </div>

          {/* 3) ORGANIC INK PARTING OVERLAY (Unveils flythrough from center outwards) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-15"
            style={{
              opacity: flythroughInkOpacity,
              background: `radial-gradient(circle at 50% 50%, transparent ${flythroughInkRadius}%, rgba(16, 4, 18, 0.98) 100%)`,
              backdropFilter: `blur(${flythroughInkBlur}px)`,
              WebkitBackdropFilter: `blur(${flythroughInkBlur}px)`,
            }}
            aria-hidden="true"
          />

          {/* 4) UPPER LAYER: Intro Light Matrix Hero (Active during p: 0.0 -> 0.16) */}
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center"
            style={{
              opacity: introLayerOpacity,
              visibility: introLayerOpacity > 0 ? 'visible' : 'hidden',
              pointerEvents: introLayerOpacity > 0.4 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out',
            }}
          >
            {/* Background Looping Light-Painting Video */}
            <video
              ref={introVideoRef}
              src={INTRO_VIDEO_URL}
              poster={INTRO_POSTER_URL}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover origin-center will-change-transform pointer-events-none"
              style={{
                transform: `scale(${introZoom})`,
              }}
            />

            {/* Atmospheric Ambient Veil */}
            <div className="intro-veil" />

            {/* Central Intro Content: No overlapping badge, single-line luxury title, direct CTA */}
            <div
              className="relative z-10 max-w-5xl px-6 text-center flex flex-col items-center select-none will-change-transform"
              style={{
                opacity: introContentOpacity,
                transform: `translateY(${introTextLift}px) scale(${1 + introP * 0.03})`,
                filter: `blur(${introTextBlur}px)`,
                pointerEvents: introContentOpacity > 0.1 ? 'auto' : 'none',
                visibility: introContentOpacity > 0 ? 'visible' : 'hidden',
                transition: 'opacity 0.15s ease-out',
              }}
            >
              {/* Central Title: Luxury Serif Cormorant Garamond, Single Line */}
              <h1
                className="font-['Cormorant_Garamond',serif] text-white font-light uppercase tracking-[0.14em] leading-[1.05] mb-5 select-none whitespace-nowrap"
                style={{
                  fontSize: 'clamp(2.1rem, 5.8vw, 4.8rem)',
                  textShadow: '0 0 60px rgba(255, 255, 255, 0.3), 0 2px 25px rgba(0, 0, 0, 0.95)',
                  letterSpacing: '0.14em',
                }}
              >
                ULTRA CREATOR
              </h1>

              {/* Subtitle */}
              <p
                className="font-['Prompt'] text-purple-100/90 font-light tracking-wide leading-relaxed mb-4 max-w-xl hero-tagline"
                style={{
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.45rem)',
                  textShadow: '0 2px 14px rgba(0, 0, 0, 0.9)',
                }}
              >
                {t.hero.tagline}
              </p>

              <p className="text-white/60 text-[10px] sm:text-xs tracking-[0.12em] uppercase font-light mb-8 w-full max-w-[310px] sm:max-w-xl leading-relaxed text-center break-words">
                {t.hero.sub}
              </p>

              {/* CTA Glass Button: Scrolls directly to Creators portfolio cards */}
              <button
                type="button"
                onClick={() => {
                  const el = document.querySelector('#creators');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="intro-cta group cursor-pointer"
                aria-label={t.hero.cta}
              >
                <span>{t.hero.cta}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Compact Horizontal Scrolling Logo Showcase Section (Item 1) */}
              <div className="mt-8 sm:mt-10 w-full max-w-[450px] mx-auto px-2">
                <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-purple-200/60 mb-3 font-medium text-center">
                  {t.hero.trustedBrands}
                </p>
                <div className="hero-logo-showcase-window" aria-label="โลโก้พาร์ทเนอร์">
                  <div className="hero-logo-showcase-belt">
                    {[0, 1].map((copy) => (
                      <div key={copy} className="hero-logo-showcase-group" aria-hidden={copy === 1}>
                        {HERO_BRAND_LOGOS.map((brand, bIdx) => (
                          <div key={`${copy}-${bIdx}`} className="hero-logo-badge group">
                            {brand.logo ? (
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="hero-logo-badge-img"
                                loading="lazy"
                              />
                            ) : (
                              <div className="hero-logo-text-badge">
                                <span className="hero-logo-badge-mark text-purple-500 font-bold">{brand.mark}</span>
                                <span className="hero-logo-badge-name">{brand.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Organic Ink Vignette: Pools from perimeter inward to center flare */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-20"
              style={{
                opacity: inkOpacity,
                background: `radial-gradient(circle at 50% 50%, rgba(16, 4, 18, ${inkCenterDarkness}) ${inkRadius}%, rgba(16, 4, 18, 0.98) 100%)`,
                backdropFilter: `blur(${inkBlur}px)`,
                WebkitBackdropFilter: `blur(${inkBlur}px)`,
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      )}

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-[100] bg-[#18081a] flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div
          className={`flex flex-col h-full justify-between transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            menuOpen ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          {/* Header in mobile menu: Logo + Close button */}
          <div className="flex items-center justify-between px-6 sm:px-8 pt-8 sm:pt-12">
            <div className="flex items-center gap-3">
              <img
                src={asset('/brand/uc-logo-white.png')}
                alt="Ultra Creator"
                className="w-8 h-8 object-contain"
              />
              <span className="text-sm tracking-[0.22em] font-semibold text-white">ULTRA CREATOR</span>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white transition-colors cursor-pointer"
              aria-label="ปิดเมนู"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {/* Links centered vertically */}
          <div className="flex flex-col justify-center px-8 sm:px-12 py-4">
            {[
              { label: t.nav.home, id: 'home' },
              { label: t.nav.services, id: 'services' },
              { label: t.nav.articles, id: 'articles' },
              { label: t.nav.contact, id: 'contact' },
            ].map((link, idx) => {
              const isActive = link.id === currentPage;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => navigateTo(link.id as any)}
                  className={`py-3 text-2xl sm:text-3xl font-light tracking-wide transition-all duration-500 cursor-pointer bg-transparent border-0 p-0 text-left ${
                    isActive ? 'text-white font-normal' : 'text-white/60 hover:text-white'
                  }`}
                  style={{
                    transitionDelay: `${idx * 60}ms`,
                    transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                    opacity: menuOpen ? 1 : 0,
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Language Switcher Pills */}
          <div className="flex items-center gap-2 px-8 sm:px-12 py-3 border-t border-b border-white/10">
            <span className="text-xs uppercase tracking-wider text-white/50 mr-2 flex items-center gap-1.5">
              <Globe size={13} />
              <span>Language:</span>
            </span>
            <div className="inline-flex rounded-full bg-white/10 p-1 border border-white/15">
              {(['th', 'en', 'zh'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    lang === l ? 'bg-purple-600 text-white shadow-md' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Footer: SERVICES and CONTACT */}
          <div className="px-8 sm:px-12 pb-10 flex items-center gap-8 text-xs tracking-[0.15em] font-medium text-white/60">
            <button
              type="button"
              onClick={() => navigateTo('services')}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              {t.nav.services}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE CONTENT ROUTING: Home vs Services vs Articles vs Contact             */}
      {/* ========================================================================= */}
      {currentPage === 'home' && (
        <main id="main-content" className="relative z-10 w-full bg-[#18081a]">
          {/* 01 / พอร์ตโฟลิโอและความสำเร็จ: Portfolio & Achievements Showcase */}
          <Story t={t} />

          {/* 02 / คนที่เราเล่าเรื่องไปด้วยกัน: Creators Showcase Carousel with Refined Glass Cards & Bottom Fade */}
          <Creators motion={motion} onOpen={setClip} t={t} />

          {/* แบรนด์ที่เติบโตไปด้วยกัน: Client Partner Logos Belt (Full width, no pause on hover) */}
          <ClientLogos motion={motion} t={t} />

          {/* 03 / คลิปสั้น เล่าได้มากกว่า: Short Video Showcase Reel (Auto-slide enabled + manual controls) */}
          <ShortShowcase motion={motion} onOpen={setClip} t={t} />

          {/* 04 / เสียงจากผู้ร่วมงานจริง: Testimonial Video Section (Vertical Layout) */}
          <Work onSelect={setProject} onOpen={setClip} motion={motion} t={t} />

          {/* 05 / ทีมงานและบริการ: Collective Team, Disciplines, Contact & Footer */}
          <Collective t={t} />
        </main>
      )}

      {currentPage === 'services' && (
        <main id="main-content" className="relative z-10 w-full bg-[#18081a]">
          <ServicesPage onNavigateContact={() => navigateTo('contact')} t={t} />
          <Collective t={t} />
        </main>
      )}

      {currentPage === 'articles' && (
        <main id="main-content" className="relative z-10 w-full bg-[#18081a]">
          <ArticlesPage t={t} lang={lang} />
          <Collective t={t} />
        </main>
      )}

      {currentPage === 'contact' && (
        <main id="main-content" className="relative z-10 w-full bg-[#18081a]">
          <ContactPage t={t} lang={lang} />
          <Collective t={t} />
        </main>
      )}

      {/* FLOATING MOTION TOGGLE CONTROL */}
      <button
        className="motion-toggle"
        aria-pressed={motion}
        onClick={() => setMotion(!motion)}
        title={t.common?.motionToggleTitle || 'สลับแอนิเมชัน'}
      >
        <span aria-hidden="true">{motion ? 'Ⅱ' : '▷'}</span> {motion ? (t.common?.motionOn || 'แอนิเมชัน เปิด') : (t.common?.motionOff || 'แอนิเมชัน ปิด')}
      </button>

      {/* INTERACTIVE MODALS */}
      <ProjectDialog project={project} onClose={() => setProject(null)} />
      <VideoDialog clip={clip} onClose={() => setClip(null)} t={t} />

      {/* ATMOSPHERIC PARTICLE CURSOR */}
      <FireflyCursor enabled={motion && !project && !clip} />

      {/* CINEMATIC PRELOADER SCREEN */}
      <Preloader onComplete={() => setIsSiteLoaded(true)} lang={lang} />
    </div>
  );
}
