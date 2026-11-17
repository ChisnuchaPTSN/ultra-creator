import React, { useState } from 'react';
import { BookOpen, Clock, Tag, ArrowRight, X, ChevronRight, Share2, Sparkles } from 'lucide-react';

const articles = [
  {
    id: 'hook-technique-3s',
    category: 'Video Editing & Algorithm',
    readTime: '5 นาที',
    date: '9 พ.ย. 2026',
    title: '5 เทคนิคตัดต่อคลิปสั้น (TikTok & Reels) ให้คนหยุดดูตั้งแต่ 3 วินาทีแรก',
    seoKeywords: ['ตัดต่อคลิปสั้น', 'เทคนิค Hook 3 วิ', 'เพิ่มยอดวิว TikTok', 'Reels Algorithm'],
    excerpt: 'ทำไมคนถึงปัดผ่านคลิปของคุณ? เจาะลึกจิตวิทยา Hook 3 วินาทีแรก เทคนิคการตัดต่อแบบ Pattern Interrupt และการใช้ Sound FX ดึงสายตาให้อยู่จนจบ',
    content: `
### ปัญหาใหญ่ที่สุดของครีเอเตอร์ยุคนี้ ไม่ใช่เนื้อหาไม่ดี แต่คือ "คนดูไม่อยู่รอ"
ในโลกที่คนเลื่อนฟีดวันละหลายร้อยคลิป สมองของผู้ชมจะตัดสินใจภายใน **1.5 ถึง 3 วินาทีแรก** ว่าจะหยุดดูหรือปัดผ่าน นี่คือ 5 เทคนิคที่ทีมตัดต่อ Ultra Creator ใช้กับทุกคลิปที่สร้างยอดวิวระดับล้าน:

#### 1. Pattern Interrupt (ขัดจังหวะการรับรู้ทันที)
อย่าเปิดคลิปด้วยคำทักทายทั่วไปอย่าง "สวัสดีครับ วันนี้เราจะมา..." แต่ให้เริ่มด้วย:
- **คำถามที่แทงใจดำ** หรือปัญหาที่คนดูกำลังเจอ
- **ภาพ Movement รวดเร็ว** หรือการซูมกระชาก (Crash Zoom)
- **ประโยคขัดแย้งที่ชวนสงสัย** (Curiosity Gap) เช่น "สิ่งนี้อาจทำให้คลิปคุณยอดวิวตกโดยไม่รู้ตัว"

#### 2. Visual Hook & Text Caption ที่อ่านจบใน 1 วินาที
ตัวหนังสือพาดหัวบนหน้าจอต้องใหญ่ กระชับ ไม่เกิน 6-8 พยางค์ และอยู่ในตำแหน่งที่สายตามองเห็นชัดเจน (กลางจอค่อนไปทางบน) ไม่โดนปุ่ม Like หรือคำบรรยายของแพลตฟอร์มบัง

#### 3. Sound Design & Audio Cue
เสียงดนตรีหรือเอฟเฟกต์เสียง (Whoosh, Pop, Thud) ในวินาทีแรกช่วยกระตุ้นโสตประสาท ทำให้สมองตื่นตัวและหยุดนิ้วโป้งได้ทันที

#### 4. Micro-cut & Pacing Control (ตัดคำเงียบออกให้หมด)
ลบช่องว่างระหว่างประโยค (Dead Air) และคำว่า "เอ่อ... อ่า..." ออกทั้งหมด จังหวะการพูดต้องต่อเนื่อง กระชับ ไม่ยืดเยื้อ

#### 5. Open Loop (เปิดปมทิ้งไว้)
บอกผลลัพธ์ที่น่าตื่นเต้นตั้งแต่ต้น แต่เก็บวิธีแก้ไว้ตรงกลางหรือท้ายคลิป เพื่อดันค่า **Watch Time** และ **Retention Rate** ให้อัลกอริทึมดันคลิปขึ้นหน้าฟีดแนะนำ
    `,
  },
  {
    id: 'personal-branding-asset',
    category: 'Content Strategy',
    readTime: '6 นาที',
    date: '6 พ.ย. 2026',
    title: 'ทำไม Personal Branding ถึงเป็นสินทรัพย์ที่คุ้มค่าที่สุดในยุคครีเอเตอร์และ AI?',
    seoKeywords: ['Personal Branding', 'สร้างตัวตน', 'ครีเอเตอร์มือโปร', 'การตลาดออนไลน์'],
    excerpt: 'สินค้าและบริการลอกเลียนแบบได้ แต่ "ตัวตนของคุณ" ไม่มีใครก๊อปปี้ได้ ถอดรหัสวิธีสร้างความน่าเชื่อถือและการเปลี่ยนผู้ติดตามให้กลายเป็นลูกค้าจริง',
    content: `
### เมื่อใครๆ ก็สามารถใช้ AI สร้างคอนเทนต์ได้ สิ่งเดียวที่ทำให้คุณโดดเด่นคือ "ตัวคุณ"
หลายคนเข้าใจผิดว่า Personal Branding คือการมียอดฟอลโลว์เยอะๆ แต่ความจริงแล้ว **Personal Branding คือสิ่งที่มีคนพูดถึงคุณเวลาที่คุณไม่ได้อยู่ในห้อง**

#### 1. ความไว้วางใจคือเงินตราที่มีค่าที่สุด (Trust is the New Currency)
ในยุคที่มีข้อมูลล้นหลาม ผู้บริโภคไม่ได้ซื้อสินค้าจากโฆษณาแบบเดิม แต่ซื้อจาก **คนที่เขารู้สึกผูกพันและเชื่อมั่น** วิดีโอสั้นที่มีหน้าของคุณ แววตาของคุณ และน้ำเสียงจริงใจ จะสร้างสายสัมพันธ์ที่แน่นแฟ้นกว่ากราฟิกนิ่งหลายสิบเท่า

#### 2. ความชัดเจนใน Niche & Unique Value
อย่าพยายามเป็นทุกอย่างสำหรับทุกคน เลือกสิ่งที่คุณเชี่ยวชาญ 1-2 ด้าน แล้วส่งมอบคุณค่าผ่านการเล่าเรื่องที่เข้าใจง่ายและสม่ำเสมอ

#### 3. คุมภาพลักษณ์ด้วย Production ที่มีคุณภาพ
คุณภาพของคลิป สะท้อนคุณภาพของตัวคุณและธุรกิจ การมีโทนสี แสง และเสียงที่คมชัด จะช่วยยกระดับความน่าเชื่อถือในสายตาลูกค้าและสปอนเซอร์ขึ้นทันที
    `,
  },
  {
    id: 'storyboard-to-viral',
    category: 'Production & Storytelling',
    readTime: '8 นาที',
    date: '2 พ.ย. 2026',
    title: 'คู่มือถ่ายทำและวาง Storyboard ฉบับครีเอเตอร์: จากไอเดียในหัวสู่ 1,000,000 วิว',
    seoKeywords: ['วาง Storyboard', 'ถ่ายคลิปสั้น', 'โปรดักชันมืออาชีพ', 'คลิปไวรัล'],
    excerpt: 'กระบวนการคิดงานหลังฉากของสตูดิโอ: โครงสร้าง 3 ตอน (Hook - Story - Call to Action), การจัดแสงในห้องนอนให้ดูแพง และมุมกล้องที่ดึงดูดอารมณ์',
    content: `
### คอนเทนต์ที่ดีไม่ได้เกิดจากความบังเอิญ แต่เกิดจากการวางแผน (Pre-production)
คลิปที่มียอดวิวทะลุหลักล้านเกือบทั้งหมด ผ่านการคิดโครงสร้าง Storyboard มาก่อนกดอัดกล้องเสมอ

#### โครงสร้าง 3 องก์ของคลิปสั้นที่ทรงพลัง:
1. **Act 1: Hook & Problem (0-3 วินาที)** - ชี้ปัญหา จุดเจ็บปวด หรือสิ่งที่ผู้ชมอยากรู้
2. **Act 2: Value Delivery & Insight (4-45 วินาที)** - ให้คำตอบอย่างกระชับ แบ่งเป็น 3 ข้อย่อย พร้อมภาพ B-Roll เสริมเพื่อลดความน่าเบื่อ
3. **Act 3: Takeaway & Engagement CTA (45-60 วินาที)** - สรุปใจความสำคัญ และชวนคอมเมนต์พูดคุยแลกเปลี่ยน

#### เคล็ดลับการจัดแสงฉบับประหยัดแต่ดูพรีเมียม:
- **Key Light:** ไฟหลักทำมุม 45 องศากับใบหน้า ใช้ Softbox หรือผ้าม่านกรองแสงให้นุ่มนวล
- **Rim / Hair Light:** ไฟดวงเล็กจากด้านหลังช่วยแยกตัวคุณออกจากฉากหลัง เพิ่มมิติความลึก
- **Background Atmosphere:** ใช้ไฟเส้น Warm Light หรือไฟเปลี่ยนสีสร้างบรรยากาศห้องให้น่ามอง
    `,
  },
  {
    id: 'ai-creative-workflow',
    category: 'AI Creative Technology',
    readTime: '7 นาที',
    date: '28 ต.ค. 2026',
    title: 'ใช้ AI ช่วยตัดต่อและคิดคอนเทนต์อย่างไร ให้ยังคงมี "เสน่ห์และความเป็นมนุษย์" ที่ไม่ซ้ำใคร',
    seoKeywords: ['AI ช่วยตัดต่อ', 'Generative AI ครีเอเตอร์', 'Prompt ทำคอนเทนต์', 'เวิร์กโฟลว์ AI'],
    excerpt: 'หยุดปล่อยให้ AI ทำงานจนดูเหมือนหุ่นยนต์ เรียนรู้วิธีใช้ AI เป็นผู้ช่วยทุ่นแรงในการ Research, เขียนโครงสคริปต์ และทำ B-Roll โดยไม่สูญเสียความจริงใจ',
    content: `
### AI คือเครื่องทุ่นแรง ไม่ใช่ตัวแทนความเป็นมนุษย์ของคุณ
ข้อผิดพลาดอันดับหนึ่งของคนที่เริ่มใช้ AI ทำคอนเทนต์ คือการก็อปปี้สคริปต์ดิบๆ จาก Chatbot มาอ่าน ผลลัพธ์คือคลิปที่ดูแบน ไม่มีจิตวิญญาณ และคนดูจับได้ทันที

#### เวิร์กโฟลว์การทำงานร่วมกับ AI ที่ถูกวิธี:
1. **ใช้ AI ระดมไอเดีย (Brainstorming Partner):** ให้ AI เสนอมุมมองแปลกใหม่ ปัญหาของกลุ่มเป้าหมาย หรือคำถามยอดนิยม
2. **ใส่ตัวตนของคุณเข้าไปในสคริปต์ (Injecting Human Tone):** ปรับคำพูดให้เป็นภาษาพูดของคุณ เติมประสบการณ์ส่วนตัว เรื่องเล่า หรือมุกตลกเฉพาะตัว
3. **ใช้ AI สร้าง Storyboard & Moodboard:** นำ Generative AI มาจำลองภาพที่อยากถ่าย ช่วยให้สื่อสารกับตากล้องและทีมตัดต่อได้ตรงใจ
4. **ใช้ AI ออโตเมตงานซ้ำซาก:** เช่น การตัดต่อคำเงียบอัตโนมัติ การสร้างคำบรรยายซับไตเติล (Auto Captions) และการจัดทำ Color Match เพื่อให้คุณมีเวลาโฟกัสกับการคิดสาระสำคัญ
    `,
  },
];

const categories = ['ทั้งหมด', 'Video Editing & Algorithm', 'Content Strategy', 'Production & Storytelling', 'AI Creative Technology'];

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
