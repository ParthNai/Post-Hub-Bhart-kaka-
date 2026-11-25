/* ============================================
   PosterBanao — Profile Manager
   Handles business profile CRUD with localStorage
   ============================================ */

const ProfileManager = (() => {
  const STORAGE_KEY = 'posterbanao_profile';
  const BRAND_FIELD_IDS = ['logo', 'business_name', 'phone', 'tagline', 'address'];
  const BRAND_PRESET_IDS = ['bottom_bar', 'top_bar', 'left_stack', 'right_stack', 'corner_logo', 'clean'];
  const BRAND_LOGO_SHAPES = ['circle', 'rounded', 'rect'];
  const DEFAULT_BRAND_DEFAULTS = {
    show: {
      logo: true,
      business_name: true,
      phone: true,
      tagline: true,
      address: true
    },
    presetId: 'bottom_bar',
    textColor: '#FFFFFF',
    logoShape: 'circle'
  };

  function compactSpaces(value) {
    return (value || '').toString().replace(/\s+/g, ' ').trim();
  }

  function smartTitleCase(value) {
    const text = compactSpaces(value);
    if (!text) return '';

    const hasLower = /[a-z]/.test(text);
    const hasUpper = /[A-Z]/.test(text);
    if (hasLower && hasUpper) return text;

    const keepUpper = new Set(['LLP', 'PVT', 'LTD', 'LLC', 'INC', 'CO', 'AI', 'IT']);
    const smallWords = new Set(['and', 'or', 'of', 'the', 'for', 'in', 'at']);

    return text.split(' ').map((word, index) => {
      const clean = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
      if (keepUpper.has(clean)) return clean;
      const lower = word.toLowerCase();
      if (index > 0 && smallWords.has(lower)) return lower;
      return lower.replace(/(^|[-'.&])([a-z])/g, (match, prefix, char) => `${prefix}${char.toUpperCase()}`);
    }).join(' ');
  }

  function normalizeBusinessName(value) {
    return smartTitleCase(value).replace(/^[\s.,-]+|[\s.,-]+$/g, '');
  }

  function normalizeDisplayName(value, fallback = '') {
    const name = normalizeBusinessName(value || fallback);
    return name.length > 36 ? name.substring(0, 36).trim() : name;
  }

  function groupLocalNumber(digits) {
    if (digits.length === 10) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    if (digits.length === 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  }

  function normalizePhone(value) {
    const raw = compactSpaces(value);
    if (!raw) {
      return {
        raw: '',
        digits: '',
        countryCode: '',
        formatted: ''
      };
    }

    let cleaned = raw.replace(/[^\d+]/g, '');
    if (cleaned.indexOf('+') > 0) cleaned = cleaned.replace(/\+/g, '');
    if ((cleaned.match(/\+/g) || []).length > 1) cleaned = `+${cleaned.replace(/\+/g, '')}`;

    let digits = cleaned.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);

    if (digits.length === 10) {
      return {
        raw,
        digits,
        countryCode: '+91',
        formatted: `+91 ${groupLocalNumber(digits)}`
      };
    }

    if (digits.length === 12 && digits.startsWith('91')) {
      const local = digits.slice(2);
      return {
        raw,
        digits: local,
        countryCode: '+91',
        formatted: `+91 ${groupLocalNumber(local)}`
      };
    }

    const separatedInternational = raw.match(/^\s*\+(\d{1,4})[\s-]+(.+)$/);
    if (separatedInternational) {
      const local = separatedInternational[2].replace(/\D/g, '');
      return {
        raw,
        digits: local,
        countryCode: `+${separatedInternational[1]}`,
        formatted: `+${separatedInternational[1]} ${groupLocalNumber(local)}`
      };
    }

    if (cleaned.startsWith('+') && digits.length > 10) {
      const countryLength = Math.min(4, digits.length - 10);
      const countryCode = `+${digits.slice(0, countryLength)}`;
      const local = digits.slice(countryLength);
      return {
        raw,
        digits: local,
        countryCode,
        formatted: `${countryCode} ${groupLocalNumber(local)}`
      };
    }

    return {
      raw,
      digits,
      countryCode: '',
      formatted: groupLocalNumber(digits) || raw
    };
  }

  function normalizeHexColor(value, fallback = DEFAULT_BRAND_DEFAULTS.textColor) {
    const color = compactSpaces(value);
    if (/^#[0-9a-f]{6}$/i.test(color)) return color.toUpperCase();
    if (/^#[0-9a-f]{3}$/i.test(color)) {
      return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toUpperCase();
    }
    return fallback;
  }

  function normalizeBrandDefaults(defaults = {}) {
    const source = defaults || {};
    const showSource = source.show || {};
    const show = {};

    BRAND_FIELD_IDS.forEach((id) => {
      show[id] = typeof showSource[id] === 'boolean'
        ? showSource[id]
        : DEFAULT_BRAND_DEFAULTS.show[id];
    });

    return {
      show,
      presetId: BRAND_PRESET_IDS.includes(source.presetId) ? source.presetId : DEFAULT_BRAND_DEFAULTS.presetId,
      textColor: normalizeHexColor(source.textColor, DEFAULT_BRAND_DEFAULTS.textColor),
      logoShape: BRAND_LOGO_SHAPES.includes(source.logoShape) ? source.logoShape : DEFAULT_BRAND_DEFAULTS.logoShape
    };
  }

  function getDefaultBrandDefaults() {
    return normalizeBrandDefaults(DEFAULT_BRAND_DEFAULTS);
  }

  function normalizeProfile(profile = {}) {
    const businessName = normalizeBusinessName(profile.businessName || profile.shopName || '');
    const displayName = normalizeDisplayName(profile.displayName || profile.shopName, businessName);
    const phoneInfo = normalizePhone(profile.phone || profile.phoneRaw || '');

    const normalized = {
      businessName,
      displayName,
      shopName: displayName || businessName,
      phone: phoneInfo.formatted,
      phoneRaw: phoneInfo.raw,
      phoneDigits: phoneInfo.digits,
      countryCode: phoneInfo.countryCode,
      businessType: compactSpaces(profile.businessType),
      address: compactSpaces(profile.address),
      tagline: compactSpaces(profile.tagline),
      logoDataURL: profile.logoDataURL || null,
      createdAt: profile.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    normalized.brandDefaults = normalizeBrandDefaults(profile.brandDefaults);
    return normalized;
  }

  function getDisplayName(profile = null) {
    const data = profile || getProfile();
    return data?.displayName || data?.shopName || data?.businessName || '';
  }

  function getInitials(value) {
    const source = compactSpaces(value || getDisplayName());
    const parts = source.match(/[a-zA-Z0-9]+/g) || [];
    if (!parts.length) return 'PB';
    return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  /**
   * Get the saved business profile from localStorage
   * @returns {Object|null} The profile object or null
   */
  function getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data);
      const businessName = normalizeBusinessName(parsed.businessName || parsed.shopName || '');
      const displayName = normalizeDisplayName(parsed.displayName || parsed.shopName, businessName);
      const phoneInfo = normalizePhone(parsed.phone || parsed.phoneRaw || '');
      const hydrated = {
        ...parsed,
        displayName,
        businessName,
        shopName: displayName || businessName,
        phone: phoneInfo.formatted || parsed.phone || '',
        phoneRaw: parsed.phoneRaw || phoneInfo.raw,
        phoneDigits: parsed.phoneDigits || phoneInfo.digits,
        countryCode: parsed.countryCode || phoneInfo.countryCode
      };
      hydrated.brandDefaults = normalizeBrandDefaults(parsed.brandDefaults);
      return hydrated;
    } catch (e) {
      console.error('Error reading profile:', e);
      return null;
    }
  }

  /**
   * Save a business profile to localStorage
   * @param {Object} profile - The profile data
   * @returns {boolean} Success status
   */
  function saveProfile(profile) {
    try {
      const data = normalizeProfile(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving profile:', e);
      return false;
    }
  }

  /**
   * Check if a profile exists
   * @returns {boolean}
   */
  function hasProfile() {
    const profile = getProfile();
    return profile !== null && getDisplayName(profile);
  }

  /**
   * Delete the saved profile
   */
  function deleteProfile() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Validate profile data
   * @param {Object} data - Form data to validate
   * @returns {Object} { isValid, errors }
   */
  function validate(data) {
    const errors = {};
    const businessName = normalizeBusinessName(data.businessName || data.shopName);
    const displayName = normalizeDisplayName(data.displayName, businessName);
    const phoneInfo = normalizePhone(data.phone);

    if (!businessName || businessName.length < 2) {
      errors.shopName = 'Please enter your business name (min 2 characters)';
    }

    if (displayName && displayName.length < 2) {
      errors.displayName = 'Display name is too short';
    }

    if (phoneInfo.raw && (!phoneInfo.digits || phoneInfo.digits.length < 7 || phoneInfo.digits.length > 15)) {
      errors.phone = 'Please enter a valid phone number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Read a file as Data URL (for logo upload)
   * @param {File} file - The file to read
   * @returns {Promise<string>} Base64 data URL
   */
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        reject(new Error('Invalid file type. Please use PNG, JPG, or WebP.'));
        return;
      }

      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error('File too large. Maximum size is 2MB.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  return {
    getProfile,
    saveProfile,
    hasProfile,
    deleteProfile,
    validate,
    normalizeBusinessName,
    normalizeDisplayName,
    normalizePhone,
    normalizeProfile,
    normalizeBrandDefaults,
    getDefaultBrandDefaults,
    getDisplayName,
    getInitials,
    readFileAsDataURL
  };
})();
