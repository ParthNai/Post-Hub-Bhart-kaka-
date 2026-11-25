/* ============================================
   PosterBanao - Premium Sticker Library
   Searchable SVG and emoji stickers for the editor
   ============================================ */

const StickerLibrary = (() => {
  const categories = [
    { id: 'featured', label: 'Featured' },
    { id: 'emoji', label: 'Emoji' },
    { id: 'shapes', label: 'Shapes' },
    { id: 'frames', label: 'Frames' },
    { id: 'decorations', label: 'Decor' },
    { id: 'arrows', label: 'Arrows' },
    { id: 'social', label: 'Social' }
  ];

  function svg(inner, viewBox = '0 0 128 128') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${inner}</svg>`;
  }

  function textSticker(label, text, options = {}) {
    const fill = options.fill || '#111827';
    const color = options.color || '#FFFFFF';
    const accent = options.accent || 'rgba(255,255,255,0.22)';
    return svg(`
      <defs>
        <linearGradient id="${options.id || label.replace(/\W+/g, '_')}_g" x1="18" y1="16" x2="112" y2="116" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="${options.start || fill}"/>
          <stop offset="1" stop-color="${options.end || fill}"/>
        </linearGradient>
      </defs>
      <rect x="10" y="30" width="108" height="68" rx="24" fill="url(#${options.id || label.replace(/\W+/g, '_')}_g)"/>
      <path d="M24 44c18-10 62-10 80 0" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
      <text x="64" y="72" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="${options.size || 21}" font-weight="800" fill="${color}">${text}</text>
    `);
  }

  const items = [
    {
      id: 'badge_whatsapp_order',
      category: 'featured',
      label: 'WhatsApp order',
      kind: 'svg',
      tags: ['whatsapp', 'order', 'business', 'chat', 'call'],
      width: 0.34,
      height: 0.18,
      svg: textSticker('WhatsApp order', 'WhatsApp', {
        id: 'whatsapp_order',
        fill: '#16A34A',
        start: '#22C55E',
        end: '#15803D',
        size: 20
      })
    },
    {
      id: 'badge_limited_offer',
      category: 'featured',
      label: 'Limited offer',
      kind: 'svg',
      tags: ['offer', 'sale', 'discount', 'retail'],
      width: 0.36,
      height: 0.18,
      svg: textSticker('Limited offer', 'Limited', {
        id: 'limited_offer',
        fill: '#E11D48',
        start: '#FB7185',
        end: '#BE123C',
        size: 21
      })
    },
    {
      id: 'shape_gold_seal',
      category: 'featured',
      label: 'Gold seal',
      kind: 'svg',
      tags: ['premium', 'seal', 'gold', 'badge', 'offer'],
      width: 0.2,
      height: 0.2,
      svg: svg(`
        <defs>
          <linearGradient id="gold_seal_g" x1="22" y1="18" x2="106" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#FFF7AD"/>
            <stop offset="0.45" stop-color="#FACC15"/>
            <stop offset="1" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <path d="M64 10l9 14 16-6 3 17 17 3-6 16 14 9-14 9 6 16-17 3-3 17-16-6-9 14-9-14-16 6-3-17-17-3 6-16-14-9 14-9-6-16 17-3 3-17 16 6 9-14z" fill="url(#gold_seal_g)"/>
        <circle cx="64" cy="64" r="34" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.62)" stroke-width="3"/>
        <path d="M48 64l11 11 23-27" fill="none" stroke="#3F2600" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `)
    },
    {
      id: 'decor_rangoli_round',
      category: 'featured',
      label: 'Rangoli round',
      kind: 'svg',
      tags: ['festival', 'rangoli', 'diwali', 'decor'],
      width: 0.24,
      height: 0.24,
      svg: svg(`
        <circle cx="64" cy="64" r="48" fill="#7C2D12"/>
        <g transform="translate(64 64)">
          <g fill="#FDE68A">
            <ellipse rx="10" ry="28" transform="rotate(0) translate(0 -24)"/>
            <ellipse rx="10" ry="28" transform="rotate(45) translate(0 -24)"/>
            <ellipse rx="10" ry="28" transform="rotate(90) translate(0 -24)"/>
            <ellipse rx="10" ry="28" transform="rotate(135) translate(0 -24)"/>
            <ellipse rx="10" ry="28" transform="rotate(180) translate(0 -24)"/>
            <ellipse rx="10" ry="28" transform="rotate(225) translate(0 -24)"/>
            <ellipse rx="10" ry="28" transform="rotate(270) translate(0 -24)"/>
            <ellipse rx="10" ry="28" transform="rotate(315) translate(0 -24)"/>
          </g>
          <circle r="22" fill="#E11D48"/>
          <circle r="10" fill="#FFFFFF"/>
        </g>
      `)
    },
    {
      id: 'emoji_diya',
      category: 'emoji',
      label: 'Diya',
      kind: 'emoji',
      glyph: '🪔',
      tags: ['diwali', 'lamp', 'festival', 'light'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'emoji_folded_hands',
      category: 'emoji',
      label: 'Namaste',
      kind: 'emoji',
      glyph: '🙏',
      tags: ['greeting', 'namaste', 'thanks', 'festival'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'emoji_party',
      category: 'emoji',
      label: 'Party popper',
      kind: 'emoji',
      glyph: '🎉',
      tags: ['party', 'birthday', 'celebration'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'emoji_gift',
      category: 'emoji',
      label: 'Gift',
      kind: 'emoji',
      glyph: '🎁',
      tags: ['gift', 'offer', 'birthday', 'sale'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'emoji_heart',
      category: 'emoji',
      label: 'Heart',
      kind: 'emoji',
      glyph: '❤️',
      tags: ['love', 'wedding', 'anniversary'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'emoji_sparkles',
      category: 'emoji',
      label: 'Sparkles',
      kind: 'emoji',
      glyph: '✨',
      tags: ['sparkle', 'premium', 'highlight'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'emoji_camera',
      category: 'emoji',
      label: 'Camera',
      kind: 'emoji',
      glyph: '📸',
      tags: ['photo', 'camera', 'studio'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'emoji_shop',
      category: 'emoji',
      label: 'Shop',
      kind: 'emoji',
      glyph: '🏪',
      tags: ['shop', 'store', 'business'],
      width: 0.16,
      height: 0.16
    },
    {
      id: 'shape_soft_blob',
      category: 'shapes',
      label: 'Soft blob',
      kind: 'svg',
      tags: ['shape', 'blob', 'background', 'highlight'],
      width: 0.28,
      height: 0.22,
      svg: svg(`
        <defs>
          <linearGradient id="blob_g" x1="19" y1="18" x2="110" y2="111" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#F97316"/>
            <stop offset="1" stop-color="#DB2777"/>
          </linearGradient>
        </defs>
        <path d="M31 27c16-15 45-16 62-3 20 15 25 47 13 66-13 21-45 28-69 16-24-12-36-44-23-65 4-6 9-10 17-14z" fill="url(#blob_g)"/>
        <path d="M33 38c12-9 33-10 48-4" fill="none" stroke="rgba(255,255,255,0.36)" stroke-width="8" stroke-linecap="round"/>
      `)
    },
    {
      id: 'shape_sunburst',
      category: 'shapes',
      label: 'Sunburst',
      kind: 'svg',
      tags: ['shape', 'sale', 'burst', 'offer'],
      width: 0.24,
      height: 0.24,
      svg: svg(`
        <path d="M64 8l9 20 18-13-1 22 22-3-12 18 20 9-20 9 12 18-22-3 1 22-18-13-9 20-9-20-18 13 1-22-22 3 12-18-20-9 20-9-12-18 22 3-1-22 18 13 9-20z" fill="#FACC15"/>
        <circle cx="64" cy="64" r="34" fill="#EF4444"/>
        <text x="64" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="900" fill="#FFFFFF">SALE</text>
      `)
    },
    {
      id: 'shape_ticket',
      category: 'shapes',
      label: 'Ticket',
      kind: 'svg',
      tags: ['ticket', 'coupon', 'sale', 'entry'],
      width: 0.36,
      height: 0.18,
      svg: svg(`
        <path d="M18 34h92a12 12 0 0 1 12 12v10a11 11 0 0 0 0 16v10a12 12 0 0 1-12 12H18A12 12 0 0 1 6 82V72a11 11 0 0 0 0-16V46a12 12 0 0 1 12-12z" fill="#0F766E"/>
        <path d="M42 40v48" stroke="rgba(255,255,255,0.38)" stroke-width="4" stroke-dasharray="5 7"/>
        <text x="79" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" font-weight="900" fill="#FFFFFF">COUPON</text>
      `)
    },
    {
      id: 'shape_price_tag',
      category: 'shapes',
      label: 'Price tag',
      kind: 'svg',
      tags: ['price', 'tag', 'offer', 'retail'],
      width: 0.26,
      height: 0.2,
      svg: svg(`
        <path d="M16 30h52l44 44-38 38-44-44V30z" fill="#EA580C"/>
        <circle cx="46" cy="50" r="9" fill="#FFF7ED"/>
        <text x="70" y="82" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="900" fill="#FFFFFF">%</text>
      `)
    },
    {
      id: 'frame_polaroid',
      category: 'frames',
      label: 'Polaroid frame',
      kind: 'svg',
      tags: ['frame', 'photo', 'polaroid'],
      width: 0.42,
      height: 0.48,
      scaleWithCanvas: true,
      svg: svg(`
        <rect x="18" y="10" width="92" height="108" rx="6" fill="#FFFFFF"/>
        <rect x="28" y="22" width="72" height="68" rx="3" fill="rgba(15,23,42,0.13)" stroke="#E5E7EB" stroke-width="2"/>
        <path d="M38 104h52" stroke="#CBD5E1" stroke-width="5" stroke-linecap="round"/>
      `)
    },
    {
      id: 'frame_arch_gold',
      category: 'frames',
      label: 'Gold arch',
      kind: 'svg',
      tags: ['frame', 'wedding', 'gold', 'arch'],
      width: 0.48,
      height: 0.58,
      scaleWithCanvas: true,
      svg: svg(`
        <path d="M23 112V60c0-26 18-46 41-46s41 20 41 46v52" fill="none" stroke="#FACC15" stroke-width="10" stroke-linecap="round"/>
        <path d="M38 112V62c0-17 11-31 26-31s26 14 26 31v50" fill="none" stroke="rgba(255,255,255,0.54)" stroke-width="3"/>
        <circle cx="24" cy="112" r="8" fill="#B45309"/>
        <circle cx="104" cy="112" r="8" fill="#B45309"/>
      `)
    },
    {
      id: 'frame_story_neon',
      category: 'frames',
      label: 'Story neon',
      kind: 'svg',
      tags: ['frame', 'story', 'neon', 'instagram'],
      width: 0.62,
      height: 0.82,
      scaleWithCanvas: true,
      svg: svg(`
        <defs>
          <linearGradient id="story_neon_g" x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#F97316"/>
            <stop offset="0.52" stop-color="#E11D48"/>
            <stop offset="1" stop-color="#7C3AED"/>
          </linearGradient>
        </defs>
        <rect x="18" y="10" width="92" height="108" rx="22" fill="none" stroke="url(#story_neon_g)" stroke-width="9"/>
        <rect x="30" y="22" width="68" height="84" rx="16" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="2"/>
      `)
    },
    {
      id: 'decor_leaf_sprig',
      category: 'decorations',
      label: 'Leaf sprig',
      kind: 'svg',
      tags: ['leaf', 'nature', 'decor', 'wedding'],
      width: 0.24,
      height: 0.34,
      svg: svg(`
        <path d="M64 112C56 80 58 48 76 18" fill="none" stroke="#166534" stroke-width="6" stroke-linecap="round"/>
        <path d="M64 78c-20-5-28-18-27-33 17 0 30 10 27 33z" fill="#22C55E"/>
        <path d="M70 58c20-4 31-16 32-31-18-1-32 9-32 31z" fill="#16A34A"/>
        <path d="M62 96c-16-2-27-10-31-23 15-3 30 4 31 23z" fill="#86EFAC"/>
      `)
    },
    {
      id: 'decor_star_trail',
      category: 'decorations',
      label: 'Star trail',
      kind: 'svg',
      tags: ['stars', 'sparkle', 'premium', 'decor'],
      width: 0.36,
      height: 0.2,
      svg: svg(`
        <path d="M21 91C42 45 79 25 111 22" fill="none" stroke="rgba(250,204,21,0.76)" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 13"/>
        <path d="M39 21l5 12 13 2-10 8 3 13-11-7-12 7 4-13-10-8 13-2 5-12z" fill="#FACC15"/>
        <path d="M83 45l4 8 9 1-7 6 2 9-8-4-8 4 2-9-7-6 9-1 4-8z" fill="#FFFFFF"/>
        <path d="M104 74l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7z" fill="#FDE68A"/>
      `)
    },
    {
      id: 'decor_confetti',
      category: 'decorations',
      label: 'Confetti',
      kind: 'svg',
      tags: ['confetti', 'party', 'birthday', 'celebration'],
      width: 0.28,
      height: 0.26,
      svg: svg(`
        <rect x="16" y="24" width="13" height="8" rx="2" fill="#F97316" transform="rotate(-18 16 24)"/>
        <rect x="78" y="19" width="10" height="16" rx="2" fill="#22C55E" transform="rotate(21 78 19)"/>
        <rect x="98" y="62" width="14" height="9" rx="2" fill="#38BDF8" transform="rotate(-30 98 62)"/>
        <rect x="42" y="72" width="9" height="18" rx="2" fill="#E11D48" transform="rotate(18 42 72)"/>
        <circle cx="33" cy="52" r="7" fill="#FDE047"/>
        <circle cx="74" cy="86" r="6" fill="#A855F7"/>
        <path d="M68 31c9 6 15 12 19 22" fill="none" stroke="#FDE68A" stroke-width="5" stroke-linecap="round"/>
      `)
    },
    {
      id: 'arrow_curved_right',
      category: 'arrows',
      label: 'Curved right',
      kind: 'svg',
      tags: ['arrow', 'pointer', 'cta', 'right'],
      width: 0.28,
      height: 0.2,
      svg: svg(`
        <path d="M18 88c18-42 55-58 86-42" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
        <path d="M91 25l23 28-36 4" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 88c18-42 55-58 86-42" fill="none" stroke="#F97316" stroke-width="6" stroke-linecap="round"/>
        <path d="M91 25l23 28-36 4" fill="none" stroke="#F97316" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      `)
    },
    {
      id: 'arrow_bold_up',
      category: 'arrows',
      label: 'Bold up',
      kind: 'svg',
      tags: ['arrow', 'up', 'highlight', 'pointer'],
      width: 0.2,
      height: 0.26,
      svg: svg(`
        <path d="M64 12l44 50H84v54H44V62H20L64 12z" fill="#FACC15" stroke="#111827" stroke-width="5" stroke-linejoin="round"/>
      `)
    },
    {
      id: 'arrow_hand_pointer',
      category: 'arrows',
      label: 'Hand pointer',
      kind: 'svg',
      tags: ['pointer', 'click', 'tap', 'cta'],
      width: 0.2,
      height: 0.24,
      svg: svg(`
        <path d="M52 18c7 0 12 5 12 12v27l7-5c6-4 14-1 16 6l12 34c2 8-3 16-11 18H55c-7 0-13-4-16-10L25 71c-3-6-1-13 5-16 6-3 13-1 17 5l5 8V30c0-7 5-12 12-12z" fill="#FDE68A" stroke="#78350F" stroke-width="5" stroke-linejoin="round"/>
        <path d="M64 58v22" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>
      `)
    },
    {
      id: 'social_chat',
      category: 'social',
      label: 'Chat bubble',
      kind: 'svg',
      tags: ['whatsapp', 'chat', 'message', 'contact'],
      width: 0.18,
      height: 0.18,
      svg: svg(`
        <circle cx="64" cy="64" r="52" fill="#16A34A"/>
        <path d="M38 94l8-18a32 32 0 1 1 13 12l-21 6z" fill="#FFFFFF"/>
        <path d="M55 52c5 15 16 24 30 28" fill="none" stroke="#16A34A" stroke-width="8" stroke-linecap="round"/>
      `)
    },
    {
      id: 'social_camera',
      category: 'social',
      label: 'Camera social',
      kind: 'svg',
      tags: ['instagram', 'camera', 'social', 'photo'],
      width: 0.18,
      height: 0.18,
      svg: svg(`
        <defs>
          <linearGradient id="camera_social_g" x1="24" y1="18" x2="104" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#FDE047"/>
            <stop offset="0.42" stop-color="#F97316"/>
            <stop offset="0.72" stop-color="#DB2777"/>
            <stop offset="1" stop-color="#7C3AED"/>
          </linearGradient>
        </defs>
        <rect x="18" y="18" width="92" height="92" rx="28" fill="url(#camera_social_g)"/>
        <circle cx="64" cy="64" r="22" fill="none" stroke="#FFFFFF" stroke-width="8"/>
        <circle cx="88" cy="39" r="6" fill="#FFFFFF"/>
      `)
    },
    {
      id: 'social_play',
      category: 'social',
      label: 'Play button',
      kind: 'svg',
      tags: ['youtube', 'video', 'play', 'social'],
      width: 0.2,
      height: 0.16,
      svg: svg(`
        <rect x="14" y="28" width="100" height="72" rx="22" fill="#DC2626"/>
        <path d="M56 48l28 16-28 16V48z" fill="#FFFFFF"/>
      `)
    },
    {
      id: 'social_location',
      category: 'social',
      label: 'Location pin',
      kind: 'svg',
      tags: ['location', 'map', 'address', 'store'],
      width: 0.16,
      height: 0.2,
      svg: svg(`
        <path d="M64 116S28 78 28 48a36 36 0 1 1 72 0c0 30-36 68-36 68z" fill="#E11D48"/>
        <circle cx="64" cy="48" r="15" fill="#FFFFFF"/>
      `)
    },
    {
      id: 'social_phone',
      category: 'social',
      label: 'Phone',
      kind: 'svg',
      tags: ['phone', 'call', 'contact'],
      width: 0.17,
      height: 0.17,
      svg: svg(`
        <circle cx="64" cy="64" r="52" fill="#2563EB"/>
        <path d="M46 34l13 13-8 10c6 12 15 21 27 27l10-8 13 13c-3 11-12 17-24 15-28-6-50-28-56-56-2-12 4-21 15-24z" fill="#FFFFFF"/>
      `)
    }
  ];

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function getCategories() {
    return categories.slice();
  }

  function getAll() {
    return items.slice();
  }

  function getById(id) {
    return items.find(item => item.id === id) || null;
  }

  function search({ category = 'featured', query = '' } = {}) {
    const text = normalize(query);
    return items.filter((item) => {
      const categoryMatch = category === 'all' ||
        (category === 'featured' ? item.category === 'featured' || item.featured : item.category === category);
      if (!categoryMatch) return false;
      if (!text) return true;

      const haystack = [
        item.id,
        item.label,
        item.category,
        item.kind,
        ...(item.tags || [])
      ].map(normalize).join(' ');

      return haystack.includes(text);
    });
  }

  function createLayer(id, overrides = {}) {
    const item = getById(id);
    if (!item) return null;

    return {
      id: overrides.id || `sticker_${Date.now()}`,
      label: item.label,
      type: 'sticker',
      stickerId: item.id,
      stickerKind: item.kind,
      category: item.category,
      tags: item.tags || [],
      glyph: item.glyph || null,
      svg: item.svg || null,
      x: overrides.x ?? 0.42,
      y: overrides.y ?? 0.42,
      width: overrides.width ?? item.width ?? 0.2,
      height: overrides.height ?? item.height ?? item.width ?? 0.2,
      scaleWithCanvas: Boolean(item.scaleWithCanvas),
      rotation: overrides.rotation ?? 0,
      opacity: overrides.opacity ?? 1,
      editable: true,
      userAdded: true
    };
  }

  return {
    getCategories,
    getAll,
    getById,
    search,
    createLayer
  };
})();
