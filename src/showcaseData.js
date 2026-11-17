const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
const asset = (p) => {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p;
  if (base && p.startsWith(base)) return p;
  return `${base}${p.startsWith('/') ? p : '/' + p}`;
};

// Curated real creator & partner clinic video showcase data
const johnyClips = [
  {
    id: 'johny-cj',
    title: 'CJ แทนเซเว่น',
    platform: 'TikTok',
    views: 1850000,
    poster: asset('/images/posters/johny-cj.jpg'),
    src: asset('/videos/creators/johny-cj.mp4'),
    platformUrl: null,
    description: 'วิเคราะห์เกมธุรกิจค้าปลีก CJ More ปะทะ 7-Eleven ด้วยจังหวะการเล่าเรื่องที่กระชับและน่าติดตาม โดยทีม Ultra Creator',
  },
  {
    id: 'johny-hrk',
    title: 'HRK X Grainey',
    platform: 'Reels',
    views: 2100000,
    poster: asset('/images/posters/johny-hrk.jpg'),
    src: asset('/videos/creators/johny-hrk.mp4'),
    platformUrl: null,
    description: 'ถอดบทเรียนการ Collab แห่งปี HRK X Grainey กับกลยุทธ์ไวรัลและการตัดต่อเล่าเรื่องแบรนด์',
  },
  {
    id: 'johny-loss',
    title: 'กล้าขาดทุน',
    platform: 'Shorts',
    views: 1250000,
    poster: asset('/images/posters/johny-loss.jpg'),
    src: asset('/videos/creators/johny-loss.mp4'),
    platformUrl: null,
    description: 'เจาะลึกกลยุทธ์การตลาด ยอมขาดทุนเพื่อครองตลาด ตัดต่อกระชับ คมชัดทุกประเด็น',
  },
];

const smileClips = [
  {
    id: 'smile-easy',
    title: 'จัดฟันง่าย',
    platform: 'TikTok',
    views: 1420000,
    poster: asset('/images/posters/smile-easy.jpg'),
    src: asset('/videos/creators/smile-easy.mp4'),
    platformUrl: null,
    description: 'คอนเทนต์ให้ความรู้ด้านทันตกรรมจัดฟัน ย่อยเรื่องยากให้เข้าใจง่ายและน่าเชื่อถือ',
  },
  {
    id: 'smile-hard',
    title: 'เคสจัดฟันยาก',
    platform: 'Reels',
    views: 1580000,
    poster: asset('/images/posters/smile-hard.jpg'),
    src: asset('/videos/creators/smile-hard.mp4'),
    platformUrl: null,
    description: 'เล่าเรื่องเคสจัดฟันซับซ้อนที่เปลี่ยนรอยยิ้มใหม่ สร้างความมั่นใจให้คนไข้ตัดสินใจง่ายขึ้น',
  },
  {
    id: 'smile-party',
    title: 'เคสปาร์ตี้',
    platform: 'Shorts',
    views: 800000,
    poster: asset('/images/posters/smile-party.jpg'),
    src: asset('/videos/creators/smile-party.mp4'),
    platformUrl: null,
    description: 'ถ่ายทอดบรรยากาศสนุกสนานและรีวิวจริงจากคลินิก ให้เข้าถึงคนรุ่นใหม่ได้ง่ายยิ่งขึ้น',
  },
];

