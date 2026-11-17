import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, MessageSquare, Clock, MapPin } from 'lucide-react';

export default function ContactPage({ t, lang }) {
  const cp = t?.contactPage;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: cp?.serviceOption1 || 'คิดถ่ายตัด content',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-24 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <p className="eyebrow block mb-4">{cp?.eyebrow || '03 / ติดต่อเรา · CONTACT US'}</p>
        <h1 className="font-['Prompt',sans-serif] text-xl sm:text-3xl md:text-5xl font-light text-white tracking-wide leading-tight mb-4 supertext-title heading-fade-up">
          {cp?.title}{' '}
          <br className="sm:hidden" />
          <span className="supertext-em">{cp?.titleEm || 'ในโลก Social'}</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
          {cp?.sub || 'ส่งข้อความปรึกษาทีมงาน สอบถามเรตราคา หรือจองคิวงานล่วงหน้า ทีมงาน Ultra Creator พร้อมดูแลและตอบกลับอย่างรวดเร็ว'}
        </p>
      </div>

      {/* 2-Column Grid: Left Contact Form, Right Channels & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Side: Contact Form via Email (7 cols) */}
        <div className="lg:col-span-7 contact-form-card rounded-3xl p-7 sm:p-10">
          <h2 className="font-['Prompt',sans-serif] text-xl sm:text-2xl font-light text-white mb-2">
            {cp?.formTitle || 'ส่งข้อความถึงทีมงาน'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mb-8 font-light">
            {cp?.formSub || 'กรอกรายละเอียดโปรเจกต์ของคุณ แล้วเราจะติดต่อกลับพร้อมข้อเสนอภายใน 24 ชม.'}
          </p>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-purple-900/30 border border-purple-300/30 text-center animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-['Prompt',sans-serif] text-xl text-white font-normal mb-2">
                {cp?.successTitle || 'ส่งข้อความสำเร็จแล้ว!'}
              </h3>
              <p className="text-sm text-slate-300 font-light mb-6">
                {cp?.successSub || 'ขอบคุณที่ไว้วางใจ Ultra Creator ทีมงานได้รับข้อความเรียบร้อยแล้ว และจะติดต่อกลับทางอีเมลหรือเบอร์โทรศัพท์โดยเร็วที่สุด'}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
              >
                {cp?.sendAnother || 'ส่งข้อความอีกครั้ง'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-200/80 mb-2 font-medium">
                    {cp?.fullName || 'ชื่อ - นามสกุล *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={cp?.fullNamePh || 'เช่น คุณสมชาย ครีเอเตอร์'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="contact-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-200/80 mb-2 font-medium">
                    {cp?.email || 'อีเมลติดต่อกลับ *'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={cp?.emailPh || 'name@example.com'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="contact-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone / LINE ID */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-200/80 mb-2 font-medium">
                    {cp?.phone || 'เบอร์โทรศัพท์ / LINE ID'}
                  </label>
                  <input
                    type="text"
                    placeholder={cp?.phonePh || '08x-xxx-xxxx หรือ @line'}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="contact-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-purple-200/80 mb-2 font-medium">
                    {cp?.serviceNeeded || 'บริการที่คุณสนใจ *'}
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="contact-input w-full px-4 py-3 rounded-xl text-sm text-white bg-[#250d2b] focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="คิดถ่ายตัด content">{cp?.serviceOption1 || 'คิดถ่ายตัด content (TikTok, Reels, Shorts)'}</option>
                    <option value="ถ่ายรูปปริญญา">{cp?.serviceOption2 || 'ถ่ายรูปปริญญา / Portrait Photography'}</option>
                    <option value="คอร์สสอน AI">{cp?.serviceOption3 || 'คอร์สสอน AI และเวิร์กช็อปโปรดักชัน'}</option>
                    <option value="บริการอื่นๆ">{cp?.serviceOption4 || 'บริการอื่นๆ / ปรึกษางานเฉพาะทาง'}</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-purple-200/80 mb-2 font-medium">
                  {cp?.projectDetails || 'รายละเอียดโปรเจกต์ หรือข้อความที่ต้องการปรึกษา *'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={cp?.projectDetailsPh || 'บอกเล่าเกี่ยวกับช่องของคุณ วันที่ต้องการถ่าย หรือเป้าหมายที่ต้องการ...'}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="contact-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-medium text-sm tracking-wide shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{cp?.sending || 'กำลังส่งข้อความ...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{cp?.submitBtn || 'ส่งข้อความถึงทีมงาน Ultra Creator'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Ultra Creator Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Social Channels Card */}
          <div className="contact-side-card rounded-3xl p-7 sm:p-8">
            <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-purple-300/15">
              <img
                src="/brand/uc-logo-white.png"
                alt="Ultra Creator"
                className="w-11 h-11 object-contain p-2 rounded-2xl bg-purple-950/80 border border-purple-300/30 shadow-lg"
              />
              <div>
                <h3 className="font-['Prompt',sans-serif] text-base text-white font-medium leading-tight">
                  Ultra Creator Official
                </h3>
                <p className="text-[11px] text-purple-300/70 font-mono mt-0.5">@ultracreator.studio</p>
              </div>
            </div>

            <h4 className="font-['Prompt',sans-serif] text-sm text-purple-200 font-normal mb-1.5">
              {cp?.socialsTitle || 'ช่องทางโซเชียลมีเดีย'}
            </h4>
            <p className="text-slate-300 text-xs mb-6 font-light">
              {cp?.socialsSub || 'ติดตามคอนเทนต์ ผลงานเบื้องหลัง และอัปเดตเทคนิคตัดต่อได้ทุกแพลตฟอร์ม'}
            </p>

            <div className="space-y-3">
              {/* TikTok */}
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-channel-item flex items-center justify-between p-4 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-300/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.86-4.47V8.71a8.19 8.19 0 0 0 4.91 1.63V6.89a4.83 4.83 0 0 1-1-.2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">TikTok</p>
                    <p className="text-xs text-purple-300/70 font-mono">@ultracreator.th</p>
                  </div>
                </div>
                <span className="text-xs text-purple-300/80 font-medium">{t?.collectiveSec?.followUs || 'ติดตาม ↗'}</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-channel-item flex items-center justify-between p-4 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-300/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Instagram</p>
                    <p className="text-xs text-purple-300/70 font-mono">@ultracreator.studio</p>
                  </div>
                </div>
                <span className="text-xs text-purple-300/80 font-medium">{t?.collectiveSec?.followUs || 'ติดตาม ↗'}</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-channel-item flex items-center justify-between p-4 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-300/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Facebook</p>
                    <p className="text-xs text-purple-300/70 font-mono">Ultra Creator</p>
                  </div>
                </div>
                <span className="text-xs text-purple-300/80 font-medium">{t?.collectiveSec?.followUs || 'ติดตาม ↗'}</span>
              </a>
            </div>
          </div>

          {/* Quick Contact & Info Card */}
          <div className="contact-side-card rounded-3xl p-7 sm:p-8 space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-purple-300/80 font-medium">{cp?.officialEmail || 'อีเมลทางการ'}</p>
                <p className="text-white font-mono">contact@ultracreator.studio</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-purple-300/80 font-medium">{cp?.workingHours || 'เวลาให้บริการ'}</p>
                <p className="text-white">{cp?.workingHoursVal || 'จันทร์ – เสาร์: 09:00 – 19:00 น.'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-purple-300/80 font-medium">{t?.langShort === 'EN' ? 'Studio Location' : t?.langShort === 'ZH' ? '工作室坐标' : 'ที่ตั้งสตูดิโอ'}</p>
                <p className="text-white">{t?.langShort === 'EN' ? 'Bangkok, Thailand (On-site & Online Worldwide)' : t?.langShort === 'ZH' ? '曼谷，泰国（提供全球线上制作与现场拍摄）' : 'กรุงเทพมหานคร, ประเทศไทย (บริการทั้ง On-site และ Online ทั่วประเทศ)'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
