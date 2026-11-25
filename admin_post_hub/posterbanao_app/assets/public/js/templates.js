/* ============================================
   PosterBanao - Template Catalog
   Searchable template registry and category metadata
   ============================================ */

const TemplateRegistry = (() => {
  const categoryOptions = [
    { id: 'all', label: 'All' },
    { id: 'premium_themes', label: 'Premium Themes' },
    { id: 'photo', label: 'Real Photos' },
    { id: 'states', label: 'States' },
    { id: 'festival', label: 'Festivals' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'party', label: 'Parties' },
    { id: 'business', label: 'Business' },
    { id: 'video', label: 'Video Invites' },
    { id: 'daily', label: 'Daily' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'saved', label: 'My Designs' }
  ];

  const commonOverlay = {
    bannerY: 0.78,
    bannerHeight: 0.22,
    bannerColor: 'rgba(18, 16, 20, 0.86)',
    logoX: 0.06,
    logoY: 0.82,
    logoSize: 0.12,
    nameX: 0.22,
    nameY: 0.86,
    nameFontSize: 36,
    nameColor: '#FFD700',
    phoneX: 0.22,
    phoneY: 0.92,
    phoneFontSize: 22,
    phoneColor: '#FFFFFF',
    taglineX: 0.22,
    taglineY: 0.96,
    taglineFontSize: 16,
    taglineColor: 'rgba(255,255,255,0.72)'
  };

  function overlay(overrides = {}) {
    return { ...commonOverlay, ...overrides };
  }

  function generatedBackground(type, gradient, text, subtext, textColor = '#FFFFFF', options = {}) {
    return {
      type,
      gradient,
      text,
      subtext,
      textColor,
      decorEmojis: [],
      ...options
    };
  }

  function editableTextLayer(id, label, text, x, y, options = {}) {
    return {
      id,
      label,
      type: 'text',
      text,
      x,
      y,
      maxWidth: options.maxWidth ?? 0.78,
      fontSize: options.fontSize ?? 38,
      weight: options.weight || '600',
      fontFamily: options.fontFamily || '"Outfit", "Arial", sans-serif',
      color: options.color || '#FFFFFF',
      align: options.align || 'center',
      baseline: options.baseline || 'middle',
      shadowBlur: options.shadowBlur ?? 8,
      editable: true,
      templateLayer: true
    };
  }

  function editableImageSlot(id, label, x, y, width, height, options = {}) {
    return {
      id,
      label,
      type: 'image',
      x,
      y,
      width,
      height,
      mask: options.mask || 'rounded',
      fit: options.fit || 'cover',
      cropX: options.cropX ?? 0.5,
      cropY: options.cropY ?? 0.5,
      cropZoom: options.cropZoom ?? 1,
      padding: options.padding ?? 0.012,
      frameColor: options.frameColor || 'rgba(255,255,255,0.78)',
      backgroundColor: options.backgroundColor || 'rgba(255,255,255,0.10)',
      placeholderLabel: options.placeholderLabel || label,
      editable: true,
      templateLayer: true,
      slot: true
    };
  }

  function productionLayout(name) {
    const layouts = {
      portrait: {
        slot: { x: 0.29, y: 0.32, width: 0.42, height: 0.33 },
        title: { x: 0.5, y: 0.16, maxWidth: 0.82 },
        subtitle: { x: 0.5, y: 0.235, maxWidth: 0.74 },
        detail: { x: 0.5, y: 0.70, maxWidth: 0.76 }
      },
      side: {
        slot: { x: 0.07, y: 0.29, width: 0.38, height: 0.40 },
        title: { x: 0.67, y: 0.27, maxWidth: 0.46 },
        subtitle: { x: 0.67, y: 0.38, maxWidth: 0.42 },
        detail: { x: 0.67, y: 0.58, maxWidth: 0.42 }
      },
      hero: {
        slot: { x: 0.18, y: 0.32, width: 0.64, height: 0.31 },
        title: { x: 0.5, y: 0.16, maxWidth: 0.84 },
        subtitle: { x: 0.5, y: 0.24, maxWidth: 0.76 },
        detail: { x: 0.5, y: 0.69, maxWidth: 0.78 }
      },
      editorial: {
        slot: { x: 0.49, y: 0.28, width: 0.40, height: 0.42 },
        title: { x: 0.28, y: 0.28, maxWidth: 0.40 },
        subtitle: { x: 0.28, y: 0.41, maxWidth: 0.38 },
        detail: { x: 0.28, y: 0.61, maxWidth: 0.38 }
      }
    };
    return layouts[name] || layouts.portrait;
  }

  function buildProductionLayers(spec) {
    const layout = productionLayout(spec.layout);
    const titleColor = spec.titleColor || '#FFFFFF';
    const subtitleColor = spec.subtitleColor || 'rgba(255,255,255,0.86)';
    const detailColor = spec.detailColor || 'rgba(255,255,255,0.82)';
    const titleAlign = spec.layout === 'side' || spec.layout === 'editorial' ? 'center' : 'center';

    const layers = [
      editableImageSlot(
        'primary_photo',
        spec.slotLabel || 'Photo',
        layout.slot.x,
        layout.slot.y,
        layout.slot.width,
        layout.slot.height,
        {
          mask: spec.mask || 'rounded',
          frameColor: spec.frameColor || 'rgba(255,255,255,0.72)',
          backgroundColor: spec.slotBackground || 'rgba(255,255,255,0.10)',
          placeholderLabel: spec.placeholderLabel || spec.slotLabel || 'Photo'
        }
      ),
      editableTextLayer('event_title', 'Title', spec.headline, layout.title.x, layout.title.y, {
        fontSize: spec.titleSize || 58,
        weight: '800',
        color: titleColor,
        maxWidth: layout.title.maxWidth,
        align: titleAlign,
        shadowBlur: 12
      }),
      editableTextLayer('event_subtitle', 'Subtitle', spec.subline, layout.subtitle.x, layout.subtitle.y, {
        fontSize: spec.subtitleSize || 27,
        weight: '500',
        color: subtitleColor,
        maxWidth: layout.subtitle.maxWidth,
        align: titleAlign
      }),
      editableTextLayer('event_details', 'Details', spec.detail || 'Date | Time | Venue', layout.detail.x, layout.detail.y, {
        fontSize: spec.detailSize || 25,
        weight: '600',
        color: detailColor,
        maxWidth: layout.detail.maxWidth,
        align: titleAlign
      })
    ];

    if (spec.note) {
      layers.push(editableTextLayer('event_note', 'Note', spec.note, 0.5, 0.745, {
        fontSize: 20,
        weight: '500',
        color: spec.noteColor || 'rgba(255,255,255,0.74)',
        maxWidth: 0.8
      }));
    }

    return layers;
  }

  function weddingArtworkPhotoSlot(spec) {
    if (spec.category !== 'wedding') return null;

    const group = spec.subcategory || '';
    const common = {
      frameColor: spec.accent || '#FDE68A',
      backgroundColor: 'rgba(12, 10, 18, 0.34)',
      placeholderColor: 'rgba(255,255,255,0.84)',
      frameWidth: 0.004,
      padding: 0.014
    };

    if (['haldi', 'mehndi', 'bride_entry', 'marathi'].includes(group)) {
      const label = group === 'mehndi' || group === 'bride_entry' ? 'Bride Photo' : 'Bride/Groom Photo';
      return editableImageSlot('wedding_center_photo', label, 0.29, 0.285, 0.42, 0.39, {
        ...common,
        mask: group === 'haldi' ? 'circle' : 'arch',
        placeholderLabel: label
      });
    }

    if (['punjabi', 'baraat'].includes(group)) {
      return editableImageSlot('wedding_center_photo', 'Groom Photo', 0.30, 0.285, 0.40, 0.40, {
        ...common,
        mask: 'arch',
        placeholderLabel: 'Groom Photo'
      });
    }

    if (['reception', 'wedding_invite', 'save_the_date', 'engagement', 'couple_photo', 'south_indian', 'bengali', 'west_indian', 'nikah', 'christian', 'destination', 'varmala', 'premium_wedding'].includes(group)) {
      return editableImageSlot('wedding_center_photo', 'Bride & Groom Photo', 0.205, 0.285, 0.59, 0.41, {
        ...common,
        mask: 'arch',
        placeholderLabel: 'Bride & Groom'
      });
    }

    if (['rsvp', 'thank_you'].includes(group)) {
      return editableImageSlot('wedding_center_photo', 'Couple Photo', 0.31, 0.30, 0.38, 0.34, {
        ...common,
        mask: group === 'thank_you' ? 'heart' : 'oval',
        placeholderLabel: 'Couple Photo'
      });
    }

    return editableImageSlot('wedding_center_photo', 'Wedding Photo', 0.28, 0.30, 0.44, 0.38, {
      ...common,
      mask: 'arch',
      placeholderLabel: 'Wedding Photo'
    });
  }

  function artworkDefaultLayers(spec) {
    if (spec.defaultLayers) return spec.defaultLayers;
    const slot = weddingArtworkPhotoSlot(spec);
    return slot ? [slot] : [];
  }

  function productionTemplate(spec) {
    const videoTags = spec.isVideoInvite ? ['video', 'animated', 'whatsapp video'] : [];
    return {
      id: spec.id,
      name: spec.name,
      category: spec.category,
      subcategory: spec.subcategory,
      categoryLabel: spec.categoryLabel,
      path: null,
      isPremium: Boolean(spec.isPremium),
      isVideoInvite: Boolean(spec.isVideoInvite),
      animationPreset: spec.animationPreset || (spec.isVideoInvite ? 'cinematic' : null),
      animationIntensity: spec.animationIntensity ?? 1,
      animationSpeed: spec.animationSpeed ?? 1,
      emoji: spec.emoji,
      tags: [
        spec.category,
        spec.subcategory,
        spec.categoryLabel,
        spec.headline,
        spec.subline,
        spec.slotLabel,
        ...(spec.tags || []),
        ...videoTags
      ].filter(Boolean),
      canvasGen: generatedBackground(spec.id, spec.gradient, '', '', spec.textColor || '#FFFFFF', {
        motif: spec.motif || null,
        accentColor: spec.accentColor || spec.frameColor || '#FFD166'
      }),
      overlayConfig: overlay(spec.overlay || {
        bannerColor: spec.bannerColor || 'rgba(16, 18, 27, 0.9)',
        nameColor: spec.businessColor || '#FFFFFF',
        phoneColor: spec.phoneColor || 'rgba(255,255,255,0.86)'
      }),
      defaultLayers: buildProductionLayers(spec)
    };
  }

  function photoTextLayer(id, label, text, y, options = {}) {
    return editableTextLayer(id, label, text, options.x ?? 0.5, y, {
      fontSize: options.fontSize,
      weight: options.weight,
      color: options.color,
      maxWidth: options.maxWidth ?? 0.82,
      align: options.align || 'center',
      shadowBlur: options.shadowBlur ?? 16
    });
  }

  function photoTemplate(spec) {
    const accent = spec.accent || '#FDE68A';
    return {
      id: spec.id,
      name: spec.name,
      category: spec.category,
      subcategory: 'photo',
      categoryLabel: spec.categoryLabel,
      path: `assets/photos/${spec.photo}`,
      isPhotoTemplate: true,
      isPremium: Boolean(spec.isPremium),
      isVideoInvite: Boolean(spec.isVideoInvite),
      animationPreset: spec.animationPreset || (spec.isVideoInvite ? 'cinematic' : null),
      animationIntensity: spec.animationIntensity ?? 1,
      animationSpeed: spec.animationSpeed ?? 1,
      emoji: 'PH',
      tags: [
        'real photo',
        'photo template',
        spec.category,
        spec.categoryLabel,
        spec.name,
        spec.headline,
        spec.subline,
        ...(spec.tags || [])
      ].filter(Boolean),
      canvasGen: generatedBackground(spec.id, spec.fallbackGradient || ['#111827', '#334155', '#0F766E'], spec.headline, spec.subline, '#FFFFFF'),
      overlayConfig: overlay({
        bannerY: 0.765,
        bannerHeight: 0.235,
        bannerColor: spec.bannerColor || 'rgba(7, 10, 18, 0.88)',
        logoX: 0.06,
        logoY: 0.815,
        logoSize: 0.115,
        nameX: 0.205,
        nameY: 0.852,
        nameFontSize: 42,
        nameColor: spec.businessColor || accent,
        phoneX: 0.205,
        phoneY: 0.912,
        phoneFontSize: 34,
        phoneColor: 'rgba(255,255,255,0.9)',
        taglineX: 0.205,
        taglineY: 0.956,
        taglineFontSize: 24,
        taglineColor: 'rgba(255,255,255,0.7)'
      }),
      defaultLayers: [
        {
          id: 'photo_readability_scrim',
          label: 'Photo Contrast',
          type: 'shape',
          shape: 'rect',
          x: 0,
          y: 0,
          width: 1,
          height: 0.765,
          color: spec.scrimColor || 'rgba(0,0,0,0.38)',
          editable: false,
          templateLayer: true
        },
        {
          id: 'photo_caption_panel',
          label: 'Caption Panel',
          type: 'shape',
          shape: 'rect',
          x: 0.07,
          y: spec.panelY ?? 0.095,
          width: 0.86,
          height: spec.panelHeight ?? 0.245,
          radius: 22,
          color: spec.panelColor || 'rgba(5, 8, 14, 0.48)',
          editable: false,
          templateLayer: true
        },
        photoTextLayer('photo_kicker', 'Kicker', spec.kicker || spec.categoryLabel, spec.kickerY ?? 0.14, {
          fontSize: 22,
          weight: '800',
          color: accent,
          maxWidth: 0.74,
          shadowBlur: 12
        }),
        photoTextLayer('photo_title', 'Title', spec.headline, spec.titleY ?? 0.215, {
          fontSize: spec.titleSize || 66,
          weight: '800',
          color: spec.titleColor || '#FFFFFF',
          maxWidth: 0.78,
          shadowBlur: 18
        }),
        photoTextLayer('photo_subtitle', 'Subtitle', spec.subline, spec.subtitleY ?? 0.295, {
          fontSize: spec.subtitleSize || 28,
          weight: '600',
          color: spec.subtitleColor || 'rgba(255,255,255,0.9)',
          maxWidth: 0.78,
          shadowBlur: 12
        }),
        photoTextLayer('photo_detail', 'Details', spec.detail, spec.detailY ?? 0.665, {
          fontSize: spec.detailSize || 26,
          weight: '700',
          color: spec.detailColor || '#FFFFFF',
          maxWidth: 0.76,
          shadowBlur: 16
        })
      ]
    };
  }

  function createRealPhotoTemplates() {
    return [
      photoTemplate({
        id: 'real_photo_wedding_01',
        name: 'Real Photo Wedding',
        category: 'wedding',
        categoryLabel: 'Wedding',
        photo: 'wedding_real.jpg',
        kicker: 'Wedding Invitation',
        headline: 'Together Forever',
        subline: 'Join us for the celebration',
        detail: 'Date | Time | Venue',
        accent: '#FDE68A',
        tags: ['couple', 'wedding invite', 'save the date'],
        fallbackGradient: ['#111827', '#7C2D12', '#FDE68A'],
        isPremium: true
      }),
      photoTemplate({
        id: 'real_photo_stage_event_01',
        name: 'Live Event Photo',
        category: 'party',
        categoryLabel: 'Event',
        photo: 'event_stage_real.jpg',
        kicker: 'Live Night',
        headline: 'Grand Celebration',
        subline: 'Music, lights and memories',
        detail: '7 PM | Main Stage',
        accent: '#A7F3D0',
        tags: ['concert', 'party', 'stage', 'event invite'],
        fallbackGradient: ['#020617', '#0E7490', '#A7F3D0'],
        isVideoInvite: true,
        animationPreset: 'stage3d'
      }),
      photoTemplate({
        id: 'real_photo_birthday_01',
        name: 'Real Cake Birthday',
        category: 'birthday',
        categoryLabel: 'Birthday',
        photo: 'birthday_cake_real.jpg',
        kicker: 'Birthday Invite',
        headline: 'Make a Wish',
        subline: 'Cake, smiles and celebration',
        detail: 'Sunday | 5 PM | Home',
        accent: '#FBCFE8',
        tags: ['birthday cake', 'kids birthday', 'party'],
        fallbackGradient: ['#831843', '#BE185D', '#FBCFE8']
      }),
      photoTemplate({
        id: 'real_photo_retail_offer_01',
        name: 'Retail Offer Photo',
        category: 'business',
        categoryLabel: 'Business',
        photo: 'retail_offer_real.jpg',
        kicker: 'Store Offer',
        headline: 'Fresh Deals',
        subline: 'New arrivals and daily savings',
        detail: 'This Week Only',
        accent: '#FDE047',
        tags: ['shop', 'sale', 'offer', 'retail'],
        fallbackGradient: ['#713F12', '#CA8A04', '#FEF3C7'],
        isVideoInvite: true,
        animationPreset: 'product3d'
      }),
      photoTemplate({
        id: 'real_photo_restaurant_01',
        name: 'Restaurant Photo Invite',
        category: 'business',
        categoryLabel: 'Food',
        photo: 'restaurant_real.jpg',
        kicker: 'Food Festival',
        headline: 'Taste The Weekend',
        subline: 'Special menu for family and friends',
        detail: 'Book Your Table Today',
        accent: '#FDBA74',
        tags: ['restaurant', 'cafe', 'food festival', 'menu'],
        fallbackGradient: ['#431407', '#EA580C', '#FED7AA']
      }),
      photoTemplate({
        id: 'real_photo_housewarming_01',
        name: 'Housewarming Photo',
        category: 'party',
        categoryLabel: 'Housewarming',
        photo: 'home_real.jpg',
        kicker: 'Griha Pravesh',
        headline: 'New Home',
        subline: 'Blessings, lunch and warm memories',
        detail: 'Pooja | Lunch | Address',
        accent: '#BAE6FD',
        tags: ['housewarming', 'griha pravesh', 'home'],
        fallbackGradient: ['#134E4A', '#14B8A6', '#BAE6FD'],
        isPremium: true
      }),
      photoTemplate({
        id: 'generated_photo_salon_01',
        name: 'Salon Studio Photo',
        category: 'business',
        categoryLabel: 'Salon',
        photo: 'generated/salon_studio_generated.jpg',
        kicker: 'Beauty Studio',
        headline: 'Glow Up Today',
        subline: 'Fresh styling for every occasion',
        detail: 'Book Your Appointment',
        accent: '#F9A8D4',
        businessColor: '#FDE68A',
        tags: ['salon', 'beauty', 'makeup', 'generated photo'],
        fallbackGradient: ['#4A044E', '#DB2777', '#F9A8D4'],
        isPremium: true
      }),
      photoTemplate({
        id: 'generated_photo_clinic_01',
        name: 'Clinic Trust Photo',
        category: 'business',
        categoryLabel: 'Clinic',
        photo: 'generated/clinic_reception_generated.jpg',
        kicker: 'Healthcare',
        headline: 'Care You Can Trust',
        subline: 'Clean, calm and professional service',
        detail: 'Appointments Open',
        accent: '#99F6E4',
        businessColor: '#A7F3D0',
        tags: ['clinic', 'doctor', 'healthcare', 'generated photo'],
        fallbackGradient: ['#0F766E', '#14B8A6', '#CCFBF1']
      }),
      photoTemplate({
        id: 'generated_photo_coaching_01',
        name: 'Coaching Class Photo',
        category: 'business',
        categoryLabel: 'Education',
        photo: 'generated/coaching_class_generated.jpg',
        kicker: 'Admissions Open',
        headline: 'Learn With Focus',
        subline: 'New batches for serious students',
        detail: 'Enroll This Week',
        accent: '#FDE68A',
        businessColor: '#FDE68A',
        tags: ['coaching', 'education', 'classes', 'generated photo'],
        fallbackGradient: ['#111827', '#2563EB', '#FDE68A'],
        isVideoInvite: true,
        animationPreset: 'slide'
      }),
      photoTemplate({
        id: 'generated_photo_real_estate_01',
        name: 'Real Estate Photo',
        category: 'business',
        categoryLabel: 'Real Estate',
        photo: 'generated/real_estate_showcase_generated.jpg',
        kicker: 'Property Showcase',
        headline: 'Open House',
        subline: 'Modern spaces ready to visit',
        detail: 'Schedule A Site Visit',
        accent: '#BAE6FD',
        businessColor: '#FFFFFF',
        tags: ['real estate', 'property', 'open house', 'generated photo'],
        fallbackGradient: ['#0F172A', '#0EA5E9', '#A7F3D0'],
        isPremium: true
      }),
      photoTemplate({
        id: 'generated_photo_boutique_01',
        name: 'Boutique Display Photo',
        category: 'business',
        categoryLabel: 'Boutique',
        photo: 'generated/boutique_display_generated.jpg',
        kicker: 'New Collection',
        headline: 'Fresh Styles',
        subline: 'Festive looks and daily wear',
        detail: 'Visit Store Today',
        accent: '#FDE68A',
        businessColor: '#FDE68A',
        tags: ['boutique', 'fashion', 'clothing', 'generated photo'],
        fallbackGradient: ['#4A044E', '#BE185D', '#FDE68A']
      }),
      photoTemplate({
        id: 'generated_photo_fitness_01',
        name: 'Fitness Gym Photo',
        category: 'business',
        categoryLabel: 'Fitness',
        photo: 'generated/fitness_gym_generated.jpg',
        kicker: 'Fitness Offer',
        headline: 'Train Strong',
        subline: 'Membership plans for every goal',
        detail: 'Join This Month',
        accent: '#FCA5A5',
        businessColor: '#FDE68A',
        tags: ['gym', 'fitness', 'workout', 'generated photo'],
        fallbackGradient: ['#020617', '#DC2626', '#FDE68A'],
        isVideoInvite: true,
        animationPreset: 'product3d'
      })
    ];
  }

  function createProductionTemplates() {
    return [
      productionTemplate({ id: 'save_date_01', name: 'Save The Date', category: 'wedding', subcategory: 'save_the_date', categoryLabel: 'Wedding', emoji: 'SD', headline: 'Save The Date', subline: 'Two families, one celebration', detail: '12 Dec | 7 PM | Jaipur', slotLabel: 'Couple Photo', mask: 'arch', layout: 'portrait', gradient: ['#431407', '#9A3412', '#FDBA74'], frameColor: '#FED7AA', tags: ['marriage', 'couple'] }),
      productionTemplate({ id: 'wedding_floral_01', name: 'Floral Wedding Invite', category: 'wedding', subcategory: 'wedding_invite', categoryLabel: 'Wedding', emoji: 'WF', headline: 'Wedding Invitation', subline: 'Join us for the big day', detail: 'Dinner follows the ceremony', slotLabel: 'Couple Photo', mask: 'heart', layout: 'hero', gradient: ['#4C0519', '#BE123C', '#FCE7F3'], frameColor: '#FBCFE8', isVideoInvite: true, animationPreset: 'sparkle', isPremium: true, tags: ['wedding', 'floral', 'couple'] }),
      productionTemplate({ id: 'reception_gold_01', name: 'Gold Reception', category: 'wedding', subcategory: 'reception', categoryLabel: 'Wedding', emoji: 'RG', headline: 'Reception Night', subline: 'An evening of blessings and dinner', detail: '8 PM onwards | Grand Hall', slotLabel: 'Couple Photo', mask: 'oval', layout: 'side', gradient: ['#111827', '#7C2D12', '#FACC15'], frameColor: '#FDE68A', isVideoInvite: true, animationPreset: 'spotlight', tags: ['reception', 'gold'] }),
      productionTemplate({ id: 'haldi_modern_01', name: 'Modern Haldi', category: 'wedding', subcategory: 'haldi', categoryLabel: 'Wedding', emoji: 'HM', headline: 'Haldi Ceremony', subline: 'Yellow, laughter and blessings', detail: '10 AM | Home Lawn', slotLabel: 'Bride/Groom Photo', mask: 'circle', layout: 'editorial', gradient: ['#78350F', '#F59E0B', '#FEF3C7'], titleColor: '#FFF7D6', frameColor: '#FDE68A', tags: ['haldi', 'yellow'] }),
      productionTemplate({ id: 'mehndi_floral_01', name: 'Floral Mehndi', category: 'wedding', subcategory: 'mehndi', categoryLabel: 'Wedding', emoji: 'MF', headline: 'Mehndi Night', subline: 'Patterns, music and memories', detail: '5 PM | Courtyard', slotLabel: 'Bride Photo', mask: 'rounded', layout: 'portrait', gradient: ['#052E16', '#15803D', '#FACC15'], frameColor: '#BBF7D0', tags: ['mehndi', 'green'] }),
      productionTemplate({ id: 'sangeet_stage_01', name: 'Sangeet Stage', category: 'wedding', subcategory: 'sangeet', categoryLabel: 'Wedding', emoji: 'SS', headline: 'Sangeet Celebration', subline: 'Music, dance and family', detail: '7 PM | Ballroom', slotLabel: 'Couple Photo', mask: 'arch', layout: 'hero', gradient: ['#581C87', '#C026D3', '#FB923C'], frameColor: '#F5D0FE', isVideoInvite: true, animationPreset: 'confetti', tags: ['sangeet', 'dance'] }),
      productionTemplate({ id: 'engagement_ring_01', name: 'Ring Ceremony', category: 'wedding', subcategory: 'engagement', categoryLabel: 'Wedding', emoji: 'ER', headline: 'Engagement', subline: 'Two hearts, one promise', detail: 'Sunday | 6 PM | Orchid Hall', slotLabel: 'Couple Photo', mask: 'circle', layout: 'side', gradient: ['#1E1B4B', '#7C3AED', '#FDE68A'], frameColor: '#DDD6FE', tags: ['engagement', 'ring ceremony'] }),
      productionTemplate({ id: 'cocktail_night_01', name: 'Cocktail Night', category: 'wedding', subcategory: 'cocktail', categoryLabel: 'Wedding', emoji: 'CN', headline: 'Cocktail Night', subline: 'Dress sharp, dance late', detail: '8 PM | Rooftop Lounge', slotLabel: 'Host Photo', mask: 'oval', layout: 'editorial', gradient: ['#020617', '#334155', '#A78BFA'], frameColor: '#C4B5FD', isPremium: true, tags: ['cocktail', 'party'] }),
      productionTemplate({ id: 'baraat_royal_01', name: 'Royal Baraat', category: 'wedding', subcategory: 'baraat', categoryLabel: 'Wedding', emoji: 'BR', headline: 'Baraat Welcome', subline: 'Let the procession begin', detail: '4 PM | Main Gate', slotLabel: 'Groom Photo', mask: 'arch', layout: 'portrait', gradient: ['#450A0A', '#B91C1C', '#F59E0B'], frameColor: '#FCD34D', tags: ['baraat', 'groom'] }),
      productionTemplate({ id: 'couple_photo_01', name: 'Couple Photo Invite', category: 'wedding', subcategory: 'couple_photo', categoryLabel: 'Wedding', emoji: 'CP', headline: 'Together Forever', subline: 'With love and blessings', detail: 'Wedding Invite | RSVP Today', slotLabel: 'Couple Photo', mask: 'rounded', layout: 'hero', gradient: ['#3B0764', '#BE185D', '#FBCFE8'], frameColor: '#F9A8D4', tags: ['photo invite', 'couple'] }),
      productionTemplate({ id: 'destination_wedding_01', name: 'Destination Wedding', category: 'wedding', subcategory: 'destination', categoryLabel: 'Wedding', emoji: 'DW', headline: 'Destination Wedding', subline: 'Pack your bags for love', detail: 'Goa | 3 Days | RSVP', slotLabel: 'Venue Photo', mask: 'arch', layout: 'side', gradient: ['#164E63', '#0EA5E9', '#FDE68A'], frameColor: '#BAE6FD', isPremium: true, tags: ['destination wedding', 'venue'] }),
      productionTemplate({ id: 'rsvp_wedding_01', name: 'Wedding RSVP', category: 'wedding', subcategory: 'rsvp', categoryLabel: 'Wedding', emoji: 'RS', headline: 'Kindly RSVP', subline: 'Your presence means a lot', detail: 'Reply by 20 Nov | 98765 43210', slotLabel: 'Couple Photo', mask: 'circle', layout: 'portrait', gradient: ['#172554', '#2563EB', '#C7D2FE'], frameColor: '#DBEAFE', tags: ['rsvp', 'wedding'] }),
      productionTemplate({ id: 'thank_you_wedding_01', name: 'Wedding Thank You', category: 'wedding', subcategory: 'thank_you', categoryLabel: 'Wedding', emoji: 'TY', headline: 'Thank You', subline: 'For your love and blessings', detail: 'With gratitude from both families', slotLabel: 'Couple Photo', mask: 'heart', layout: 'hero', gradient: ['#500724', '#BE185D', '#FDE68A'], frameColor: '#FBCFE8', tags: ['thank you', 'wedding'] }),
      productionTemplate({ id: 'religious_wedding_01', name: 'Traditional Ceremony', category: 'wedding', subcategory: 'religious_ceremony', categoryLabel: 'Wedding', emoji: 'TW', headline: 'Ceremony Invitation', subline: 'With prayers and blessings', detail: 'Mandap | 11 AM | Temple Hall', slotLabel: 'Family Photo', mask: 'arch', layout: 'editorial', gradient: ['#7C2D12', '#DC2626', '#FED7AA'], frameColor: '#FDBA74', tags: ['religious', 'ceremony'] }),
      productionTemplate({ id: 'birthday_neon_01', name: 'Neon Birthday', category: 'birthday', subcategory: 'birthday_party', categoryLabel: 'Birthday', emoji: 'NB', headline: 'Birthday Bash', subline: 'Cake, music and bright lights', detail: '7 PM | Party Studio', slotLabel: 'Birthday Photo', mask: 'circle', layout: 'side', gradient: ['#111827', '#2563EB', '#F472B6'], frameColor: '#93C5FD', tags: ['birthday', 'neon'] }),
      productionTemplate({ id: 'birthday_princess_01', name: 'Princess Birthday', category: 'birthday', subcategory: 'kids', categoryLabel: 'Birthday', emoji: 'PB', headline: 'Princess Party', subline: 'A royal birthday celebration', detail: 'Sunday | 5 PM | Home', slotLabel: 'Child Photo', mask: 'heart', layout: 'portrait', gradient: ['#831843', '#F472B6', '#FCE7F3'], frameColor: '#F9A8D4', tags: ['kids birthday', 'princess'] }),
      productionTemplate({ id: 'birthday_superhero_01', name: 'Superhero Birthday', category: 'birthday', subcategory: 'kids', categoryLabel: 'Birthday', emoji: 'SH', headline: 'Super Birthday', subline: 'Calling all little heroes', detail: 'Games | Cake | Fun', slotLabel: 'Child Photo', mask: 'rounded', layout: 'editorial', gradient: ['#1E3A8A', '#DC2626', '#FDE047'], frameColor: '#FDE68A', tags: ['kids', 'superhero'] }),
      productionTemplate({ id: 'birthday_elegant_01', name: 'Elegant Birthday', category: 'birthday', subcategory: 'milestone', categoryLabel: 'Birthday', emoji: 'EB', headline: 'Birthday Dinner', subline: 'Celebrate a special year', detail: '8 PM | The Grand Table', slotLabel: 'Guest Photo', mask: 'oval', layout: 'side', gradient: ['#111827', '#92400E', '#FDE68A'], frameColor: '#FDE68A', isPremium: true, tags: ['milestone', 'dinner'] }),
      productionTemplate({ id: 'birthday_first_01', name: 'First Birthday', category: 'birthday', subcategory: 'first_birthday', categoryLabel: 'Birthday', emoji: 'FB', headline: 'First Birthday', subline: 'One year of smiles', detail: '11 AM | Kids Zone', slotLabel: 'Baby Photo', mask: 'circle', layout: 'portrait', gradient: ['#0E7490', '#67E8F9', '#FEF3C7'], frameColor: '#CFFAFE', tags: ['first birthday', 'baby'] }),
      productionTemplate({ id: 'birthday_photo_01', name: 'Birthday Photo Card', category: 'birthday', subcategory: 'photo_card', categoryLabel: 'Birthday', emoji: 'BP', headline: 'Party Time', subline: 'Make a wish and celebrate', detail: 'Date | Time | Venue', slotLabel: 'Photo', mask: 'arch', layout: 'hero', gradient: ['#581C87', '#7C3AED', '#FDE047'], frameColor: '#DDD6FE', tags: ['photo card', 'birthday'] }),
      productionTemplate({ id: 'birthday_video_story_01', name: 'Birthday Video Story', category: 'birthday', subcategory: 'video_story', categoryLabel: 'Birthday', emoji: 'BV', headline: 'Birthday Invite', subline: 'Animated for WhatsApp', detail: 'Tap to share with family', slotLabel: 'Birthday Photo', mask: 'circle', layout: 'hero', gradient: ['#1D4ED8', '#E11D48', '#FDE047'], frameColor: '#FEF08A', isVideoInvite: true, animationPreset: 'confetti', tags: ['video birthday', 'animated invite'] }),
      productionTemplate({ id: 'kitty_elegant_01', name: 'Elegant Kitty Party', category: 'party', subcategory: 'kitty_party', categoryLabel: 'Party', emoji: 'KP', headline: 'Kitty Party', subline: 'Food, games and laughter', detail: '3 PM | Cafe Room', slotLabel: 'Host Photo', mask: 'oval', layout: 'editorial', gradient: ['#7C2D12', '#F97316', '#FDE68A'], frameColor: '#FED7AA', isVideoInvite: true, animationPreset: 'pulse', tags: ['kitty party', 'ladies'] }),
      productionTemplate({ id: 'anniversary_gold_01', name: 'Gold Anniversary', category: 'party', subcategory: 'anniversary', categoryLabel: 'Party', emoji: 'AG', headline: 'Anniversary', subline: 'Celebrating love and years', detail: 'Dinner | 8 PM | Banquet', slotLabel: 'Couple Photo', mask: 'heart', layout: 'hero', gradient: ['#831843', '#BE123C', '#FDE68A'], frameColor: '#FDE68A', tags: ['anniversary', 'couple'] }),
      productionTemplate({ id: 'baby_shower_cloud_01', name: 'Cloud Baby Shower', category: 'party', subcategory: 'baby_shower', categoryLabel: 'Party', emoji: 'BC', headline: 'Baby Shower', subline: 'Blessings for the little one', detail: '4 PM | Family Home', slotLabel: 'Parents Photo', mask: 'rounded', layout: 'portrait', gradient: ['#0E7490', '#A7F3D0', '#FFE4E6'], frameColor: '#CFFAFE', isVideoInvite: true, animationPreset: 'sparkle', tags: ['baby shower', 'godh bharai'] }),
      productionTemplate({ id: 'housewarming_modern_01', name: 'Modern Housewarming', category: 'party', subcategory: 'housewarming', categoryLabel: 'Party', emoji: 'HW', headline: 'Housewarming', subline: 'Welcome to our new home', detail: 'Pooja | Lunch | New Address', slotLabel: 'Home Photo', mask: 'arch', layout: 'side', gradient: ['#134E4A', '#14B8A6', '#FDE68A'], frameColor: '#99F6E4', isVideoInvite: true, animationPreset: 'cinematic', tags: ['housewarming', 'griha pravesh'] }),
      productionTemplate({ id: 'pooja_traditional_01', name: 'Traditional Pooja', category: 'party', subcategory: 'pooja', categoryLabel: 'Party', emoji: 'PT', headline: 'Pooja Invitation', subline: 'With devotion and blessings', detail: '9 AM | Home Temple', slotLabel: 'Family Photo', mask: 'rounded', layout: 'editorial', gradient: ['#7C2D12', '#EA580C', '#FFEDD5'], frameColor: '#FDBA74', tags: ['pooja', 'puja'] }),
      productionTemplate({ id: 'farewell_party_01', name: 'Farewell Party', category: 'party', subcategory: 'farewell', categoryLabel: 'Party', emoji: 'FP', headline: 'Farewell Party', subline: 'Memories, stories and goodbyes', detail: '5 PM | Office Lounge', slotLabel: 'Guest Photo', mask: 'circle', layout: 'side', gradient: ['#0F172A', '#475569', '#CBD5E1'], frameColor: '#E2E8F0', tags: ['farewell', 'send off'] }),
      productionTemplate({ id: 'naming_ceremony_01', name: 'Naming Ceremony', category: 'party', subcategory: 'naming_ceremony', categoryLabel: 'Party', emoji: 'NC', headline: 'Naming Ceremony', subline: 'A name, a blessing, a new beginning', detail: '11 AM | Family Home', slotLabel: 'Baby Photo', mask: 'oval', layout: 'portrait', gradient: ['#164E63', '#38BDF8', '#FDE68A'], frameColor: '#BAE6FD', tags: ['naming ceremony', 'baby'] }),
      productionTemplate({ id: 'graduation_party_01', name: 'Graduation Party', category: 'party', subcategory: 'graduation', categoryLabel: 'Party', emoji: 'GP', headline: 'Graduation Party', subline: 'Caps off to new beginnings', detail: '6 PM | Club Hall', slotLabel: 'Graduate Photo', mask: 'rounded', layout: 'hero', gradient: ['#312E81', '#2563EB', '#FACC15'], frameColor: '#C7D2FE', tags: ['graduation', 'party'] }),
      productionTemplate({ id: 'webinar_modern_01', name: 'Modern Webinar', category: 'corporate', subcategory: 'webinar', categoryLabel: 'Corporate', emoji: 'WM', headline: 'Live Webinar', subline: 'Learn from industry experts', detail: 'Friday | 4 PM | Online', slotLabel: 'Speaker Photo', mask: 'circle', layout: 'side', gradient: ['#020617', '#1D4ED8', '#7DD3FC'], frameColor: '#BAE6FD', isVideoInvite: true, animationPreset: 'slide', tags: ['webinar', 'online event'] }),
      productionTemplate({ id: 'seminar_blue_01', name: 'Blue Seminar', category: 'corporate', subcategory: 'seminar', categoryLabel: 'Corporate', emoji: 'SB', headline: 'Business Seminar', subline: 'Insights for growth', detail: '10 AM | Conference Hall', slotLabel: 'Speaker Photo', mask: 'rounded', layout: 'editorial', gradient: ['#0F172A', '#2563EB', '#93C5FD'], frameColor: '#DBEAFE', tags: ['seminar', 'business'] }),
      productionTemplate({ id: 'product_launch_01', name: 'Product Launch', category: 'business', subcategory: 'product_launch', categoryLabel: 'Business', emoji: 'PL', headline: 'Product Launch', subline: 'Introducing something new', detail: 'Launch Day | Visit Store', slotLabel: 'Product Photo', mask: 'rounded', layout: 'hero', gradient: ['#111827', '#0F766E', '#A7F3D0'], frameColor: '#A7F3D0', isVideoInvite: true, animationPreset: 'spotlight', tags: ['product launch', 'new product'] }),
      productionTemplate({ id: 'grand_opening_ribbon_01', name: 'Ribbon Grand Opening', category: 'business', subcategory: 'grand_opening', categoryLabel: 'Business', emoji: 'GO', headline: 'Grand Opening', subline: 'Join us for the first day', detail: '10 AM | Ribbon Cutting', slotLabel: 'Store Photo', mask: 'arch', layout: 'side', gradient: ['#064E3B', '#10B981', '#FBBF24'], frameColor: '#FDE68A', isVideoInvite: true, animationPreset: 'confetti', tags: ['grand opening', 'shop'] }),
      productionTemplate({ id: 'sale_flash_01', name: 'Flash Sale Invite', category: 'business', subcategory: 'sale', categoryLabel: 'Business', emoji: 'FS', headline: 'Flash Sale', subline: 'Limited time mega offers', detail: 'Today Only | Up to 50% Off', slotLabel: 'Product Photo', mask: 'rounded', layout: 'editorial', gradient: ['#7F1D1D', '#EF4444', '#FBBF24'], frameColor: '#FDE68A', isVideoInvite: true, animationPreset: 'pulse', tags: ['sale', 'discount'] }),
      productionTemplate({ id: 'awards_gala_01', name: 'Awards Gala', category: 'corporate', subcategory: 'awards', categoryLabel: 'Corporate', emoji: 'AG', headline: 'Awards Gala', subline: 'Celebrating excellence', detail: '7 PM | Grand Ballroom', slotLabel: 'Winner Photo', mask: 'oval', layout: 'hero', gradient: ['#18181B', '#A16207', '#FACC15'], frameColor: '#FDE68A', isVideoInvite: true, animationPreset: 'spotlight', isPremium: true, tags: ['awards', 'gala'] }),
      productionTemplate({ id: 'workshop_invite_01', name: 'Workshop Invite', category: 'corporate', subcategory: 'workshop', categoryLabel: 'Corporate', emoji: 'WI', headline: 'Hands-on Workshop', subline: 'Learn by doing', detail: 'Seats Limited | Register Now', slotLabel: 'Trainer Photo', mask: 'circle', layout: 'portrait', gradient: ['#0F172A', '#0369A1', '#A7F3D0'], frameColor: '#BAE6FD', tags: ['workshop', 'training'] }),
      productionTemplate({ id: 'hiring_announcement_01', name: 'Hiring Announcement', category: 'corporate', subcategory: 'hiring', categoryLabel: 'Corporate', emoji: 'HA', headline: 'We Are Hiring', subline: 'Join our growing team', detail: 'Apply Now | Multiple Roles', slotLabel: 'Team Photo', mask: 'rounded', layout: 'side', gradient: ['#111827', '#4F46E5', '#C7D2FE'], frameColor: '#C7D2FE', tags: ['hiring', 'jobs'] }),
      productionTemplate({ id: 'networking_event_01', name: 'Networking Event', category: 'corporate', subcategory: 'networking', categoryLabel: 'Corporate', emoji: 'NE', headline: 'Networking Evening', subline: 'Meet founders and professionals', detail: '6 PM | Business Club', slotLabel: 'Venue Photo', mask: 'arch', layout: 'editorial', gradient: ['#020617', '#0E7490', '#A7F3D0'], frameColor: '#99F6E4', tags: ['networking', 'business event'] }),
      productionTemplate({ id: 'store_offer_photo_01', name: 'Photo Offer Card', category: 'business', subcategory: 'offer', categoryLabel: 'Business', emoji: 'OF', headline: 'Special Offer', subline: 'Fresh deal for our customers', detail: 'Valid This Week', slotLabel: 'Offer Photo', mask: 'rounded', layout: 'hero', gradient: ['#713F12', '#CA8A04', '#FEF3C7'], frameColor: '#FDE68A', tags: ['offer', 'store'] }),
      productionTemplate({ id: 'course_launch_01', name: 'Course Launch', category: 'business', subcategory: 'course_launch', categoryLabel: 'Business', emoji: 'CL', headline: 'New Course', subline: 'Admissions open now', detail: 'Batch Starts Soon | Enroll Today', slotLabel: 'Instructor Photo', mask: 'circle', layout: 'side', gradient: ['#1E1B4B', '#7C3AED', '#67E8F9'], frameColor: '#C4B5FD', tags: ['course', 'education'] })
    ];
  }

  function idPart(value) {
    return (value || 'template')
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 42) || 'template';
  }

  function createPackTemplates(pack) {
    const masks = ['arch', 'rounded', 'circle', 'oval', 'heart'];
    const layouts = pack.layouts || ['portrait', 'hero', 'side', 'editorial'];
    const gradients = pack.gradients || [['#111827', '#7C3AED', '#FDE68A']];
    const frameColors = pack.frameColors || ['#FDE68A', '#FBCFE8', '#C7D2FE', '#BAE6FD'];

    return pack.items.map((item, index) => {
      const preset = item.animationPreset || null;
      return productionTemplate({
        id: item.id || `${pack.prefix}_${idPart(item.key || item.name)}_${String(index + 1).padStart(2, '0')}`,
        name: item.name,
        category: item.category || pack.category,
        subcategory: item.subcategory || pack.subcategory || pack.prefix,
        categoryLabel: item.categoryLabel || pack.categoryLabel || pack.label,
        emoji: item.emoji || pack.emoji,
        headline: item.headline || item.name,
        subline: item.subline || pack.subline || 'You are invited',
        detail: item.detail || pack.detail || 'Date | Time | Venue',
        slotLabel: item.slotLabel || pack.slotLabel || 'Photo',
        mask: item.mask || pack.mask || masks[index % masks.length],
        layout: item.layout || layouts[index % layouts.length],
        gradient: item.gradient || gradients[index % gradients.length],
        frameColor: item.frameColor || frameColors[index % frameColors.length],
        titleColor: item.titleColor || pack.titleColor,
        subtitleColor: item.subtitleColor || pack.subtitleColor,
        motif: item.motif || pack.motif,
        accentColor: item.accentColor || pack.accentColor,
        isVideoInvite: Boolean(item.isVideoInvite || preset),
        animationPreset: preset,
        animationIntensity: item.animationIntensity ?? pack.animationIntensity ?? 1,
        animationSpeed: item.animationSpeed ?? pack.animationSpeed ?? 1,
        isPremium: Boolean(item.isPremium || preset),
        tags: [
          pack.label,
          pack.region,
          ...(pack.tags || []),
          ...(item.tags || [])
        ].filter(Boolean)
      });
    });
  }

  function createRegionalWeddingTemplates() {
    const packs = [
      {
        prefix: 'south_indian_wedding',
        label: 'South Indian Wedding',
        region: 'south india',
        category: 'wedding',
        subcategory: 'south_indian',
        categoryLabel: 'South Indian',
        emoji: 'SI',
        slotLabel: 'Couple Photo',
        motif: 'mandap',
        gradients: [
          ['#3F0D12', '#9A3412', '#FDE68A'],
          ['#064E3B', '#0F766E', '#FBBF24'],
          ['#581C87', '#BE185D', '#FDE68A'],
          ['#111827', '#7C2D12', '#FDBA74']
        ],
        tags: ['tamil wedding', 'telugu wedding', 'kannada wedding', 'kerala wedding', 'muhurtham', 'temple wedding'],
        items: [
          { key: 'muhurtham', name: 'Muhurtham Ceremony', headline: 'Muhurtham Ceremony', subline: 'A sacred start with family blessings', detail: '6:30 AM | Temple Hall', mask: 'arch', animationPreset: 'mandap3d', tags: ['muhurtham', 'south indian bride'] },
          { key: 'temple', name: 'Temple Wedding Invite', headline: 'Temple Wedding', subline: 'Tradition, prayers and togetherness', detail: 'Mandap | 7 AM | Main Temple', animationPreset: 'rangoli3d', tags: ['temple', 'traditional'] },
          { key: 'nischayathartham', name: 'Nischayathartham', headline: 'Nischayathartham', subline: 'Engagement blessings with both families', detail: 'Sunday | 10 AM | Family Hall', tags: ['engagement', 'south indian'] },
          { key: 'nalangu', name: 'Nalangu Ceremony', headline: 'Nalangu', subline: 'Joyful rituals before the big day', detail: '4 PM | Bride Home', mask: 'circle', tags: ['nalangu', 'pre wedding'] },
          { key: 'oonjal', name: 'Oonjal Ceremony', headline: 'Oonjal Ceremony', subline: 'Blessings around the swing of love', detail: '8 AM | Wedding Venue', tags: ['oonjal', 'tamil'] },
          { key: 'kashi_yatra', name: 'Kashi Yatra Invite', headline: 'Kashi Yatra', subline: 'A playful wedding tradition', detail: 'Before Muhurtham | Venue Lawn', tags: ['kashi yatra', 'groom'] },
          { key: 'mangalya', name: 'Mangalya Dharanam', headline: 'Mangalya Dharanam', subline: 'The sacred wedding moment', detail: 'Muhurtham Time | Main Mandap', mask: 'heart', animationPreset: 'mandap3d', tags: ['mangalya', 'ceremony'] },
          { key: 'silk_reception', name: 'Silk Reception Night', headline: 'Reception', subline: 'An elegant evening after the ceremony', detail: '7 PM | Convention Centre', animationPreset: 'stage3d', tags: ['reception', 'silk saree'] },
          { key: 'kerala', name: 'Kerala Wedding Card', headline: 'Wedding Invitation', subline: 'Simple, graceful and full of blessings', detail: '11 AM | Kalyana Mandapam', tags: ['kerala', 'malayali'] },
          { key: 'pellikuthuru', name: 'Pellikuthuru Ceremony', headline: 'Pellikuthuru', subline: 'A beautiful Telugu pre-wedding celebration', detail: '10 AM | Bride Home', tags: ['telugu', 'pellikuthuru'] },
          { key: 'varapooje', name: 'Varapooje Welcome', headline: 'Varapooje', subline: 'Welcoming the groom with warmth', detail: '5 PM | Wedding House', tags: ['kannada', 'varapooje'] },
          { key: 'south_thank_you', name: 'South Wedding Thank You', headline: 'Thank You', subline: 'For your blessings and presence', detail: 'With gratitude from both families', mask: 'heart', tags: ['thank you', 'family'] }
        ]
      },
      {
        prefix: 'punjabi_wedding',
        label: 'Punjabi Wedding',
        region: 'punjab north india',
        category: 'wedding',
        subcategory: 'punjabi',
        categoryLabel: 'Punjabi',
        emoji: 'PW',
        slotLabel: 'Couple Photo',
        motif: 'stage',
        gradients: [
          ['#450A0A', '#DC2626', '#FACC15'],
          ['#1E1B4B', '#7C3AED', '#FDE68A'],
          ['#052E16', '#16A34A', '#FACC15'],
          ['#111827', '#BE123C', '#FDBA74']
        ],
        tags: ['punjabi wedding', 'sikh wedding', 'dhol', 'anand karaj', 'roka', 'jaggo'],
        items: [
          { key: 'roka', name: 'Roka Ceremony', headline: 'Roka Ceremony', subline: 'Two families begin the celebration', detail: 'Sunday | 12 PM | Family Home', tags: ['roka', 'engagement'] },
          { key: 'chunni', name: 'Chunni Ceremony', headline: 'Chunni Ceremony', subline: 'Blessings, gifts and a new bond', detail: '5 PM | Banquet Hall', tags: ['chunni', 'bride'] },
          { key: 'mehndi', name: 'Punjabi Mehndi', headline: 'Mehndi Night', subline: 'Dhol, mehndi and laughter', detail: '6 PM | Courtyard', tags: ['mehndi', 'dhol'] },
          { key: 'jaggo', name: 'Jaggo Night', headline: 'Jaggo Night', subline: 'Lights, music and family energy', detail: '8 PM | Home Street', animationPreset: 'fireworks3d', tags: ['jaggo', 'night'] },
          { key: 'sangeet', name: 'Dhol Sangeet', headline: 'Sangeet Night', subline: 'Dance floor open for both families', detail: '7 PM | Grand Ballroom', animationPreset: 'stage3d', tags: ['sangeet', 'dance'] },
          { key: 'anand_karaj', name: 'Anand Karaj Invite', headline: 'Anand Karaj', subline: 'With prayers and blessings', detail: '10 AM | Gurudwara Sahib', animationPreset: 'mandap3d', tags: ['anand karaj', 'gurudwara'] },
          { key: 'milni', name: 'Milni Welcome', headline: 'Milni Ceremony', subline: 'A warm welcome for both families', detail: '9 AM | Venue Entrance', tags: ['milni', 'welcome'] },
          { key: 'cocktail', name: 'Punjabi Cocktail', headline: 'Cocktail Night', subline: 'Sharp looks and louder beats', detail: '8 PM | Rooftop Lounge', tags: ['cocktail', 'party'] },
          { key: 'reception', name: 'Punjabi Reception', headline: 'Reception Night', subline: 'Dinner, blessings and celebration', detail: '8 PM | Royal Palace', animationPreset: 'spotlight', tags: ['reception', 'royal'] },
          { key: 'bridal', name: 'Punjabi Bridal Shower', headline: 'Bridal Shower', subline: 'For the bride and her closest people', detail: '3 PM | Cafe Lounge', tags: ['bridal shower', 'ladies'] },
          { key: 'baraat', name: 'Dhol Baraat', headline: 'Baraat Welcome', subline: 'Let the dhol announce the groom', detail: '4 PM | Main Gate', animationPreset: 'confetti', tags: ['baraat', 'groom'] },
          { key: 'thank_you', name: 'Punjabi Wedding Thanks', headline: 'Thank You', subline: 'For making our celebration brighter', detail: 'With love from both families', mask: 'heart', tags: ['thank you', 'family'] }
        ]
      },
      {
        prefix: 'bengali_wedding',
        label: 'Bengali Wedding',
        region: 'bengal east india',
        category: 'wedding',
        subcategory: 'bengali',
        categoryLabel: 'Bengali',
        emoji: 'BW',
        slotLabel: 'Couple Photo',
        motif: 'rangoli',
        gradients: [
          ['#7F1D1D', '#DC2626', '#FDE68A'],
          ['#4C0519', '#BE123C', '#FBCFE8'],
          ['#111827', '#A16207', '#FACC15'],
          ['#064E3B', '#15803D', '#FDE68A']
        ],
        tags: ['bengali wedding', 'bengal', 'gaye holud', 'bou bhaat', 'shubho drishti'],
        items: [
          { key: 'save_date', name: 'Bengali Save The Date', headline: 'Save The Date', subline: 'A Bengali wedding celebration begins', detail: 'Date | Kolkata | RSVP', tags: ['save the date', 'kolkata'] },
          { key: 'ashirbad', name: 'Ashirbad Ceremony', headline: 'Ashirbad', subline: 'Blessings from family elders', detail: '11 AM | Family Home', tags: ['ashirbad', 'blessings'] },
          { key: 'gaye_holud', name: 'Gaye Holud Invite', headline: 'Gaye Holud', subline: 'Haldi, laughter and bright yellow moments', detail: '4 PM | Courtyard', animationPreset: 'rangoli3d', tags: ['gaye holud', 'haldi'] },
          { key: 'ai_buro_bhaat', name: 'Ai Buro Bhaat', headline: 'Ai Buro Bhaat', subline: 'A meal of love before the wedding', detail: 'Lunch | Family Home', tags: ['ai buro bhaat', 'family lunch'] },
          { key: 'shubho_drishti', name: 'Shubho Drishti', headline: 'Shubho Drishti', subline: 'A first look wrapped in tradition', detail: 'Wedding Evening | Mandap', animationPreset: 'photoOrbit3d', tags: ['shubho drishti', 'ceremony'] },
          { key: 'mala_badal', name: 'Mala Badal Invite', headline: 'Mala Badal', subline: 'Garlands, smiles and blessings', detail: '7 PM | Wedding Venue', tags: ['mala badal', 'garland'] },
          { key: 'sindoor', name: 'Sindoor Daan Card', headline: 'Sindoor Daan', subline: 'The sacred wedding moment', detail: 'Wedding Night | Main Mandap', animationPreset: 'mandap3d', tags: ['sindoor daan', 'ceremony'] },
          { key: 'bou_bhaat', name: 'Bou Bhaat Invitation', headline: 'Bou Bhaat', subline: 'Dinner with love from the groom family', detail: '8 PM | Banquet Hall', tags: ['bou bhaat', 'reception'] },
          { key: 'reception', name: 'Bengali Reception', headline: 'Reception', subline: 'Food, music and family blessings', detail: '7 PM | Kolkata Club', animationPreset: 'stage3d', tags: ['reception', 'kolkata'] },
          { key: 'bride_entry', name: 'Bengali Bride Entry', headline: 'Bride Entry', subline: 'A beautiful moment to remember', detail: 'Wedding Evening | Main Hall', tags: ['bride entry', 'bengali bride'] },
          { key: 'family_invite', name: 'Bengali Family Invite', headline: 'Wedding Invitation', subline: 'Two families invite you with joy', detail: 'Ceremony | Dinner | Blessings', tags: ['family invite', 'traditional'] },
          { key: 'thank_you', name: 'Bengali Wedding Thanks', headline: 'Dhonnobad', subline: 'Thank you for your blessings', detail: 'With gratitude from both families', mask: 'heart', tags: ['thank you', 'dhonnobad'] }
        ]
      },
      {
        prefix: 'gujarati_marathi_wedding',
        label: 'Gujarati Marathi Wedding',
        region: 'west india',
        category: 'wedding',
        subcategory: 'west_indian',
        categoryLabel: 'West Indian',
        emoji: 'WI',
        slotLabel: 'Couple Photo',
        motif: 'rangoli',
        gradients: [
          ['#581C87', '#DB2777', '#F97316'],
          ['#78350F', '#F59E0B', '#FEF3C7'],
          ['#064E3B', '#16A34A', '#FACC15'],
          ['#172554', '#2563EB', '#FDE68A']
        ],
        tags: ['gujarati wedding', 'marathi wedding', 'garba', 'pithi', 'sakharpuda', 'mangalashtak'],
        items: [
          { key: 'garba', name: 'Wedding Garba Night', headline: 'Garba Night', subline: 'Dance with both families', detail: '8 PM | Club Lawn', animationPreset: 'rangoli3d', tags: ['garba', 'dandiya'] },
          { key: 'mandap_mahurat', name: 'Mandap Mahurat', headline: 'Mandap Mahurat', subline: 'Auspicious rituals begin', detail: '10 AM | Family Home', animationPreset: 'mandap3d', tags: ['mandap mahurat', 'gujarati'] },
          { key: 'grah_shanti', name: 'Grah Shanti Invite', headline: 'Grah Shanti', subline: 'Prayers for a blessed beginning', detail: '9 AM | Home Temple', tags: ['grah shanti', 'puja'] },
          { key: 'pithi', name: 'Pithi Ceremony', headline: 'Pithi Ceremony', subline: 'Yellow joy before the wedding', detail: '4 PM | Courtyard', tags: ['pithi', 'haldi'] },
          { key: 'mehndi', name: 'Gujarati Mehndi', headline: 'Mehndi Evening', subline: 'Henna, music and family stories', detail: '5 PM | Bride Home', tags: ['mehndi', 'henna'] },
          { key: 'lagna_patrika', name: 'Lagna Patrika', headline: 'Lagna Patrika', subline: 'With blessings from both families', detail: 'Wedding Ceremony | Venue', tags: ['lagna patrika', 'traditional'] },
          { key: 'pheras', name: 'Saat Phera Invite', headline: 'Saat Phera', subline: 'Seven vows, one lifetime', detail: 'Muhurta | Main Mandap', animationPreset: 'mandap3d', tags: ['phera', 'vows'] },
          { key: 'reception', name: 'West Indian Reception', headline: 'Reception Night', subline: 'Dinner and blessings after the ceremony', detail: '8 PM | Banquet Hall', animationPreset: 'stage3d', tags: ['reception', 'dinner'] },
          { key: 'sakharpuda', name: 'Sakharpuda Ceremony', headline: 'Sakharpuda', subline: 'A sweet promise before marriage', detail: 'Sunday | 5 PM | Family Hall', tags: ['marathi', 'engagement'] },
          { key: 'halad', name: 'Marathi Halad', headline: 'Halad Ceremony', subline: 'Family blessings in yellow', detail: '11 AM | Bride Home', tags: ['marathi haldi', 'halad'] },
          { key: 'mangalashtak', name: 'Mangalashtak Wedding', headline: 'Mangalashtak', subline: 'Sacred verses and family blessings', detail: 'Wedding Morning | Mandap', tags: ['mangalashtak', 'marathi wedding'] },
          { key: 'thank_you', name: 'Gujarati Marathi Thanks', headline: 'Thank You', subline: 'For celebrating with us', detail: 'With love from both families', mask: 'heart', tags: ['thank you', 'family'] }
        ]
      },
      {
        prefix: 'pan_india_wedding',
        label: 'Pan India Wedding',
        region: 'india',
        category: 'wedding',
        subcategory: 'pan_india',
        categoryLabel: 'India Wedding',
        emoji: 'IW',
        slotLabel: 'Couple Photo',
        motif: 'mandap',
        gradients: [
          ['#450A0A', '#B91C1C', '#F59E0B'],
          ['#111827', '#7C3AED', '#FDE68A'],
          ['#064E3B', '#0EA5E9', '#FDE68A'],
          ['#3B0764', '#BE185D', '#FBCFE8']
        ],
        tags: ['indian wedding', 'north india', 'rajasthani', 'nikah', 'sikh', 'christian wedding', 'assamese', 'odia'],
        items: [
          { key: 'royal_rajasthan', name: 'Royal Rajasthan Invite', headline: 'Royal Wedding', subline: 'A regal celebration with family blessings', detail: 'Jaipur | 7 PM | Palace Lawn', animationPreset: 'mandap3d', tags: ['rajasthani', 'palace'] },
          { key: 'hindu_phera', name: 'Hindu Phera Invite', headline: 'Wedding Ceremony', subline: 'Sacred vows around the fire', detail: 'Mandap | Muhurat | Dinner', tags: ['hindu wedding', 'phera'] },
          { key: 'lucknow_nikah', name: 'Lucknow Nikah Invite', headline: 'Nikah Ceremony', subline: 'With duas, love and family blessings', detail: '7 PM | Banquet Hall', animationPreset: 'photoOrbit3d', tags: ['nikah', 'muslim wedding', 'lucknow'] },
          { key: 'walima', name: 'Walima Reception', headline: 'Walima', subline: 'Dinner and blessings with family', detail: '8 PM | Grand Hall', animationPreset: 'stage3d', tags: ['walima', 'reception'] },
          { key: 'sikh_anand', name: 'Sikh Wedding Invite', headline: 'Anand Karaj', subline: 'You are invited with blessings', detail: '10 AM | Gurudwara Sahib', tags: ['sikh wedding', 'gurudwara'] },
          { key: 'christian_church', name: 'Church Wedding Invite', headline: 'Wedding Ceremony', subline: 'With love, vows and blessings', detail: '11 AM | Church | Reception follows', animationPreset: 'spotlight', tags: ['christian wedding', 'church'] },
          { key: 'jain', name: 'Jain Wedding Card', headline: 'Wedding Invitation', subline: 'A graceful ceremony with family', detail: 'Morning Ceremony | Dinner', tags: ['jain wedding', 'traditional'] },
          { key: 'himachali', name: 'Himachali Wedding', headline: 'Wedding Invitation', subline: 'Mountain blessings and family joy', detail: 'Himachal | 2 Days | RSVP', tags: ['himachali', 'mountain wedding'] },
          { key: 'assamese', name: 'Assamese Biya Invite', headline: 'Biya Invitation', subline: 'A beautiful Assamese wedding celebration', detail: 'Date | Time | Venue', tags: ['assamese', 'biya'] },
          { key: 'odia', name: 'Odia Bahaghara', headline: 'Bahaghara', subline: 'Traditional wedding invitation', detail: 'Ceremony | Dinner | Blessings', tags: ['odia wedding', 'bahaghara'] },
          { key: 'goan', name: 'Goan Beach Wedding', headline: 'Beach Wedding', subline: 'Sunset vows by the sea', detail: 'Goa | 5 PM | Beach Resort', animationPreset: 'cinematic', tags: ['goa', 'destination'] },
          { key: 'destination', name: 'Indian Destination Invite', headline: 'Destination Wedding', subline: 'Travel, love and three days of celebration', detail: 'Udaipur | Goa | RSVP', animationPreset: 'fireworks3d', tags: ['destination wedding', 'resort'] }
        ]
      }
    ];

    return packs.flatMap(createPackTemplates);
  }

  function createFestivalTemplatePacks() {
    const packs = [
      {
        prefix: 'diwali_pack',
        label: 'Diwali',
        category: 'festival',
        subcategory: 'diwali',
        categoryLabel: 'Diwali',
        emoji: 'DI',
        slotLabel: 'Family Photo',
        motif: 'lights',
        gradients: [['#431407', '#C2410C', '#FDE68A'], ['#3B0764', '#A21CAF', '#FBBF24'], ['#111827', '#7C2D12', '#FACC15']],
        tags: ['diwali', 'deepavali', 'lakshmi puja', 'diya', 'festival lights'],
        items: [
          { key: 'family', name: 'Diwali Family Greeting', headline: 'Happy Diwali', subline: 'Wishing light and prosperity', detail: 'From our family to yours' },
          { key: 'laxmi_puja', name: 'Lakshmi Puja Invite', headline: 'Lakshmi Puja', subline: 'Join us for evening prayers', detail: '7 PM | Home Temple', tags: ['laxmi puja'] },
          { key: 'rangoli', name: '3D Rangoli Diwali', headline: 'Shubh Deepavali', subline: 'Lights, rangoli and blessings', detail: 'Celebrate with us', animationPreset: 'rangoli3d', motif: 'rangoli' },
          { key: 'fireworks', name: 'Diwali Fireworks Video', headline: 'Happy Diwali', subline: 'A sparkling festive greeting', detail: 'Share the light', animationPreset: 'fireworks3d' },
          { key: 'shop', name: 'Shop Diwali Greeting', headline: 'Diwali Wishes', subline: 'Thank you for your trust', detail: 'Festive greetings from our team', slotLabel: 'Shop Photo', tags: ['business diwali'] },
          { key: 'corporate', name: 'Corporate Diwali', headline: 'Happy Diwali', subline: 'Wishing success and new beginnings', detail: 'From our entire team', slotLabel: 'Team Photo' },
          { key: 'premium_gold', name: 'Premium Gold Diwali', headline: 'Deepavali Blessings', subline: 'May every home shine brighter', detail: 'Warm wishes and prosperity', isPremium: true },
          { key: 'kids', name: 'Kids Diwali Party', headline: 'Diwali Party', subline: 'Sweets, games and safe lights', detail: '5 PM | Community Hall', slotLabel: 'Child Photo' },
          { key: 'minimal', name: 'Minimal Diwali Card', headline: 'Happy Diwali', subline: 'Peace, light and new hope', detail: 'With warm wishes', mask: 'rounded' },
          { key: 'photo', name: 'Diwali Photo Frame', headline: 'Festival of Lights', subline: 'Add your festive family photo', detail: 'Happy Deepavali', mask: 'arch' },
          { key: 'sale', name: 'Diwali Sale Invite', headline: 'Diwali Offers', subline: 'Festive deals for every customer', detail: 'This Week Only', slotLabel: 'Product Photo', categoryLabel: 'Diwali' },
          { key: 'thank_you', name: 'Diwali Thank You', headline: 'Thank You', subline: 'For being part of our festive year', detail: 'Happy Diwali', mask: 'heart' }
        ]
      },
      {
        prefix: 'holi_pack',
        label: 'Holi',
        category: 'festival',
        subcategory: 'holi',
        categoryLabel: 'Holi',
        emoji: 'HO',
        slotLabel: 'Celebration Photo',
        motif: 'colors',
        gradients: [['#7C3AED', '#E11D48', '#FDE047'], ['#0E7490', '#22C55E', '#FDE047'], ['#831843', '#F97316', '#67E8F9']],
        tags: ['holi', 'rang', 'gulal', 'colors', 'holika dahan'],
        items: [
          { key: 'rang_barse', name: 'Rang Barse Holi', headline: 'Happy Holi', subline: 'Colors, laughter and togetherness', detail: 'Celebrate safely' },
          { key: 'party', name: 'Holi Party Invite', headline: 'Holi Party', subline: 'Music, colors and festive food', detail: '10 AM | Club Lawn', animationPreset: 'confetti3d' },
          { key: 'family', name: 'Family Holi Greeting', headline: 'Happy Holi', subline: 'Warm wishes from our family', detail: 'May your day be colorful' },
          { key: 'organic', name: 'Organic Gulal Holi', headline: 'Eco Holi', subline: 'Organic colors and happy hearts', detail: 'Community Park | 11 AM' },
          { key: 'holika', name: 'Holika Dahan Invite', headline: 'Holika Dahan', subline: 'Prayers for positivity and renewal', detail: '7 PM | Society Ground', motif: 'lights' },
          { key: 'kids', name: 'Kids Holi Splash', headline: 'Kids Holi', subline: 'Safe colors and playful moments', detail: '11 AM | Kids Zone', slotLabel: 'Child Photo' },
          { key: 'corporate', name: 'Corporate Holi Greeting', headline: 'Happy Holi', subline: 'Wishing a bright season to all', detail: 'From our team', slotLabel: 'Team Photo' },
          { key: 'rang_panchami', name: 'Rang Panchami Card', headline: 'Rang Panchami', subline: 'Let joy fill every color', detail: 'Festive greetings' },
          { key: 'photo_frame', name: 'Holi Photo Frame', headline: 'Color Memories', subline: 'Place your Holi photo here', detail: 'Happy Holi', mask: 'circle' },
          { key: 'video', name: '3D Color Burst Holi', headline: 'Happy Holi', subline: 'A moving color greeting', detail: 'Share on WhatsApp', animationPreset: 'fireworks3d' }
        ]
      },
      {
        prefix: 'eid_pack',
        label: 'Eid',
        category: 'festival',
        subcategory: 'eid',
        categoryLabel: 'Eid',
        emoji: 'EI',
        slotLabel: 'Family Photo',
        motif: 'moon',
        gradients: [['#064E3B', '#0F766E', '#FDE68A'], ['#172554', '#2563EB', '#C7D2FE'], ['#111827', '#047857', '#A7F3D0']],
        tags: ['eid', 'eid mubarak', 'ramzan', 'crescent', 'daawat'],
        items: [
          { key: 'mubarak', name: 'Eid Mubarak Greeting', headline: 'Eid Mubarak', subline: 'Peace, joy and blessings', detail: 'From our family to yours' },
          { key: 'chand_raat', name: 'Chand Raat Invite', headline: 'Chand Raat', subline: 'Celebrate the moonlit evening', detail: '8 PM | Family Home', animationPreset: 'photoOrbit3d' },
          { key: 'fitr', name: 'Eid ul Fitr Card', headline: 'Eid ul Fitr', subline: 'Blessings after Ramadan', detail: 'Warm wishes' },
          { key: 'adha', name: 'Eid al Adha Card', headline: 'Eid al Adha', subline: 'Faith, gratitude and giving', detail: 'Eid Mubarak' },
          { key: 'daawat', name: 'Eid Daawat Invite', headline: 'Eid Daawat', subline: 'Join us for festive dinner', detail: '8 PM | Home', slotLabel: 'Host Photo' },
          { key: 'masjid', name: 'Masjid Moon Greeting', headline: 'Eid Mubarak', subline: 'May your prayers be accepted', detail: 'Warm festive wishes' },
          { key: 'kids', name: 'Kids Eid Greeting', headline: 'Eidi Time', subline: 'Smiles, sweets and blessings', detail: 'Happy Eid', slotLabel: 'Child Photo' },
          { key: 'charity', name: 'Eid Charity Appeal', headline: 'Share The Joy', subline: 'Give with kindness this Eid', detail: 'Support families in need', slotLabel: 'Cause Photo' },
          { key: 'business', name: 'Business Eid Wishes', headline: 'Eid Mubarak', subline: 'Thank you for being with us', detail: 'Warm wishes from our team', slotLabel: 'Team Photo' },
          { key: 'premium', name: 'Premium Crescent Eid', headline: 'Eid Mubarak', subline: 'A graceful moving greeting', detail: 'Share with loved ones', animationPreset: 'stage3d' }
        ]
      },
      {
        prefix: 'navratri_pack',
        label: 'Navratri',
        category: 'festival',
        subcategory: 'navratri',
        categoryLabel: 'Navratri',
        emoji: 'NV',
        slotLabel: 'Group Photo',
        motif: 'garba',
        gradients: [['#581C87', '#DB2777', '#F97316'], ['#7F1D1D', '#EA580C', '#FDE68A'], ['#052E16', '#16A34A', '#FACC15']],
        tags: ['navratri', 'garba', 'dandiya', 'mata', 'durga'],
        items: [
          { key: 'garba', name: 'Garba Night Invite', headline: 'Garba Night', subline: 'Nine nights of dance and devotion', detail: '8 PM | Club Ground', animationPreset: 'rangoli3d' },
          { key: 'dandiya', name: 'Dandiya Raas', headline: 'Dandiya Raas', subline: 'Bring your best moves', detail: '7 PM | Society Lawn', animationPreset: 'stage3d' },
          { key: 'aarti', name: 'Durga Aarti Invite', headline: 'Mata Ki Aarti', subline: 'Join us for evening prayers', detail: '7 PM | Temple Hall', motif: 'durga' },
          { key: 'mata_chowki', name: 'Mata Chowki', headline: 'Mata Chowki', subline: 'Devotional evening with family', detail: '6 PM | Home Temple' },
          { key: 'nine_nights', name: 'Nine Nights Card', headline: 'Happy Navratri', subline: 'Devotion, dance and joy', detail: 'Festive greetings' },
          { key: 'group', name: 'Garba Group Poster', headline: 'Garba Celebration', subline: 'Add your group photo', detail: 'Navratri Night', mask: 'rounded' },
          { key: 'corporate', name: 'Corporate Garba', headline: 'Navratri Celebration', subline: 'Team garba and festive dinner', detail: 'Office Event | 6 PM', slotLabel: 'Team Photo' },
          { key: 'kids', name: 'Kids Garba Invite', headline: 'Kids Garba', subline: 'Traditional dress and fun games', detail: '5 PM | Community Hall', slotLabel: 'Child Photo' },
          { key: 'premium', name: 'Premium Goddess Card', headline: 'Happy Navratri', subline: 'May Maa bless every home', detail: 'Jai Mata Di', motif: 'durga', isPremium: true },
          { key: 'final', name: 'Final Night Dandiya', headline: 'Final Garba Night', subline: 'One last night of festive energy', detail: '8 PM | Main Stage', animationPreset: 'fireworks3d' }
        ]
      },
      {
        prefix: 'rakhi_pack',
        label: 'Raksha Bandhan',
        category: 'festival',
        subcategory: 'raksha_bandhan',
        categoryLabel: 'Rakhi',
        emoji: 'RK',
        slotLabel: 'Sibling Photo',
        motif: 'rakhi',
        gradients: [['#7C2D12', '#F97316', '#FDE68A'], ['#831843', '#E11D48', '#FBCFE8'], ['#3B0764', '#7C3AED', '#FDE68A']],
        tags: ['raksha bandhan', 'rakhi', 'siblings', 'brother sister'],
        items: [
          { key: 'classic', name: 'Classic Rakhi Greeting', headline: 'Happy Raksha Bandhan', subline: 'A bond of love and protection', detail: 'With warm wishes' },
          { key: 'brother', name: 'For Brother Rakhi', headline: 'For My Brother', subline: 'Thank you for always being there', detail: 'Happy Rakhi' },
          { key: 'sister', name: 'For Sister Rakhi', headline: 'For My Sister', subline: 'For every laugh and memory', detail: 'Happy Raksha Bandhan' },
          { key: 'photo', name: 'Sibling Photo Rakhi', headline: 'Sibling Love', subline: 'Place your favorite photo', detail: 'Happy Rakhi', mask: 'heart' },
          { key: 'family', name: 'Family Rakhi Invite', headline: 'Rakhi Celebration', subline: 'Join us for family lunch', detail: '1 PM | Home' },
          { key: 'kids', name: 'Kids Rakhi Card', headline: 'Rakhi Time', subline: 'Sweet moments for little siblings', detail: 'Happy Rakhi', slotLabel: 'Kids Photo' },
          { key: 'premium', name: 'Premium Rakhi Thread', headline: 'Raksha Bandhan', subline: 'A graceful animated greeting', detail: 'Share with family', animationPreset: 'photoOrbit3d' },
          { key: 'gift', name: 'Rakhi Gift Offer', headline: 'Rakhi Gift Sale', subline: 'Perfect gifts for siblings', detail: 'This Week Only', slotLabel: 'Product Photo' },
          { key: 'long_distance', name: 'Long Distance Rakhi', headline: 'Missing You', subline: 'Distance cannot weaken this bond', detail: 'Happy Raksha Bandhan' },
          { key: 'thank_you', name: 'Rakhi Thank You', headline: 'Thank You', subline: 'For every blessing and smile', detail: 'With love', mask: 'heart' }
        ]
      },
      {
        prefix: 'ganesh_pack',
        label: 'Ganesh Chaturthi',
        category: 'festival',
        subcategory: 'ganesh_chaturthi',
        categoryLabel: 'Ganesh',
        emoji: 'GN',
        slotLabel: 'Mandap Photo',
        motif: 'ganesh',
        gradients: [['#7C2D12', '#EA580C', '#FDE68A'], ['#064E3B', '#16A34A', '#FACC15'], ['#3B0764', '#A855F7', '#FDE68A']],
        tags: ['ganesh chaturthi', 'ganpati', 'bappa', 'modak', 'aarti'],
        items: [
          { key: 'welcome', name: 'Ganpati Welcome', headline: 'Ganpati Bappa Morya', subline: 'Welcome Bappa with devotion', detail: 'Ganesh Chaturthi wishes' },
          { key: 'aarti', name: 'Ganesh Aarti Invite', headline: 'Ganesh Aarti', subline: 'Join us for evening aarti', detail: '7 PM | Home Mandap' },
          { key: 'sthapana', name: 'Ganesh Sthapana', headline: 'Ganesh Sthapana', subline: 'Prayers for a blessed beginning', detail: '10 AM | Family Home', animationPreset: 'mandap3d' },
          { key: 'visarjan', name: 'Visarjan Invite', headline: 'Ganpati Visarjan', subline: 'With gratitude and devotion', detail: '5 PM | Society Gate' },
          { key: 'society', name: 'Society Ganpati Poster', headline: 'Ganesh Utsav', subline: 'Community celebration and prasad', detail: 'Daily Aarti | 7 PM', slotLabel: 'Pandal Photo' },
          { key: 'modak', name: 'Modak Fest Card', headline: 'Ganesh Chaturthi', subline: 'Sweet blessings for every home', detail: 'Warm wishes' },
          { key: 'business', name: 'Business Ganesh Wishes', headline: 'Ganpati Bappa Morya', subline: 'May every new beginning prosper', detail: 'From our team', slotLabel: 'Team Photo' },
          { key: 'kids', name: 'Kids Ganesh Drawing', headline: 'Happy Ganesh Chaturthi', subline: 'Little artists, big devotion', detail: 'Kids Activity Invite', slotLabel: 'Child Photo' },
          { key: 'premium', name: '3D Ganesh Stage', headline: 'Ganesh Utsav', subline: 'Animated festive invite', detail: 'Share on WhatsApp', animationPreset: 'stage3d' },
          { key: 'thank_you', name: 'Ganesh Thank You', headline: 'Thank You Bappa', subline: 'For blessings and new beginnings', detail: 'Ganpati Bappa Morya' }
        ]
      },
      {
        prefix: 'durga_puja_pack',
        label: 'Durga Puja',
        category: 'festival',
        subcategory: 'durga_puja',
        categoryLabel: 'Durga Puja',
        emoji: 'DP',
        slotLabel: 'Pandal Photo',
        motif: 'durga',
        gradients: [['#7F1D1D', '#DC2626', '#FDE68A'], ['#111827', '#A16207', '#FACC15'], ['#4C0519', '#BE123C', '#FBCFE8']],
        tags: ['durga puja', 'pandal', 'bengali festival', 'ashtami', 'dashami'],
        items: [
          { key: 'pandal', name: 'Durga Puja Pandal', headline: 'Durga Puja', subline: 'Come celebrate at our pandal', detail: 'Ashtami | 7 PM | Pandal' },
          { key: 'mahalaya', name: 'Mahalaya Greeting', headline: 'Subho Mahalaya', subline: 'The festive season begins', detail: 'Warm wishes' },
          { key: 'ashtami', name: 'Ashtami Pushpanjali', headline: 'Ashtami Anjali', subline: 'Join us for prayers and prasad', detail: '8 AM | Pandal' },
          { key: 'dhunuchi', name: 'Dhunuchi Dance Night', headline: 'Dhunuchi Night', subline: 'Dance, beats and devotion', detail: '8 PM | Main Stage', animationPreset: 'stage3d' },
          { key: 'bhog', name: 'Puja Bhog Invite', headline: 'Puja Bhog', subline: 'Lunch with community blessings', detail: '1 PM | Pandal Hall' },
          { key: 'family', name: 'Family Durga Greeting', headline: 'Subho Durga Puja', subline: 'Blessings and festive joy', detail: 'From our family' },
          { key: 'dashami', name: 'Dashami Wishes', headline: 'Subho Bijoya', subline: 'Good wishes for the season ahead', detail: 'With love and blessings' },
          { key: 'corporate', name: 'Corporate Durga Puja', headline: 'Durga Puja Wishes', subline: 'Strength, prosperity and success', detail: 'From our team', slotLabel: 'Team Photo' },
          { key: 'premium', name: '3D Pandal Invite', headline: 'Durga Puja', subline: 'Animated festive invitation', detail: 'Share with family', animationPreset: 'mandap3d' },
          { key: 'thank_you', name: 'Durga Puja Thanks', headline: 'Thank You', subline: 'For joining our celebration', detail: 'Subho Bijoya' }
        ]
      },
      {
        prefix: 'harvest_pack',
        label: 'Pongal Sankranti',
        category: 'festival',
        subcategory: 'pongal_sankranti',
        categoryLabel: 'Pongal',
        emoji: 'PS',
        slotLabel: 'Family Photo',
        motif: 'harvest',
        gradients: [['#713F12', '#CA8A04', '#FEF3C7'], ['#064E3B', '#16A34A', '#FDE68A'], ['#0E7490', '#38BDF8', '#FEF3C7']],
        tags: ['pongal', 'makar sankranti', 'lohri', 'bihu', 'onam', 'harvest festival', 'kite'],
        items: [
          { key: 'pongal', name: 'Pongal Greeting', headline: 'Happy Pongal', subline: 'Harvest blessings for every home', detail: 'Warm festive wishes' },
          { key: 'pongal_invite', name: 'Pongal Family Invite', headline: 'Pongal Celebration', subline: 'Join us for food and prayers', detail: '10 AM | Family Home' },
          { key: 'sankranti', name: 'Makar Sankranti Card', headline: 'Happy Sankranti', subline: 'Kites, sweets and new sunshine', detail: 'Festive greetings', animationPreset: 'photoOrbit3d' },
          { key: 'kite', name: 'Kite Festival Invite', headline: 'Kite Festival', subline: 'Fly high with family and friends', detail: '4 PM | Terrace', animationPreset: 'fireworks3d' },
          { key: 'lohri', name: 'Lohri Celebration', headline: 'Happy Lohri', subline: 'Bonfire, music and warmth', detail: '7 PM | Community Ground', motif: 'lights' },
          { key: 'bihu', name: 'Bihu Greeting', headline: 'Happy Bihu', subline: 'Harvest joy and cultural rhythm', detail: 'Warm wishes' },
          { key: 'onam', name: 'Onam Greeting', headline: 'Happy Onam', subline: 'Prosperity, flowers and togetherness', detail: 'Onam Ashamsakal', motif: 'rangoli' },
          { key: 'corporate', name: 'Harvest Corporate Wishes', headline: 'Season Greetings', subline: 'Wishing growth and prosperity', detail: 'From our team', slotLabel: 'Team Photo' },
          { key: 'shop', name: 'Sankranti Shop Offer', headline: 'Harvest Offers', subline: 'Festive deals for your family', detail: 'This Week Only', slotLabel: 'Product Photo' },
          { key: 'thank_you', name: 'Harvest Thank You', headline: 'Thank You', subline: 'For your blessings and support', detail: 'Happy festive season' }
        ]
      },
      {
        prefix: 'christmas_new_year_pack',
        label: 'Christmas New Year',
        category: 'festival',
        subcategory: 'christmas_new_year',
        categoryLabel: 'Christmas',
        emoji: 'CN',
        slotLabel: 'Family Photo',
        motif: 'lights',
        gradients: [['#064E3B', '#DC2626', '#FDE68A'], ['#172554', '#2563EB', '#F8FAFC'], ['#111827', '#B91C1C', '#FACC15']],
        tags: ['christmas', 'new year', 'xmas', 'party', 'season greetings'],
        items: [
          { key: 'christmas_family', name: 'Christmas Family Card', headline: 'Merry Christmas', subline: 'Peace, joy and warm wishes', detail: 'From our family' },
          { key: 'christmas_party', name: 'Christmas Party Invite', headline: 'Christmas Party', subline: 'Dinner, music and festive lights', detail: '7 PM | Club Hall', animationPreset: 'stage3d' },
          { key: 'new_year', name: 'New Year Greeting', headline: 'Happy New Year', subline: 'New dreams and fresh beginnings', detail: 'Welcome the year ahead' },
          { key: 'new_year_party', name: 'New Year Party', headline: 'New Year Bash', subline: 'Countdown, music and celebration', detail: '9 PM | Rooftop', animationPreset: 'fireworks3d' },
          { key: 'corporate', name: 'Corporate Season Greeting', headline: 'Season Greetings', subline: 'Thank you for a meaningful year', detail: 'From our team', slotLabel: 'Team Photo' },
          { key: 'sale', name: 'Christmas Sale Poster', headline: 'Holiday Sale', subline: 'Festive offers for every customer', detail: 'Limited Time', slotLabel: 'Product Photo' },
          { key: 'church', name: 'Christmas Service Invite', headline: 'Christmas Service', subline: 'Join us for carols and prayer', detail: '25 Dec | 8 AM | Church' },
          { key: 'kids', name: 'Kids Christmas Card', headline: 'Merry Christmas', subline: 'Tiny smiles and festive joy', detail: 'Happy holidays', slotLabel: 'Child Photo' },
          { key: 'premium', name: '3D Fireworks New Year', headline: 'Happy New Year', subline: 'Animated wishes for WhatsApp', detail: 'Share with everyone', animationPreset: 'fireworks3d' },
          { key: 'thank_you', name: 'Year End Thank You', headline: 'Thank You', subline: 'For being with us this year', detail: 'Season greetings' }
        ]
      }
    ];

    return packs.flatMap(createPackTemplates);
  }

  function createMotionShowcaseTemplates() {
    return [
      productionTemplate({ id: 'birthday_3d_cake_01', name: '3D Cake Birthday', category: 'birthday', subcategory: 'birthday_3d', categoryLabel: 'Birthday', emoji: '3B', headline: 'Birthday Celebration', subline: 'Cake, candles and moving lights', detail: '7 PM | Party Hall', slotLabel: 'Birthday Photo', mask: 'circle', layout: 'hero', gradient: ['#1D4ED8', '#E11D48', '#FDE047'], frameColor: '#FEF08A', motif: 'stage', isVideoInvite: true, animationPreset: 'stage3d', tags: ['birthday', '3d animation', 'cake', 'video'] }),
      productionTemplate({ id: 'birthday_3d_balloon_01', name: '3D Balloon Birthday', category: 'birthday', subcategory: 'birthday_3d', categoryLabel: 'Birthday', emoji: '3B', headline: 'Party Time', subline: 'Animated balloons and bright wishes', detail: 'Date | Time | Venue', slotLabel: 'Child Photo', mask: 'heart', layout: 'portrait', gradient: ['#7C3AED', '#22C55E', '#FDE047'], frameColor: '#DDD6FE', motif: 'colors', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['kids birthday', '3d animation', 'balloons'] }),
      productionTemplate({ id: 'corporate_3d_stage_01', name: '3D Corporate Stage', category: 'corporate', subcategory: 'corporate_3d', categoryLabel: 'Corporate', emoji: '3C', headline: 'Annual Event', subline: 'A premium animated announcement', detail: 'Friday | 7 PM | Auditorium', slotLabel: 'Speaker Photo', mask: 'rounded', layout: 'side', gradient: ['#020617', '#1D4ED8', '#7DD3FC'], frameColor: '#BAE6FD', motif: 'stage', isVideoInvite: true, animationPreset: 'stage3d', tags: ['corporate', '3d animation', 'event'] }),
      productionTemplate({ id: 'business_3d_product_01', name: '3D Product Reveal', category: 'business', subcategory: 'product_3d', categoryLabel: 'Business', emoji: '3P', headline: 'Product Reveal', subline: 'Animated spotlight for your launch', detail: 'Launching Soon', slotLabel: 'Product Photo', mask: 'rounded', layout: 'hero', gradient: ['#111827', '#0F766E', '#A7F3D0'], frameColor: '#A7F3D0', motif: 'product', isVideoInvite: true, animationPreset: 'product3d', tags: ['product launch', '3d animation', 'business'] }),
      productionTemplate({ id: 'business_3d_sale_01', name: '3D Sale Blast', category: 'business', subcategory: 'sale_3d', categoryLabel: 'Business', emoji: '3S', headline: 'Mega Sale', subline: 'Animated offers for WhatsApp', detail: 'Up to 50% Off', slotLabel: 'Product Photo', mask: 'rounded', layout: 'editorial', gradient: ['#7F1D1D', '#EF4444', '#FBBF24'], frameColor: '#FDE68A', motif: 'product', isVideoInvite: true, animationPreset: 'product3d', tags: ['sale', '3d animation', 'offer'] }),
      productionTemplate({ id: 'party_3d_housewarming_01', name: '3D Housewarming Invite', category: 'party', subcategory: 'housewarming_3d', categoryLabel: 'Party', emoji: '3H', headline: 'Housewarming', subline: 'Animated invite for your new home', detail: 'Pooja | Lunch | New Address', slotLabel: 'Home Photo', mask: 'arch', layout: 'side', gradient: ['#134E4A', '#14B8A6', '#FDE68A'], frameColor: '#99F6E4', motif: 'mandap', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['housewarming', 'griha pravesh', '3d animation'] }),
      productionTemplate({ id: 'party_3d_baby_shower_01', name: '3D Baby Shower', category: 'party', subcategory: 'baby_shower_3d', categoryLabel: 'Party', emoji: '3D', headline: 'Baby Shower', subline: 'Soft animated wishes and blessings', detail: '4 PM | Family Home', slotLabel: 'Parents Photo', mask: 'oval', layout: 'portrait', gradient: ['#0E7490', '#A7F3D0', '#FFE4E6'], frameColor: '#CFFAFE', motif: 'lights', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['baby shower', '3d animation', 'godh bharai'] }),
      productionTemplate({ id: 'party_3d_kitty_01', name: '3D Kitty Party', category: 'party', subcategory: 'kitty_party_3d', categoryLabel: 'Party', emoji: '3K', headline: 'Kitty Party', subline: 'Animated sparkle for a fun afternoon', detail: '3 PM | Cafe Room', slotLabel: 'Host Photo', mask: 'circle', layout: 'editorial', gradient: ['#7C2D12', '#F97316', '#FDE68A'], frameColor: '#FED7AA', motif: 'stage', isVideoInvite: true, animationPreset: 'stage3d', tags: ['kitty party', '3d animation', 'ladies'] })
    ];
  }

  function artworkTemplate(spec) {
    const videoTags = spec.isVideoInvite ? ['video', 'animated', 'whatsapp video', spec.animationPreset] : [];
    const defaultLayers = artworkDefaultLayers(spec);
    const guidedTags = defaultLayers.length
      ? ['photo slot', 'fill slot', 'center photo', 'bride groom photo', 'couple photo', 'custom image']
      : [];
    return {
      id: `art_${spec.id}`,
      name: spec.name,
      category: spec.category || 'festival',
      subcategory: spec.subcategory,
      categoryLabel: spec.categoryLabel,
      path: spec.path || `assets/templates/festival_art/${spec.id}.svg`,
      isPremium: Boolean(spec.isPremium || spec.isVideoInvite),
      isVideoInvite: Boolean(spec.isVideoInvite),
      animationPreset: spec.animationPreset || (spec.isVideoInvite ? 'cinematic' : null),
      animationIntensity: spec.animationIntensity ?? 1,
      animationSpeed: spec.animationSpeed ?? 1,
      emoji: spec.emoji,
      tags: [
        'image design',
        'art poster',
        'festival artwork',
        spec.name,
        spec.categoryLabel,
        spec.subcategory,
        ...(spec.tags || []),
        ...guidedTags,
        ...videoTags
      ].filter(Boolean),
      overlayConfig: overlay({
        bannerColor: spec.bannerColor || 'rgba(10, 10, 16, 0.9)',
        nameColor: spec.nameColor || spec.accent || '#FDE68A',
        phoneColor: 'rgba(255,255,255,0.88)'
      }),
      defaultLayers
    };
  }

  function createFestivalArtworkTemplates() {
    return [
      artworkTemplate({ id: 'diwali_many_diyas_gold', name: 'Many Diyas Diwali', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'DI', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['diwali', 'deepavali', 'many diyas', 'diya', 'lights', 'wonder poster'] }),
      artworkTemplate({ id: 'diwali_rangoli_lamps', name: 'Rangoli Lamps Diwali', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'DI', accent: '#FDE047', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['diwali', 'rangoli', 'lamps', 'deepavali'] }),
      artworkTemplate({ id: 'diwali_lakshmi_puja', name: 'Lakshmi Puja Artwork', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'LP', accent: '#FACC15', tags: ['diwali', 'lakshmi puja', 'puja', 'temple lights'] }),
      artworkTemplate({ id: 'diwali_premium_fireworks', name: 'Fireworks Diwali Poster', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'DI', accent: '#FDBA74', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['diwali', 'fireworks', 'premium', 'night'] }),

      artworkTemplate({ id: 'holi_color_burst', name: 'Color Burst Holi', categoryLabel: 'Holi', subcategory: 'holi', emoji: 'HO', accent: '#FDE047', isVideoInvite: true, animationPreset: 'confetti3d', tags: ['holi', 'colors', 'gulal', 'rang'] }),
      artworkTemplate({ id: 'holi_pichkari_splash', name: 'Pichkari Splash Holi', categoryLabel: 'Holi', subcategory: 'holi', emoji: 'HO', accent: '#67E8F9', tags: ['holi', 'pichkari', 'water colors', 'party'] }),
      artworkTemplate({ id: 'holi_gulal_cloud', name: 'Gulal Cloud Holi', categoryLabel: 'Holi', subcategory: 'holi', emoji: 'HO', accent: '#F9A8D4', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['holi', 'gulal', 'color cloud'] }),
      artworkTemplate({ id: 'holi_holika_dahan', name: 'Holika Dahan Artwork', categoryLabel: 'Holi', subcategory: 'holi', emoji: 'HD', accent: '#FDBA74', tags: ['holi', 'holika dahan', 'bonfire', 'prayers'] }),

      artworkTemplate({ id: 'eid_crescent_green', name: 'Crescent Green Eid', categoryLabel: 'Eid', subcategory: 'eid', emoji: 'EI', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['eid', 'eid mubarak', 'crescent', 'stars'] }),
      artworkTemplate({ id: 'eid_moon_masjid', name: 'Moon Masjid Eid', categoryLabel: 'Eid', subcategory: 'eid', emoji: 'EI', accent: '#BAE6FD', tags: ['eid', 'masjid', 'moon', 'ramzan'] }),
      artworkTemplate({ id: 'eid_daawat_gold', name: 'Gold Eid Daawat', categoryLabel: 'Eid', subcategory: 'eid', emoji: 'ED', accent: '#FDE68A', tags: ['eid', 'daawat', 'dinner invite', 'family'] }),
      artworkTemplate({ id: 'eid_chand_raat', name: 'Chand Raat Lanterns', categoryLabel: 'Eid', subcategory: 'eid', emoji: 'CR', accent: '#DDD6FE', isVideoInvite: true, animationPreset: 'stage3d', tags: ['eid', 'chand raat', 'lanterns', 'moonlit'] }),

      artworkTemplate({ id: 'navratri_garba_stage', name: 'Garba Stage Navratri', categoryLabel: 'Navratri', subcategory: 'navratri', emoji: 'NV', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'stage3d', tags: ['navratri', 'garba', 'dance', 'stage'] }),
      artworkTemplate({ id: 'navratri_dandiya_raas', name: 'Dandiya Raas Artwork', categoryLabel: 'Navratri', subcategory: 'navratri', emoji: 'DR', accent: '#FACC15', tags: ['navratri', 'dandiya', 'raas', 'garba'] }),
      artworkTemplate({ id: 'navratri_mata_aarti', name: 'Mata Aarti Poster', categoryLabel: 'Navratri', subcategory: 'navratri', emoji: 'MA', accent: '#FDBA74', tags: ['navratri', 'mata ki aarti', 'durga', 'prayers'] }),
      artworkTemplate({ id: 'navratri_rangoli_circle', name: 'Rangoli Garba Night', categoryLabel: 'Navratri', subcategory: 'navratri', emoji: 'GN', accent: '#FDE047', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['navratri', 'rangoli', 'garba night'] }),

      artworkTemplate({ id: 'rakhi_thread_gold', name: 'Gold Thread Rakhi', categoryLabel: 'Rakhi', subcategory: 'raksha_bandhan', emoji: 'RK', accent: '#FDE68A', tags: ['raksha bandhan', 'rakhi', 'thread', 'siblings'] }),
      artworkTemplate({ id: 'rakhi_sibling_frame', name: 'Sibling Photo Rakhi', categoryLabel: 'Rakhi', subcategory: 'raksha_bandhan', emoji: 'RK', accent: '#F9A8D4', tags: ['raksha bandhan', 'sibling photo', 'brother sister'] }),
      artworkTemplate({ id: 'rakhi_gift_offer', name: 'Rakhi Gift Artwork', categoryLabel: 'Rakhi', subcategory: 'raksha_bandhan', emoji: 'RG', accent: '#DDD6FE', tags: ['raksha bandhan', 'gift', 'shop offer', 'business'] }),
      artworkTemplate({ id: 'rakhi_lumba_style', name: 'Lumba Rakhi Poster', categoryLabel: 'Rakhi', subcategory: 'raksha_bandhan', emoji: 'LR', accent: '#FBCFE8', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['raksha bandhan', 'lumba rakhi', 'family'] }),

      artworkTemplate({ id: 'ganesh_bappa_mandap', name: 'Bappa Mandap Poster', categoryLabel: 'Ganesh', subcategory: 'ganesh_chaturthi', emoji: 'GN', accent: '#FACC15', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['ganesh chaturthi', 'ganpati', 'bappa', 'mandap'] }),
      artworkTemplate({ id: 'ganesh_aarti_evening', name: 'Ganesh Aarti Evening', categoryLabel: 'Ganesh', subcategory: 'ganesh_chaturthi', emoji: 'GA', accent: '#FDE68A', tags: ['ganesh chaturthi', 'aarti', 'prayers'] }),
      artworkTemplate({ id: 'ganesh_modak_blessings', name: 'Modak Blessings Ganesh', categoryLabel: 'Ganesh', subcategory: 'ganesh_chaturthi', emoji: 'GM', accent: '#FDBA74', tags: ['ganesh chaturthi', 'modak', 'blessings'] }),
      artworkTemplate({ id: 'ganesh_utsav_pandal', name: 'Ganesh Utsav Pandal', categoryLabel: 'Ganesh', subcategory: 'ganesh_chaturthi', emoji: 'GU', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'stage3d', tags: ['ganesh chaturthi', 'ganesh utsav', 'pandal'] }),

      artworkTemplate({ id: 'durga_puja_pandal', name: 'Durga Puja Pandal', categoryLabel: 'Durga Puja', subcategory: 'durga_puja', emoji: 'DP', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['durga puja', 'pandal', 'bengali festival'] }),
      artworkTemplate({ id: 'durga_ashtami_anjali', name: 'Ashtami Anjali Artwork', categoryLabel: 'Durga Puja', subcategory: 'durga_puja', emoji: 'AA', accent: '#FBCFE8', tags: ['durga puja', 'ashtami', 'anjali', 'flowers'] }),
      artworkTemplate({ id: 'durga_dhunuchi_night', name: 'Dhunuchi Night Poster', categoryLabel: 'Durga Puja', subcategory: 'durga_puja', emoji: 'DN', accent: '#FDBA74', isVideoInvite: true, animationPreset: 'stage3d', tags: ['durga puja', 'dhunuchi', 'dance'] }),
      artworkTemplate({ id: 'durga_bijoya_wishes', name: 'Subho Bijoya Wishes', categoryLabel: 'Durga Puja', subcategory: 'durga_puja', emoji: 'SB', accent: '#F9A8D4', tags: ['durga puja', 'subho bijoya', 'bijoya'] }),

      artworkTemplate({ id: 'pongal_harvest_pot', name: 'Harvest Pot Pongal', categoryLabel: 'Pongal', subcategory: 'pongal_sankranti', emoji: 'PO', accent: '#FDE68A', tags: ['pongal', 'harvest', 'pot', 'south india'] }),
      artworkTemplate({ id: 'sankranti_kite_sky', name: 'Kite Sky Sankranti', categoryLabel: 'Sankranti', subcategory: 'pongal_sankranti', emoji: 'SK', accent: '#FDE047', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['makar sankranti', 'sankranti', 'kite festival'] }),
      artworkTemplate({ id: 'lohri_bonfire_dhol', name: 'Bonfire Lohri Poster', categoryLabel: 'Lohri', subcategory: 'pongal_sankranti', emoji: 'LH', accent: '#FDBA74', tags: ['lohri', 'bonfire', 'dhol', 'harvest'] }),
      artworkTemplate({ id: 'onam_pookalam', name: 'Pookalam Onam Poster', categoryLabel: 'Onam', subcategory: 'pongal_sankranti', emoji: 'ON', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['onam', 'pookalam', 'kerala', 'harvest'] }),

      artworkTemplate({ id: 'christmas_lights_tree', name: 'Christmas Lights Tree', categoryLabel: 'Christmas', subcategory: 'christmas_new_year', emoji: 'CH', accent: '#FDE68A', tags: ['christmas', 'merry christmas', 'tree', 'lights'] }),
      artworkTemplate({ id: 'new_year_fireworks_gold', name: 'New Year Fireworks', categoryLabel: 'New Year', subcategory: 'christmas_new_year', emoji: 'NY', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['new year', 'fireworks', '2026', 'party'] }),
      artworkTemplate({ id: 'christmas_party_invite', name: 'Christmas Party Artwork', categoryLabel: 'Christmas', subcategory: 'christmas_new_year', emoji: 'CP', accent: '#FACC15', tags: ['christmas', 'party', 'season greetings'] }),
      artworkTemplate({ id: 'season_greetings_corporate', name: 'Corporate Season Greeting', categoryLabel: 'Season', subcategory: 'christmas_new_year', emoji: 'SG', accent: '#A7F3D0', tags: ['season greetings', 'corporate', 'business'] }),

      artworkTemplate({ id: 'independence_tricolor_wave', name: 'Tricolor Independence', categoryLabel: 'National', subcategory: 'national', emoji: 'IN', accent: '#0A3D91', tags: ['independence day', 'india', 'tricolor', 'patriotic'] }),
      artworkTemplate({ id: 'republic_ashoka_pride', name: 'Ashoka Republic Pride', categoryLabel: 'National', subcategory: 'national', emoji: 'IN', accent: '#0A3D91', tags: ['republic day', 'india', 'ashoka chakra', 'patriotic'] }),
      artworkTemplate({ id: 'teacher_day_board', name: 'Teachers Day Board', categoryLabel: 'Teachers Day', subcategory: 'teachers_day', emoji: 'TD', accent: '#FDE68A', tags: ['teachers day', 'teacher', 'school', 'gratitude'] }),
      artworkTemplate({ id: 'janmashtami_mor_pankh', name: 'Janmashtami Feather', categoryLabel: 'Janmashtami', subcategory: 'janmashtami', emoji: 'JK', accent: '#38BDF8', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['janmashtami', 'krishna', 'peacock feather', 'mor pankh'] })
    ];
  }

  function premiumArtworkTemplate(spec) {
    return artworkTemplate({
      ...spec,
      path: `assets/templates/premium_art/${spec.id}.svg`,
      isPremium: true,
      tags: [
        'premium poster',
        'out of box',
        'luxury artwork',
        'showcase design',
        ...(spec.tags || [])
      ]
    });
  }

  function createPremiumArtworkTemplates() {
    return [
      premiumArtworkTemplate({ id: 'diwali_luxury_palace_of_lights', name: 'Luxury Palace Diwali', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'PD', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['diwali', 'deepavali', 'palace', 'many diyas', 'premium diwali'] }),
      premiumArtworkTemplate({ id: 'diwali_cosmic_rangoli', name: 'Cosmic Rangoli Diwali', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'CD', accent: '#FDE047', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['diwali', 'rangoli', 'cosmic', 'light mandala'] }),
      premiumArtworkTemplate({ id: 'holi_color_portal', name: 'Holi Color Portal', categoryLabel: 'Holi', subcategory: 'holi', emoji: 'PH', accent: '#67E8F9', isVideoInvite: true, animationPreset: 'confetti3d', tags: ['holi', 'color portal', 'gulal', 'out of box'] }),
      premiumArtworkTemplate({ id: 'eid_moonlit_lantern_palace', name: 'Moonlit Lantern Eid', categoryLabel: 'Eid', subcategory: 'eid', emoji: 'PE', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['eid', 'eid mubarak', 'lantern palace', 'crescent'] }),
      premiumArtworkTemplate({ id: 'navratri_neon_garba_arena', name: 'Neon Garba Arena', categoryLabel: 'Navratri', subcategory: 'navratri', emoji: 'PN', accent: '#FDE047', isVideoInvite: true, animationPreset: 'stage3d', tags: ['navratri', 'garba arena', 'dandiya', 'neon'] }),
      premiumArtworkTemplate({ id: 'ganesh_golden_stage', name: 'Golden Ganesh Stage', categoryLabel: 'Ganesh', subcategory: 'ganesh_chaturthi', emoji: 'PG', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['ganesh chaturthi', 'ganpati', 'golden stage', 'bappa'] }),
      premiumArtworkTemplate({ id: 'durga_cinematic_pandal', name: 'Cinematic Durga Pandal', categoryLabel: 'Durga Puja', subcategory: 'durga_puja', emoji: 'PC', accent: '#FDBA74', isVideoInvite: true, animationPreset: 'stage3d', tags: ['durga puja', 'pandal', 'cinematic', 'bengali festival'] }),
      premiumArtworkTemplate({ id: 'rakhi_jewel_thread', name: 'Jewel Thread Rakhi', categoryLabel: 'Rakhi', subcategory: 'raksha_bandhan', emoji: 'PR', accent: '#FBCFE8', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['raksha bandhan', 'rakhi', 'jewel thread', 'siblings'] }),
      premiumArtworkTemplate({ id: 'pongal_harvest_sunrise', name: 'Harvest Sunrise Pongal', categoryLabel: 'Pongal', subcategory: 'pongal_sankranti', emoji: 'PP', accent: '#FDE68A', tags: ['pongal', 'harvest', 'sunrise', 'south india'] }),
      premiumArtworkTemplate({ id: 'sankranti_kite_universe', name: 'Kite Universe Sankranti', categoryLabel: 'Sankranti', subcategory: 'pongal_sankranti', emoji: 'PK', accent: '#FDE047', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['makar sankranti', 'kite universe', 'kites', 'sky'] }),
      premiumArtworkTemplate({ id: 'new_year_city_fireworks', name: 'City Fireworks New Year', categoryLabel: 'New Year', subcategory: 'christmas_new_year', emoji: 'PN', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['new year', 'fireworks', 'city', '2026'] }),
      premiumArtworkTemplate({ id: 'royal_wedding_mandap_luxury', name: 'Royal Luxury Mandap', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'premium_wedding', emoji: 'RW', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['wedding', 'royal mandap', 'luxury wedding', 'premium wedding'] })
    ];
  }

  function stateArtLayers(spec) {
    return [
      editableTextLayer('state_kicker', 'Kicker', spec.kicker || 'State Special', 0.5, 0.115, {
        fontSize: 23,
        weight: '900',
        color: spec.accent || '#FDE68A',
        maxWidth: 0.72,
        shadowBlur: 16
      }),
      editableTextLayer('state_title', 'Title', spec.headline, 0.5, 0.205, {
        fontSize: spec.titleSize || 62,
        weight: '900',
        color: spec.titleColor || '#FFFFFF',
        maxWidth: 0.82,
        shadowBlur: 18
      }),
      editableTextLayer('state_subtitle', 'Subtitle', spec.subline, 0.5, 0.292, {
        fontSize: spec.subtitleSize || 27,
        weight: '700',
        color: spec.subtitleColor || 'rgba(255,255,255,0.9)',
        maxWidth: 0.76,
        shadowBlur: 14
      }),
      editableTextLayer('state_details', 'Details', spec.detail || 'Festival | Offer | Greeting', 0.5, 0.69, {
        fontSize: spec.detailSize || 25,
        weight: '800',
        color: spec.detailColor || '#FFFFFF',
        maxWidth: 0.74,
        shadowBlur: 16
      })
    ];
  }

  function stateArtTemplate(spec) {
    return artworkTemplate({
      ...spec,
      category: 'states',
      categoryLabel: spec.categoryLabel || 'States',
      path: `assets/templates/state_art/${spec.id}.svg`,
      isPremium: true,
      isVideoInvite: Boolean(spec.isVideoInvite),
      animationPreset: spec.animationPreset || (spec.isVideoInvite ? 'photoOrbit3d' : null),
      defaultLayers: stateArtLayers(spec),
      tags: [
        'state art',
        'indian state',
        'regional design',
        'premium state poster',
        'culture poster',
        ...(spec.tags || [])
      ]
    });
  }

  function createStateArtTemplates() {
    return [
      stateArtTemplate({
        id: 'rajasthan_royal_palace_state',
        name: 'Rajasthan Royal Palace',
        subcategory: 'rajasthan',
        kicker: 'Royal Rajasthan',
        headline: 'Desert Grandeur',
        subline: 'Palaces, camels and golden hospitality',
        detail: 'Greeting | Offer | Travel Poster',
        accent: '#FDE68A',
        isVideoInvite: true,
        animationPreset: 'luxury3d',
        tags: ['rajasthan', 'jaipur', 'udaipur', 'desert', 'palace', 'camel']
      }),
      stateArtTemplate({
        id: 'kerala_backwater_state',
        name: 'Kerala Backwater Luxe',
        subcategory: 'kerala',
        kicker: 'Gods Own Country',
        headline: 'Backwater Calm',
        subline: 'Houseboats, coconut palms and festival warmth',
        detail: 'Onam | Travel | Local Business',
        accent: '#A7F3D0',
        animationPreset: 'photoOrbit3d',
        tags: ['kerala', 'onam', 'backwater', 'houseboat', 'coconut']
      }),
      stateArtTemplate({
        id: 'punjab_harvest_dhol_state',
        name: 'Punjab Harvest Dhol',
        subcategory: 'punjab',
        kicker: 'Punjab Spirit',
        headline: 'Harvest Energy',
        subline: 'Dhol beats, mustard fields and celebration',
        detail: 'Baisakhi | Lohri | Store Greeting',
        accent: '#FDE047',
        isVideoInvite: true,
        animationPreset: 'confetti3d',
        tags: ['punjab', 'baisakhi', 'lohri', 'dhol', 'mustard fields']
      }),
      stateArtTemplate({
        id: 'gujarat_garba_night_state',
        name: 'Gujarat Garba Night',
        subcategory: 'gujarat',
        kicker: 'Gujarat Rhythm',
        headline: 'Garba Glow',
        subline: 'Dandiya lights, mirror work and festive motion',
        detail: 'Navratri | Event | Offer Poster',
        accent: '#FDE047',
        isVideoInvite: true,
        animationPreset: 'rangoli3d',
        tags: ['gujarat', 'garba', 'dandiya', 'navratri', 'mirror work']
      }),
      stateArtTemplate({
        id: 'maharashtra_fort_saffron_state',
        name: 'Maharashtra Fort Saffron',
        subcategory: 'maharashtra',
        kicker: 'Maharashtra Pride',
        headline: 'Fort Legacy',
        subline: 'Sahyadri silhouettes, saffron skies and strength',
        detail: 'Festival | Local Brand | Event',
        accent: '#FDBA74',
        animationPreset: 'spotlight',
        tags: ['maharashtra', 'shivaji', 'fort', 'sahyadri', 'marathi']
      }),
      stateArtTemplate({
        id: 'bengal_durga_river_state',
        name: 'Bengal Durga River',
        subcategory: 'west_bengal',
        kicker: 'Bengal Heritage',
        headline: 'River & Shakti',
        subline: 'Alpana curves, dhaak rhythm and festive lights',
        detail: 'Durga Puja | Bijoya | Community',
        accent: '#FDE68A',
        isVideoInvite: true,
        animationPreset: 'stage3d',
        tags: ['west bengal', 'bengal', 'durga puja', 'alpana', 'dhaak']
      }),
      stateArtTemplate({
        id: 'tamilnadu_temple_silk_state',
        name: 'Tamil Nadu Temple Silk',
        subcategory: 'tamil_nadu',
        kicker: 'Tamil Nadu Craft',
        headline: 'Temple Radiance',
        subline: 'Gopuram lines, silk borders and classical grace',
        detail: 'Pongal | Wedding | Cultural Poster',
        accent: '#FDE68A',
        isVideoInvite: true,
        animationPreset: 'mandap3d',
        tags: ['tamil nadu', 'temple', 'gopuram', 'silk', 'pongal']
      }),
      stateArtTemplate({
        id: 'kashmir_valley_saffron_state',
        name: 'Kashmir Valley Saffron',
        subcategory: 'kashmir',
        kicker: 'Kashmir Valley',
        headline: 'Mountain Grace',
        subline: 'Snow peaks, saffron bloom and lake reflections',
        detail: 'Travel | Winter | Local Greeting',
        accent: '#BAE6FD',
        animationPreset: 'photoOrbit3d',
        tags: ['kashmir', 'valley', 'dal lake', 'saffron', 'mountains']
      }),
      stateArtTemplate({
        id: 'assam_tea_rhino_state',
        name: 'Assam Tea Garden',
        subcategory: 'assam',
        kicker: 'Assam Freshness',
        headline: 'Tea Garden Mist',
        subline: 'Green estates, rhino pride and river rhythm',
        detail: 'Bihu | Travel | Fresh Offers',
        accent: '#A7F3D0',
        tags: ['assam', 'tea garden', 'bihu', 'rhino', 'brahmaputra']
      }),
      stateArtTemplate({
        id: 'karnataka_mysore_tech_state',
        name: 'Karnataka Mysore Tech',
        subcategory: 'karnataka',
        kicker: 'Karnataka Blend',
        headline: 'Palace To Future',
        subline: 'Mysore arches, coffee hills and modern energy',
        detail: 'Dasara | Startup | Event Poster',
        accent: '#C4B5FD',
        isVideoInvite: true,
        animationPreset: 'product3d',
        tags: ['karnataka', 'mysore', 'bengaluru', 'coffee', 'dasara']
      }),
      stateArtTemplate({
        id: 'odisha_temple_coast_state',
        name: 'Odisha Temple Coast',
        subcategory: 'odisha',
        kicker: 'Odisha Coast',
        headline: 'Temple Waves',
        subline: 'Konark geometry, sea breeze and handcrafted detail',
        detail: 'Rath Yatra | Travel | Culture',
        accent: '#FDE68A',
        tags: ['odisha', 'konark', 'puri', 'rath yatra', 'coast']
      }),
      stateArtTemplate({
        id: 'telangana_charminar_neon_state',
        name: 'Telangana Charminar Neon',
        subcategory: 'telangana',
        kicker: 'Telangana Nights',
        headline: 'Charminar Glow',
        subline: 'Pearl city arches, tech lights and festive streets',
        detail: 'Eid | Business | Event Poster',
        accent: '#67E8F9',
        isVideoInvite: true,
        animationPreset: 'luxury3d',
        tags: ['telangana', 'hyderabad', 'charminar', 'pearls', 'eid']
      })
    ];
  }

  function cinematicTextLayer(id, label, text, x, y, options = {}) {
    return editableTextLayer(id, label, text, x, y, {
      fontSize: options.fontSize,
      weight: options.weight,
      color: options.color,
      maxWidth: options.maxWidth ?? 0.78,
      align: options.align || 'center',
      shadowBlur: options.shadowBlur ?? 18
    });
  }

  function cinematicPremiumLayers(spec) {
    const accent = spec.accent || '#FDE68A';
    const panelColor = spec.panelColor || 'rgba(4, 7, 14, 0.52)';
    const panel = {
      id: 'cinematic_text_panel',
      label: 'Text Panel',
      type: 'shape',
      shape: 'rect',
      x: spec.panelX ?? 0.065,
      y: spec.panelY ?? 0.095,
      width: spec.panelWidth ?? 0.87,
      height: spec.panelHeight ?? 0.255,
      radius: 24,
      color: panelColor,
      editable: false,
      templateLayer: true
    };
    const layers = [panel];

    if (spec.photoSlot) {
      layers.push(editableImageSlot(
        'cinematic_photo',
        spec.photoSlot.label || 'Photo',
        spec.photoSlot.x ?? 0.23,
        spec.photoSlot.y ?? 0.34,
        spec.photoSlot.width ?? 0.54,
        spec.photoSlot.height ?? 0.36,
        {
          mask: spec.photoSlot.mask || 'arch',
          frameColor: spec.photoSlot.frameColor || accent,
          backgroundColor: 'rgba(255,255,255,0.12)',
          placeholderLabel: spec.photoSlot.placeholderLabel || spec.photoSlot.label || 'Photo',
          padding: 0.014
        }
      ));
    }

    layers.push(
      cinematicTextLayer('cinematic_kicker', 'Kicker', spec.kicker, spec.textX ?? 0.5, spec.kickerY ?? 0.14, {
        fontSize: spec.kickerSize || 22,
        weight: '800',
        color: accent,
        maxWidth: spec.kickerMaxWidth || 0.72
      }),
      cinematicTextLayer('cinematic_title', 'Title', spec.headline, spec.textX ?? 0.5, spec.titleY ?? 0.215, {
        fontSize: spec.titleSize || 62,
        weight: '900',
        color: spec.titleColor || '#FFFFFF',
        maxWidth: spec.titleMaxWidth || 0.78
      }),
      cinematicTextLayer('cinematic_subtitle', 'Subtitle', spec.subline, spec.textX ?? 0.5, spec.subtitleY ?? 0.292, {
        fontSize: spec.subtitleSize || 27,
        weight: '600',
        color: spec.subtitleColor || 'rgba(255,255,255,0.9)',
        maxWidth: spec.subtitleMaxWidth || 0.78
      }),
      cinematicTextLayer('cinematic_details', 'Details', spec.detail, spec.detailX ?? 0.5, spec.detailY ?? 0.708, {
        fontSize: spec.detailSize || 25,
        weight: '800',
        color: spec.detailColor || '#FFFFFF',
        maxWidth: spec.detailMaxWidth || 0.72
      })
    );

    return layers;
  }

  function cinematicPremiumTemplate(spec) {
    const videoTags = spec.isVideoInvite ? ['video', 'animated', 'whatsapp video', spec.animationPreset] : [];
    const basePath = spec.assetGroup === 'festival'
      ? 'assets/templates/cinematic_pack'
      : 'assets/photos/cinematic_pack';
    return {
      id: spec.id,
      name: spec.name,
      category: spec.category,
      subcategory: spec.subcategory,
      categoryLabel: spec.categoryLabel,
      path: `${basePath}/${spec.id}.svg`,
      isPremium: true,
      isVideoInvite: Boolean(spec.isVideoInvite),
      animationPreset: spec.animationPreset || (spec.isVideoInvite ? 'cinematic' : null),
      animationIntensity: spec.animationIntensity ?? 1,
      animationSpeed: spec.animationSpeed ?? 1,
      emoji: spec.emoji,
      themePack: 'cinematic_premium_v1',
      themeRank: spec.themeRank,
      tags: [
        'premium themes',
        'cinematic premium',
        'cinematic indian',
        'state of the art',
        'eye catching',
        spec.name,
        spec.category,
        spec.subcategory,
        spec.categoryLabel,
        ...(spec.tags || []),
        ...videoTags
      ].filter(Boolean),
      canvasGen: generatedBackground(spec.id, spec.fallbackGradient || ['#050816', '#7C2D12', '#FDE68A'], spec.headline, spec.subline, '#FFFFFF'),
      overlayConfig: overlay({
        bannerY: 0.792,
        bannerHeight: 0.208,
        bannerColor: spec.bannerColor || 'rgba(4, 7, 14, 0.88)',
        nameColor: spec.accent || '#FDE68A',
        phoneColor: 'rgba(255,255,255,0.9)'
      }),
      defaultLayers: cinematicPremiumLayers(spec)
    };
  }

  function createCinematicPremiumTemplates() {
    const wedding = [
      { id: 'cin_wed_royal_ruby_mandap', name: 'Royal Ruby Mandap', subcategory: 'wedding_invite', categoryLabel: 'Wedding', emoji: 'RM', kicker: 'Wedding Invitation', headline: 'Royal Celebration', subline: 'A palace evening of vows and blessings', detail: 'Date | Time | Venue', accent: '#FDE68A', animationPreset: 'mandap3d', photoSlot: { label: 'Bride & Groom Photo', mask: 'arch' }, tags: ['royal mandap', 'palace', 'ruby wedding'] },
      { id: 'cin_wed_ivory_muhurtham_gold', name: 'Ivory Muhurtham Gold', subcategory: 'south_indian', categoryLabel: 'South Indian', emoji: 'IM', kicker: 'Muhurtham', headline: 'Sacred Beginnings', subline: 'Temple bells, silk and golden blessings', detail: 'Date | Time | Venue', accent: '#FDE68A', animationPreset: 'mandap3d', photoSlot: { label: 'Couple Photo', mask: 'arch' }, tags: ['muhurtham', 'south indian', 'temple silk'] },
      { id: 'cin_wed_moonlit_nikah_jaali', name: 'Moonlit Nikah Jaali', subcategory: 'nikah', categoryLabel: 'Nikah', emoji: 'NJ', kicker: 'Nikah Invitation', headline: 'Moonlit Blessings', subline: 'Pearl lanterns and a graceful evening', detail: 'Date | Time | Venue', accent: '#BAE6FD', animationPreset: 'photoOrbit3d', photoSlot: { label: 'Couple Photo', mask: 'arch' }, tags: ['nikah', 'jaali', 'moonlit'] },
      { id: 'cin_wed_haldi_sun_shower', name: 'Haldi Sun Shower', subcategory: 'haldi', categoryLabel: 'Wedding', emoji: 'HS', kicker: 'Haldi Ceremony', headline: 'Sunlit Haldi', subline: 'Turmeric, marigolds and happy faces', detail: 'Date | Time | Venue', accent: '#FDE047', animationPreset: 'confetti3d', photoSlot: { label: 'Bride/Groom Photo', mask: 'circle' }, tags: ['haldi', 'marigold', 'turmeric'] },
      { id: 'cin_wed_emerald_mehndi_courtyard', name: 'Emerald Mehndi Courtyard', subcategory: 'mehndi', categoryLabel: 'Wedding', emoji: 'EM', kicker: 'Mehndi Night', headline: 'Emerald Mehndi', subline: 'Henna, lanterns and courtyard music', detail: 'Date | Time | Venue', accent: '#BBF7D0', animationPreset: 'rangoli3d', photoSlot: { label: 'Bride Photo', mask: 'arch' }, tags: ['mehndi', 'henna', 'courtyard'] },
      { id: 'cin_wed_bollywood_sangeet_arena', name: 'Bollywood Sangeet Arena', subcategory: 'sangeet', categoryLabel: 'Wedding', emoji: 'SA', kicker: 'Sangeet Night', headline: 'Bollywood Lights', subline: 'Dhol beats, dance floor and stage glow', detail: 'Date | Time | Venue', accent: '#FDE047', animationPreset: 'stage3d', photoSlot: { label: 'Host Photo', mask: 'rounded' }, tags: ['sangeet', 'bollywood', 'stage lights'] },
      { id: 'cin_wed_destination_beach_pheras', name: 'Destination Beach Pheras', subcategory: 'destination', categoryLabel: 'Wedding', emoji: 'BP', kicker: 'Destination Wedding', headline: 'Sunset Pheras', subline: 'Ocean breeze and golden vows', detail: 'Date | Time | Venue', accent: '#FDE68A', animationPreset: 'photoOrbit3d', photoSlot: { label: 'Couple Photo', mask: 'arch' }, tags: ['destination', 'beach', 'pheras'] },
      { id: 'cin_wed_varmala_flower_rain', name: 'Varmala Flower Rain', subcategory: 'varmala', categoryLabel: 'Wedding', emoji: 'VF', kicker: 'Varmala Ceremony', headline: 'Flower Rain', subline: 'A cinematic moment under falling petals', detail: 'Date | Time | Venue', accent: '#FBCFE8', animationPreset: 'confetti3d', photoSlot: { label: 'Couple Photo', mask: 'arch' }, tags: ['varmala', 'flower shower', 'ceremony'] },
      { id: 'cin_wed_black_gold_reception', name: 'Black Gold Reception', subcategory: 'reception', categoryLabel: 'Wedding', emoji: 'BG', kicker: 'Reception Night', headline: 'Black Gold Soiree', subline: 'Champagne lights and a grand ballroom', detail: 'Date | Time | Venue', accent: '#FDE68A', animationPreset: 'luxury3d', photoSlot: { label: 'Couple Photo', mask: 'oval' }, tags: ['reception', 'black gold', 'ballroom'] },
      { id: 'cin_wed_bride_entry_lotus_canopy', name: 'Bride Entry Lotus Canopy', subcategory: 'bride_entry', categoryLabel: 'Wedding', emoji: 'LE', kicker: 'Bride Entry', headline: 'Lotus Canopy', subline: 'A graceful walk through glowing florals', detail: 'Date | Time | Venue', accent: '#FBCFE8', animationPreset: 'stage3d', photoSlot: { label: 'Bride Photo', mask: 'arch' }, tags: ['bride entry', 'lotus', 'floral canopy'] },
      { id: 'cin_wed_starry_lotus_save_date', name: 'Starry Lotus Save Date', subcategory: 'save_the_date', categoryLabel: 'Wedding', emoji: 'SL', kicker: 'Save The Date', headline: 'Written In Stars', subline: 'Lotus constellations and timeless love', detail: 'Date | City | RSVP', accent: '#BAE6FD', animationPreset: 'photoOrbit3d', photoSlot: { label: 'Couple Photo', mask: 'circle' }, tags: ['save the date', 'celestial', 'lotus'] },
      { id: 'cin_wed_palace_rsvp_glass', name: 'Palace RSVP Glass', subcategory: 'rsvp', categoryLabel: 'Wedding', emoji: 'RG', kicker: 'RSVP Card', headline: 'Kindly RSVP', subline: 'A premium palace glass invitation', detail: 'Reply By | Phone | Venue', accent: '#FDE68A', animationPreset: 'photoOrbit3d', photoSlot: { label: 'Couple Photo', mask: 'rounded' }, tags: ['rsvp', 'glass', 'palace'] }
    ];

    const festival = [
      { id: 'cin_fest_diwali_diya_palace', name: 'Diwali Diya Palace', subcategory: 'diwali', categoryLabel: 'Diwali', emoji: 'DP', kicker: 'Festival Greetings', headline: 'Palace Of Diyas', subline: 'Light, prosperity and golden celebrations', detail: 'Warm wishes from our family', accent: '#FDE68A', animationPreset: 'fireworks3d', tags: ['diwali', 'diyas', 'palace lights'] },
      { id: 'cin_fest_lakshmi_lotus_gold', name: 'Lakshmi Lotus Gold', subcategory: 'diwali', categoryLabel: 'Diwali', emoji: 'LG', kicker: 'Diwali Puja', headline: 'Lotus Gold Blessings', subline: 'Prosperity, light and sacred glow', detail: 'Happy Diwali', accent: '#FDE68A', animationPreset: 'mandap3d', tags: ['lakshmi puja', 'lotus', 'gold'] },
      { id: 'cin_fest_holi_color_storm', name: 'Holi Color Storm', subcategory: 'holi', categoryLabel: 'Holi', emoji: 'HC', kicker: 'Festival Of Colors', headline: 'Color Storm', subline: 'Gulal clouds and joyful energy', detail: 'Happy Holi', accent: '#FDE047', animationPreset: 'confetti3d', tags: ['holi', 'gulal', 'color burst'] },
      { id: 'cin_fest_eid_moon_bazaar', name: 'Eid Moon Bazaar', subcategory: 'eid', categoryLabel: 'Eid', emoji: 'EM', kicker: 'Eid Mubarak', headline: 'Moonlit Bazaar', subline: 'Lanterns, pearls and warm daawat', detail: 'Blessings for every home', accent: '#BAE6FD', animationPreset: 'photoOrbit3d', tags: ['eid', 'crescent', 'lantern bazaar'] },
      { id: 'cin_fest_navratri_garba_arena', name: 'Navratri Garba Arena', subcategory: 'navratri', categoryLabel: 'Navratri', emoji: 'NG', kicker: 'Garba Night', headline: 'Dandiya Arena', subline: 'Nine nights of music, rhythm and light', detail: 'Date | Time | Venue', accent: '#FDE047', animationPreset: 'stage3d', tags: ['navratri', 'garba', 'dandiya'] },
      { id: 'cin_fest_durga_pandal_flame', name: 'Durga Pandal Flame', subcategory: 'durga_puja', categoryLabel: 'Durga Puja', emoji: 'DF', kicker: 'Durga Puja', headline: 'Pandal Flame', subline: 'Dhunuchi smoke and festive devotion', detail: 'Shubho Pujo', accent: '#FDBA74', animationPreset: 'stage3d', tags: ['durga puja', 'pandal', 'dhunuchi'] },
      { id: 'cin_fest_ganesh_modak_stage', name: 'Ganesh Modak Stage', subcategory: 'ganesh_chaturthi', categoryLabel: 'Ganesh', emoji: 'GM', kicker: 'Ganesh Utsav', headline: 'Modak Stage', subline: 'Golden blessings and festive drums', detail: 'Ganpati Bappa Morya', accent: '#FDE68A', animationPreset: 'mandap3d', tags: ['ganesh', 'modak', 'pandal'] },
      { id: 'cin_fest_rakhi_jewel_thread', name: 'Rakhi Jewel Thread', subcategory: 'raksha_bandhan', categoryLabel: 'Rakhi', emoji: 'RJ', kicker: 'Raksha Bandhan', headline: 'Jewel Thread', subline: 'A bond wrapped in love and shine', detail: 'Happy Rakhi', accent: '#FBCFE8', animationPreset: 'photoOrbit3d', tags: ['rakhi', 'jewel thread', 'sibling'] },
      { id: 'cin_fest_janmashtami_peacock_night', name: 'Janmashtami Peacock Night', subcategory: 'janmashtami', categoryLabel: 'Janmashtami', emoji: 'JP', kicker: 'Janmashtami', headline: 'Peacock Night', subline: 'Moonlight, flute notes and devotion', detail: 'Jai Shri Krishna', accent: '#67E8F9', animationPreset: 'photoOrbit3d', tags: ['janmashtami', 'peacock', 'flute'] },
      { id: 'cin_fest_onam_pookalam_feast', name: 'Onam Pookalam Feast', subcategory: 'onam', categoryLabel: 'Onam', emoji: 'OP', kicker: 'Onam Ashamsakal', headline: 'Pookalam Feast', subline: 'Flowers, harvest and togetherness', detail: 'Happy Onam', accent: '#FDE68A', animationPreset: 'rangoli3d', tags: ['onam', 'pookalam', 'feast'] },
      { id: 'cin_fest_pongal_harvest_sunrise', name: 'Pongal Harvest Sunrise', subcategory: 'pongal_sankranti', categoryLabel: 'Pongal', emoji: 'PH', kicker: 'Harvest Festival', headline: 'Sunrise Pongal', subline: 'Fresh harvest, sweet rice and gratitude', detail: 'Happy Pongal', accent: '#FDE68A', animationPreset: 'rangoli3d', tags: ['pongal', 'harvest', 'sunrise'] },
      { id: 'cin_fest_tricolor_light_pride', name: 'Tricolor Light Pride', subcategory: 'national', categoryLabel: 'National', emoji: 'TP', kicker: 'National Pride', headline: 'Tricolor Light', subline: 'Unity, courage and a brighter India', detail: 'Jai Hind', accent: '#67E8F9', animationPreset: 'photoOrbit3d', tags: ['independence day', 'republic day', 'tricolor'] }
    ];

    return [
      ...wedding.map((spec, index) => cinematicPremiumTemplate({
        ...spec,
        category: 'wedding',
        assetGroup: 'photo',
        isVideoInvite: true,
        themeRank: index + 1
      })),
      ...festival.map((spec, index) => cinematicPremiumTemplate({
        ...spec,
        category: 'festival',
        assetGroup: 'festival',
        isVideoInvite: true,
        themeRank: wedding.length + index + 1
      }))
    ];
  }

  function signatureImageTemplate(spec) {
    return artworkTemplate({
      ...spec,
      isPremium: true,
      tags: [
        'signature image poster',
        'earlier image',
        'premium image',
        'hero poster',
        'ready made premium',
        ...(spec.tags || [])
      ]
    });
  }

  function createSignatureImageTemplates() {
    return [
      signatureImageTemplate({ id: 'signature_diwali_many_diyas', name: 'Signature Many Diyas', category: 'festival', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'DI', path: 'assets/templates/wow_premium_pack/wow_diwali_palace_many_diyas.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['diwali', 'many diyas', 'lights', 'palace'] }),
      signatureImageTemplate({ id: 'signature_diwali_palace_lights', name: 'Palace Lights Diwali', category: 'festival', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'DL', path: 'assets/templates/premium_art/diwali_luxury_palace_of_lights.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['diwali', 'palace', 'luxury lights'] }),
      signatureImageTemplate({ id: 'signature_holi_color_portal', name: 'Signature Holi Portal', category: 'festival', categoryLabel: 'Holi', subcategory: 'holi', emoji: 'HO', path: 'assets/templates/premium_art/holi_color_portal.svg', accent: '#67E8F9', isVideoInvite: true, animationPreset: 'confetti3d', tags: ['holi', 'gulal', 'color portal'] }),
      signatureImageTemplate({ id: 'signature_eid_lantern_palace', name: 'Eid Lantern Palace', category: 'festival', categoryLabel: 'Eid', subcategory: 'eid', emoji: 'EI', path: 'assets/templates/premium_art/eid_moonlit_lantern_palace.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['eid', 'crescent', 'moonlit lantern'] }),
      signatureImageTemplate({ id: 'signature_ganesh_golden_stage', name: 'Golden Ganesh Stage', category: 'festival', categoryLabel: 'Ganesh', subcategory: 'ganesh_chaturthi', emoji: 'GN', path: 'assets/templates/premium_art/ganesh_golden_stage.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['ganesh', 'ganpati', 'gold stage'] }),
      signatureImageTemplate({ id: 'signature_royal_wedding_mandap', name: 'Signature Royal Mandap', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'premium_wedding', emoji: 'WM', path: 'assets/templates/premium_art/royal_wedding_mandap_luxury.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['wedding', 'mandap', 'royal wedding', 'couple photo'] }),
      signatureImageTemplate({ id: 'signature_haldi_marigold', name: 'Signature Haldi Marigold', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'haldi', emoji: 'HL', path: 'assets/templates/premium_indian_pack/haldi_marigold_courtyard.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['haldi', 'marigold', 'turmeric'] }),
      signatureImageTemplate({ id: 'signature_mehndi_emerald', name: 'Signature Emerald Mehndi', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'mehndi', emoji: 'MD', path: 'assets/templates/premium_indian_pack/mehndi_emerald_courtyard.svg', accent: '#BBF7D0', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['mehndi', 'henna', 'emerald'] }),
      signatureImageTemplate({ id: 'signature_sangeet_spotlight', name: 'Signature Sangeet Stage', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'sangeet', emoji: 'SG', path: 'assets/templates/premium_indian_pack/sangeet_spotlight_stage.svg', accent: '#FDE047', isVideoInvite: true, animationPreset: 'stage3d', tags: ['sangeet', 'stage', 'dance'] }),
      signatureImageTemplate({ id: 'signature_south_indian_temple', name: 'Signature Muhurtham Gold', category: 'wedding', categoryLabel: 'South Indian', subcategory: 'south_indian', emoji: 'SI', path: 'assets/templates/premium_indian_pack/south_indian_temple_silk.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['south indian', 'muhurtham', 'temple'] }),
      signatureImageTemplate({ id: 'signature_bengali_alpana', name: 'Signature Bengali Wedding', category: 'wedding', categoryLabel: 'Bengali', subcategory: 'bengali', emoji: 'BW', path: 'assets/templates/premium_indian_pack/bengali_alpana_red_gold.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['bengali', 'alpana', 'wedding'] }),
      signatureImageTemplate({ id: 'signature_nikah_moonlit', name: 'Signature Moonlit Nikah', category: 'wedding', categoryLabel: 'Nikah', subcategory: 'nikah', emoji: 'NK', path: 'assets/templates/premium_indian_pack/nikah_moonlit_jaali.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['nikah', 'moonlit', 'jaali'] }),
      signatureImageTemplate({ id: 'signature_awards_trophy', name: 'Signature Awards Trophy', category: 'corporate', categoryLabel: 'Corporate', subcategory: 'awards', emoji: 'AW', path: 'assets/templates/wow_premium_pack/wow_awards_night_trophy.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'luxury3d', tags: ['awards', 'trophy', 'corporate'] }),
      signatureImageTemplate({ id: 'signature_product_launch_orbit', name: 'Signature Product Orbit', category: 'business', categoryLabel: 'Business', subcategory: 'product_launch', emoji: 'PL', path: 'assets/templates/wow_premium_pack/wow_product_launch_orbit.svg', accent: '#67E8F9', isVideoInvite: true, animationPreset: 'product3d', tags: ['product launch', 'orbit', 'business'] }),
      signatureImageTemplate({ id: 'signature_grand_opening_luxe', name: 'Signature Grand Opening', category: 'business', categoryLabel: 'Business', subcategory: 'grand_opening', emoji: 'GO', path: 'assets/templates/wow_premium_pack/wow_grand_opening_ribbon.svg', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'luxury3d', tags: ['grand opening', 'ribbon', 'business'] })
    ];
  }

  function premiumIndianPackTemplate(spec) {
    return artworkTemplate({
      ...spec,
      path: `assets/templates/premium_indian_pack/${spec.id}.svg`,
      isPremium: true,
      tags: [
        'premium indian pack',
        'research inspired',
        'luxury poster',
        'ready made poster',
        ...(spec.tags || [])
      ]
    });
  }

  function createPremiumIndianPackTemplates() {
    return [
      premiumIndianPackTemplate({ id: 'haldi_marigold_courtyard', name: 'Marigold Courtyard Haldi', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'haldi', emoji: 'HL', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['haldi', 'marigold', 'turmeric', 'yellow wedding'] }),
      premiumIndianPackTemplate({ id: 'haldi_turmeric_splash_luxe', name: 'Turmeric Splash Haldi', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'haldi', emoji: 'HL', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'confetti3d', tags: ['haldi', 'turmeric splash', 'yellow ceremony'] }),
      premiumIndianPackTemplate({ id: 'mehndi_emerald_courtyard', name: 'Emerald Courtyard Mehndi', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'mehndi', emoji: 'MD', accent: '#BBF7D0', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['mehndi', 'henna', 'green wedding'] }),
      premiumIndianPackTemplate({ id: 'mehndi_jaali_lanterns', name: 'Jaali Lantern Mehndi', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'mehndi', emoji: 'MD', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'stage3d', tags: ['mehndi', 'jaali', 'lantern'] }),
      premiumIndianPackTemplate({ id: 'sangeet_spotlight_stage', name: 'Spotlight Stage Sangeet', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'sangeet', emoji: 'SG', accent: '#FDE047', isVideoInvite: true, animationPreset: 'stage3d', tags: ['sangeet', 'dance', 'stage'] }),
      premiumIndianPackTemplate({ id: 'sangeet_dhol_neon', name: 'Neon Dhol Sangeet', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'sangeet', emoji: 'SG', accent: '#FDE047', isVideoInvite: true, animationPreset: 'stage3d', tags: ['sangeet', 'dhol', 'neon'] }),
      premiumIndianPackTemplate({ id: 'royal_mandap_floral_gold', name: 'Royal Floral Mandap', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'wedding_invite', emoji: 'WM', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['wedding', 'mandap', 'royal floral'] }),
      premiumIndianPackTemplate({ id: 'reception_black_gold_ballroom', name: 'Black Gold Reception', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'reception', emoji: 'RC', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'spotlight', tags: ['reception', 'black gold', 'ballroom'] }),
      premiumIndianPackTemplate({ id: 'south_indian_temple_silk', name: 'Temple Silk Muhurtham', category: 'wedding', categoryLabel: 'South Indian', subcategory: 'south_indian', emoji: 'SI', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['south indian', 'muhurtham', 'temple wedding', 'silk'] }),
      premiumIndianPackTemplate({ id: 'punjabi_dhol_baraat_royal', name: 'Royal Dhol Baraat', category: 'wedding', categoryLabel: 'Punjabi', subcategory: 'punjabi', emoji: 'PW', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'confetti3d', tags: ['punjabi', 'baraat', 'dhol', 'jaggo'] }),
      premiumIndianPackTemplate({ id: 'bengali_alpana_red_gold', name: 'Red Gold Bengali Wedding', category: 'wedding', categoryLabel: 'Bengali', subcategory: 'bengali', emoji: 'BW', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['bengali', 'alpana', 'gaye holud', 'shubho drishti'] }),
      premiumIndianPackTemplate({ id: 'gujarati_garba_wedding', name: 'Gujarati Garba Wedding', category: 'wedding', categoryLabel: 'Gujarati', subcategory: 'west_indian', emoji: 'GW', accent: '#FDE047', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['gujarati', 'garba', 'dandiya', 'wedding'] }),
      premiumIndianPackTemplate({ id: 'marathi_sakharpuda_pearl', name: 'Pearl Sakharpuda', category: 'wedding', categoryLabel: 'Marathi', subcategory: 'marathi', emoji: 'MW', accent: '#FDE68A', tags: ['marathi', 'sakharpuda', 'halad', 'mangalashtak'] }),
      premiumIndianPackTemplate({ id: 'nikah_moonlit_jaali', name: 'Moonlit Jaali Nikah', category: 'wedding', categoryLabel: 'Nikah', subcategory: 'nikah', emoji: 'NK', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['nikah', 'muslim wedding', 'crescent', 'jaali'] }),
      premiumIndianPackTemplate({ id: 'christian_floral_chapel', name: 'Floral Chapel Wedding', category: 'wedding', categoryLabel: 'Christian', subcategory: 'christian', emoji: 'CW', accent: '#FBCFE8', tags: ['christian wedding', 'chapel', 'floral'] }),
      premiumIndianPackTemplate({ id: 'engagement_ring_garden', name: 'Ring Garden Engagement', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'engagement', emoji: 'EG', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['engagement', 'ring ceremony', 'couple'] }),
      premiumIndianPackTemplate({ id: 'save_date_celestial_lotus', name: 'Celestial Lotus Save Date', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'save_the_date', emoji: 'SD', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['save the date', 'celestial', 'lotus'] }),
      premiumIndianPackTemplate({ id: 'bridal_entry_floral_canopy', name: 'Floral Canopy Bride Entry', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'bride_entry', emoji: 'BE', accent: '#FBCFE8', isVideoInvite: true, animationPreset: 'stage3d', tags: ['bride entry', 'floral canopy', 'wedding'] }),
      premiumIndianPackTemplate({ id: 'cocktail_luxe_rooftop', name: 'Luxe Rooftop Cocktail', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'cocktail', emoji: 'CT', accent: '#C4B5FD', isVideoInvite: true, animationPreset: 'spotlight', tags: ['cocktail', 'rooftop', 'party'] }),
      premiumIndianPackTemplate({ id: 'wedding_thank_you_floral', name: 'Floral Wedding Thank You', category: 'wedding', categoryLabel: 'Wedding', subcategory: 'thank_you', emoji: 'TY', accent: '#FBCFE8', tags: ['wedding thank you', 'floral', 'family'] }),

      premiumIndianPackTemplate({ id: 'diwali_lotus_lantern_luxe', name: 'Lotus Lantern Diwali', categoryLabel: 'Diwali', subcategory: 'diwali', emoji: 'DI', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'fireworks3d', tags: ['diwali', 'lotus lantern', 'diyas'] }),
      premiumIndianPackTemplate({ id: 'holi_rang_mahal_luxe', name: 'Rang Mahal Holi', categoryLabel: 'Holi', subcategory: 'holi', emoji: 'HO', accent: '#FDE047', isVideoInvite: true, animationPreset: 'confetti3d', tags: ['holi', 'rang mahal', 'colors'] }),
      premiumIndianPackTemplate({ id: 'eid_pearl_crescent_luxe', name: 'Pearl Crescent Eid', categoryLabel: 'Eid', subcategory: 'eid', emoji: 'EI', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['eid', 'crescent', 'pearls'] }),
      premiumIndianPackTemplate({ id: 'navratri_goddess_stage_luxe', name: 'Goddess Stage Navratri', categoryLabel: 'Navratri', subcategory: 'navratri', emoji: 'NV', accent: '#FDE047', isVideoInvite: true, animationPreset: 'stage3d', tags: ['navratri', 'goddess', 'aarti', 'garba'] }),
      premiumIndianPackTemplate({ id: 'ganesh_modak_palace_luxe', name: 'Modak Palace Ganesh', categoryLabel: 'Ganesh', subcategory: 'ganesh_chaturthi', emoji: 'GN', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'mandap3d', tags: ['ganesh', 'modak', 'bappa'] }),
      premiumIndianPackTemplate({ id: 'durga_shakti_luxe', name: 'Shakti Durga Puja', categoryLabel: 'Durga Puja', subcategory: 'durga_puja', emoji: 'DP', accent: '#FDBA74', isVideoInvite: true, animationPreset: 'stage3d', tags: ['durga puja', 'shakti', 'dhunuchi'] }),
      premiumIndianPackTemplate({ id: 'rakhi_royal_jewel_luxe', name: 'Royal Jewel Rakhi', categoryLabel: 'Rakhi', subcategory: 'raksha_bandhan', emoji: 'RK', accent: '#FBCFE8', tags: ['rakhi', 'raksha bandhan', 'royal thread'] }),
      premiumIndianPackTemplate({ id: 'pongal_pookalam_harvest_luxe', name: 'Pookalam Harvest Pongal', categoryLabel: 'Pongal', subcategory: 'pongal_sankranti', emoji: 'PO', accent: '#FDE68A', isVideoInvite: true, animationPreset: 'rangoli3d', tags: ['pongal', 'pookalam', 'harvest'] }),
      premiumIndianPackTemplate({ id: 'janmashtami_peacock_palace', name: 'Peacock Palace Janmashtami', categoryLabel: 'Janmashtami', subcategory: 'janmashtami', emoji: 'JK', accent: '#38BDF8', isVideoInvite: true, animationPreset: 'photoOrbit3d', tags: ['janmashtami', 'krishna', 'peacock', 'flute'] }),
      premiumIndianPackTemplate({ id: 'independence_cinematic_tricolor', name: 'Cinematic Tricolor India', categoryLabel: 'National', subcategory: 'national', emoji: 'IN', accent: '#0A3D91', tags: ['independence day', 'tricolor', 'india'] })
    ];
  }

  function wowPremiumPosterTemplate(spec) {
    const keywordTags = spec.id
      .replace(/^wow_/, '')
      .split('_')
      .filter(Boolean);
    const categoryLabel = spec.categoryLabel || spec.category || 'Premium';
    return artworkTemplate({
      ...spec,
      path: `assets/templates/wow_premium_pack/${spec.id}.svg`,
      isPremium: true,
      isVideoInvite: Boolean(spec.animationPreset),
      emoji: spec.emoji || categoryLabel.substring(0, 2).toUpperCase(),
      tags: [
        'wow premium pack',
        'premium poster',
        'beautiful lights',
        'amazing colors',
        'ready made design',
        'research inspired',
        ...keywordTags,
        ...(spec.tags || [])
      ]
    });
  }

  function createWowPremiumPosterTemplates() {
    const rows = [
      ['wow_haldi_sunlit_marigold', 'Sunlit Haldi', 'wedding', 'haldi', 'Wedding', '#FDE047', 'mandap3d'],
      ['wow_haldi_lotus_turmeric', 'Lotus Haldi', 'wedding', 'haldi', 'Wedding', '#FDE68A', 'confetti3d'],
      ['wow_mehndi_emerald_henna', 'Emerald Mehndi', 'wedding', 'mehndi', 'Wedding', '#BBF7D0', 'rangoli3d'],
      ['wow_mehndi_lantern_courtyard', 'Lantern Mehndi', 'wedding', 'mehndi', 'Wedding', '#FDE68A', 'stage3d'],
      ['wow_sangeet_neon_dhol', 'Neon Sangeet', 'wedding', 'sangeet', 'Wedding', '#FDE047', 'stage3d'],
      ['wow_sangeet_golden_stage', 'Golden Sangeet', 'wedding', 'sangeet', 'Wedding', '#FDE68A', 'stage3d'],
      ['wow_royal_mandap_ruby', 'Royal Mandap', 'wedding', 'wedding_invite', 'Wedding', '#FDE68A', 'mandap3d'],
      ['wow_floral_mandap_blush', 'Floral Mandap', 'wedding', 'wedding_invite', 'Wedding', '#FBCFE8', 'mandap3d'],
      ['wow_reception_black_gold', 'Black Gold Reception', 'wedding', 'reception', 'Wedding', '#FDE68A', 'luxury3d'],
      ['wow_engagement_ring_aurora', 'Aurora Engagement', 'wedding', 'engagement', 'Wedding', '#FDE68A', 'photoOrbit3d'],
      ['wow_save_date_starry_lotus', 'Save The Date', 'wedding', 'save_the_date', 'Wedding', '#FDE68A', 'photoOrbit3d'],
      ['wow_bride_entry_canopy', 'Bride Entry', 'wedding', 'bride_entry', 'Wedding', '#FBCFE8', 'stage3d'],
      ['wow_baraat_punjabi_dhol', 'Baraat Welcome', 'wedding', 'punjabi', 'Punjabi', '#FDE68A', 'confetti3d'],
      ['wow_south_indian_temple_gold', 'Muhurtham Gold', 'wedding', 'south_indian', 'South Indian', '#FDE68A', 'mandap3d'],
      ['wow_bengali_alpana_luxe', 'Bengali Wedding', 'wedding', 'bengali', 'Bengali', '#FDE68A', 'rangoli3d'],
      ['wow_gujarati_garba_neon', 'Garba Wedding', 'wedding', 'west_indian', 'Gujarati', '#FDE047', 'rangoli3d'],
      ['wow_marathi_pearl_halad', 'Pearl Halad', 'wedding', 'marathi', 'Marathi', '#FDE68A', 'photoOrbit3d'],
      ['wow_nikah_moonlit_lantern', 'Moonlit Nikah', 'wedding', 'nikah', 'Nikah', '#FDE68A', 'photoOrbit3d'],
      ['wow_christian_chapel_bloom', 'Chapel Blooms', 'wedding', 'christian', 'Christian', '#FBCFE8', 'spotlight'],
      ['wow_destination_beach_pheras', 'Beach Pheras', 'wedding', 'destination', 'Wedding', '#FDE68A', 'photoOrbit3d'],
      ['wow_cocktail_rooftop_luxe', 'Rooftop Cocktail', 'wedding', 'cocktail', 'Wedding', '#C4B5FD', 'spotlight'],
      ['wow_wedding_thank_you_roses', 'Wedding Thank You', 'wedding', 'thank_you', 'Wedding', '#FBCFE8', 'photoOrbit3d'],
      ['wow_couple_photo_palace', 'Palace Couple Card', 'wedding', 'couple_photo', 'Wedding', '#FDE68A', 'photoOrbit3d'],
      ['wow_rsvp_liquid_glass', 'RSVP Glass Card', 'wedding', 'rsvp', 'Wedding', '#BAE6FD', 'photoOrbit3d'],
      ['wow_reception_champagne', 'Champagne Reception', 'wedding', 'reception', 'Wedding', '#FDE68A', 'spotlight'],
      ['wow_haldi_poolside_modern', 'Poolside Haldi', 'wedding', 'haldi', 'Wedding', '#FDE047', 'confetti3d'],
      ['wow_mehndi_peacock_jewel', 'Peacock Mehndi', 'wedding', 'mehndi', 'Wedding', '#38BDF8', 'rangoli3d'],
      ['wow_sangeet_bollywood_lights', 'Bollywood Sangeet', 'wedding', 'sangeet', 'Wedding', '#FDE047', 'stage3d'],
      ['wow_varnamala_floral_shower', 'Varmala Shower', 'wedding', 'varmala', 'Wedding', '#FDE68A', 'confetti3d'],
      ['wow_wedding_itinerary_multi_event', 'Wedding Itinerary', 'wedding', 'itinerary', 'Wedding', '#FDE68A', 'photoOrbit3d'],
      ['wow_diwali_palace_many_diyas', 'Palace Diwali', 'festival', 'diwali', 'Diwali', '#FDE68A', 'fireworks3d'],
      ['wow_diwali_cosmic_rangoli', 'Cosmic Rangoli', 'festival', 'diwali', 'Diwali', '#FDE047', 'rangoli3d'],
      ['wow_diwali_lakshmi_lotus_gold', 'Lakshmi Lotus', 'festival', 'diwali', 'Diwali', '#FDE68A', 'mandap3d'],
      ['wow_holi_color_cloud', 'Holi Color Cloud', 'festival', 'holi', 'Holi', '#FDE047', 'confetti3d'],
      ['wow_holi_rang_mahal', 'Rang Mahal Holi', 'festival', 'holi', 'Holi', '#FDE047', 'confetti3d'],
      ['wow_holi_pool_party', 'Holi Pool Party', 'festival', 'holi', 'Holi', '#FDE047', 'stage3d'],
      ['wow_eid_pearl_crescent', 'Pearl Eid', 'festival', 'eid', 'Eid', '#FDE68A', 'photoOrbit3d'],
      ['wow_eid_lantern_dawat', 'Eid Daawat', 'festival', 'eid', 'Eid', '#FDE68A', 'stage3d'],
      ['wow_ramadan_iftar_moon', 'Iftar Evening', 'festival', 'ramadan', 'Ramadan', '#BAE6FD', 'photoOrbit3d'],
      ['wow_navratri_garba_arena', 'Garba Arena', 'festival', 'navratri', 'Navratri', '#FDE047', 'stage3d'],
      ['wow_navratri_mata_aarti', 'Mata Aarti', 'festival', 'navratri', 'Navratri', '#FDE68A', 'mandap3d'],
      ['wow_dandiya_neon_night', 'Dandiya Neon', 'festival', 'navratri', 'Navratri', '#FDE047', 'stage3d'],
      ['wow_ganesh_gold_pandal', 'Golden Ganesh', 'festival', 'ganesh_chaturthi', 'Ganesh', '#FDE68A', 'mandap3d'],
      ['wow_ganesh_modak_blessing', 'Modak Blessings', 'festival', 'ganesh_chaturthi', 'Ganesh', '#FDE047', 'photoOrbit3d'],
      ['wow_durga_cinematic_pandal', 'Durga Pandal', 'festival', 'durga_puja', 'Durga Puja', '#FDBA74', 'stage3d'],
      ['wow_durga_dhunuchi_flame', 'Dhunuchi Night', 'festival', 'durga_puja', 'Durga Puja', '#FDE68A', 'stage3d'],
      ['wow_rakhi_jewel_thread', 'Jewel Rakhi', 'festival', 'raksha_bandhan', 'Rakhi', '#FBCFE8', 'photoOrbit3d'],
      ['wow_rakhi_sibling_photo', 'Sibling Rakhi', 'festival', 'raksha_bandhan', 'Rakhi', '#FBCFE8', 'photoOrbit3d'],
      ['wow_pongal_harvest_pot', 'Harvest Pongal', 'festival', 'pongal_sankranti', 'Pongal', '#FDE68A', 'rangoli3d'],
      ['wow_onam_pookalam_luxe', 'Onam Pookalam', 'festival', 'onam', 'Onam', '#FDE68A', 'rangoli3d'],
      ['wow_janmashtami_peacock_flute', 'Janmashtami', 'festival', 'janmashtami', 'Janmashtami', '#38BDF8', 'photoOrbit3d'],
      ['wow_independence_tricolor_light', 'Independence Day', 'festival', 'national', 'National', '#0A3D91', 'photoOrbit3d'],
      ['wow_republic_ashoka_pride', 'Republic Day', 'festival', 'national', 'National', '#0A3D91', 'photoOrbit3d'],
      ['wow_christmas_luxury_lights', 'Christmas Lights', 'festival', 'christmas_new_year', 'Christmas', '#FDE68A', 'fireworks3d'],
      ['wow_newyear_midnight_fireworks', 'Midnight New Year', 'festival', 'christmas_new_year', 'New Year', '#FDE68A', 'fireworks3d'],
      ['wow_lohri_bonfire_dhol', 'Lohri Bonfire', 'festival', 'lohri', 'Lohri', '#FDBA74', 'confetti3d'],
      ['wow_sankranti_kite_sky', 'Kite Sankranti', 'festival', 'pongal_sankranti', 'Sankranti', '#FDE047', 'photoOrbit3d'],
      ['wow_baisakhi_harvest_gold', 'Baisakhi Gold', 'festival', 'baisakhi', 'Baisakhi', '#FDE68A', 'confetti3d'],
      ['wow_karwa_chauth_moon', 'Karwa Chauth', 'festival', 'karwa_chauth', 'Karwa Chauth', '#FDE68A', 'photoOrbit3d'],
      ['wow_chhath_sunrise_prayer', 'Chhath Puja', 'festival', 'chhath', 'Chhath', '#FDE68A', 'photoOrbit3d'],
      ['wow_mahashivratri_cosmic', 'Mahashivratri', 'festival', 'mahashivratri', 'Mahashivratri', '#BAE6FD', 'photoOrbit3d'],
      ['wow_ram_navami_temple', 'Ram Navami', 'festival', 'ram_navami', 'Ram Navami', '#FDE68A', 'mandap3d'],
      ['wow_dussehra_ravan_fireworks', 'Happy Dussehra', 'festival', 'dussehra', 'Dussehra', '#FDE68A', 'fireworks3d'],
      ['wow_guru_purnima_light', 'Guru Purnima', 'festival', 'guru_purnima', 'Guru Purnima', '#FDE68A', 'photoOrbit3d'],
      ['wow_teachers_day_gold', 'Teachers Day', 'festival', 'teachers_day', 'Teachers Day', '#FDE68A', 'spotlight'],
      ['wow_birthday_kids_candy_lights', 'Birthday Fun', 'party', 'birthday_kids', 'Birthday', '#F9A8D4', 'luxury3d'],
      ['wow_birthday_milestone_black_gold', 'Milestone Birthday', 'party', 'birthday', 'Birthday', '#FDE68A', 'fireworks3d'],
      ['wow_birthday_princess_castle', 'Princess Birthday', 'party', 'birthday_kids', 'Birthday', '#FBCFE8', 'luxury3d'],
      ['wow_anniversary_champagne_luxe', 'Anniversary Night', 'party', 'anniversary', 'Anniversary', '#FDE68A', 'spotlight'],
      ['wow_baby_shower_pastel_clouds', 'Baby Shower', 'party', 'baby_shower', 'Baby Shower', '#BAE6FD', 'luxury3d'],
      ['wow_naming_ceremony_lotus', 'Naming Ceremony', 'party', 'naming_ceremony', 'Naming', '#FBCFE8', 'photoOrbit3d'],
      ['wow_housewarming_griha_pravesh', 'Housewarming', 'party', 'housewarming', 'Housewarming', '#FDE68A', 'mandap3d'],
      ['wow_kitty_party_glam', 'Kitty Party Glam', 'party', 'kitty_party', 'Kitty Party', '#FBCFE8', 'stage3d'],
      ['wow_farewell_neon_memories', 'Farewell Night', 'party', 'farewell', 'Farewell', '#67E8F9', 'stage3d'],
      ['wow_graduation_spotlight', 'Graduation Party', 'party', 'graduation', 'Graduation', '#FDE68A', 'spotlight'],
      ['wow_pool_party_tropical', 'Pool Party', 'party', 'pool_party', 'Party', '#FDE047', 'confetti3d'],
      ['wow_music_night_stage', 'Music Night', 'party', 'music_night', 'Party', '#FDE047', 'stage3d'],
      ['wow_dinner_party_candlelight', 'Dinner Party', 'party', 'dinner_party', 'Party', '#FDE68A', 'spotlight'],
      ['wow_family_reunion_photo', 'Family Reunion', 'party', 'family_reunion', 'Family', '#FDE68A', 'photoOrbit3d'],
      ['wow_bridal_shower_blush', 'Bridal Shower', 'party', 'bridal_shower', 'Party', '#FBCFE8', 'photoOrbit3d'],
      ['wow_webinar_blue_glass', 'Premium Webinar', 'corporate', 'webinar', 'Corporate', '#BAE6FD', 'luxury3d'],
      ['wow_seminar_premium_stage', 'Leadership Seminar', 'corporate', 'seminar', 'Corporate', '#FDE68A', 'spotlight'],
      ['wow_workshop_neon_grid', 'Creative Workshop', 'corporate', 'workshop', 'Corporate', '#67E8F9', 'stage3d'],
      ['wow_product_launch_orbit', 'Product Launch', 'business', 'product_launch', 'Business', '#67E8F9', 'product3d'],
      ['wow_grand_opening_ribbon', 'Grand Opening', 'business', 'grand_opening', 'Business', '#FDE68A', 'luxury3d'],
      ['wow_sale_megadeal_burst', 'Mega Sale', 'business', 'sale', 'Business', '#FDE047', 'luxury3d'],
      ['wow_awards_night_trophy', 'Awards Night', 'corporate', 'awards', 'Corporate', '#FDE68A', 'luxury3d'],
      ['wow_hiring_spotlight', 'We Are Hiring', 'business', 'hiring', 'Business', '#BAE6FD', 'stage3d'],
      ['wow_conference_future_city', 'Future Conference', 'corporate', 'conference', 'Corporate', '#67E8F9', 'stage3d'],
      ['wow_expo_booth_lights', 'Expo Showcase', 'corporate', 'expo', 'Corporate', '#FDE047', 'stage3d'],
      ['wow_real_estate_luxury_openhouse', 'Luxury Open House', 'business', 'real_estate', 'Business', '#FDE68A', 'photoOrbit3d'],
      ['wow_restaurant_food_festival', 'Food Festival', 'business', 'restaurant', 'Business', '#FDE68A', 'confetti3d'],
      ['wow_salon_beauty_luxe', 'Beauty Studio', 'business', 'salon', 'Business', '#FBCFE8', 'photoOrbit3d'],
      ['wow_clinic_healthcare_trust', 'Health Camp', 'business', 'clinic', 'Business', '#A7F3D0', 'photoOrbit3d'],
      ['wow_gym_fitness_energy', 'Fitness Challenge', 'business', 'gym', 'Business', '#FDE047', 'stage3d'],
      ['wow_coaching_masterclass', 'Masterclass', 'business', 'coaching', 'Business', '#FDE68A', 'photoOrbit3d'],
      ['wow_finance_growth_summit', 'Growth Summit', 'corporate', 'finance', 'Corporate', '#A7F3D0', 'stage3d'],
      ['wow_tech_ai_event', 'AI Tech Event', 'corporate', 'tech', 'Corporate', '#67E8F9', 'product3d'],
      ['wow_fashion_show_runway', 'Fashion Runway', 'business', 'fashion', 'Business', '#FBCFE8', 'spotlight'],
      ['wow_travel_deal_sunset', 'Travel Deal', 'business', 'travel', 'Business', '#FDE68A', 'luxury3d']
    ];

    return rows.map(([id, name, category, subcategory, categoryLabel, accent, animationPreset]) => wowPremiumPosterTemplate({
      id,
      name,
      category,
      subcategory,
      categoryLabel,
      accent,
      animationPreset
    }));
  }

  const templates = [
    {
      id: 'diwali_01',
      name: 'Diwali Glow',
      category: 'festival',
      subcategory: 'diwali',
      categoryLabel: 'Diwali',
      path: 'assets/templates/diwali_01.png',
      isPremium: false,
      emoji: 'D',
      tags: ['diwali', 'deepavali', 'festival', 'lights', 'greeting'],
      overlayConfig: overlay({ bannerColor: 'rgba(20, 10, 5, 0.86)' })
    },
    {
      id: 'diwali_02',
      name: 'Deepavali Night',
      category: 'festival',
      subcategory: 'diwali',
      categoryLabel: 'Diwali',
      path: 'assets/templates/diwali_02.png',
      isPremium: true,
      emoji: 'D',
      tags: ['diwali', 'deepavali', 'fireworks', 'premium', 'festival'],
      overlayConfig: overlay({ bannerColor: 'rgba(30, 10, 40, 0.88)' })
    },
    {
      id: 'eid_01',
      name: 'Eid Mubarak',
      category: 'festival',
      subcategory: 'eid',
      categoryLabel: 'Eid',
      path: 'assets/templates/eid_01.png',
      isPremium: false,
      emoji: 'E',
      tags: ['eid', 'mubarak', 'ramzan', 'festival', 'greeting'],
      overlayConfig: overlay({
        bannerColor: 'rgba(5, 30, 25, 0.88)',
        phoneColor: '#E0FFE0'
      })
    },
    {
      id: 'holi_01',
      name: 'Rang Barse',
      category: 'festival',
      subcategory: 'holi',
      categoryLabel: 'Holi',
      path: 'assets/templates/holi_01.png',
      isPremium: false,
      emoji: 'H',
      tags: ['holi', 'colors', 'rang', 'festival', 'gulal'],
      overlayConfig: overlay({
        bannerColor: 'rgba(40, 10, 50, 0.88)',
        nameColor: '#FFFFFF',
        phoneColor: '#FFE0F0'
      })
    },
    {
      id: 'independence_01',
      name: 'Jai Hind',
      category: 'festival',
      subcategory: 'national',
      categoryLabel: 'National',
      path: 'assets/templates/independence_01.png',
      isPremium: false,
      emoji: 'IN',
      tags: ['independence day', 'india', 'national', 'tricolor', 'patriotic'],
      overlayConfig: overlay({ bannerColor: 'rgba(10, 20, 40, 0.88)' })
    },
    {
      id: 'republic_01',
      name: 'Republic Pride',
      category: 'festival',
      subcategory: 'national',
      categoryLabel: 'National',
      path: 'assets/templates/republic_01.png',
      isPremium: true,
      emoji: 'IN',
      tags: ['republic day', 'india', 'national', 'tricolor', 'premium'],
      overlayConfig: overlay({ bannerColor: 'rgba(10, 15, 35, 0.88)' })
    },
    {
      id: 'good_morning_01',
      name: 'Sunrise Vibes',
      category: 'daily',
      subcategory: 'good_morning',
      categoryLabel: 'Daily',
      path: 'assets/templates/good_morning_01.png',
      isPremium: false,
      emoji: 'GM',
      tags: ['good morning', 'daily', 'sunrise', 'flowers', 'greeting'],
      canvasGen: generatedBackground('good_morning', ['#FF6B2C', '#FFB800', '#FFF3E0'], 'Good Morning', 'Have a Beautiful Day!'),
      overlayConfig: overlay({
        bannerColor: 'rgba(60, 20, 0, 0.86)',
        nameColor: '#FFFFFF',
        phoneColor: '#FFE0C0'
      })
    },
    {
      id: 'good_morning_02',
      name: 'Chai & Flowers',
      category: 'daily',
      subcategory: 'good_morning',
      categoryLabel: 'Daily',
      path: 'assets/templates/good_morning_02.png',
      isPremium: true,
      emoji: 'GM',
      tags: ['good morning', 'daily', 'chai', 'flowers', 'premium'],
      canvasGen: generatedBackground('good_morning_2', ['#8B5E3C', '#D4956A', '#FFE8D0'], 'Good Morning', 'Start Your Day with a Smile'),
      overlayConfig: overlay({
        bannerColor: 'rgba(50, 30, 15, 0.88)',
        nameColor: '#FFE0B0'
      })
    },
    {
      id: 'navratri_01',
      name: 'Garba Nights',
      category: 'festival',
      subcategory: 'navratri',
      categoryLabel: 'Navratri',
      path: 'assets/templates/navratri_01.png',
      isPremium: false,
      emoji: 'N',
      tags: ['navratri', 'garba', 'dandiya', 'festival', 'greeting'],
      canvasGen: generatedBackground('navratri', ['#E91E8C', '#FF6B2C', '#FFB800'], 'Happy Navratri', 'Jai Mata Di'),
      overlayConfig: overlay({ bannerColor: 'rgba(50, 5, 30, 0.88)' })
    },
    {
      id: 'raksha_bandhan_01',
      name: 'Rakhi Love',
      category: 'festival',
      subcategory: 'raksha_bandhan',
      categoryLabel: 'Rakhi',
      path: 'assets/templates/raksha_bandhan_01.png',
      isPremium: true,
      emoji: 'R',
      tags: ['raksha bandhan', 'rakhi', 'siblings', 'festival', 'premium'],
      canvasGen: generatedBackground('raksha_bandhan', ['#7C3AED', '#E91E8C', '#FFB800'], 'Happy Raksha Bandhan', 'Celebrating the Bond of Love'),
      overlayConfig: overlay({ bannerColor: 'rgba(40, 10, 50, 0.88)' })
    },
    {
      id: 'wedding_01',
      name: 'Wedding Invitation',
      category: 'wedding',
      subcategory: 'wedding',
      categoryLabel: 'Wedding',
      path: null,
      isPremium: false,
      emoji: 'W',
      tags: ['wedding', 'marriage', 'invitation', 'save the date', 'couple'],
      canvasGen: generatedBackground('wedding', ['#5B1636', '#C06C84', '#F8D7C4'], 'Wedding Invitation', 'Join Us To Celebrate', '#FFF5E8'),
      overlayConfig: overlay({
        bannerColor: 'rgba(58, 15, 39, 0.88)',
        nameColor: '#FFE7B8'
      })
    },
    {
      id: 'wedding_02',
      name: 'Reception Night',
      category: 'wedding',
      subcategory: 'reception',
      categoryLabel: 'Wedding',
      path: null,
      isPremium: true,
      emoji: 'W',
      tags: ['wedding', 'reception', 'invite', 'premium', 'event'],
      canvasGen: generatedBackground('reception', ['#191724', '#7C3AED', '#F7C948'], 'Reception', 'You Are Invited', '#FFFFFF'),
      overlayConfig: overlay({
        bannerColor: 'rgba(20, 17, 32, 0.9)',
        nameColor: '#FFD700'
      })
    },
    {
      id: 'birthday_01',
      name: 'Birthday Bash',
      category: 'birthday',
      subcategory: 'birthday',
      categoryLabel: 'Birthday',
      path: null,
      isPremium: false,
      emoji: 'BD',
      tags: ['birthday', 'party', 'kids', 'celebration', 'invite'],
      canvasGen: generatedBackground('birthday', ['#315CFF', '#E91E8C', '#FFB800'], 'Birthday Party', 'Celebrate With Us'),
      overlayConfig: overlay({
        bannerColor: 'rgba(18, 30, 70, 0.88)',
        nameColor: '#FFFFFF'
      })
    },
    {
      id: 'kitty_party_01',
      name: 'Kitty Party',
      category: 'party',
      subcategory: 'kitty_party',
      categoryLabel: 'Party',
      path: null,
      isPremium: false,
      emoji: 'KP',
      tags: ['kitty party', 'ladies party', 'invite', 'games', 'snacks'],
      canvasGen: generatedBackground('kitty_party', ['#7C2D12', '#F97316', '#FDE68A'], 'Kitty Party', 'Fun, Food & Friends', '#FFF7ED'),
      overlayConfig: overlay({
        bannerColor: 'rgba(70, 28, 8, 0.88)',
        nameColor: '#FFE7A3'
      })
    },
    {
      id: 'corporate_01',
      name: 'Corporate Invite',
      category: 'corporate',
      subcategory: 'meeting',
      categoryLabel: 'Corporate',
      path: null,
      isPremium: false,
      emoji: 'CO',
      tags: ['corporate', 'meeting', 'seminar', 'webinar', 'professional'],
      canvasGen: generatedBackground('corporate', ['#0F172A', '#2563EB', '#38BDF8'], 'Corporate Invite', 'Professional Event', '#E0F2FE'),
      overlayConfig: overlay({
        bannerColor: 'rgba(8, 15, 32, 0.9)',
        nameColor: '#E0F2FE'
      })
    },
    {
      id: 'opening_01',
      name: 'Grand Opening',
      category: 'business',
      subcategory: 'opening',
      categoryLabel: 'Business',
      path: null,
      isPremium: false,
      emoji: 'GO',
      tags: ['business', 'opening', 'launch', 'shop', 'invite'],
      canvasGen: generatedBackground('opening', ['#064E3B', '#10B981', '#FBBF24'], 'Grand Opening', 'You Are Invited', '#ECFDF5'),
      overlayConfig: overlay({
        bannerColor: 'rgba(4, 50, 38, 0.9)',
        nameColor: '#FDE68A'
      })
    },
    {
      id: 'sale_01',
      name: 'Big Sale Poster',
      category: 'business',
      subcategory: 'offer',
      categoryLabel: 'Business',
      path: null,
      isPremium: true,
      emoji: 'SL',
      tags: ['sale', 'offer', 'discount', 'shop', 'business', 'premium'],
      canvasGen: generatedBackground('sale', ['#7F1D1D', '#EF4444', '#FBBF24'], 'Big Sale', 'Limited Time Offer', '#FFFFFF'),
      overlayConfig: overlay({
        bannerColor: 'rgba(70, 10, 10, 0.9)',
        nameColor: '#FFF3B0'
      })
    },
    {
      id: 'haldi_01',
      name: 'Haldi Ceremony',
      category: 'wedding',
      subcategory: 'haldi',
      categoryLabel: 'Wedding',
      path: null,
      isPremium: false,
      emoji: 'HL',
      tags: ['haldi', 'wedding', 'ceremony', 'yellow', 'invitation'],
      canvasGen: generatedBackground('haldi', ['#78350F', '#F59E0B', '#FEF3C7'], 'Haldi Ceremony', 'Join the Celebration', '#FFF7D6'),
      overlayConfig: overlay({
        bannerColor: 'rgba(76, 35, 8, 0.9)',
        nameColor: '#FDE68A'
      })
    },
    {
      id: 'mehndi_01',
      name: 'Mehndi Night',
      category: 'wedding',
      subcategory: 'mehndi',
      categoryLabel: 'Wedding',
      path: null,
      isPremium: false,
      emoji: 'MD',
      tags: ['mehndi', 'wedding', 'sangeet', 'green', 'invite'],
      canvasGen: generatedBackground('mehndi', ['#052E16', '#16A34A', '#FACC15'], 'Mehndi Night', 'Music, Dance & Blessings', '#ECFDF5'),
      overlayConfig: overlay({
        bannerColor: 'rgba(5, 46, 22, 0.9)',
        nameColor: '#BBF7D0'
      })
    },
    {
      id: 'engagement_01',
      name: 'Engagement Invite',
      category: 'wedding',
      subcategory: 'engagement',
      categoryLabel: 'Wedding',
      path: null,
      isPremium: true,
      emoji: 'EG',
      tags: ['engagement', 'ring ceremony', 'wedding', 'couple', 'premium'],
      canvasGen: generatedBackground('engagement', ['#312E81', '#A855F7', '#FDE68A'], 'Engagement', 'Two Hearts, One Promise', '#FDF4FF'),
      overlayConfig: overlay({
        bannerColor: 'rgba(34, 28, 88, 0.9)',
        nameColor: '#FDE68A'
      })
    },
    {
      id: 'sangeet_01',
      name: 'Sangeet Celebration',
      category: 'wedding',
      subcategory: 'sangeet',
      categoryLabel: 'Wedding',
      path: null,
      isPremium: false,
      emoji: 'SG',
      tags: ['sangeet', 'wedding', 'music', 'dance', 'invite'],
      canvasGen: generatedBackground('sangeet', ['#581C87', '#DB2777', '#F97316'], 'Sangeet', 'An Evening of Music', '#FFF1F2'),
      overlayConfig: overlay({
        bannerColor: 'rgba(62, 16, 80, 0.9)',
        nameColor: '#FDBA74'
      })
    },
    {
      id: 'anniversary_01',
      name: 'Anniversary Party',
      category: 'party',
      subcategory: 'anniversary',
      categoryLabel: 'Party',
      path: null,
      isPremium: false,
      emoji: 'AN',
      tags: ['anniversary', 'party', 'couple', 'celebration', 'invite'],
      canvasGen: generatedBackground('anniversary', ['#831843', '#BE185D', '#FBCFE8'], 'Anniversary', 'Celebrate Love & Togetherness', '#FFF1F2'),
      overlayConfig: overlay({
        bannerColor: 'rgba(83, 18, 54, 0.9)',
        nameColor: '#FBCFE8'
      })
    },
    {
      id: 'birthday_kids_01',
      name: 'Kids Birthday',
      category: 'birthday',
      subcategory: 'kids',
      categoryLabel: 'Birthday',
      path: null,
      isPremium: false,
      emoji: 'KB',
      tags: ['birthday', 'kids', 'children', 'party', 'invite'],
      canvasGen: generatedBackground('kids_birthday', ['#0EA5E9', '#22C55E', '#FDE047'], 'Birthday Fun', 'Cake, Games & Smiles'),
      overlayConfig: overlay({
        bannerColor: 'rgba(7, 48, 78, 0.88)',
        nameColor: '#FEF9C3'
      })
    },
    {
      id: 'birthday_milestone_01',
      name: 'Milestone Birthday',
      category: 'birthday',
      subcategory: 'milestone',
      categoryLabel: 'Birthday',
      path: null,
      isPremium: true,
      emoji: 'MB',
      tags: ['birthday', 'milestone', 'adult', 'party', 'premium'],
      canvasGen: generatedBackground('milestone_birthday', ['#111827', '#B45309', '#FDE68A'], 'Birthday Celebration', 'A Special Year Begins', '#FEF3C7'),
      overlayConfig: overlay({
        bannerColor: 'rgba(17, 24, 39, 0.92)',
        nameColor: '#FDE68A'
      })
    },
    {
      id: 'baby_shower_01',
      name: 'Baby Shower',
      category: 'party',
      subcategory: 'baby_shower',
      categoryLabel: 'Party',
      path: null,
      isPremium: false,
      emoji: 'BS',
      tags: ['baby shower', 'godh bharai', 'family', 'invite', 'celebration'],
      canvasGen: generatedBackground('baby_shower', ['#0E7490', '#67E8F9', '#FFE4E6'], 'Baby Shower', 'Blessings & Joy', '#F0FDFA'),
      overlayConfig: overlay({
        bannerColor: 'rgba(8, 75, 88, 0.9)',
        nameColor: '#CFFAFE'
      })
    },
    {
      id: 'housewarming_01',
      name: 'Housewarming',
      category: 'party',
      subcategory: 'housewarming',
      categoryLabel: 'Party',
      path: null,
      isPremium: false,
      emoji: 'HW',
      tags: ['housewarming', 'griha pravesh', 'home', 'puja', 'invite'],
      canvasGen: generatedBackground('housewarming', ['#134E4A', '#14B8A6', '#FDE68A'], 'Housewarming', 'Welcome to Our New Home', '#F0FDFA'),
      overlayConfig: overlay({
        bannerColor: 'rgba(10, 67, 62, 0.9)',
        nameColor: '#FDE68A'
      })
    },
    {
      id: 'pooja_invite_01',
      name: 'Pooja Invitation',
      category: 'party',
      subcategory: 'pooja',
      categoryLabel: 'Party',
      path: null,
      isPremium: false,
      emoji: 'PJ',
      tags: ['pooja', 'puja', 'invitation', 'religious', 'family'],
      canvasGen: generatedBackground('pooja', ['#7C2D12', '#EA580C', '#FFEDD5'], 'Pooja Invitation', 'With Blessings & Prayers', '#FFF7ED'),
      overlayConfig: overlay({
        bannerColor: 'rgba(76, 29, 12, 0.9)',
        nameColor: '#FED7AA'
      })
    },
    {
      id: 'webinar_01',
      name: 'Webinar Invite',
      category: 'corporate',
      subcategory: 'webinar',
      categoryLabel: 'Corporate',
      path: null,
      isPremium: false,
      emoji: 'WB',
      tags: ['webinar', 'online event', 'corporate', 'training', 'invite'],
      canvasGen: generatedBackground('webinar', ['#020617', '#1D4ED8', '#7DD3FC'], 'Webinar', 'Learn, Connect, Grow', '#E0F2FE'),
      overlayConfig: overlay({
        bannerColor: 'rgba(2, 6, 23, 0.92)',
        nameColor: '#BAE6FD'
      })
    },
    {
      id: 'awards_01',
      name: 'Awards Night',
      category: 'corporate',
      subcategory: 'awards',
      categoryLabel: 'Corporate',
      path: null,
      isPremium: true,
      emoji: 'AW',
      tags: ['awards', 'corporate', 'recognition', 'event', 'premium'],
      canvasGen: generatedBackground('awards', ['#18181B', '#A16207', '#FACC15'], 'Awards Night', 'Celebrating Excellence', '#FEF9C3'),
      overlayConfig: overlay({
        bannerColor: 'rgba(24, 24, 27, 0.92)',
        nameColor: '#FACC15'
      })
    },
    {
      id: 'video_wedding_01',
      name: 'Wedding Video Invite',
      category: 'video',
      subcategory: 'wedding_video',
      categoryLabel: 'Video Invite',
      path: null,
      isPremium: true,
      isVideoInvite: true,
      emoji: 'VW',
      tags: ['video', 'whatsapp video', 'wedding', 'invitation', 'animated'],
      canvasGen: generatedBackground('video_wedding', ['#3B0A2A', '#BE185D', '#FCD34D'], 'Wedding Invite', 'Animated WhatsApp Video', '#FFF7ED'),
      overlayConfig: overlay({
        bannerColor: 'rgba(49, 7, 36, 0.92)',
        nameColor: '#FDE68A'
      })
    },
    {
      id: 'video_birthday_01',
      name: 'Birthday Video Invite',
      category: 'video',
      subcategory: 'birthday_video',
      categoryLabel: 'Video Invite',
      path: null,
      isPremium: false,
      isVideoInvite: true,
      emoji: 'VB',
      tags: ['video', 'whatsapp video', 'birthday', 'party', 'animated'],
      canvasGen: generatedBackground('video_birthday', ['#1E3A8A', '#7C3AED', '#FDE047'], 'Birthday Invite', 'Animated WhatsApp Video', '#FFFFFF'),
      overlayConfig: overlay({
        bannerColor: 'rgba(30, 41, 100, 0.92)',
        nameColor: '#FEF08A'
      })
    },
    {
      id: 'video_corporate_01',
      name: 'Corporate Video Invite',
      category: 'video',
      subcategory: 'corporate_video',
      categoryLabel: 'Video Invite',
      path: null,
      isPremium: true,
      isVideoInvite: true,
      emoji: 'VC',
      tags: ['video', 'whatsapp video', 'corporate', 'event', 'animated'],
      canvasGen: generatedBackground('video_corporate', ['#0F172A', '#0E7490', '#A7F3D0'], 'Event Invite', 'Animated Announcement', '#ECFEFF'),
      overlayConfig: overlay({
        bannerColor: 'rgba(8, 18, 34, 0.92)',
        nameColor: '#A7F3D0'
      })
    },
    {
      id: 'custom_blank_01',
      name: 'Custom Blank Card',
      category: 'custom',
      subcategory: 'blank',
      categoryLabel: 'Custom',
      path: null,
      isPremium: false,
      emoji: 'CU',
      tags: ['custom', 'blank', 'create', 'ai ready', 'card builder'],
      canvasGen: generatedBackground('custom_blank', ['#111827', '#334155', '#0F766E'], '', '', '#F8FAFC'),
      overlayConfig: overlay({
        bannerY: 0.74,
        bannerHeight: 0.26,
        bannerColor: 'rgba(8, 13, 22, 0.88)',
        nameColor: '#FFFFFF',
        phoneColor: '#D1FAE5'
      }),
      isCustomStarter: true
    }
  ];

  templates.unshift(
    ...createRealPhotoTemplates(),
    ...createCinematicPremiumTemplates(),
    ...createStateArtTemplates(),
    ...createSignatureImageTemplates(),
    ...createWowPremiumPosterTemplates(),
    ...createPremiumIndianPackTemplates(),
    ...createPremiumArtworkTemplates(),
    ...createFestivalArtworkTemplates(),
    ...createProductionTemplates(),
    ...createRegionalWeddingTemplates(),
    ...createFestivalTemplatePacks(),
    ...createMotionShowcaseTemplates()
  );

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function hasGalleryArtwork(template) {
    return Boolean(template?.path || template?.isPhotoTemplate);
  }

  function galleryTemplates() {
    return templates.filter(hasGalleryArtwork);
  }

  function getAll() {
    return galleryTemplates();
  }

  function getByCategory(category) {
    const source = galleryTemplates();
    if (category === 'all') return source;
    if (category === 'premium_themes') {
      return source
        .filter(t => t.themePack === 'cinematic_premium_v1')
        .sort((a, b) => (a.themeRank || 999) - (b.themeRank || 999));
    }
    if (category === 'photo') return source.filter(t => t.isPhotoTemplate || t.subcategory === 'photo');
    if (category === 'video') return source.filter(t => t.isVideoInvite || t.category === 'video' || t.subcategory === 'video');
    return source.filter(t => t.category === category || t.subcategory === category);
  }

  function search({ category = 'all', query = '' } = {}) {
    const text = normalize(query);
    const categoryFiltered = getByCategory(category);
    if (!text) return categoryFiltered;

    return categoryFiltered.filter((template) => {
      const haystack = [
        template.name,
        template.category,
        template.subcategory,
        template.categoryLabel,
        template.animationPreset,
        ...(template.tags || [])
      ].map(normalize).join(' ');

      return haystack.includes(text);
    });
  }

  function getById(id) {
    return templates.find(t => t.id === id) || null;
  }

  function getCategoryOptions() {
    return categoryOptions;
  }

  function getCategories() {
    return categoryOptions.map(category => category.id);
  }

  return {
    getAll,
    getByCategory,
    getById,
    getCategories,
    getCategoryOptions,
    search
  };
})();
