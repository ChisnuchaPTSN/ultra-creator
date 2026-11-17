export const studio = {
  name: 'ULTRA CREATOR',
  // Add a model at public/models/seedling.glb, then set this to '/models/seedling.glb'.
  // The model should use metres, Y-up, with its base at the origin and height ~1.8m.
  modelUrl: null,
};

// Editorial concept studies. Replace with the team's own films and client credits.
export const projects = [
  { id:'still-wild', number:'01', title:'เรื่องเล่าจากธรรมชาติ', category:'ธรรมชาติ / เล่าเรื่อง', year:'2026', image:'/images/forest.jpg', alt:'หมอกเคลื่อนผ่านป่าสีเขียวเข้ม', description:'ตัวอย่างการเล่าเรื่องผ่านบรรยากาศธรรมชาติ ใช้ภาพ เสียง และจังหวะที่ค่อยเป็นค่อยไป ให้คนดูรู้สึกเหมือนได้หยุดพัก', services:['ตัดต่อเพื่อเล่าเรื่อง','คุมโทนสี','ออกแบบเสียง'], treatment:'เล่าอย่างค่อยเป็นค่อยไป ใช้โทนเขียวลึก แสงนุ่ม และเสียงบรรยากาศ ให้ธรรมชาติเป็นคนเล่าเรื่อง', credit:'Ivana Cajina', source:'https://unsplash.com/photos/pine-trees-surrounded-by-fogs-DuiPYwz3CBA', wide:true },
  { id:'ebb-flow', number:'02', title:'จังหวะของวันพักผ่อน', category:'ไลฟ์สไตล์ / แบรนด์', year:'2026', image:'/images/ocean.jpg', alt:'คลื่นทะเลสีฟ้าซัดแนวชายฝั่ง', description:'ตัวอย่างคอนเทนต์ไลฟ์สไตล์ที่ใช้การเคลื่อนไหวของคลื่นพาเรื่อง เหมาะกับแบรนด์ที่อยากสื่อถึงความผ่อนคลายและชีวิตนอกจอ', services:['ตัดต่อเชิงสร้างสรรค์','คุมโทนสี','โมชั่นกราฟิก'], treatment:'เชื่อมภาพด้วยการเคลื่อนไหว ผสมโทนน้ำทะเลกับแสงอุ่น ให้คลิปไหลลื่นและดูสบาย', credit:'Hash Studio', source:'https://unsplash.com/photos/an-aerial-view-of-a-body-of-water-vn-Qmt07J-U' },
  { id:'out-there', number:'03', title:'ออกไปเจอมุมใหม่', category:'ท่องเที่ยว / สร้างแรงบันดาลใจ', year:'2026', image:'/images/desert.jpg', alt:'เนินทรายโทนอุ่นทอดยาวไปสุดขอบฟ้า', description:'ตัวอย่างคอนเทนต์ท่องเที่ยวที่เล่าเรื่องด้วยภาพกว้างและรายละเอียดเล็ก ๆ ชวนคนดูอยากออกไปพบประสบการณ์ใหม่', services:['พัฒนาเรื่องและสคริปต์','ตัดต่อคลิป','คุมโทนสี'], treatment:'ใช้ภาพกว้างและการตัดที่มีจังหวะ คุมโทนสีเอิร์ธโทน ให้แสงและบรรยากาศชวนติดตาม', credit:'Tim de Groot', source:'https://unsplash.com/photos/vast-desert-FA0Xhlv7m6A' },
];

export const chapters = [
 {label:'วิเคราะห์',title:'เข้าใจคุณ ก่อนเริ่มเล่า',body:'คุยเป้าหมาย ทำความเข้าใจแบรนด์และกลุ่มคนดู ดูจุดแข็งของช่อง แล้วหาเรื่องที่คุณอยากสื่อสารให้ชัด'},
 {label:'วางแผน',title:'ให้ทุกคลิป มีทิศทาง',body:'วางเสาหลักคอนเทนต์ เลือกรูปแบบให้เหมาะกับแพลตฟอร์ม และจัดตารางให้ทีมทำงานต่อเนื่องได้จริง'},
 {label:'คอนเทนต์และสคริปต์',title:'เปลี่ยนไอเดีย เป็นเรื่องน่าดู',body:'คิดประเด็น วาง Hook เขียนสคริปต์และลำดับภาพ ให้คุณรู้ว่าต้องพูดอะไรและถ่ายแบบไหน'},
 {label:'ตัดต่อ',title:'เรียงทุกเฟรม ให้ดูต่อ',body:'คัดภาพ ตัดต่อ ใส่ซับ แต่งเสียงและสี พร้อมปรับจังหวะให้เหมาะกับ TikTok, Reels และ Shorts'},
 {label:'เปิดช่องและลงสื่อ',title:'พร้อมออกไป เจอคนดู',body:'ช่วยตั้งค่าช่อง เตรียมภาพปกและแคปชัน ลงคอนเทนต์ตามแผน แล้วดูผลเพื่อนำมาปรับคลิปต่อไป'},
];
