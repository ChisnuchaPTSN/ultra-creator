import React, { useState } from 'react';
import { BookOpen, Clock, Tag, ArrowRight, X, ChevronRight, Share2, Sparkles } from 'lucide-react';
import { articles, categories } from '../content/articlesData';

function renderArticleContent(text) {
  if (!text) return null;
  const lines = text.trim().split('\n');
  const elements = [];
  let pBuffer = [];

  const flushParagraph = (keyPrefix) => {
    if (pBuffer.length > 0) {
      const fullText = pBuffer.join(' ').trim();
      if (fullText) {
        elements.push(
          <p key={`${keyPrefix}-${elements.length}`} className="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
            {formatInlineText(fullText)}
          </p>
        );
      }
      pBuffer = [];
    }
  };

  function formatInlineText(str) {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-purple-200">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph(idx);
      return;
    }
    if (trimmed.startsWith('### ')) {
      flushParagraph(idx);
      elements.push(
        <h3 key={`h3-${idx}`} className="font-['Prompt',sans-serif] text-lg sm:text-xl font-medium text-purple-100 mt-6 mb-2">
          {formatInlineText(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
    } else if (trimmed.startsWith('#### ')) {
      flushParagraph(idx);
      elements.push(
        <h4 key={`h4-${idx}`} className="font-['Prompt',sans-serif] text-base sm:text-lg font-medium text-purple-300 mt-5 mb-2">
          {formatInlineText(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph(idx);
      elements.push(
        <div key={`li-${idx}`} className="flex items-start gap-2 pl-2 text-slate-200 text-sm sm:text-base leading-relaxed">
          <span className="text-purple-400 font-mono mt-0.5">•</span>
          <div>{formatInlineText(trimmed)}</div>
        </div>
      );
    } else if (trimmed.startsWith('- ')) {
      flushParagraph(idx);
      elements.push(
        <div key={`bullet-${idx}`} className="flex items-start gap-2 pl-2 text-slate-200 text-sm sm:text-base leading-relaxed">
          <span className="text-purple-400 font-mono mt-0.5">•</span>
          <div>{formatInlineText(trimmed.replace(/^-\s+/, ''))}</div>
        </div>
      );
    } else {
      pBuffer.push(trimmed);
    }
  });

  flushParagraph('end');
  return <div className="space-y-3.5">{elements}</div>;
}

export default function ArticlesPage({ t, lang }) {
  const ap = t?.articlesPage;
  const allCatLabel = ap?.allCategory || 'ทั้งหมด';
  const [selectedCategory, setSelectedCategory] = useState(allCatLabel);
  const [activeArticle, setActiveArticle] = useState(null);

  const categoriesList = [
    allCatLabel,
    'Video Editing & Algorithm',
    'Content Strategy',
    'Production & Storytelling',
    'AI Tools & Workflow',
  ];

  const filteredArticles = (selectedCategory === allCatLabel || selectedCategory === 'ทั้งหมด' || selectedCategory === 'All' || selectedCategory === '全部')
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-24 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Header featuring Image 2 reference quote and style */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <p className="eyebrow block mb-4">{ap?.eyebrow || '02 / บทความและกลยุทธ์คอนเทนต์'}</p>
        <h1 className="font-['Prompt',sans-serif] text-xl sm:text-3xl md:text-5xl font-light text-white tracking-wide leading-tight mb-4 supertext-title heading-fade-up">
          {ap?.title}{' '}
          <br className="sm:hidden" />
          <span className="supertext-em">{ap?.titleEm || 'ให้ทีมเราดูแล'}</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-6">
          {ap?.sub || 'ตั้งแต่หาไอเดีย เขียนสคริปต์ จนถึงคลิปพร้อมลง เราคัดสรรสาระและกลยุทธ์เบื้องหลังการเติบโตของช่อง เพื่อให้ทุกชิ้นมีทิศทางและสื่อสารอย่างทรงพลัง'}
        </p>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'bg-purple-950/40 text-purple-200/70 hover:bg-purple-900/40 hover:text-white border border-purple-300/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="article-card-item group relative flex flex-col justify-between rounded-3xl p-7 sm:p-9 transition-all duration-500 cursor-pointer"
            onClick={() => setActiveArticle(article)}
          >
            <div>
              {/* Category & Meta */}
              <div className="flex items-center justify-between mb-4 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 border border-purple-300/20 font-medium">
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400 font-light">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-['Prompt',sans-serif] text-xl sm:text-2xl font-light text-white leading-snug mb-4 group-hover:text-purple-200 transition-colors">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light mb-6">
                {article.excerpt}
              </p>

              {/* SEO Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {article.seoKeywords.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 text-purple-200/60 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Read Full Button */}
            <div className="pt-4 border-t border-purple-300/10 flex items-center justify-between text-xs sm:text-sm text-purple-300 font-medium group-hover:text-white transition-colors">
              <span>{ap?.readFull || 'อ่านบทความฉบับเต็ม'}</span>
              <div className="w-8 h-8 rounded-full bg-purple-900/40 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="article-modal-window relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-10 bg-[#1e0a24] border border-purple-300/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="ปิดบทความ"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider text-purple-300 font-medium">
                {activeArticle.category} · {activeArticle.readTime}
              </span>
              <h2 className="font-['Prompt',sans-serif] text-2xl sm:text-3xl font-light text-white leading-tight mt-2 mb-4">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 pb-6 border-b border-purple-300/15">
                <span>{ap?.publishedOn || 'เผยแพร่เมื่อ'} {activeArticle.date}</span>
                <span>•</span>
                <span>{ap?.authorBy || 'โดย Ultra Creator Editorial Team'}</span>
              </div>
            </div>

            {/* Article Body */}
            <div className="article-body-content text-slate-200 text-sm sm:text-base leading-relaxed font-light">
              {renderArticleContent(activeArticle.content)}
            </div>

            {/* Modal Footer */}
            <div className="mt-10 pt-6 border-t border-purple-300/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {activeArticle.seoKeywords.map((k) => (
                  <span key={k} className="text-xs text-purple-300/70 font-mono">
                    #{k}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
              >
                {ap?.closeModal || 'ปิดหน้าต่าง'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
