const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/').replace(/\/$/, '');
const asset = (p) => {
  if (!p) return '';
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p;
  if (base && p.startsWith(base)) return p;
  return `${base}${p.startsWith('/') ? p : '/' + p}`;
};

// 26 partner brand logos processed cleanly from LogoUltra
export const BRAND_LOGOS = [
  { id: 'smile', name: 'Smile Together Clinic', logo: asset('/brands/smile.webp') },
  { id: 'smilica', name: 'Smilica Dental Clinic', logo: asset('/brands/smilica.webp') },
  { id: 'vogue', name: 'The Vogue Clinic', logo: asset('/brands/vogue.webp') },
  { id: 'cef', name: 'CEF Bangkok', logo: asset('/brands/cef.webp') },
  { id: 'click', name: 'Click Property', logo: asset('/brands/click.webp') },
  { id: 'con', name: 'Connex Property', logo: asset('/brands/connex.webp') },
  { id: 'icare', name: 'iCare Dental Center', logo: asset('/brands/icare.webp') },
  { id: 'ideal', name: 'Ideal Physics', logo: asset('/brands/ideal.webp') },
  { id: 'learn', name: 'Learn 24', logo: asset('/brands/learn.webp') },
  { id: 'lumoz', name: 'Lumoz Clinic', logo: asset('/brands/lumoz.webp') },
  { id: 'qail', name: 'Qail Aesthetic Clinic', logo: asset('/brands/qail.webp') },
  { id: 'rcvp', name: 'Ratchavipa Dental Clinic', logo: asset('/brands/rcvp.webp') },
  { id: 'rl', name: 'Relax House', logo: asset('/brands/rl.webp') },
  { id: 'sol', name: 'SOL Dental Clinic', logo: asset('/brands/sol.webp') },
  { id: 'fin', name: 'FIN Dental Clinic', logo: asset('/brands/fin.webp') },
  { id: 'smdc', name: 'SMDC Dental Clinic', logo: asset('/brands/smdc.webp') },
  { id: 'chl', name: 'CHL', logo: asset('/brands/chl.webp') },
  { id: 'dcare', name: 'D-Care Animal Clinic', logo: asset('/brands/dcare.webp') },
  { id: 'siam', name: 'Siam Park Animal Hospital', logo: asset('/brands/siam.webp') },
  { id: 'pt', name: 'Pet Town Animal Hospital', logo: asset('/brands/pt.webp') },
  { id: 'tnw', name: 'Tanawat Clinic', logo: asset('/brands/tnw.webp') },
  { id: 'math', name: '128 Math Universe', logo: asset('/brands/math.webp') },
  { id: 'ng', name: 'Next Gen School', logo: asset('/brands/ng.webp') },
  { id: 'lnc', name: 'L+N+C', logo: asset('/brands/lnc.webp') },
  { id: 'l', name: 'L Studio', logo: asset('/brands/l.webp') },
  { id: 'wlife', name: 'W-Life', logo: asset('/brands/wlife.webp') },
];
