/* ============================================
   PosterBanao - Local AI Text Suggestions
   Contextual copy generation for poster text layers
   ============================================ */

const AIText = (() => {
  const CATEGORY_COPY = {
    festival: [
      { label: 'Greeting', text: 'Warm Wishes From {brand}' },
      { label: 'Blessing', text: 'May This Festival Bring Joy' },
      { label: 'Family', text: 'Celebrate With Light And Love' },
      { label: 'Business', text: '{brand} Wishes You Happiness' },
      { label: 'Short', text: 'Festive Greetings' },
      { label: 'Elegant', text: 'A Season Of Peace And Prosperity' }
    ],
    wedding: [
      { label: 'Invite', text: 'Together With Families' },
      { label: 'Headline', text: 'Join Our Wedding Celebration' },
      { label: 'Classic', text: 'Wedding Invitation' },
      { label: 'Date', text: 'Save The Date' },
      { label: 'Blessing', text: 'Blessings For A Beautiful Beginning' },
      { label: 'Detail', text: 'Dinner, Music And Memories' }
    ],
    birthday: [
      { label: 'Headline', text: 'Birthday Celebration' },
      { label: 'Warm', text: 'Make A Wish' },
      { label: 'Invite', text: 'Celebrate With Us' },
      { label: 'Kids', text: 'Cake, Smiles And Memories' },
      { label: 'Milestone', text: 'A Special Year Begins' },
      { label: 'Detail', text: 'Cake Cutting | Dinner | Fun' }
    ],
    business: [
      { label: 'Offer', text: 'Fresh Deals This Week' },
      { label: 'Visit', text: 'Visit {brand} Today' },
      { label: 'Launch', text: 'New Arrivals Are Here' },
      { label: 'Urgency', text: 'Limited Period Offer' },
      { label: 'Booking', text: 'Book Your Appointment' },
      { label: 'Trust', text: 'Quality Service, Fair Prices' }
    ],
    corporate: [
      { label: 'Invite', text: 'You Are Invited' },
      { label: 'Event', text: 'Leadership Meet' },
      { label: 'Growth', text: 'New Ideas, Better Growth' },
      { label: 'Action', text: 'Register Today' },
      { label: 'Formal', text: 'Professional Event Invitation' },
      { label: 'Detail', text: 'Date | Time | Venue' }
    ],
    party: [
      { label: 'Invite', text: 'Join The Celebration' },
      { label: 'Warm', text: 'Food, Music And Memories' },
      { label: 'Family', text: 'Blessings And Togetherness' },
      { label: 'Detail', text: 'Pooja | Lunch | Address' },
      { label: 'Casual', text: 'Good People, Good Moments' },
      { label: 'Welcome', text: 'Your Presence Matters' }
    ],
    daily: [
      { label: 'Morning', text: 'Good Morning From {brand}' },
      { label: 'Warm', text: 'Have A Beautiful Day' },
      { label: 'Simple', text: 'Start Fresh Today' },
      { label: 'Positive', text: 'Wishing You Peace And Progress' },
      { label: 'Brand', text: '{brand} Wishes You Well' },
      { label: 'Short', text: 'Daily Greetings' }
    ],
    video: [
      { label: 'Invite', text: 'Animated Invitation' },
      { label: 'Share', text: 'Made For WhatsApp Sharing' },
      { label: 'Event', text: 'A Celebration In Motion' },
      { label: 'Warm', text: 'Watch, Share And Celebrate' },
      { label: 'Detail', text: 'Date | Time | Venue' },
      { label: 'Brand', text: 'Greetings From {brand}' }
    ],
    custom: [
      { label: 'Headline', text: 'Your Message Here' },
      { label: 'Brand', text: 'Created By {brand}' },
      { label: 'Invite', text: 'You Are Invited' },
      { label: 'Offer', text: 'Special Announcement' },
      { label: 'Detail', text: 'Date | Time | Venue' },
      { label: 'Short', text: 'Make It Memorable' }
    ]
  };

  const SUBCATEGORY_COPY = {
    diwali: [
      { label: 'Diwali', text: 'Happy Diwali From {brand}' },
      { label: 'Light', text: 'May Every Home Glow With Joy' }
    ],
    eid: [
      { label: 'Eid', text: 'Eid Mubarak From {brand}' },
      { label: 'Blessing', text: 'May Peace And Blessings Fill Your Home' }
    ],
    holi: [
      { label: 'Holi', text: 'Happy Holi From {brand}' },
      { label: 'Color', text: 'Celebrate Colors, Smiles And Togetherness' }
    ],
    navratri: [
      { label: 'Navratri', text: 'Happy Navratri From {brand}' },
      { label: 'Garba', text: 'Nine Nights Of Devotion And Dance' }
    ],
    raksha_bandhan: [
      { label: 'Rakhi', text: 'Happy Raksha Bandhan' },
      { label: 'Bond', text: 'Celebrating The Bond Of Love' }
    ],
    national: [
      { label: 'India', text: 'Proud To Celebrate India' },
      { label: 'Patriotic', text: 'Unity, Courage And Progress' }
    ],
    offer: [
      { label: 'Sale', text: 'Big Savings Start Today' },
      { label: 'Retail', text: 'Limited Stock, Better Prices' }
    ],
    opening: [
      { label: 'Opening', text: 'Grand Opening Invitation' },
      { label: 'Visit', text: 'Visit {brand} This Week' }
    ],
    haldi: [
      { label: 'Haldi', text: 'Haldi Ceremony' },
      { label: 'Warm', text: 'A Day Of Haldi, Laughter And Blessings' }
    ],
    mehndi: [
      { label: 'Mehndi', text: 'Mehndi Night' },
      { label: 'Music', text: 'Music, Mehndi And Memories' }
    ],
    sangeet: [
      { label: 'Sangeet', text: 'Sangeet Celebration' },
      { label: 'Dance', text: 'An Evening Of Music And Dance' }
    ],
    engagement: [
      { label: 'Engagement', text: 'Engagement Ceremony' },
      { label: 'Promise', text: 'Two Hearts, One Promise' }
    ],
    webinar: [
      { label: 'Webinar', text: 'Live Webinar Invitation' },
      { label: 'Action', text: 'Reserve Your Seat Today' }
    ]
  };

  const LAYER_HINTS = {
    title: [
      { label: 'Title', text: '{template}' },
      { label: 'Headline', text: '{categoryHeadline}' }
    ],
    subtitle: [
      { label: 'Subtitle', text: '{categorySubline}' },
      { label: 'Warm', text: 'With Warm Regards From {brand}' }
    ],
    detail: [
      { label: 'Details', text: 'Date | Time | Venue' },
      { label: 'Action', text: 'Call Now To Know More' }
    ]
  };

  function clean(value) {
    return (value || '').toString().replace(/\s+/g, ' ').trim();
  }

  function compact(text, max = 76) {
    const normalized = clean(text);
    if (normalized.length <= max) return normalized;
    const trimmed = normalized.slice(0, max + 1);
    const atSpace = trimmed.lastIndexOf(' ');
    return (atSpace > 28 ? trimmed.slice(0, atSpace) : trimmed.slice(0, max)).trim();
  }

  function safeBrand(profile = {}) {
    return clean(profile.displayName || profile.shopName || profile.businessName) || 'Your Business';
  }

  function detectCategory(template = {}) {
    const haystack = [
      template.category,
      template.subcategory,
      template.categoryLabel,
      template.name,
      ...(template.tags || [])
    ].map(clean).join(' ').toLowerCase();

    if (template.isVideoInvite || /\b(video|animated|motion)\b/.test(haystack)) return 'video';
    if (/\b(wedding|haldi|mehndi|sangeet|engagement|reception|nikah|marriage)\b/.test(haystack)) return 'wedding';
    if (/\b(birthday|cake|kids birthday)\b/.test(haystack)) return 'birthday';
    if (/\b(sale|offer|shop|retail|restaurant|salon|clinic|coaching|real estate|opening|business|appointment|collection)\b/.test(haystack)) return 'business';
    if (/\b(corporate|webinar|seminar|meeting|awards|professional)\b/.test(haystack)) return 'corporate';
    if (/\b(party|housewarming|pooja|baby shower|anniversary|event)\b/.test(haystack)) return 'party';
    if (/\b(good morning|daily|sunrise)\b/.test(haystack)) return 'daily';
    if (/\b(diwali|eid|holi|navratri|raksha|festival|republic|independence|ganesh|durga|onam|pongal)\b/.test(haystack)) return 'festival';
    return CATEGORY_COPY[template.category] ? template.category : 'custom';
  }

  function layerIntent(layer = {}) {
    const haystack = [layer.id, layer.label, layer.text].map(clean).join(' ').toLowerCase();
    if (/\b(detail|venue|date|time|address|rsvp|phone)\b/.test(haystack)) return 'detail';
    if (/\b(subtitle|subline|note|kicker)\b/.test(haystack)) return 'subtitle';
    if (/\b(title|headline|caption)\b/.test(haystack)) return 'title';
    return null;
  }

  function categoryHeadline(category) {
    const map = {
      festival: 'Festive Greetings',
      wedding: 'Wedding Invitation',
      birthday: 'Birthday Celebration',
      business: 'Special Offer',
      corporate: 'Professional Event',
      party: 'Join The Celebration',
      daily: 'Good Morning',
      video: 'Animated Invitation',
      custom: 'Special Announcement'
    };
    return map[category] || map.custom;
  }

  function categorySubline(category) {
    const map = {
      festival: 'Warm Wishes For You And Your Family',
      wedding: 'Join Us For A Beautiful Celebration',
      birthday: 'Cake, Smiles And Happy Moments',
      business: 'Fresh Updates From Your Trusted Store',
      corporate: 'Connect, Learn And Grow Together',
      party: 'Food, Blessings And Memories',
      daily: 'Wishing You A Peaceful Day',
      video: 'A Share Ready Invite For Your Guests',
      custom: 'Designed With Care'
    };
    return map[category] || map.custom;
  }

  function fillTemplate(text, context) {
    return compact(clean(text)
      .replace(/\{brand\}/g, context.brand)
      .replace(/\{template\}/g, context.templateName)
      .replace(/\{categoryHeadline\}/g, categoryHeadline(context.category))
      .replace(/\{categorySubline\}/g, categorySubline(context.category)));
  }

  function unique(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = clean(item.text).toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function generateSuggestions({ template = {}, profile = {}, selectedLayer = null } = {}) {
    const category = detectCategory(template);
    const context = {
      category,
      brand: safeBrand(profile),
      templateName: clean(template.name || template.categoryLabel || 'Poster')
    };

    const subcategory = clean(template.subcategory).toLowerCase();
    const intent = layerIntent(selectedLayer);
    const source = [
      ...(intent ? LAYER_HINTS[intent] || [] : []),
      ...(SUBCATEGORY_COPY[subcategory] || []),
      ...(template.isPhotoTemplate ? [{ label: 'Photo', text: categorySubline(category) }] : []),
      ...(CATEGORY_COPY[category] || CATEGORY_COPY.custom)
    ];

    return unique(source.map((item) => ({
      label: item.label,
      text: fillTemplate(item.text, context)
    }))).slice(0, 8);
  }

  return {
    generateSuggestions
  };
})();
