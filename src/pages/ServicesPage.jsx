import React from 'react';
import { Camera, Film, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const servicesData = [
  {
    id: 'graduation',
    num: '01',
    title: 'ถ่ายรูปปริญญา',
    subtitle: 'Graduation & Portrait Photography',
    icon: Camera,
    desc: 'บริการถ่ายรูปรับปริญญาทั้งเดี่ยวและกลุ่ม ทั้งนอกรอบและวันจริง คุมโทนภาพสไตล์ฟิล์มคลีน ละมุนตา แสงธรรมชาติ พร้อมเทคนิครีทัชระดับพรีเมียมที่ช่วยดึงความมั่นใจและโมเมนต์ที่ดีที่สุดของคุณออกมา',
    highlights: [
      'ถ่ายไม่จำกัดจำนวนภาพ ส่งไฟล์เต็มความละเอียดสูงทุกรูป',
      'ปรับโทนสี Signature Mood & Tone เฉพาะบุคคล',
      'ตากล้องมืออาชีพคอยแนะนำท่าโพสต์และมุมถ่ายที่ดูดีที่สุด',
      'รับไฟล์พรีวิวไวภายใน 48 ชั่วโมง พร้อมส่งงานฉบับสมบูรณ์',
    ],
    ctaText: 'จองคิวถ่ายและดูผลงาน',
  },
  {
    id: 'content-production',
    num: '02',
    title: 'คิดถ่ายตัด content',
    subtitle: 'End-to-End Content Production',
    icon: Film,
    desc: 'บริการวางแผนคอนเทนต์ครบวงจร ตั้งแต่หาไอเดีย เขียนสคริปต์ Hook ถ่ายทำ จนถึงตัดต่อส่งมอบคลิปพร้อมลงทุกแพลตฟอร์ม (TikTok, Reels, Shorts) ช่วยสร้างการจดจำและดึงดูดผู้ติดตามอย่างยั่งยืน',
    highlights: [
      'ออกแบบ Hook 3 วินาทีแรกให้สะกดทุกสายตา หยุดการเลื่อนผ่าน',
      'วาง Storyboard, กำกับภาพ, จัดแสง และคุมทิศทางอารมณ์',
      'ตัดต่อด้วย Pacing ที่กระชับ ซาวด์ดีไซน์ และ Color Grading ระดับพรีเมียม',
      'วิเคราะห์อัลกอริทึมและพฤติกรรมผู้ชม เพื่อสร้างยอด Engagement สูง',
    ],
    ctaText: 'ปรึกษาโปรเจกต์คอนเทนต์',
  },
  {
    id: 'ai-course',
    num: '03',
    title: 'คอร์สสอน AI',
    subtitle: 'AI Creative & Workflow Masterclass',
    icon: Sparkles,
    desc: 'คอร์สเรียนและเวิร์กช็อปแบบลงมือทำจริง สอนการนำ Generative AI ยุคใหม่มาประยุกต์ใช้ในการสร้างสรรค์คอนเทนต์ คิดไอเดีย สร้างสตอรี่บอร์ด และย่นระยะเวลาผลิตงานตัดต่อให้ไวขึ้น 10 เท่า',
    highlights: [
      'เจาะลึก Generative AI Tools สำหรับสายตัดต่อ ครีเอเตอร์ และการตลาด',
      'เวิร์กโฟลว์ปฏิบัติจริงตั้งแต่ Prompt Engineering สู่ผลงานระดับโปร',
      'เทคนิคคุม Mood & Tone และเอกลักษณ์ของตัวเอง ไม่ให้ดูเป็นงาน AI โหล',
      'พร้อมเอกสารคู่มือ เวิร์กช็อป ถาม-ตอบตัวต่อตัว และกลุ่มคอมมูนิตี้ตลอดชีพ',
    ],
    ctaText: 'ดูรายละเอียดหลักสูตร',
  },
];

export default function ServicesPage({ onNavigateContact, t }) {
  const sp = t?.servicesPage;

  const services = [
    {
      id: 'graduation',
      num: '01',
      title: sp?.s1Title || 'ถ่ายรูปปริญญา',
      subtitle: sp?.s1Subtitle || 'Graduation & Portrait Photography',
      icon: Camera,
      desc: sp?.s1Desc || 'บริการถ่ายรูปรับปริญญาทั้งเดี่ยวและกลุ่ม ทั้งนอกรอบและวันจริง คุมโทนภาพสไตล์ฟิล์มคลีน ละมุนตา แสงธรรมชาติ พร้อมเทคนิครีทัชระดับพรีเมียมที่ช่วยดึงความมั่นใจและโมเมนต์ที่ดีที่สุดของคุณออกมา',
      highlights: sp?.s1Features || [
        'ถ่ายไม่จำกัดจำนวนภาพ ส่งไฟล์เต็มความละเอียดสูงทุกรูป',
        'ปรับโทนสี Signature Mood & Tone เฉพาะบุคคล',
        'ตากล้องมืออาชีพคอยแนะนำท่าโพสต์และมุมถ่ายที่ดูดีที่สุด',
        'รับไฟล์พรีวิวไวภายใน 48 ชั่วโมง พร้อมส่งงานฉบับสมบูรณ์',
      ],
      ctaText: sp ? (t?.langShort === 'EN' ? 'Book Session & Explore' : t?.langShort === 'ZH' ? '预约拍摄并查看客片' : 'จองคิวถ่ายและดูผลงาน') : 'จองคิวถ่ายและดูผลงาน',
    },
    {
      id: 'content-production',
      num: '02',
      title: sp?.s2Title || 'คิดถ่ายตัด content',
      subtitle: sp?.s2Subtitle || 'End-to-End Content Production',
      icon: Film,
      desc: sp?.s2Desc || 'บริการวางแผนคอนเทนต์ครบวงจร ตั้งแต่หาไอเดีย เขียนสคริปต์ Hook ถ่ายทำ จนถึงตัดต่อส่งมอบคลิปพร้อมลงทุกแพลตฟอร์ม (TikTok, Reels, Shorts) ช่วยสร้างการจดจำและดึงดูดผู้ติดตามอย่างยั่งยืน',
      highlights: sp?.s2Features || [
        'ออกแบบ Hook 3 วินาทีแรกให้สะกดทุกสายตา หยุดการเลื่อนผ่าน',
        'วาง Storyboard, กำกับภาพ, จัดแสง และคุมทิศทางอารมณ์',
        'ตัดต่อด้วย Pacing ที่กระชับ ซาวด์ดีไซน์ และ Color Grading ระดับพรีเมียม',
        'วิเคราะห์อัลกอริทึมและพฤติกรรมผู้ชม เพื่อสร้างยอด Engagement สูง',
      ],
      ctaText: sp ? (t?.langShort === 'EN' ? 'Consult Content Project' : t?.langShort === 'ZH' ? '咨询短视频全案合作' : 'ปรึกษาโปรเจกต์คอนเทนต์') : 'ปรึกษาโปรเจกต์คอนเทนต์',
    },
    {
      id: 'ai-course',
      num: '03',
      title: sp?.s3Title || 'คอร์สสอน AI',
      subtitle: sp?.s3Subtitle || 'AI Creative & Workflow Masterclass',
      icon: Sparkles,
      desc: sp?.s3Desc || 'คอร์สเรียนและเวิร์กช็อปแบบลงมือทำจริง สอนการนำ Generative AI ยุคใหม่มาประยุกต์ใช้ในการสร้างสรรค์คอนเทนต์ คิดไอเดีย สร้างสตอรี่บอร์ด และย่นระยะเวลาผลิตงานตัดต่อให้ไวขึ้น 10 เท่า',
      highlights: sp?.s3Features || [
        'เจาะลึก Generative AI Tools สำหรับสายตัดต่อ ครีเอเตอร์ และการตลาด',
        'เวิร์กโฟลว์ปฏิบัติจริงตั้งแต่ Prompt Engineering สู่ผลงานระดับโปร',
        'เทคนิคคุม Mood & Tone และเอกลักษณ์ของตัวเอง ไม่ให้ดูเป็นงาน AI โหล',
        'พร้อมเอกสารคู่มือ เวิร์กช็อป ถาม-ตอบตัวต่อตัว และกลุ่มคอมมูนิตี้ตลอดชีพ',
      ],
      ctaText: sp ? (t?.langShort === 'EN' ? 'Explore Masterclass' : t?.langShort === 'ZH' ? '查看实战课程详情' : 'ดูรายละเอียดหลักสูตร') : 'ดูรายละเอียดหลักสูตร',
    },
  ];

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-24 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Header matching Image 1 aesthetic adapted to site tone */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <p className="eyebrow block mb-4">{sp?.eyebrow || '01 / บริการของเรา'}</p>
        <h1 className="font-['Prompt',sans-serif] text-xl sm:text-3xl md:text-5xl font-light text-white tracking-wide leading-tight mb-5 supertext-title heading-fade-up">
          {sp?.title}{' '}
          <br className="sm:hidden" />
          <span className="supertext-em">{sp?.titleEm || 'ครบทุกมิติสร้างสรรค์'}</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
          {sp?.sub || 'ตั้งแต่ภาพนิ่งรับปริญญาที่น่าจดจำ โปรดักชันคอนเทนต์วิดีโอที่สะกดสายตา ไปจนถึงการยกระดับทักษะด้วย AI สำหรับครีเอเตอร์และแบรนด์ยุคใหม่'}
        </p>
      </div>

      {/* 3 Service Cards Grid (Matching reference Image 1 layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
        {services.map((service) => {
          const IconComp = service.icon;
          return (
            <article
              key={service.id}
              className="service-card-item group relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-500"
            >
              <div>
                {/* Top Row: Icon and Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="service-icon-wrap w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                    <IconComp className="w-7 h-7 text-purple-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-mono text-purple-300/50 tracking-wider">
                    {service.num}
                  </span>
                </div>

                {/* Service Title */}
                <h2 className="font-['Prompt',sans-serif] text-xl sm:text-2xl font-normal text-white mb-1.5 group-hover:text-purple-200 transition-colors">
                  {service.title}
                </h2>
                <p className="text-xs uppercase tracking-wider text-purple-300/70 mb-4 font-medium">
                  {service.subtitle}
                </p>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                  {service.desc}
                </p>

                {/* Highlights List */}
                <ul className="space-y-2.5 mb-8">
                  {service.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Link */}
              <button
                type="button"
                onClick={onNavigateContact}
                className="service-card-btn w-full inline-flex items-center justify-between py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer"
              >
                <span>{service.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </article>
          );
        })}
      </div>

      {/* Bottom Consultation Banner */}
      <div className="services-cta-banner rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200/80 mb-3 font-medium">
            READY TO CREATE TOGETHER
          </p>
          <h2 className="font-['Prompt',sans-serif] text-2xl sm:text-3xl font-light text-white mb-4">
            {sp?.ctaTitle || 'มีโปรเจกต์ที่อยากเริ่ม หรือต้องการคำปรึกษา?'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mb-8 leading-relaxed font-light">
            {sp?.ctaSub || 'ทีม Ultra Creator พร้อมพูดคุย ออกแบบแพ็กเกจ และช่วยให้คุณเติบโตในแบบที่เป็นตัวเองที่สุด'}
          </p>
          <button
            type="button"
            onClick={onNavigateContact}
            className="intro-cta inline-flex items-center gap-3 cursor-pointer"
          >
            <span>{sp?.ctaBtn || 'ติดต่อเราเพื่อเริ่มงาน'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