const smilicaClips = [
  {
    id: 'smilica-dentalpro',
    title: 'Dental Pro',
    platform: 'TikTok',
    views: 1150000,
    poster: asset('/images/posters/smilica-dentalpro.jpg'),
    src: asset('/videos/creators/smilica-dentalpro.mp4'),
    platformUrl: null,
    description: 'เจาะลึกเทคโนโลยีทันตกรรมสมัยใหม่ ถ่ายทอดภาพลักษณ์ระดับพรีเมียมและน่าเชื่อถือ',
  },
  {
    id: 'smilica-root',
    title: 'จัดแทนรักษาราก',
    platform: 'Reels',
    views: 980000,
    poster: asset('/images/posters/smilica-root.jpg'),
    src: asset('/videos/creators/smilica-root.mp4'),
    platformUrl: null,
    description: 'เปรียบเทียบและให้ความรู้ทางเลือกในการรักษาฟันอย่างตรงจุด ตอบข้อสงสัยคนไข้ได้อย่างชัดเจน',
  },
  {
    id: 'smilica-missing',
    title: 'ฟันหายหลายซี่แก้ได้',
    platform: 'Shorts',
    views: 820000,
    poster: asset('/images/posters/smilica-missing.jpg'),
    src: asset('/videos/creators/smilica-missing.mp4'),
    platformUrl: null,
    description: 'แนวทางการฟื้นฟูฟันหลายซี่ที่เข้าใจง่าย ช่วยเพิ่มยอดทักแชทนัดหมายคลินิกอย่างต่อเนื่อง',
  },
];

const jayClips = [
  {
    id: 'jay-hyrox',
    title: 'Hyrox',
    platform: 'TikTok',
    views: 1920000,
    poster: asset('/images/posters/jay-hyrox.jpg'),
    src: asset('/videos/creators/jay-hyrox.mp4'),
    platformUrl: null,
    description: 'เกาะติดเทรนด์กีฬา Hyrox ที่กำลังมาแรง ตัดต่อจังหวะเร้าใจตามกระแสโลกโซเชียล',
  },
  {
    id: 'jay-chula',
    title: 'จุฬาฯ',
    platform: 'Reels',
    views: 1480000,
    poster: asset('/images/posters/jay-chula.jpg'),
    src: asset('/videos/creators/jay-chula.mp4'),
    platformUrl: null,
    description: 'พาเจาะเทรนด์และเรื่องราวน่าสนใจในรั้วจุฬาฯ ด้วยสไตล์การเล่าเรื่องที่เป็นเอกลักษณ์',
  },
  {
    id: 'jay-glasses',
    title: 'วิ่งแลกแว่น',
    platform: 'Shorts',
    views: 1200000,
    poster: asset('/images/posters/jay-glasses.jpg'),
    src: asset('/videos/creators/jay-glasses.mp4'),
    platformUrl: null,
    description: 'คอนเทนต์ Challenge วิ่งแลกแว่นสุดสนุก ดึงดูดการมีส่วนร่วมและยอดแชร์สูง',
  },
];

export const clips = [
  ...johnyClips,
  ...smileClips,
  ...smilicaClips,
  ...jayClips,
];

export const creators = [
  {
    id: 'johny',
    name: 'Johny Jle',
    role: 'คอนเทนต์ธุรกิจ การตลาด และเรื่องราวรอบตัว',
    views: 5200000,
    type: 'person',
    portraitImg: asset('/images/creators/johny-jle.png'),
    clips: johnyClips,
    color: '#3c1e45',
  },
  {
    id: 'smile',
    name: 'Smile Together Clinic',
    role: 'คลินิกทันตกรรม & คอนเทนต์จัดฟัน',
    views: 3800000,
    type: 'brand',
    portraitImg: asset('/images/creators/smile-together-badge.png'),
    clips: smileClips,
    color: '#1b3f39',
  },
  {
    id: 'smilica',
    name: 'Smilica Dental Clinic',
    role: 'คลินิกทันตกรรมเพื่อความงามและสุขภาพช่องปาก',
    views: 2950000,
    type: 'brand',
    portraitImg: asset('/images/creators/smilica-badge.png'),
    clips: smilicaClips,
    color: '#431f27',
  },
  {
    id: 'jay',
    name: 'เจ เจาะเทรนด์',
    role: 'เจาะกระแส ไลฟ์สไตล์ และเทรนด์ไวรัล',
    views: 4600000,
    type: 'person',
    portraitImg: asset('/images/creators/jay-trend.png'),
    clips: jayClips,
    color: '#252e45',
  },
];

export const formatViews = (n) =>
  n >= 1000000
    ? `${(n / 1000000).toFixed(1).replace('.0', '')}M`
    : `${Math.round(n / 1000)}K`;
