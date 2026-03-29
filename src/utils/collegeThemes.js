// ─── CVR LOGO URL ─────────────────────────────────────────────────────────────
// Replace this with a direct link to the CVR logo (imgur, cloudinary, etc.)
// The Wikipedia URL below works as a fallback but may be blocked by CORS in some setups
export const CVR_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/CVR_College_of_Engineering_logo.png/220px-CVR_College_of_Engineering_logo.png';
// ─────────────────────────────────────────────────────────────────────────────

export function getCollegeTheme(college) {
  const c = (college || '').toLowerCase();

  if (c.includes('cvr'))
    return {
      gradient: 'linear-gradient(145deg,#050812 0%,#070c1c 30%,#090e26 60%,#0b0a1e 100%)',
      accent: '#3b82f6',
      secondary: '#1d4ed8',
      tertiary: '#7c3aed',
      badge: 'CVR',
      glow: 'rgba(59,130,246,0.25)',
      secondaryGlow: 'rgba(124,58,237,0.15)',
      logoUrl: 'https://res.cloudinary.com/dtbp1dkxp/image/upload/f_auto,q_auto/Screenshot_2026-03-30_013132_va3sbn',
      fullName: 'CVR College of Engineering',
    };

  if (c.includes('jntu'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#1a0f00,#2d1a00)', accent: '#d97706', secondary: '#92400e', tertiary: '#b45309', badge: 'JNTU', glow: 'rgba(217,119,6,0.2)', secondaryGlow: 'rgba(180,83,9,0.12)', logoUrl: null, fullName: 'JNTU Hyderabad' };
  if (c.includes('vasavi'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#0f1a0a,#1a2e0d)', accent: '#16a34a', secondary: '#14532d', tertiary: '#15803d', badge: 'Vasavi', glow: 'rgba(22,163,74,0.2)', secondaryGlow: 'rgba(21,128,61,0.12)', logoUrl: null, fullName: 'Vasavi College of Engineering' };
  if (c.includes('kmit'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#1a000a,#2e0d1a)', accent: '#dc2626', secondary: '#991b1b', tertiary: '#b91c1c', badge: 'KMIT', glow: 'rgba(220,38,38,0.2)', secondaryGlow: 'rgba(185,28,28,0.12)', logoUrl: null, fullName: 'KMIT' };
  if (c.includes('guru nanak') || c.includes('gni'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#1a1000,#2e2000)', accent: '#ca8a04', secondary: '#854d0e', tertiary: '#a16207', badge: 'GNI', glow: 'rgba(202,138,4,0.2)', secondaryGlow: 'rgba(161,98,7,0.12)', logoUrl: null, fullName: 'Guru Nanak Institutions' };
  if (c.includes('sri indu'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#001a1a,#002e2e)', accent: '#0891b2', secondary: '#164e63', tertiary: '#0e7490', badge: 'SriIndu', glow: 'rgba(8,145,178,0.2)', secondaryGlow: 'rgba(14,116,144,0.12)', logoUrl: null, fullName: 'Sri Indu College' };
  if (c.includes('iit'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#1a0000,#2e0000)', accent: '#dc2626', secondary: '#7f1d1d', tertiary: '#b91c1c', badge: 'IIT', glow: 'rgba(220,38,38,0.2)', secondaryGlow: 'rgba(127,29,29,0.12)', logoUrl: null, fullName: 'IIT' };
  if (c.includes('nit'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#00001a,#00002e)', accent: '#2563eb', secondary: '#1e3a8a', tertiary: '#1d4ed8', badge: 'NIT', glow: 'rgba(37,99,235,0.2)', secondaryGlow: 'rgba(29,78,216,0.12)', logoUrl: null, fullName: 'NIT' };
  if (c.includes('bits'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#1a001a,#2e002e)', accent: '#9333ea', secondary: '#581c87', tertiary: '#7e22ce', badge: 'BITS', glow: 'rgba(147,51,234,0.2)', secondaryGlow: 'rgba(126,34,206,0.12)', logoUrl: null, fullName: 'BITS' };
  if (c.includes('iiit'))
    return { gradient: 'linear-gradient(145deg,#0a0a0f,#001a0f,#002e1a)', accent: '#059669', secondary: '#064e3b', tertiary: '#047857', badge: 'IIIT', glow: 'rgba(5,150,105,0.2)', secondaryGlow: 'rgba(4,120,87,0.12)', logoUrl: null, fullName: 'IIIT' };

  return { gradient: 'linear-gradient(145deg,#0a0a0f,#0f0a1a,#1a0f2e)', accent: '#7c3aed', secondary: '#4c1d95', tertiary: '#6d28d9', badge: 'Dev', glow: 'rgba(124,58,237,0.2)', secondaryGlow: 'rgba(109,40,217,0.12)', logoUrl: null, fullName: '' };
}