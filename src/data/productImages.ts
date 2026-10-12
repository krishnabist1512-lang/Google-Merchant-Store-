// Image assets generated via generate_image tool
export const AI_IMAGES = {
  heroApparel: '/src/assets/images/hero_layer_apparel_1791797302270.jpg',
  campaignLayerUp: '/src/assets/images/campaign_layer_up_1791797322909.jpg',
  categoryApparel: '/src/assets/images/category_apparel_1791797342916.jpg',
  categoryLifestyle: '/src/assets/images/category_lifestyle_1791797365416.jpg',
};

/**
 * Creates high-fidelity, standalone SVG data URLs for merchandise items.
 * Guaranteed to render reliably offline, without broken image frames,
 * with modern tech styling, drop shadows, and subtle textural gradients.
 */
export function generateProductSvg(
  name: string,
  category: string,
  colorHex: string = '#1B1D21',
  view: 'front' | 'angle' | 'detail' = 'front',
  accentHex: string = '#2F6BFF'
): string {
  // SVG glyphs based on category
  let iconSvg = '';
  if (category === 'apparel') {
    // Hoodie/Tee silhouette
    iconSvg = `
      <path d="M120 100 L180 80 L220 110 L200 150 L180 140 L180 260 L120 260 L60 260 L60 140 L40 150 L20 110 L60 80 Z" fill="${colorHex}" filter="url(#drop-shadow)" />
      <path d="M95 85 C105 105 135 105 145 85 C130 92 110 92 95 85 Z" fill="#F1F3F4" opacity="0.6" />
      <line x1="120" y1="120" x2="120" y2="170" stroke="${accentHex}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <rect x="95" y="160" width="50" height="20" rx="4" fill="${accentHex}" opacity="0.15" />
      <text x="120" y="174" font-family="sans-serif" font-size="9" font-weight="700" fill="${accentHex}" text-anchor="middle" letter-spacing="1">LAYER</text>
    `;
  } else if (category === 'drinkware') {
    // Insulated bottle or mug silhouette
    iconSvg = `
      <rect x="85" y="70" width="70" height="180" rx="20" fill="${colorHex}" filter="url(#drop-shadow)" />
      <rect x="95" y="50" width="50" height="25" rx="6" fill="#374151" />
      <rect x="110" y="42" width="20" height="10" rx="3" fill="#1F2937" />
      <path d="M100 130 Q120 145 140 130" stroke="${accentHex}" stroke-width="3" fill="none" opacity="0.8" />
      <circle cx="120" cy="190" r="14" fill="${accentHex}" opacity="0.15" />
      <path d="M116 186 L124 190 L116 194 Z" fill="${accentHex}" />
    `;
  } else if (category === 'accessories') {
    // Cap or backpack
    iconSvg = `
      <path d="M70 180 C70 110 170 110 170 180 Z" fill="${colorHex}" filter="url(#drop-shadow)" />
      <path d="M50 180 Q120 200 190 180 Q120 170 50 180 Z" fill="${colorHex}" opacity="0.9" />
      <rect x="105" y="145" width="30" height="12" rx="3" fill="${accentHex}" opacity="0.9" />
      <circle cx="120" cy="115" r="4" fill="#374151" />
    `;
  } else if (category === 'tech') {
    // Wireless charger / tech sleeve / pad
    iconSvg = `
      <rect x="50" y="80" width="140" height="140" rx="24" fill="${colorHex}" filter="url(#drop-shadow)" />
      <circle cx="120" cy="150" r="45" stroke="${accentHex}" stroke-width="2.5" stroke-dasharray="6 4" fill="none" opacity="0.7" />
      <circle cx="120" cy="150" r="24" fill="${accentHex}" opacity="0.15" />
      <path d="M120 138 L120 162 M108 150 L132 150" stroke="${accentHex}" stroke-width="3" stroke-linecap="round" />
    `;
  } else if (category === 'stationery') {
    // Dot grid journal / notebook
    iconSvg = `
      <rect x="65" y="60" width="110" height="170" rx="10" fill="${colorHex}" filter="url(#drop-shadow)" />
      <rect x="65" y="60" width="18" height="170" rx="6" fill="#111827" opacity="0.4" />
      <line x1="95" y1="95" x2="160" y2="95" stroke="${accentHex}" stroke-width="3" stroke-linecap="round" />
      <line x1="95" y1="120" x2="150" y2="120" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" />
      <line x1="95" y1="145" x2="140" y2="145" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" />
      <rect x="150" y="55" width="10" height="180" rx="3" fill="${accentHex}" opacity="0.9" />
    `;
  } else {
    // Collectibles / Enamel pin / Figurine
    iconSvg = `
      <polygon points="120,60 175,100 175,170 120,210 65,170 65,100" fill="${colorHex}" filter="url(#drop-shadow)" />
      <polygon points="120,80 155,110 155,160 120,190 85,160 85,110" stroke="${accentHex}" stroke-width="2" fill="none" opacity="0.8" />
      <circle cx="120" cy="135" r="16" fill="${accentHex}" opacity="0.9" />
      <path d="M115 130 L125 135 L115 140 Z" fill="#FFFFFF" />
    `;
  }

  // View angle details
  const viewBadge = view === 'angle' ? '45° PERSPECTIVE' : view === 'detail' ? 'CLOSE-UP TEXTURE' : 'STUDIO ELEVATION';

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" width="100%" height="100%">
    <defs>
      <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F8F9FA" />
        <stop offset="100%" stop-color="#E9ECEF" />
      </linearGradient>
      <linearGradient id="podium-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#DDE2E6" stop-opacity="0.8" />
      </linearGradient>
      <filter id="drop-shadow" x="-20%" y="-20%" width="150%" height="150%">
        <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="#0F172A" flood-opacity="0.14" />
      </filter>
    </defs>
    <!-- Background Canvas -->
    <rect width="240" height="300" fill="url(#bg-grad)" />
    
    <!-- Geometric Studio Pedestal -->
    <ellipse cx="120" cy="245" rx="85" ry="22" fill="url(#podium-grad)" />
    
    <!-- Dynamic Icon Silhouette -->
    ${iconSvg}

    <!-- Clean Studio Watermark / Perspective Indicator -->
    <rect x="14" y="16" width="6" height="6" rx="2" fill="${accentHex}" />
    <text x="26" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="700" fill="#6B7280" letter-spacing="0.5">${viewBadge}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
