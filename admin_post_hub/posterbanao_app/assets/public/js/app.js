/* ============================================
   PosterBanao — Main App Controller
   Screen routing, event handling, and orchestration
   ============================================ */

const App = (() => {
  // State
  let currentScreen = 'welcome';
  let routeStack = [];
  let currentTemplateId = null;
  let currentDesign = null;
  let selectedLayerId = null;
  let currentCategory = 'all';
  let currentMediaType = 'all';
  let searchQuery = '';
  let currentSavedDesignId = null;
  let currentEditorTab = 'layers';
  let galleryLoadId = 0;
  let editorRenderId = 0;
  let editorRenderFrameId = null;
  let videoPreviewFrameId = null;
  let videoPreviewToken = 0;
  let canvasDragState = null;
  let editorSheetState = 'collapsed';
  let editorSheetDragState = null;
  let editorUndoStack = [];
  let editorRedoStack = [];
  let dragDeleteActive = false;
  let lastWheelHapticAt = 0;
  let lastWheelHapticValue = null;
  let isEditing = false; // editing existing profile vs new setup
  let displayNameTouched = false;
  let backNavigationBound = false;
  let hasUnsavedChanges = false;
  let previewingTemplateId = null;
  let previewingSavedId = null;
  let lastCanvasTapAt = 0;
  let canvasZoom = 1;
  let pendingCustomAspectRatio = null;
  let currentStickerCategory = 'featured';
  let stickerSearchQuery = '';
  let aiTextSuggestions = [];
  let exportOptions = {
    format: 'png',
    quality: 0.92,
    sizePreset: 'original'
  };
  const SAVED_DESIGNS_KEY = 'posterbanao_saved_designs';
  const EDITOR_SHEET_STATES = ['collapsed', 'half', 'expanded'];
  const CORE_LAYER_IDS = new Set(['business_banner', 'logo', 'business_name', 'phone', 'tagline', 'address']);
  const BRAND_LAYER_IDS = ['logo', 'business_name', 'phone', 'tagline', 'address'];
  const BRAND_FIELD_META = {
    logo: { label: 'Logo', role: 'logoDataURL' },
    business_name: { label: 'Name', role: 'shopName' },
    phone: { label: 'Phone', role: 'phone', prefix: 'Phone: ' },
    tagline: { label: 'Tagline', role: 'tagline' },
    address: { label: 'Address', role: 'address', prefix: 'Address: ' }
  };
  const BRAND_PRESET_IDS = ['bottom_bar', 'top_bar', 'left_stack', 'right_stack', 'corner_logo', 'clean'];
  const QUICK_TEXT_COLORS = [
    { label: 'White', value: '#FFFFFF' },
    { label: 'Dark', value: '#111827' },
    { label: 'Gold', value: '#F7C948' },
    { label: 'Saffron', value: '#FF6B2C' },
    { label: 'Teal', value: '#00BFA6' }
  ];
  const PHOTO_FILTERS = [
    { label: 'Original', value: 'original' },
    { label: 'Vivid', value: 'vivid' },
    { label: 'Warm', value: 'warm' },
    { label: 'Cool', value: 'cool' },
    { label: 'Matte', value: 'matte' },
    { label: 'Film', value: 'film' },
    { label: 'Festive', value: 'festive' },
    { label: 'Glow', value: 'glow' },
    { label: 'Mono', value: 'mono' },
    { label: 'Food', value: 'food' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Real Estate', value: 'real_estate' },
    { label: 'Fitness', value: 'fitness' }
  ];
  const ADJUSTMENT_CONTROLS = [
    { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
    { key: 'warmth', label: 'Warmth', min: -100, max: 100 },
    { key: 'highlights', label: 'Highlights', min: -100, max: 100 },
    { key: 'shadows', label: 'Shadows', min: -100, max: 100 },
    { key: 'vignette', label: 'Vignette', min: 0, max: 100 },
    { key: 'sharpen', label: 'Clarity', min: 0, max: 100 }
  ];
  const TEXT_FONT_PRESETS = [
    { label: 'Clean', family: '"Outfit", "Arial", sans-serif', weight: '700' },
    { label: 'Classic', family: 'Georgia, "Times New Roman", serif', weight: '700' },
    { label: 'Modern', family: '"Poppins", "Arial", sans-serif', weight: '600' },
    { label: 'Bold', family: '"Arial Black", "Outfit", sans-serif', weight: '900' }
  ];
  const TEXT_STYLE_ACTIONS = [
    { label: 'Pill', action: 'background' },
    { label: 'Shadow', action: 'shadow' },
    { label: 'Outline', action: 'outline' },
    { label: 'Left', action: 'align', value: 'left' },
    { label: 'Center', action: 'align', value: 'center' },
    { label: 'Right', action: 'align', value: 'right' }
  ];
  const CROP_FITS = [
    { label: 'Fill', value: 'cover' },
    { label: 'Fit', value: 'contain' }
  ];
  const CROP_MASKS = [
    { label: 'Square', value: 'rect' },
    { label: 'Rounded', value: 'rounded' },
    { label: 'Circle', value: 'circle' },
    { label: 'Oval', value: 'oval' },
    { label: 'Arch', value: 'arch' },
    { label: 'Heart', value: 'heart' }
  ];
  const ROTATION_WHEEL = {
    min: -45,
    max: 45,
    step: 1,
    majorEvery: 5
  };
  const QUICK_STICKER_IDS = [
    'badge_whatsapp_order',
    'badge_limited_offer',
    'shape_gold_seal',
    'decor_rangoli_round',
    'arrow_curved_right',
    'social_location'
  ];
  const EXPORT_FORMAT_LABELS = {
    png: 'PNG',
    jpeg: 'JPEG',
    webp: 'WebP'
  };
  const EXPORT_SIZE_LABELS = {
    original: 'Original HD',
    whatsapp: 'WhatsApp optimized',
    instagram: 'Instagram ready'
  };

  // Onboarding steps
  const onboardingSteps = [
    {
      emoji: '1',
      title: 'Add Your Business',
      desc: 'Save your poster display name, phone, type, address and logo once.'
    },
    {
      emoji: '2',
      title: 'Pick a Template',
      desc: 'Choose festival, event, business, video or real-photo designs.'
    },
    {
      emoji: '3',
      title: 'Download & Share',
      desc: 'Export a branded HD poster or share it directly to WhatsApp.'
    }
  ];
  let onboardingStep = 0;

  /**
   * Initialize the app
   */
  function init() {
    try {
      renderCategoryPills();
      renderMediaTypePills();

      // Show preloader splash unconditionally on every app startup/refresh
      const preloaderScreen = document.getElementById('screenPreloader');
      const proceedToDestination = () => {
        if (ProfileManager.hasProfile()) {
          navigateTo('gallery', { replace: true });
        } else {
          navigateTo('welcome', { replace: true });
        }
      };

      if (preloaderScreen) {
        preloaderScreen.classList.add('active');
        preloaderScreen.style.display = 'flex';
        preloaderScreen.style.opacity = '1';

        // Wait for preloader animation to complete before navigating
        let preloaderDuration = 2200;
        fetch('/api/appcontrol')
          .then(r => r.json())
          .then(data => {
            const cfg = data && (data.data || data.config || data);
            if (cfg && cfg.preloaderScreen) {
              if (cfg.preloaderScreen.durationSeconds) {
                preloaderDuration = Math.max(1000, cfg.preloaderScreen.durationSeconds * 1000);
              }
            }
          })
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              preloaderScreen.style.transition = 'opacity 0.35s ease';
              preloaderScreen.style.opacity = '0';
              setTimeout(() => {
                preloaderScreen.style.display = 'none';
                preloaderScreen.classList.remove('active');
                proceedToDestination();
              }, 350);
            }, preloaderDuration);
          });
      } else {
        proceedToDestination();
      }

      bindEvents();
    } catch (error) {
      console.error('Fatal initialization error in PosterBanao App:', error);
      const container = document.getElementById('appContainer');
      if (container) {
        container.innerHTML = `
          <div class="empty-state" style="padding: 2rem; text-align: center;">
            <div class="empty-state-icon" style="color: var(--saffron); font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <h2 class="heading-2">Something went wrong</h2>
            <p class="text-secondary" style="margin-top: 1rem;">We had trouble loading the app. Please reload or clear your storage.</p>
            <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: 1.5rem; display: inline-block;">Reload App</button>
          </div>
        `;
      }
    }
  }

  /**
   * Navigate to a screen
   * @param {string} screen - Screen name: welcome, profile, gallery, editor
   */
  function updateRouteStack(screen, options = {}) {
    if (options.fromHistory) {
      const existingIndex = routeStack.lastIndexOf(screen);
      routeStack = existingIndex >= 0 ? routeStack.slice(0, existingIndex + 1) : [screen];
      return;
    }

    if (options.replace) {
      routeStack = [screen];
      return;
    }

    if (options.replaceCurrent) {
      if (routeStack.length) {
        routeStack[routeStack.length - 1] = screen;
      } else {
        routeStack = [screen];
      }

      while (routeStack.length > 1 && routeStack[routeStack.length - 2] === screen) {
        routeStack.splice(routeStack.length - 1, 1);
      }
      return;
    }

    if (routeStack[routeStack.length - 1] !== screen) {
      routeStack.push(screen);
    }
  }

  function syncBrowserRoute(screen, options = {}) {
    if (!window.history?.replaceState) return;

    const state = { posterbanaoRoute: true, screen };
    const hash = `#${screen}`;
    const currentState = window.history.state;

    if (options.fromHistory) return;

    if (options.replace || options.replaceCurrent || !currentState?.posterbanaoRoute) {
      window.history.replaceState(state, '', hash);
      return;
    }

    if (currentState.screen !== screen && window.history.pushState) {
      window.history.pushState(state, '', hash);
    }
  }

  function navigateTo(screen, options = {}) {
    if (screen !== 'editor') stopVideoPreview();

    updateRouteStack(screen, options);
    syncBrowserRoute(screen, options);

    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Show target screen
    const target = document.getElementById(`screen${capitalize(screen)}`);
    if (target) {
      target.classList.add('active');
      // Re-trigger animation
      target.style.animation = 'none';
      target.offsetHeight; // trigger reflow
      target.style.animation = '';
    }

    const appContainer = document.getElementById('appContainer');
    appContainer?.classList.toggle('is-editor-mode', screen === 'editor');

    // Show/hide header
    const header = document.getElementById('appHeader');
    if (header) header.style.display = screen === 'gallery' ? 'flex' : 'none';

    // Show/hide bottom navigation
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
      const showNav = screen === 'gallery' || screen === 'profile';
      bottomNav.style.display = showNav ? 'flex' : 'none';
      if (showNav) {
        bottomNav.querySelectorAll('.bottom-nav-item').forEach(item => {
          item.classList.remove('active');
          if (screen === 'profile') {
            if (item.dataset.nav === 'profile') {
              item.classList.add('active');
            }
          } else if (screen === 'gallery') {
            if (currentCategory === 'saved') {
              if (item.dataset.nav === 'saved') {
                item.classList.add('active');
              }
            } else {
              if (item.dataset.nav === 'gallery') {
                item.classList.add('active');
              }
            }
          }
        });
      }
    }

    currentScreen = screen;

    // Screen-specific setup
    if (screen === 'gallery') {
      loadGallery(currentCategory);
    }

    if (screen === 'profile') {
      if (isEditing) {
        populateProfileForm();
      } else {
        resetProfileForm();
      }
    }
  }

  /**
   * Capitalize first letter
   */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function fallbackBackTarget() {
    if (currentScreen === 'editor') return 'gallery';
    if (currentScreen === 'profile') return ProfileManager.hasProfile() ? 'gallery' : 'welcome';
    return null;
  }

  function consumeTransientBackState() {
    const onboarding = document.getElementById('onboardingOverlay');
    if (onboarding?.classList.contains('active')) {
      if (onboardingStep > 0) {
        onboardingStep -= 1;
        updateOnboardingUI();
      } else {
        onboarding.classList.remove('active');
      }
      return true;
    }

    if (currentScreen === 'editor' && editorSheetState !== 'collapsed') {
      setEditorSheetState('collapsed');
      return true;
    }

    return false;
  }

  function navigateBack() {
    if (consumeTransientBackState()) return true;

    if (routeStack.length > 1 && window.history?.back) {
      window.history.back();
      return true;
    }

    const fallback = fallbackBackTarget();
    if (fallback) {
      navigateTo(fallback, { replaceCurrent: true });
      return true;
    }

    return false;
  }

  function handleBrowserPopState(e) {
    if (currentScreen === 'editor' && hasUnsavedChanges) {
      const dialog = document.getElementById('unsavedDialogOverlay');
      if (dialog) {
        dialog.classList.add('active');
        window.history.pushState({ posterbanaoRoute: true, screen: 'editor' }, '', '#editor');
        return;
      }
    }
    const screen = e.state?.posterbanaoRoute ? e.state.screen : fallbackBackTarget();
    if (!screen || screen === currentScreen) return;
    navigateTo(screen, { fromHistory: true });
  }

  function bindBackNavigation() {
    if (backNavigationBound) return;
    backNavigationBound = true;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.addEventListener('popstate', handleBrowserPopState);

    const nativeApp = window.Capacitor?.Plugins?.App;
    if (nativeApp?.addListener) {
      nativeApp.addListener('backButton', () => {
        if (navigateBack()) return;
        nativeApp.exitApp?.();
      });
    }
  }

  /**
   * Show a toast notification
   * @param {string} message
   * @param {string} type - success, error, info
   * @param {number} duration - ms
   */
  function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');

    const icons = {
      success: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      error: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="12" r="10"/></svg>`,
      info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };

    toast.className = `toast toast-${type}`;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'toast-icon';
    iconSpan.innerHTML = icons[type] || icons.info;

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    const bind = (id, event, handler) => {
      document.getElementById(id)?.addEventListener(event, handler);
    };

    // --- Welcome Screen ---
    document.getElementById('btnGetStarted').addEventListener('click', () => {
      if (!localStorage.getItem('posterbanao_onboarded')) {
        showOnboarding();
      } else {
        navigateTo('profile');
      }
    });

    // --- Onboarding ---
    document.getElementById('btnOnboardingNext').addEventListener('click', nextOnboardingStep);

    // --- Profile Form ---
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);

    // Logo upload
    document.getElementById('inputLogo').addEventListener('change', handleLogoUpload);
    bindProfileFieldEnhancements();

    // --- Gallery ---
    document.getElementById('categoryPills').addEventListener('click', handleCategoryFilter);
    document.getElementById('mediaTypePills').addEventListener('click', handleMediaTypeFilter);
    document.getElementById('templateGrid').addEventListener('click', (e) => {
      const card = e.target.closest('.template-card');
      if (!card) return;
      const templateId = card.dataset.templateId;
      if (templateId) showTemplatePreview(templateId, card.dataset.savedId || null);
    });

    document.getElementById('recentDesignsCarousel').addEventListener('click', (e) => {
      const card = e.target.closest('.recent-card');
      if (!card) return;
      const templateId = card.dataset.templateId;
      if (templateId) showTemplatePreview(templateId, card.dataset.savedId || null);
    });
    document.getElementById('templateGrid').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.template-card');
      if (!card) return;
      e.preventDefault();
      const templateId = card.dataset.templateId;
      if (templateId) showTemplatePreview(templateId, card.dataset.savedId || null);
    });
    document.getElementById('inputTemplateSearch').addEventListener('input', handleTemplateSearch);
    document.getElementById('btnCreateCustom').addEventListener('click', showAspectRatioModal);
    document.getElementById('btnCancelAspectSelect').addEventListener('click', hideAspectRatioModal);
    document.querySelectorAll('.aspect-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        createCustomDesign(btn.dataset.aspect);
      });
    });

    // Header edit profile
    document.getElementById('btnEditProfile').addEventListener('click', () => {
      isEditing = true;
      navigateTo('profile');
    });

    // --- Bottom Navigation ---
    document.getElementById('bottomNav').addEventListener('click', (e) => {
      const item = e.target.closest('.bottom-nav-item');
      if (!item) return;
      const navTarget = item.dataset.nav;
      if (navTarget === 'gallery') {
        currentCategory = 'all';
        navigateTo('gallery');
        loadGallery('all');
      } else if (navTarget === 'create') {
        showAspectRatioModal();
      } else if (navTarget === 'saved') {
        currentCategory = 'saved';
        navigateTo('gallery');
        loadGallery('saved');
      } else if (navTarget === 'profile') {
        isEditing = true;
        navigateTo('profile');
      }
    });

    // --- Template Preview Modal ---
    document.getElementById('btnClosePreview').addEventListener('click', hideTemplatePreview);
    document.getElementById('btnUseTemplate').addEventListener('click', () => {
      if (previewingTemplateId) {
        selectTemplate(previewingTemplateId, previewingSavedId);
      }
      hideTemplatePreview();
    });
    document.getElementById('btnToggleFavorite').addEventListener('click', () => {
      if (previewingTemplateId) {
        toggleFavorite(previewingTemplateId);
        // Sync favorite button class state
        const btnToggleFav = document.getElementById('btnToggleFavorite');
        if (btnToggleFav) {
          btnToggleFav.classList.toggle('is-favorite', isFavorite(previewingTemplateId));
        }
      }
    });

    // --- Unsaved Changes Dialog ---
    document.getElementById('btnStayEditing').addEventListener('click', () => {
      const dialog = document.getElementById('unsavedDialogOverlay');
      if (dialog) dialog.classList.remove('active');
    });
    document.getElementById('btnDiscardChanges').addEventListener('click', () => {
      const dialog = document.getElementById('unsavedDialogOverlay');
      if (dialog) dialog.classList.remove('active');
      hasUnsavedChanges = false;
      navigateTo('gallery', { replaceCurrent: true });
    });

    // --- Editor ---
    document.getElementById('btnBackToGallery').addEventListener('click', () => {
      handleBackToGallery();
    });

    document.getElementById('btnDownloadHD').addEventListener('click', handleHDDownload);
    document.getElementById('btnShareWhatsApp').addEventListener('click', handleShareWhatsApp);
    document.getElementById('editorTabbar').addEventListener('click', handleEditorTabClick);
    document.getElementById('editorSheetHandle').addEventListener('pointerdown', handleEditorSheetPointerDown);
    document.getElementById('editorSheetHandle').addEventListener('keydown', handleEditorSheetKeydown);
    bind('brandPresetGrid', 'click', handleBrandPresetClick);
    bind('selectBrandPreset', 'change', handleBrandPresetChange);
    document.getElementById('btnApplyProfileBrand').addEventListener('click', () => {
      pushEditorHistory();
      applyProfileBrandDefaultsToCurrentDesign(true, true);
    });
    bind('btnUndoEdit', 'click', handleUndoEdit);
    bind('btnRedoEdit', 'click', handleRedoEdit);
    document.getElementById('inputBrandColor').addEventListener('input', handleBrandInput);
    document.getElementById('selectBrandLogoShape').addEventListener('change', handleBrandInput);
    document.getElementById('btnResetBrandText').addEventListener('click', handleBrandResetText);
    document.getElementById('btnAddTextLayer').addEventListener('click', handleAddTextLayer);
    bind('btnGenerateTextSuggestions', 'click', handleGenerateTextSuggestions);
    bind('aiTextSuggestions', 'click', handleAITextSuggestionClick);
    document.getElementById('btnAddImageLayer').addEventListener('click', handleAddImageLayer);
    document.getElementById('btnFillSlot').addEventListener('click', handleFillSelectedSlot);
    document.getElementById('btnDeleteLayer').addEventListener('click', handleDeleteLayer);
    document.getElementById('btnDuplicateLayer').addEventListener('click', handleDuplicateLayer);
    document.getElementById('btnMoveLayerUp').addEventListener('click', handleMoveLayerUp);
    document.getElementById('btnMoveLayerDown').addEventListener('click', handleMoveLayerDown);
    document.getElementById('layerPills').addEventListener('click', (e) => {
      const item = e.target.closest('.layer-list-item');
      if (!item) return;
      selectedLayerId = item.dataset.layerId;
      renderLayerPills();
      syncLayerControls();
      syncBrandControls();
      syncPhotoToolControls();
      syncCanvasSelectionOverlay();
    });

    // --- Canvas Viewport Zoom ---
    document.getElementById('btnZoomIn').addEventListener('click', () => updateCanvasZoom(0.25));
    document.getElementById('btnZoomOut').addEventListener('click', () => updateCanvasZoom(-0.25));
    document.getElementById('btnZoomReset').addEventListener('click', resetCanvasZoom);
    document.getElementById('inputLayerText').addEventListener('input', handleLayerInput);
    document.getElementById('inputLayerImage').addEventListener('change', handleLayerImageUpload);
    bind('inputLayerSpace', 'input', handleLayerInput);
    bind('inputLayerCropZoom', 'input', handleLayerInput);
    document.getElementById('inputLayerFontSize').addEventListener('input', handleLayerInput);
    document.querySelectorAll('[data-layer-opacity-input]').forEach((input) => {
      input.addEventListener('input', handleLayerInput);
    });
    document.getElementById('inputLayerColor').addEventListener('input', handleLayerInput);
    bind('textFontRail', 'click', handleTextFontClick);
    bind('textStyleRail', 'click', handleTextStyleClick);
    bind('textColorRail', 'click', handleTextColorClick);
    bind('stickerRail', 'click', handleStickerClick);
    bind('btnOpenStickerPicker', 'click', showStickerPicker);
    bind('btnCloseStickerPicker', 'click', hideStickerPicker);
    bind('stickerCategoryTabs', 'click', handleStickerCategoryClick);
    bind('stickerPickerSearch', 'input', handleStickerPickerSearch);
    bind('stickerGrid', 'click', handleStickerGridClick);
    bind('stickerGrid', 'keydown', handleStickerGridKeydown);
    bind('stickerPickerOverlay', 'click', (e) => {
      if (e.target.id === 'stickerPickerOverlay') hideStickerPicker();
    });
    bind('photoFilterRail', 'click', handlePhotoFilterClick);
    bind('adjustControlStack', 'input', handleAdjustmentInput);
    bind('cropFitRail', 'click', handleCropFitClick);
    bind('cropMaskRail', 'click', handleCropMaskClick);
    bind('btnResetRotation', 'click', handleResetRotation);
    document.getElementById('selectAnimationPreset').addEventListener('change', handleAnimationInput);
    document.getElementById('inputAnimationIntensity').addEventListener('input', handleAnimationInput);
    document.getElementById('inputAnimationSpeed').addEventListener('input', handleAnimationInput);
    bind('selectExportFormat', 'change', handleExportOptionInput);
    bind('inputExportQuality', 'input', handleExportOptionInput);
    bind('selectExportSize', 'change', handleExportOptionInput);
    document.getElementById('btnSaveDesign').addEventListener('click', handleSaveDesign);
    bind('btnBatchExportDesigns', 'click', handleBatchExportDesigns);
    document.getElementById('btnDownloadVideo').addEventListener('click', handleVideoInvite);
    document.getElementById('btnDownloadAnimatedImage').addEventListener('click', handleAnimatedImageInvite);
    document.getElementById('canvasWrapper').addEventListener('pointerdown', handleCanvasPointerDown);
    window.addEventListener('pointermove', handleCanvasPointerMove);
    window.addEventListener('pointerup', handleCanvasPointerUp);
    window.addEventListener('pointercancel', handleCanvasPointerUp);
    window.addEventListener('pointermove', handleEditorSheetPointerMove);
    window.addEventListener('pointerup', handleEditorSheetPointerUp);
    window.addEventListener('pointercancel', handleEditorSheetPointerUp);
    window.addEventListener('resize', syncCanvasSelectionOverlay);
    bindBackNavigation();
    syncAITextControls();
    syncExportControls();

    // Add ripple effect to all buttons
    document.addEventListener('click', addRippleEffect);
  }

  /**
   * Add ripple effect to buttons
   */
  function addRippleEffect(e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // =======================================
  // ONBOARDING
  // =======================================

  function showOnboarding() {
    onboardingStep = 0;
    updateOnboardingUI();
    document.getElementById('onboardingOverlay').classList.add('active');
  }

  function nextOnboardingStep() {
    onboardingStep++;
    if (onboardingStep >= onboardingSteps.length) {
      // Done with onboarding
      document.getElementById('onboardingOverlay').classList.remove('active');
      localStorage.setItem('posterbanao_onboarded', 'true');
      navigateTo('profile');
      return;
    }
    updateOnboardingUI();
  }

  function updateOnboardingUI() {
    const step = onboardingSteps[onboardingStep];
    document.getElementById('onboardingEmoji').textContent = step.emoji;
    document.getElementById('onboardingTitle').textContent = step.title;
    document.getElementById('onboardingDesc').textContent = step.desc;

    // Update dots
    const dots = document.querySelectorAll('#onboardingDots .onboarding-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === onboardingStep);
    });

    // Update button text
    const btn = document.getElementById('btnOnboardingNext');
    btn.textContent = onboardingStep === onboardingSteps.length - 1 ? 'Start Creating' : 'Next';
  }

  // =======================================
  // PROFILE
  // =======================================

  function readProfileBrandDefaults() {
    const fallback = ProfileManager.getDefaultBrandDefaults();
    const show = { ...fallback.show };

    document.querySelectorAll('[data-profile-brand-show]').forEach((input) => {
      show[input.dataset.profileBrandShow] = input.checked;
    });

    return ProfileManager.normalizeBrandDefaults({
      show,
      presetId: document.getElementById('inputBrandPresetDefault')?.value || fallback.presetId,
      textColor: document.getElementById('inputBrandTextColorDefault')?.value || fallback.textColor,
      logoShape: document.getElementById('inputLogoShapeDefault')?.value || fallback.logoShape
    });
  }

  function setProfileBrandDefaultsForm(defaults) {
    const normalized = ProfileManager.normalizeBrandDefaults(defaults || ProfileManager.getDefaultBrandDefaults());

    document.querySelectorAll('[data-profile-brand-show]').forEach((input) => {
      input.checked = normalized.show[input.dataset.profileBrandShow] !== false;
    });

    const presetInput = document.getElementById('inputBrandPresetDefault');
    const colorInput = document.getElementById('inputBrandTextColorDefault');
    const shapeInput = document.getElementById('inputLogoShapeDefault');

    if (presetInput) presetInput.value = normalized.presetId;
    if (colorInput) colorInput.value = normalized.textColor;
    if (shapeInput) shapeInput.value = normalized.logoShape;
  }

  function readProfileFormData() {
    return {
      businessName: document.getElementById('inputShopName').value,
      displayName: document.getElementById('inputDisplayName')?.value || '',
      businessType: document.getElementById('inputBusinessType')?.value || '',
      phone: document.getElementById('inputPhone').value,
      address: document.getElementById('inputAddress').value,
      tagline: document.getElementById('inputTagline').value,
      logoDataURL: getSelectedLogoDataURL(),
      brandDefaults: readProfileBrandDefaults()
    };
  }

  function refreshIdentityPreview() {
    const businessName = document.getElementById('inputShopName')?.value || '';
    const displayName = document.getElementById('inputDisplayName')?.value || '';
    const businessType = document.getElementById('inputBusinessType')?.value || '';
    const phoneValue = document.getElementById('inputPhone')?.value || '';
    const normalizedName = ProfileManager.normalizeDisplayName(displayName, businessName) || 'Your Business';
    const phoneInfo = ProfileManager.normalizePhone(phoneValue);
    const brandDefaults = readProfileBrandDefaults();
    const previewName = document.getElementById('identityPreviewName');
    const previewMeta = document.getElementById('identityPreviewMeta');
    const previewMark = document.getElementById('identityPreviewMark');

    if (previewName) previewName.textContent = normalizedName;
    if (previewMark) previewMark.textContent = ProfileManager.getInitials(normalizedName);
    if (previewMeta) {
      const visibleDefaults = [
        brandDefaults.show.logo ? 'Logo' : '',
        brandDefaults.show.business_name ? 'Name' : '',
        brandDefaults.show.phone && phoneInfo.formatted ? 'Phone' : '',
        brandDefaults.show.tagline && document.getElementById('inputTagline')?.value ? 'Tagline' : '',
        brandDefaults.show.address && document.getElementById('inputAddress')?.value ? 'Address' : ''
      ].filter(Boolean).join(', ');
      const meta = [businessType, visibleDefaults || 'Clean profile'].filter(Boolean).join(' - ');
      previewMeta.textContent = meta || 'Brand defaults ready';
    }
  }

  function bindProfileFieldEnhancements() {
    const shopInput = document.getElementById('inputShopName');
    const displayInput = document.getElementById('inputDisplayName');
    const phoneInput = document.getElementById('inputPhone');
    const liveInputs = ['inputBusinessType', 'inputAddress', 'inputTagline'];
    const brandInputs = ['inputBrandPresetDefault', 'inputBrandTextColorDefault', 'inputLogoShapeDefault'];

    if (shopInput && displayInput) {
      shopInput.addEventListener('input', () => {
        if (!displayNameTouched) {
          displayInput.value = ProfileManager.normalizeDisplayName('', shopInput.value);
        }
        refreshIdentityPreview();
      });

      shopInput.addEventListener('blur', () => {
        shopInput.value = ProfileManager.normalizeBusinessName(shopInput.value);
        if (!displayNameTouched) {
          displayInput.value = ProfileManager.normalizeDisplayName('', shopInput.value);
        }
        refreshIdentityPreview();
      });

      displayInput.addEventListener('input', () => {
        displayNameTouched = displayInput.value.trim().length > 0;
        refreshIdentityPreview();
      });

      displayInput.addEventListener('blur', () => {
        displayInput.value = ProfileManager.normalizeDisplayName(displayInput.value, shopInput.value);
        displayNameTouched = displayInput.value.trim().length > 0;
        refreshIdentityPreview();
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', refreshIdentityPreview);
      phoneInput.addEventListener('blur', () => {
        const phoneInfo = ProfileManager.normalizePhone(phoneInput.value);
        if (phoneInfo.formatted) phoneInput.value = phoneInfo.formatted;
        refreshIdentityPreview();
      });
    }

    liveInputs.forEach((id) => {
      document.getElementById(id)?.addEventListener('input', refreshIdentityPreview);
      document.getElementById(id)?.addEventListener('change', refreshIdentityPreview);
    });

    document.getElementById('profileBrandDefaultToggles')?.addEventListener('change', refreshIdentityPreview);
    brandInputs.forEach((id) => {
      document.getElementById(id)?.addEventListener('input', refreshIdentityPreview);
      document.getElementById(id)?.addEventListener('change', refreshIdentityPreview);
    });
  }

  function handleProfileSubmit(e) {
    e.preventDefault();

    const data = readProfileFormData();

    // Get existing profile data for logo if not changed
    const existingProfile = ProfileManager.getProfile();
    if (!data.logoDataURL) {
      data.logoDataURL = existingProfile?.logoDataURL || null;
    }

    // Validate
    const { isValid, errors } = ProfileManager.validate(data);

    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    if (!isValid) {
      if (errors.shopName) {
        document.getElementById('groupShopName').classList.add('error');
      }
      if (errors.displayName) {
        document.getElementById('groupDisplayName')?.classList.add('error');
      }
      if (errors.phone) {
        document.getElementById('groupPhone').classList.add('error');
      }
      showToast('Please fix the errors above', 'error');
      return;
    }

    // Save profile
    if (isEditing && existingProfile) {
      data.createdAt = existingProfile.createdAt;
    }

    const success = ProfileManager.saveProfile(data);
    if (success) {
      showToast(isEditing ? 'Profile updated' : 'Profile saved', 'success');
      isEditing = false;
      navigateTo('gallery', { replaceCurrent: true });
    } else {
      showToast('Failed to save profile', 'error');
    }
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    ProfileManager.readFileAsDataURL(file)
      .then(dataURL => {
        const preview = document.getElementById('logoPreview');
        preview.src = dataURL;
        document.getElementById('logoUploadArea').classList.add('has-logo');
        refreshIdentityPreview();
        showToast('Logo uploaded', 'success');
      })
      .catch(err => {
        showToast(err.message, 'error');
      });
  }

  function populateProfileForm() {
    const profile = ProfileManager.getProfile();
    if (!profile) return;

    displayNameTouched = Boolean(profile.displayName);
    document.getElementById('inputShopName').value = profile.businessName || profile.shopName || '';
    document.getElementById('inputDisplayName').value = profile.displayName || profile.shopName || '';
    document.getElementById('inputBusinessType').value = profile.businessType || '';
    document.getElementById('inputPhone').value = profile.phone || '';
    document.getElementById('inputAddress').value = profile.address || '';
    document.getElementById('inputTagline').value = profile.tagline || '';
    setProfileBrandDefaultsForm(profile.brandDefaults);

    if (profile.logoDataURL) {
      const preview = document.getElementById('logoPreview');
      preview.src = profile.logoDataURL;
      document.getElementById('logoUploadArea').classList.add('has-logo');
    } else {
      document.getElementById('logoPreview').removeAttribute('src');
      document.getElementById('logoUploadArea').classList.remove('has-logo');
    }

    // Update save button text
    document.getElementById('btnSaveProfile').textContent = 'Update Profile';
    refreshIdentityPreview();
  }

  function resetProfileForm() {
    const form = document.getElementById('profileForm');
    const preview = document.getElementById('logoPreview');
    const uploadArea = document.getElementById('logoUploadArea');

    form.reset();
    displayNameTouched = false;
    preview.removeAttribute('src');
    uploadArea.classList.remove('has-logo');
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    document.getElementById('btnSaveProfile').textContent = 'Save & Start Creating';
    setProfileBrandDefaultsForm(ProfileManager.getDefaultBrandDefaults());
    refreshIdentityPreview();
  }

  function getSelectedLogoDataURL() {
    const preview = document.getElementById('logoPreview');
    const uploadArea = document.getElementById('logoUploadArea');

    if (!uploadArea.classList.contains('has-logo')) return null;
    return preview.getAttribute('src') || null;
  }

  // =======================================
  // GALLERY
  // =======================================

  const escapeHtml = PBUtils.escapeHtml;

  function visibleTemplateTitle(template, title = null) {
    const name = title || template?.name || '';
    const marker = template?.emoji || '';
    if (!marker || /^[A-Z0-9]{1,3}$/.test(marker)) return name;
    return `${marker} ${name}`.trim();
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function getSavedDesigns() {
    try {
      const designs = JSON.parse(localStorage.getItem(SAVED_DESIGNS_KEY) || '[]');
      if (!Array.isArray(designs)) return [];
      return designs.filter(design => design?.id && design?.templateId && design?.design);
    } catch (e) {
      console.warn('Saved designs could not be read:', e);
      return [];
    }
  }

  function getSavedDesignById(id) {
    return getSavedDesigns().find(design => design.id === id) || null;
  }

  function saveDesignRecord(record) {
    const existing = getSavedDesigns().filter(design => design.id !== record.id);
    const next = [record, ...existing].slice(0, 40);

    try {
      localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify(next));
      return true;
    } catch (e) {
      if (!record.thumbnail) {
        console.error('Saved design failed:', e);
        return false;
      }

      try {
        const lighterRecord = { ...record, thumbnail: null };
        localStorage.setItem(SAVED_DESIGNS_KEY, JSON.stringify([lighterRecord, ...existing].slice(0, 40)));
        return true;
      } catch (retryError) {
        console.error('Saved design failed after thumbnail fallback:', retryError);
        return false;
      }
    }
  }

  function captureCurrentThumbnail() {
    const source = document.getElementById('posterCanvas');
    if (!source) return null;

    try {
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 300;
      thumbCanvas.height = 300;
      const ctx = thumbCanvas.getContext('2d');
      ctx.drawImage(source, 0, 0, 300, 300);
      return thumbCanvas.toDataURL('image/jpeg', 0.72);
    } catch (e) {
      console.warn('Thumbnail capture failed:', e);
      return null;
    }
  }

  function getDesignTitle(design, template) {
    const preferredLayer = design?.layers?.find(layer =>
      layer.type === 'text' &&
      layer.id !== 'phone' &&
      layer.id !== 'tagline' &&
      layer.text &&
      layer.text.trim()
    );

    return preferredLayer?.text?.trim() || template?.name || 'Custom Design';
  }

  function renderCategoryPills() {
    const container = document.getElementById('categoryPills');
    if (!container) return;

    container.innerHTML = TemplateRegistry.getCategoryOptions().map(category => {
      const count = getCategoryCount(category.id, currentMediaType);
      return `
        <button class="category-pill ${category.id === currentCategory ? 'active' : ''}"
          type="button"
          data-category="${escapeHtml(category.id)}">
          ${escapeHtml(category.label)}<span class="pill-count">${escapeHtml(formatCount(count))}</span>
        </button>
      `;
    }).join('');
  }

  function setActiveCategoryPill(category) {
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === category);
    });
  }

  function renderMediaTypePills() {
    const container = document.getElementById('mediaTypePills');
    if (!container) return;

    const counts = getMediaCounts(currentCategory);
    const options = [
      { id: 'all', label: 'All Designs', count: counts.all },
      { id: 'image', label: 'Images', count: counts.image },
      { id: 'video', label: 'Videos', count: counts.video }
    ];

    container.innerHTML = options.map(option => `
      <button class="media-type-pill ${option.id === currentMediaType ? 'active' : ''}"
        type="button"
        data-media-type="${escapeHtml(option.id)}">
        ${escapeHtml(option.label)}<span class="pill-count">${escapeHtml(formatCount(option.count))}</span>
      </button>
    `).join('');
  }

  function setActiveMediaTypePill(mediaType) {
    document.querySelectorAll('.media-type-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.mediaType === mediaType);
    });
  }

  const debouncedLoadGallery = PBUtils.debounce((category) => {
    loadGallery(category);
  }, 250);

  function handleTemplateSearch(e) {
    searchQuery = e.target.value.trim();
    debouncedLoadGallery(currentCategory);
  }

  function isTemplateVideo(template) {
    return Boolean(template?.isVideoInvite || template?.category === 'video' || template?.subcategory === 'video');
  }

  function templateMatchesMediaType(template, mediaType = currentMediaType) {
    if (mediaType === 'all') return true;
    const isVideo = isTemplateVideo(template);
    return mediaType === 'video' ? isVideo : !isVideo;
  }

  function filterItemsByMediaType(items, isSavedCategory, mediaType = currentMediaType) {
    if (mediaType === 'all') return items;
    return items.filter((item) => {
      const template = isSavedCategory ? TemplateRegistry.getById(item.templateId) : item;
      return templateMatchesMediaType(template, mediaType);
    });
  }

  function formatCount(count) {
    return count > 999 ? '999+' : String(count);
  }

  function getCategorySourceItems(category) {
    if (category === 'saved') return { items: getSavedDesigns(), isSavedCategory: true };
    if (category === 'favorites') {
      const favIds = getFavorites();
      return {
        items: TemplateRegistry.search({ category: 'all', query: '' }).filter(template => favIds.includes(template.id)),
        isSavedCategory: false
      };
    }
    return { items: TemplateRegistry.getByCategory(category), isSavedCategory: false };
  }

  function getCategoryCount(category, mediaType = currentMediaType) {
    const source = getCategorySourceItems(category);
    return filterItemsByMediaType(source.items, source.isSavedCategory, mediaType).length;
  }

  function getMediaCounts(category) {
    const source = getCategorySourceItems(category);
    const all = source.items.length;
    const video = filterItemsByMediaType(source.items, source.isSavedCategory, 'video').length;
    return {
      all,
      image: Math.max(0, all - video),
      video
    };
  }

  function updateGalleryResultsMeta(visibleCount, rawCount, category, isSavedCategory) {
    const meta = document.getElementById('galleryResultsMeta');
    if (!meta) return;

    const isFavoriteCategory = category === 'favorites';
    const categoryLabel = TemplateRegistry.getCategoryOptions()
      .find(option => option.id === category)?.label || 'Designs';
    const mediaLabel = currentMediaType === 'video'
      ? 'video templates'
      : currentMediaType === 'image'
        ? 'image templates'
        : 'templates';
    const base = isSavedCategory
      ? `${visibleCount} saved ${visibleCount === 1 ? 'design' : 'designs'}`
      : isFavoriteCategory
        ? `${visibleCount} favorite ${visibleCount === 1 ? 'template' : 'templates'}`
      : `${visibleCount} ${mediaLabel}`;
    const searchSuffix = searchQuery ? ` matching "${searchQuery}"` : '';
    const hiddenSuffix = visibleCount !== rawCount ? ` (${rawCount - visibleCount} hidden by media filter)` : '';
    meta.textContent = `${base} in ${categoryLabel}${searchSuffix}${hiddenSuffix}`;
  }

  function savedDesignMatches(record, query) {
    const text = query.toLowerCase();
    if (!text) return true;

    const template = TemplateRegistry.getById(record.templateId);
    const layerText = (record.design?.layers || [])
      .filter(layer => layer.type === 'text')
      .map(layer => layer.text || '')
      .join(' ');
    const haystack = [
      record.title,
      template?.name,
      template?.category,
      template?.subcategory,
      template?.categoryLabel,
      ...(template?.tags || []),
      layerText
    ].join(' ').toLowerCase();

    return haystack.includes(text);
  }

  function renderRecentDesigns() {
    const section = document.getElementById('recentDesignsSection');
    const carousel = document.getElementById('recentDesignsCarousel');
    if (!section || !carousel) return;

    const saved = getSavedDesigns();
    if (!saved || !saved.length) {
      section.style.display = 'none';
      return;
    }

    // Sort by updatedAt descending, get top 6
    const recents = saved.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);

    carousel.innerHTML = recents.map(record => {
      const template = TemplateRegistry.getById(record.templateId);
      const thumb = record.thumbnail || template?.path || '';
      const fallbackGradient = template ? (template.canvasGen?.gradient || ['#333', '#555']).join(',') : '#333,#555';
      const title = record.title || template?.name || 'Design';

      return `
        <div class="recent-card" data-template-id="${escapeHtml(record.templateId)}" data-saved-id="${escapeHtml(record.id)}" role="button" tabindex="0">
          <div class="recent-card-thumb">
            ${thumb
              ? `<img src="${escapeHtml(thumb)}" alt="${escapeHtml(title)}" style="width:100%; height:100%; object-fit:cover; display:block;">`
              : `<div class="template-card-fallback" style="background:linear-gradient(135deg,${fallbackGradient}); font-size:1.5rem; width:100%; height:100%; display:grid; place-items:center;">
                  ${escapeHtml(template?.emoji || '✨')}
                </div>`
            }
          </div>
          <div class="recent-card-title">${escapeHtml(title)}</div>
        </div>
      `;
    }).join('');

    section.style.display = 'block';
  }

  async function loadGallery(category = 'all') {
    currentCategory = category;
    renderCategoryPills();
    renderMediaTypePills();
    renderRecentDesigns();

    const grid = document.getElementById('templateGrid');
    const loadId = ++galleryLoadId;
    const isSavedCategory = category === 'saved';
    const isFavCategory = category === 'favorites';

    let rawItems;
    if (isSavedCategory) {
      rawItems = getSavedDesigns().filter(record => savedDesignMatches(record, searchQuery));
    } else if (isFavCategory) {
      const favIds = getFavorites();
      rawItems = TemplateRegistry.search({ category: 'all', query: searchQuery })
        .filter(t => favIds.includes(t.id));
    } else {
      rawItems = TemplateRegistry.search({ category, query: searchQuery });
    }
    const items = filterItemsByMediaType(rawItems, isSavedCategory);
    updateGalleryResultsMeta(items.length, rawItems.length, category, isSavedCategory);

    if (!items.length) {
      const emptyText = isSavedCategory
        ? 'Saved cards will appear here after you save a design.'
        : isFavCategory
          ? 'Favorite templates will appear here after you tap the heart on a preview.'
        : 'No templates matched your filters.';
      grid.innerHTML = `
        <div class="empty-state gallery-empty">
          <div class="empty-state-icon">+</div>
          <div class="empty-state-text">${escapeHtml(emptyText)}</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.slice(0, 12).map(() => `
      <div class="template-card loading">
        <div style="width:100%; height:100%;"></div>
      </div>
    `).join('');

    await sleep(250);
    if (loadId !== galleryLoadId) return;

    const cards = [];
    const canGenerateRichThumbs = items.length <= 120;
    for (const item of items) {
      const savedRecord = isSavedCategory ? item : null;
      const template = isSavedCategory ? TemplateRegistry.getById(item.templateId) : item;
      if (!template) continue;

      let thumbSrc = savedRecord?.thumbnail || null;
      if (!thumbSrc) {
        if (template.path) {
          thumbSrc = template.path;
        } else if (canGenerateRichThumbs) {
          try {
            thumbSrc = await CanvasEngine.generateThumbnail(template.id);
          } catch (e) {
            console.warn('Thumbnail generation failed:', e);
          }
        }
      }

      const badgeClass = savedRecord
        ? 'badge-saved'
        : template.isVideoInvite ? 'badge-video'
        : template.isPhotoTemplate ? 'badge-photo'
        : template.isPremium ? 'badge-premium' : 'badge-free';
      const badgeText = savedRecord
        ? 'SAVED'
        : template.isVideoInvite ? 'VIDEO'
        : template.isPhotoTemplate ? 'PHOTO'
        : template.isPremium ? 'PREMIUM' : 'FREE';
      const cardName = savedRecord?.title || template.name;
      const savedAttr = savedRecord ? ` data-saved-id="${escapeHtml(savedRecord.id)}"` : '';
      const fallbackGradient = (template.canvasGen?.gradient || ['#333', '#555']).join(',');
      const cardMeta = [
        template.categoryLabel || template.category,
        template.isPhotoTemplate ? 'Real photo' : null
      ].filter(Boolean).join(' - ');

      cards.push(`
        <div class="template-card" data-template-id="${escapeHtml(template.id)}"${savedAttr} role="button" tabindex="0"
             aria-label="Select ${escapeHtml(cardName)} template">
          ${thumbSrc
            ? `<img src="${escapeHtml(thumbSrc)}" alt="${escapeHtml(cardName)}" loading="lazy">`
            : `<div class="template-card-fallback" style="background:linear-gradient(135deg,${fallbackGradient});">
                ${escapeHtml(template.emoji)}
              </div>`
          }
          <span class="template-card-badge ${badgeClass}">${badgeText}</span>
          ${isFavorite(template.id) ? `<span class="template-card-favorite" style="position: absolute; top: 10px; right: 10px; z-index: 5; color: #EF4444; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); font-size: 14px;">❤️</span>` : ''}
          ${template.isVideoInvite ? '<span class="template-card-play" aria-hidden="true">▶</span>' : ''}
          <div class="template-card-overlay">
            <span class="template-card-name">${escapeHtml(visibleTemplateTitle(template, cardName))}</span>
            <span class="template-card-meta">${escapeHtml(cardMeta)}</span>
          </div>
        </div>
      `);
    }

    if (loadId === galleryLoadId) {
      grid.innerHTML = cards.join('');
    }
  }

  function handleCategoryFilter(e) {
    const pill = e.target.closest('.category-pill');
    if (!pill) return;
    if (typeof debouncedLoadGallery !== 'undefined') debouncedLoadGallery.cancel();
    loadGallery(pill.dataset.category);
  }

  function handleMediaTypeFilter(e) {
    const pill = e.target.closest('.media-type-pill');
    if (!pill) return;
    if (typeof debouncedLoadGallery !== 'undefined') debouncedLoadGallery.cancel();
    currentMediaType = pill.dataset.mediaType || 'all';
    loadGallery(currentCategory);
  }

  function handleTemplateSelect(e) {
    const card = e.target.closest('.template-card');
    if (!card) return;

    const templateId = card.dataset.templateId;
    if (!templateId) return;

    selectTemplate(templateId, card.dataset.savedId || null);
  }

  function handleTemplateKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    const card = e.target.closest('.template-card');
    if (!card) return;

    e.preventDefault();
    const templateId = card.dataset.templateId;
    if (templateId) selectTemplate(templateId, card.dataset.savedId || null);
  }

  function normalizeAspectRatio(aspectRatio) {
    return ['1:1', '9:16', '16:9', 'a4'].includes(aspectRatio) ? aspectRatio : '1:1';
  }

  function syncCanvasPreviewAspect(aspectRatio = '1:1') {
    const dimensions = CanvasEngine.getCanvasDimensionsForAspect
      ? CanvasEngine.getCanvasDimensionsForAspect(aspectRatio)
      : { width: 1080, height: 1080 };
    const wrapper = document.getElementById('canvasWrapper');
    const videoCanvas = document.getElementById('videoPreviewCanvas');
    const ratio = dimensions.width / dimensions.height;
    const format = ratio < 0.8 ? 'portrait' : ratio > 1.25 ? 'landscape' : 'square';

    if (wrapper) {
      wrapper.style.aspectRatio = `${dimensions.width} / ${dimensions.height}`;
      wrapper.style.setProperty('--canvas-preview-ratio', `${dimensions.width} / ${dimensions.height}`);
      wrapper.dataset.canvasFormat = format;
    }

    if (videoCanvas) {
      videoCanvas.width = dimensions.width;
      videoCanvas.height = dimensions.height;
      videoCanvas.style.aspectRatio = `${dimensions.width} / ${dimensions.height}`;
      videoCanvas.style.setProperty('--canvas-preview-ratio', `${dimensions.width} / ${dimensions.height}`);
    }
  }

  function setEditorCanvasAspect(aspectRatio = '1:1') {
    const next = normalizeAspectRatio(aspectRatio);
    if (CanvasEngine.setCanvasSizeForAspect) {
      CanvasEngine.setCanvasSizeForAspect(next);
    } else {
      const canvas = document.getElementById('posterCanvas');
      if (canvas) {
        if (next === '9:16') {
          canvas.width = 1080;
          canvas.height = 1920;
        } else if (next === '16:9') {
          canvas.width = 1920;
          canvas.height = 1080;
        } else {
          canvas.width = 1080;
          canvas.height = 1080;
        }
      }
    }
    syncCanvasPreviewAspect(next);
    return next;
  }

  function selectTemplate(templateId, savedId = null, options = {}) {
    currentTemplateId = templateId;
    currentSavedDesignId = savedId;
    openEditor(templateId, savedId, options);
  }

  function showAspectRatioModal() {
    const modal = document.getElementById('aspectRatioModal');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.querySelector('.modal-card').style.transform = 'scale(1)';
    }, 10);
  }

  function hideAspectRatioModal() {
    const modal = document.getElementById('aspectRatioModal');
    if (!modal) return;
    modal.style.opacity = '0';
    modal.querySelector('.modal-card').style.transform = 'scale(0.9)';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }

  function createCustomDesign(aspectRatio) {
    pendingCustomAspectRatio = normalizeAspectRatio(aspectRatio);
    selectTemplate('custom_blank_01', null, { aspectRatio: pendingCustomAspectRatio });
    hideAspectRatioModal();
  }

  const FAVORITES_KEY = 'posterbanao_favorites';

  function getFavorites() {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function isFavorite(templateId) {
    return getFavorites().includes(templateId);
  }

  function toggleFavorite(templateId) {
    let favs = getFavorites();
    if (favs.includes(templateId)) {
      favs = favs.filter(id => id !== templateId);
      showToast('Removed from Favorites', 'info');
    } else {
      favs.push(templateId);
      showToast('Added to Favorites', 'success');
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));

    if (currentCategory === 'favorites') {
      loadGallery('favorites');
    } else {
      renderCategoryPills();
      // Also update current card if visible
      const card = document.querySelector(`.template-card[data-template-id="${templateId}"]`);
      if (card) {
        let favBadge = card.querySelector('.template-card-favorite');
        if (favBadge) favBadge.remove();
        if (favs.includes(templateId)) {
          card.insertAdjacentHTML('beforeend', `<span class="template-card-favorite" style="position: absolute; top: 10px; right: 10px; z-index: 5; color: #EF4444; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); font-size: 14px;">❤️</span>`);
        }
      }
    }
  }

  function showTemplatePreview(templateId, savedId = null) {
    const isSavedCategory = !!savedId;
    const template = TemplateRegistry.getById(templateId);
    if (!template) return;

    previewingTemplateId = templateId;
    previewingSavedId = savedId;

    const overlay = document.getElementById('templatePreviewOverlay');
    const imageContainer = document.getElementById('previewModalImage');
    const titleEl = document.getElementById('previewModalTitle');
    const categoryEl = document.getElementById('previewModalCategory');
    const badgeEl = document.getElementById('previewBadge');

    titleEl.textContent = isSavedCategory ? (getSavedDesignById(savedId)?.title || template.name) : template.name;
    categoryEl.textContent = (template.categoryLabel || template.category).replace('_', ' ').toUpperCase();

    // Set badge
    badgeEl.className = 'template-card-badge';
    if (isSavedCategory) {
      badgeEl.classList.add('badge-saved');
      badgeEl.textContent = 'SAVED';
    } else if (template.isVideoInvite) {
      badgeEl.classList.add('badge-video');
      badgeEl.textContent = 'VIDEO';
    } else if (template.isPhotoTemplate) {
      badgeEl.classList.add('badge-photo');
      badgeEl.textContent = 'PHOTO';
    } else if (template.isPremium) {
      badgeEl.classList.add('badge-premium');
      badgeEl.textContent = 'PREMIUM';
    } else {
      badgeEl.classList.add('badge-free');
      badgeEl.textContent = 'FREE';
    }

    // Set image/thumbnail
    imageContainer.innerHTML = '';
    const existingCard = document.querySelector(`.template-card[data-template-id="${templateId}"]`);
    const cardImg = existingCard?.querySelector('img');

    if (cardImg) {
      const imgClone = cardImg.cloneNode();
      imageContainer.appendChild(imgClone);
    } else {
      const fallbackGradient = (template.canvasGen?.gradient || ['#333', '#555']).join(',');
      imageContainer.innerHTML = `
        <div class="template-card-fallback" style="background:linear-gradient(135deg,${fallbackGradient});">
          ${escapeHtml(template.emoji || '✨')}
        </div>
      `;
    }

    const btnToggleFav = document.getElementById('btnToggleFavorite');
    if (btnToggleFav) {
      btnToggleFav.classList.toggle('is-favorite', isFavorite(templateId));
    }

    overlay.classList.add('active');
  }

  function hideTemplatePreview() {
    const overlay = document.getElementById('templatePreviewOverlay');
    if (overlay) overlay.classList.remove('active');
    previewingTemplateId = null;
    previewingSavedId = null;
  }

  function handleBackToGallery() {
    if (hasUnsavedChanges) {
      const dialog = document.getElementById('unsavedDialogOverlay');
      if (dialog) dialog.classList.add('active');
    } else {
      navigateTo('gallery', { replaceCurrent: true });
    }
  }

  function handleDuplicateLayer() {
    const layer = getSelectedLayer();
    if (!layer || !currentDesign) return;

    pushEditorHistory();
    const cloned = JSON.parse(JSON.stringify(layer));
    const duplicatePrefix = layer.type === 'text'
      ? 'custom_text'
      : layer.type === 'sticker'
        ? 'sticker'
        : 'custom_image';
    cloned.id = newLayerId(duplicatePrefix);
    cloned.label = `${layer.label || layer.id} Copy`;
    cloned.x = clampUnit((layer.x || 0.3) + 0.04, 0.015, 0.9);
    cloned.y = clampUnit((layer.y || 0.3) + 0.04, 0.015, 0.9);
    cloned.userAdded = true; // allow manual deletion/movement

    currentDesign.layers.push(cloned);
    selectedLayerId = cloned.id;
    markDesignChanged();
    showToast('Layer duplicated', 'success');
  }

  function handleMoveLayerUp() {
    const layer = getSelectedLayer();
    if (!layer || !currentDesign) return;

    const layers = currentDesign.layers;
    const index = layers.findIndex(l => l.id === layer.id);
    if (index < 0 || index === layers.length - 1) return;

    pushEditorHistory();
    layers[index] = layers[index + 1];
    layers[index + 1] = layer;

    markDesignChanged();
    showToast('Moved layer up', 'success');
  }

  function handleMoveLayerDown() {
    const layer = getSelectedLayer();
    if (!layer || !currentDesign) return;

    const layers = currentDesign.layers;
    const index = layers.findIndex(l => l.id === layer.id);
    if (index <= 0) return;

    pushEditorHistory();
    layers[index] = layers[index - 1];
    layers[index - 1] = layer;

    markDesignChanged();
    showToast('Moved layer down', 'success');
  }

  function getEditableLayers() {
    return (currentDesign?.layers || []).filter(layer => layer.editable && !layer.hidden);
  }

  function getAllEditableLayers() {
    return (currentDesign?.layers || []).filter(layer => layer.editable);
  }

  function getSelectedLayer() {
    return getAllEditableLayers().find(layer => layer.id === selectedLayerId) || null;
  }

  function getLayerById(id) {
    return (currentDesign?.layers || []).find(layer => layer.id === id) || null;
  }

  function designsEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    try {
      const simplify = (design) => {
        return {
          id: design.id,
          templateId: design.templateId,
          aspectRatio: design.aspectRatio,
          brand: design.brand,
          animation: design.animation,
          photoStyle: design.photoStyle,
          layers: (design.layers || []).map(layer => {
            const { src, logoDataURL, ...rest } = layer;
            return {
              ...rest,
              hasSrc: !!src,
              srcLength: src ? src.length : 0,
              hasLogo: !!logoDataURL,
              logoLength: logoDataURL ? logoDataURL.length : 0
            };
          })
        };
      };
      return JSON.stringify(simplify(a)) === JSON.stringify(simplify(b));
    } catch {
      return false;
    }
  }

  function updateHistoryButtons() {
    const undo = document.getElementById('btnUndoEdit');
    const redo = document.getElementById('btnRedoEdit');
    if (undo) undo.disabled = editorUndoStack.length === 0;
    if (redo) redo.disabled = editorRedoStack.length === 0;
  }

  function resetEditorHistory() {
    editorUndoStack = [];
    editorRedoStack = [];
    updateHistoryButtons();
  }

  let lastHistoryPushAt = 0;

  function pushEditorHistory(isContinuous = false) {
    if (!currentDesign) return;

    const now = Date.now();
    if (isContinuous && now - lastHistoryPushAt < 300) {
      return;
    }
    lastHistoryPushAt = now;

    const snapshot = CanvasEngine.cloneDesign(currentDesign);
    const previous = editorUndoStack[editorUndoStack.length - 1];
    if (previous && designsEqual(previous, snapshot)) return;
    editorUndoStack.push(snapshot);
    if (editorUndoStack.length > 40) editorUndoStack.shift();
    editorRedoStack = [];
    updateHistoryButtons();
  }

  function restoreEditorDesign(snapshot) {
    if (!snapshot) return;
    currentDesign = CanvasEngine.cloneDesign(snapshot);
    (currentDesign.layers || []).forEach(ensureImageDefaults);
    ensureBrandState(ProfileManager.getProfile() || {});
    if (!getLayerById(selectedLayerId)) selectedLayerId = firstVisibleEditableLayerId();
    DownloadManager.setActiveDesign(currentDesign);
    renderLayerPills();
    syncLayerControls();
    syncBrandControls();
    syncAnimationControls();
    syncPhotoToolControls();
    renderEditorPoster();
    updateHistoryButtons();
  }

  function handleUndoEdit() {
    if (!editorUndoStack.length || !currentDesign) return;
    editorRedoStack.push(CanvasEngine.cloneDesign(currentDesign));
    const snapshot = editorUndoStack.pop();
    restoreEditorDesign(snapshot);
  }

  function handleRedoEdit() {
    if (!editorRedoStack.length || !currentDesign) return;
    editorUndoStack.push(CanvasEngine.cloneDesign(currentDesign));
    const snapshot = editorRedoStack.pop();
    restoreEditorDesign(snapshot);
  }

  function isBrandLayer(layerOrId) {
    const id = typeof layerOrId === 'string' ? layerOrId : layerOrId?.id;
    return BRAND_LAYER_IDS.includes(id);
  }

  function setEditorSheetState(state) {
    const next = EDITOR_SHEET_STATES.includes(state) ? state : 'collapsed';
    editorSheetState = next;
    const sheet = document.getElementById('editorBottomSheet');
    if (!sheet) return;
    sheet.dataset.sheetState = next;
    sheet.setAttribute('aria-expanded', next !== 'collapsed' ? 'true' : 'false');
    sheet.style.removeProperty('--sheet-drag-offset');
    syncCanvasSelectionOverlay();
  }

  function revealEditorSheet() {
    if (editorSheetState === 'collapsed') {
      setEditorSheetState('half');
    } else {
      setEditorSheetState(editorSheetState);
    }
  }

  function stepEditorSheet(direction) {
    const current = Math.max(0, EDITOR_SHEET_STATES.indexOf(editorSheetState));
    const next = clampUnit(current + direction, 0, EDITOR_SHEET_STATES.length - 1);
    setEditorSheetState(EDITOR_SHEET_STATES[next]);
  }

  function handleEditorSheetPointerDown(e) {
    if (currentScreen !== 'editor') return;
    editorSheetDragState = {
      pointerId: e.pointerId,
      startY: e.clientY,
      lastY: e.clientY,
      moved: false
    };
    document.getElementById('editorBottomSheet')?.classList.add('sheet-dragging');
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    e.preventDefault();
  }

  function handleEditorSheetPointerMove(e) {
    if (!editorSheetDragState || editorSheetDragState.pointerId !== e.pointerId) return;
    const deltaY = e.clientY - editorSheetDragState.startY;
    editorSheetDragState.lastY = e.clientY;
    editorSheetDragState.moved = editorSheetDragState.moved || Math.abs(deltaY) > 6;
    const offset = clampUnit(deltaY, -110, 110);
    document.getElementById('editorBottomSheet')?.style.setProperty('--sheet-drag-offset', `${offset}px`);
    e.preventDefault();
  }

  function handleEditorSheetPointerUp(e) {
    if (!editorSheetDragState || editorSheetDragState.pointerId !== e.pointerId) return;
    const deltaY = e.clientY - editorSheetDragState.startY;
    const velocityHint = e.clientY - editorSheetDragState.lastY;
    const sheet = document.getElementById('editorBottomSheet');
    sheet?.classList.remove('sheet-dragging');
    sheet?.style.removeProperty('--sheet-drag-offset');

    if (deltaY < -42 || velocityHint < -18) {
      stepEditorSheet(1);
    } else if (deltaY > 42 || velocityHint > 18) {
      stepEditorSheet(-1);
    } else {
      setEditorSheetState(editorSheetState);
    }

    editorSheetDragState = null;
  }

  function handleEditorSheetKeydown(e) {
    if (e.key === 'ArrowUp') {
      stepEditorSheet(1);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
      stepEditorSheet(-1);
      e.preventDefault();
    }
  }

  function handleEditorTabClick(e) {
    const tab = e.target.closest('[data-editor-tab]');
    if (!tab || tab.hidden) return;
    setEditorTab(tab.dataset.editorTab);
    revealEditorSheet();
  }

  function setEditorTab(tab) {
    const template = currentTemplate();
    if (tab === 'animation' && !template?.isVideoInvite) {
      tab = 'brand';
    }
    currentEditorTab = tab || 'brand';
    syncEditorTabs();
  }

  function syncEditorTabs() {
    const template = currentTemplate();
    const animationAvailable = Boolean(template?.isVideoInvite);
    if (!animationAvailable && currentEditorTab === 'animation') {
      currentEditorTab = 'brand';
    }

    document.querySelectorAll('[data-editor-tab]').forEach((tab) => {
      const isAnimationTab = tab.dataset.editorTab === 'animation';
      tab.hidden = isAnimationTab && !animationAvailable;
      const isActive = tab.dataset.editorTab === currentEditorTab && !tab.hidden;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('[data-editor-tab-panel]').forEach((panel) => {
      const isActive = panel.dataset.editorTabPanel === currentEditorTab;
      panel.classList.toggle('active', isActive);
    });

    if (currentEditorTab === 'crop') {
      requestAnimationFrame(syncRotationWheel);
    }
  }

  function newLayerId(prefix) {
    const count = (currentDesign?.layers || []).filter(layer => layer.id?.startsWith(prefix)).length + 1;
    return `${prefix}_${Date.now()}_${count}`;
  }

  function canDeleteLayer(layer) {
    if (!layer) return false;
    return !CORE_LAYER_IDS.has(layer.id);
  }

  function canDragDeleteLayer(layer) {
    if (!layer || !layer.editable) return false;
    return layer.id !== 'business_banner';
  }

  function labelForLayer(layer) {
    return BRAND_FIELD_META[layer?.id]?.label || layer?.label || layer?.id || 'Layer';
  }

  function hideDragDeleteZone() {
    dragDeleteActive = false;
    const zone = document.getElementById('canvasDeleteZone');
    if (!zone) return;
    zone.hidden = true;
    zone.classList.remove('visible', 'active');
  }

  function showDragDeleteZone(layer) {
    const zone = document.getElementById('canvasDeleteZone');
    if (!zone || !canDragDeleteLayer(layer)) return;
    zone.hidden = false;
    requestAnimationFrame(() => zone.classList.add('visible'));
  }

  function isPointerOverDeleteZone(e) {
    const zone = document.getElementById('canvasDeleteZone');
    if (!zone || zone.hidden) return false;
    const rect = zone.getBoundingClientRect();
    const pad = 18;
    return e.clientX >= rect.left - pad &&
      e.clientX <= rect.right + pad &&
      e.clientY >= rect.top - pad &&
      e.clientY <= rect.bottom + pad;
  }

  function syncDragDeleteZone(e) {
    const layer = getLayerById(canvasDragState?.layerId);
    const zone = document.getElementById('canvasDeleteZone');
    if (!zone || !canvasDragState?.moved || !canDragDeleteLayer(layer)) {
      dragDeleteActive = false;
      if (zone) zone.classList.remove('active');
      return;
    }

    showDragDeleteZone(layer);
    dragDeleteActive = isPointerOverDeleteZone(e);
    zone.classList.toggle('active', dragDeleteActive);
  }

  function deleteLayerFromPoster(layer, options = {}) {
    if (!layer || !currentDesign) return false;
    const announce = options.announce !== false;

    if (isBrandLayer(layer)) {
      if (options.captureHistory !== false) pushEditorHistory();
      layer.hidden = true;
      if (currentDesign.brand?.show && Object.prototype.hasOwnProperty.call(currentDesign.brand.show, layer.id)) {
        currentDesign.brand.show[layer.id] = false;
      }
      selectedLayerId = firstVisibleEditableLayerId();
      markDesignChanged();
      if (announce) showToast(`${labelForLayer(layer)} hidden on this poster`, 'info');
      return true;
    }

    if (!canDeleteLayer(layer)) {
      if (announce) showToast('This layer cannot be deleted', 'info');
      return false;
    }

    const index = currentDesign.layers.findIndex(item => item.id === layer.id);
    if (index < 0) return false;
    if (options.captureHistory !== false) pushEditorHistory();
    currentDesign.layers.splice(index, 1);
    selectedLayerId = getEditableLayers()[Math.max(0, index - 1)]?.id || getEditableLayers()[0]?.id || null;
    markDesignChanged();
    if (announce) showToast(`${labelForLayer(layer)} deleted`, 'success');
    return true;
  }

  function markDesignChanged(render = true) {
    if (!currentDesign) return;
    hasUnsavedChanges = true;
    currentDesign.updatedAt = Date.now();
    DownloadManager.setActiveDesign(currentDesign);
    renderLayerPills();
    syncLayerControls();
    syncBrandControls();
    syncAnimationControls();
    syncPhotoToolControls();
    syncCanvasSelectionOverlay();
    if (currentScreen !== 'editor' || !canvasDragState) hideDragDeleteZone();
    updateHistoryButtons();
    if (render) {
      renderEditorPoster();
    } else {
      scheduleEditorPosterRender();
    }
  }

  function scheduleEditorPosterRender() {
    if (editorRenderFrameId) return;
    editorRenderFrameId = requestAnimationFrame(() => {
      editorRenderFrameId = null;
      renderEditorPoster();
    });
  }

  function ensureImageDefaults(layer) {
    if (!layer || layer.type !== 'image') return;
    layer.mask = layer.mask || layer.shape || 'rounded';
    layer.shape = layer.shape || layer.mask;
    layer.fit = layer.fit || 'cover';
    layer.cropX = layer.cropX ?? layer.crop?.x ?? 0.5;
    layer.cropY = layer.cropY ?? layer.crop?.y ?? 0.5;
    layer.cropZoom = layer.cropZoom ?? layer.crop?.zoom ?? 1;
    layer.padding = layer.padding ?? 0;
    layer.placeholderLabel = layer.placeholderLabel || layer.label || 'Image';
  }

  function currentTemplate() {
    return TemplateRegistry.getById(currentTemplateId);
  }

  function createAddressLayer(profile = {}) {
    const defaults = getProfileBrandDefaults(profile);
    return {
      id: 'address',
      label: 'Address',
      type: 'text',
      role: 'address',
      text: profile.address || '',
      prefix: 'Address: ',
      x: 0.5,
      y: 0.982,
      maxWidth: 0.86,
      fontSize: 18,
      weight: '400',
      fontFamily: '"Poppins", "Arial", sans-serif',
      color: defaults.textColor || 'rgba(255,255,255,0.5)',
      align: 'center',
      baseline: 'bottom',
      editable: true,
      hidden: !(defaults.show.address && profile.address)
    };
  }

  function profileHasBrandValue(id, profile, layer) {
    if (id === 'business_name' || id === 'logo') return true;
    const role = BRAND_FIELD_META[id]?.role;
    if (role && profile?.[role]) return true;
    return Boolean(layer && !layer.role && layer.text);
  }

  function ensureBrandState(profile = ProfileManager.getProfile() || {}) {
    if (!currentDesign) return null;

    if (!getLayerById('address')) {
      currentDesign.layers.push(createAddressLayer(profile));
    }

    BRAND_LAYER_IDS.forEach((id) => {
      const layer = getLayerById(id);
      if (!layer) return;
      const meta = BRAND_FIELD_META[id];
      layer.label = layer.label || meta.label;
      layer.brandLayer = true;
      if (layer.type === 'image') ensureImageDefaults(layer);
      if (layer.type === 'text') {
        layer.text = layer.text ?? '';
        if (!layer.role && !layer.userDetached) return;
      }
    });

    const previous = currentDesign.brand || {};
    const show = { ...(previous.show || {}) };

    BRAND_LAYER_IDS.forEach((id) => {
      const layer = getLayerById(id);
      if (!layer) return;
      if (typeof show[id] !== 'boolean') {
        show[id] = profileHasBrandValue(id, profile, layer) && !layer.hidden;
      }
    });

    if (typeof show.logo !== 'boolean') show.logo = true;
    if (typeof show.business_name !== 'boolean') show.business_name = true;

    currentDesign.brand = {
      presetId: BRAND_PRESET_IDS.includes(previous.presetId) ? previous.presetId : 'bottom_bar',
      show
    };

    syncBrandLayerVisibility();
    return currentDesign.brand;
  }

  function visibleBrandLayerCount() {
    return BRAND_LAYER_IDS.reduce((count, id) => {
      const layer = getLayerById(id);
      return count + (layer && !layer.hidden ? 1 : 0);
    }, 0);
  }

  function syncBrandBannerVisibility() {
    const banner = getLayerById('business_banner');
    if (!banner || !currentDesign?.brand) return;
    banner.hidden = currentDesign.brand.presetId === 'clean' || visibleBrandLayerCount() === 0;
  }

  function syncBrandLayerVisibility() {
    if (!currentDesign?.brand) return;
    BRAND_LAYER_IDS.forEach((id) => {
      const layer = getLayerById(id);
      if (layer) layer.hidden = currentDesign.brand.show?.[id] === false;
    });
    syncBrandBannerVisibility();
  }

  function getProfileBrandDefaults(profile = ProfileManager.getProfile() || {}) {
    return ProfileManager.normalizeBrandDefaults(profile.brandDefaults);
  }

  function canShowProfileBrandField(id, profile = {}) {
    if (id === 'logo' || id === 'business_name') return true;
    const role = BRAND_FIELD_META[id]?.role;
    return Boolean(role && profile?.[role]);
  }

  function firstVisibleEditableLayerId() {
    const brandLayer = BRAND_LAYER_IDS
      .map(id => getLayerById(id))
      .find(layer => layer?.editable && !layer.hidden);
    return brandLayer?.id || getEditableLayers()[0]?.id || null;
  }

  function applyProfileBrandDefaultsToCurrentDesign(render = true, notify = false) {
    if (!currentDesign) return;

    const profile = ProfileManager.getProfile() || {};
    const defaults = getProfileBrandDefaults(profile);
    const brand = ensureBrandState(profile);
    if (!brand) return;

    brand.presetId = defaults.presetId;
    BRAND_LAYER_IDS.forEach((id) => {
      brand.show[id] = Boolean(defaults.show?.[id]) && canShowProfileBrandField(id, profile);
      const layer = getLayerById(id);
      if (!layer) return;

      if (layer.type === 'text') {
        layer.color = defaults.textColor;
        if (layer.role) {
          const meta = BRAND_FIELD_META[id];
          layer.prefix = meta?.prefix || '';
          layer.text = profile[layer.role] || '';
        }
      }

      if (layer.type === 'image') {
        ensureImageDefaults(layer);
        layer.mask = defaults.logoShape;
        layer.shape = defaults.logoShape;
      }
    });

    syncBrandLayerVisibility();
    selectedLayerId = firstVisibleEditableLayerId();
    applyBrandPreset(defaults.presetId, render);

    if (notify) {
      showToast('Profile brand applied', 'success');
    }
  }

  function setLayerPosition(id, props) {
    const layer = getLayerById(id);
    if (!layer) return;
    Object.assign(layer, props);
  }

  function applyBrandPreset(presetId, render = true) {
    const profile = ProfileManager.getProfile() || {};
    const brand = ensureBrandState(profile);
    if (!brand) return;

    brand.presetId = BRAND_PRESET_IDS.includes(presetId) ? presetId : 'bottom_bar';

    const commonText = {
      business_name: { fontSize: 40, maxWidth: 0.72, align: 'left', baseline: 'middle' },
      phone: { fontSize: 30, maxWidth: 0.64, align: 'left', baseline: 'middle' },
      tagline: { fontSize: 22, maxWidth: 0.64, align: 'left', baseline: 'middle' },
      address: { fontSize: 17, maxWidth: 0.86, align: 'center', baseline: 'bottom' }
    };

    if (brand.presetId === 'bottom_bar') {
      setLayerPosition('business_banner', { x: 0, y: 0.765, width: 1, height: 0.235 });
      setLayerPosition('logo', { x: 0.06, y: 0.815, width: 0.115, height: 0.115 });
      setLayerPosition('business_name', { ...commonText.business_name, x: 0.205, y: 0.852, fontSize: 42 });
      setLayerPosition('phone', { ...commonText.phone, x: 0.205, y: 0.912, fontSize: 34 });
      setLayerPosition('tagline', { ...commonText.tagline, x: 0.205, y: 0.956, fontSize: 24 });
      setLayerPosition('address', { ...commonText.address, x: 0.5, y: 0.985 });
    }

    if (brand.presetId === 'top_bar') {
      setLayerPosition('business_banner', { x: 0, y: 0, width: 1, height: 0.235 });
      setLayerPosition('logo', { x: 0.06, y: 0.055, width: 0.115, height: 0.115 });
      setLayerPosition('business_name', { ...commonText.business_name, x: 0.205, y: 0.09, fontSize: 40 });
      setLayerPosition('phone', { ...commonText.phone, x: 0.205, y: 0.15, fontSize: 30 });
      setLayerPosition('tagline', { ...commonText.tagline, x: 0.205, y: 0.195, fontSize: 22 });
      setLayerPosition('address', { ...commonText.address, x: 0.5, y: 0.224 });
    }

    if (brand.presetId === 'left_stack') {
      setLayerPosition('business_banner', { x: 0, y: 0, width: 0.39, height: 1 });
      setLayerPosition('logo', { x: 0.105, y: 0.09, width: 0.18, height: 0.18 });
      setLayerPosition('business_name', { ...commonText.business_name, x: 0.195, y: 0.33, maxWidth: 0.33, fontSize: 38, align: 'center' });
      setLayerPosition('phone', { ...commonText.phone, x: 0.195, y: 0.425, maxWidth: 0.32, fontSize: 25, align: 'center' });
      setLayerPosition('tagline', { ...commonText.tagline, x: 0.195, y: 0.505, maxWidth: 0.32, fontSize: 20, align: 'center' });
      setLayerPosition('address', { ...commonText.address, x: 0.195, y: 0.94, maxWidth: 0.32 });
    }

    if (brand.presetId === 'right_stack') {
      setLayerPosition('business_banner', { x: 0.61, y: 0, width: 0.39, height: 1 });
      setLayerPosition('logo', { x: 0.715, y: 0.09, width: 0.18, height: 0.18 });
      setLayerPosition('business_name', { ...commonText.business_name, x: 0.805, y: 0.33, maxWidth: 0.33, fontSize: 38, align: 'center' });
      setLayerPosition('phone', { ...commonText.phone, x: 0.805, y: 0.425, maxWidth: 0.32, fontSize: 25, align: 'center' });
      setLayerPosition('tagline', { ...commonText.tagline, x: 0.805, y: 0.505, maxWidth: 0.32, fontSize: 20, align: 'center' });
      setLayerPosition('address', { ...commonText.address, x: 0.805, y: 0.94, maxWidth: 0.32 });
    }

    if (brand.presetId === 'corner_logo') {
      setLayerPosition('business_banner', { x: 0.045, y: 0.045, width: 0.49, height: 0.19 });
      setLayerPosition('logo', { x: 0.07, y: 0.07, width: 0.105, height: 0.105 });
      setLayerPosition('business_name', { ...commonText.business_name, x: 0.2, y: 0.105, maxWidth: 0.31, fontSize: 29 });
      setLayerPosition('phone', { ...commonText.phone, x: 0.2, y: 0.154, maxWidth: 0.3, fontSize: 19 });
      setLayerPosition('tagline', { ...commonText.tagline, x: 0.2, y: 0.194, maxWidth: 0.3, fontSize: 16 });
      setLayerPosition('address', { ...commonText.address, x: 0.5, y: 0.985 });
    }

    if (brand.presetId === 'clean') {
      setLayerPosition('business_banner', { hidden: true });
      setLayerPosition('logo', { x: 0.06, y: 0.06, width: 0.1, height: 0.1 });
      setLayerPosition('business_name', { ...commonText.business_name, x: 0.5, y: 0.885, maxWidth: 0.82, fontSize: 38, align: 'center' });
      setLayerPosition('phone', { ...commonText.phone, x: 0.5, y: 0.935, maxWidth: 0.74, fontSize: 25, align: 'center' });
      setLayerPosition('tagline', { ...commonText.tagline, x: 0.5, y: 0.972, maxWidth: 0.72, fontSize: 20, align: 'center' });
      setLayerPosition('address', { ...commonText.address, x: 0.5, y: 0.992, maxWidth: 0.82, fontSize: 15 });
    }

    syncBrandLayerVisibility();
    markDesignChanged(render);
  }

  function brandLayerValueLabel(id, profile, layer) {
    if (id === 'logo') return profile?.logoDataURL ? 'Uploaded' : 'Initials';
    const text = layerDisplayText(layer).trim();
    if (text) return text.length > 28 ? `${text.slice(0, 27)}...` : text;
    return 'Hidden';
  }

  function syncBrandControls() {
    if (!currentDesign) return;
    const profile = ProfileManager.getProfile() || {};
    const brand = ensureBrandState(profile);
    if (!brand) return;

    document.querySelectorAll('[data-brand-preset]').forEach((button) => {
      button.classList.toggle('active', button.dataset.brandPreset === brand.presetId);
    });

    const presetSelect = document.getElementById('selectBrandPreset');
    if (presetSelect && presetSelect.value !== brand.presetId) {
      presetSelect.value = brand.presetId;
    }

    const summary = document.getElementById('profileBrandSummary');
    if (summary) {
      const visibleLabels = BRAND_LAYER_IDS
        .filter((id) => id !== 'logo')
        .map((id) => {
        const layer = getLayerById(id);
        if (!layer) return '';
        const shown = brand.show?.[id] !== false && !layer.hidden;
        if (!shown) return '';
        const label = BRAND_FIELD_META[id].label;
        return `
          <span class="profile-brand-state-chip active">
            ${escapeHtml(label)}
          </span>
        `;
      }).filter(Boolean);

      summary.innerHTML = visibleLabels.length
        ? visibleLabels.join('')
        : '<span class="profile-brand-state-chip muted">No brand text shown</span>';
    }

    let layer = getSelectedLayer();
    if (!isBrandLayer(layer)) {
      layer = getLayerById('business_name') || getLayerById('logo');
    }
    if (!layer) return;

    const selectedName = document.getElementById('brandSelectedName');
    const colorInput = document.getElementById('inputBrandColor');
    const shapeInput = document.getElementById('selectBrandLogoShape');
    const colorControl = document.getElementById('brandColorControl');
    const shapeControl = document.getElementById('brandLogoShapeControl');
    const resetButton = document.getElementById('btnResetBrandText');

    if (selectedName) selectedName.textContent = BRAND_FIELD_META[layer.id]?.label || layer.label || 'Brand';
    if (colorInput) colorInput.value = colorToHex(layer.color);
    if (shapeInput && layer.type === 'image') shapeInput.value = layer.mask || layer.shape || 'circle';

    if (colorControl) colorControl.style.display = layer.type === 'text' ? 'flex' : 'none';
    if (shapeControl) shapeControl.style.display = layer.type === 'image' ? 'flex' : 'none';
    if (resetButton) resetButton.disabled = layer.type !== 'text';

    syncCanvasSelectionOverlay();
  }

  function ensureDesignAnimation() {
    const template = currentTemplate();
    if (!template?.isVideoInvite || !currentDesign) return null;
    currentDesign.animation = {
      preset: currentDesign.animation?.preset || template.animationPreset || 'cinematic',
      intensity: Number(currentDesign.animation?.intensity ?? template.animationIntensity ?? 1),
      speed: Number(currentDesign.animation?.speed ?? template.animationSpeed ?? 1)
    };
    return currentDesign.animation;
  }

  function stopVideoPreview() {
    videoPreviewToken += 1;
    if (videoPreviewFrameId) {
      cancelAnimationFrame(videoPreviewFrameId);
      videoPreviewFrameId = null;
    }
  }

  function formatPresetLabel(preset) {
    return (preset || 'cinematic')
      .replace(/3d$/i, ' 3D')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  function refreshVideoPreview() {
    const template = currentTemplate();
    const card = document.getElementById('videoPreviewCard');
    if (!card) return;

    if (!template?.isVideoInvite || !currentDesign) {
      stopVideoPreview();
      card.style.display = 'none';
      return;
    }

    const sourceCanvas = document.getElementById('posterCanvas');
    const previewCanvas = document.getElementById('videoPreviewCanvas');
    const previewCtx = previewCanvas?.getContext('2d');
    if (!sourceCanvas || !previewCanvas || !previewCtx) return;

    const animation = ensureDesignAnimation();
    const presetLabel = document.getElementById('videoPreviewPreset');
    if (presetLabel) presetLabel.textContent = formatPresetLabel(animation?.preset || template.animationPreset);

    card.style.display = 'block';
    stopVideoPreview();
    const token = ++videoPreviewToken;
    const baseImage = new Image();

    baseImage.onload = () => {
      if (token !== videoPreviewToken) return;
      const start = performance.now();

      function drawFrame(timestamp) {
        if (token !== videoPreviewToken) return;
        const progress = ((timestamp - start) % 6000) / 6000;
        CanvasEngine.drawAnimatedFrame(previewCtx, baseImage, progress, animation || {});
        videoPreviewFrameId = requestAnimationFrame(drawFrame);
      }

      drawFrame(performance.now());
    };

    baseImage.src = sourceCanvas.toDataURL('image/png');
  }

  function layerDisplayText(layer) {
    const profile = ProfileManager.getProfile() || {};
    if (layer.role) {
      return profile[layer.role] ? `${layer.prefix || ''}${profile[layer.role]}` : '';
    }
    return `${layer.prefix || ''}${layer.text || ''}`;
  }

  function colorToHex(color) {
    if (!color) return '#ffffff';
    if (color.startsWith('#')) {
      if (color.length === 4) {
        return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
      }
      return color.slice(0, 7);
    }

    const match = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return '#ffffff';
    return `#${[match[1], match[2], match[3]]
      .map(value => Number(value).toString(16).padStart(2, '0'))
      .join('')}`;
  }

  function quickChip(label, attrs = {}, classes = []) {
    const className = ['quick-chip', ...classes.filter(Boolean)].join(' ');
    const attrText = Object.entries(attrs)
      .filter(([, value]) => value !== null && value !== undefined && value !== false)
      .map(([name, value]) => value === true ? name : `${name}="${escapeHtml(value)}"`)
      .join(' ');
    return `<button class="${className}" type="button" ${attrText}>${escapeHtml(label)}</button>`;
  }

  function renderLayerPills() {
    const container = document.getElementById('layerPills');
    if (!container || !currentDesign) return;

    const layers = getAllEditableLayers();
    if (!layers.length) {
      container.innerHTML = '<div class="text-secondary text-center" style="padding: 10px;">No layers available</div>';
      return;
    }

    container.innerHTML = `<div class="layer-list-container" style="display: flex; flex-direction: column; gap: var(--space-xs); width: 100%;">` +
      layers.slice().reverse().map(layer => {
        const isSelected = layer.id === selectedLayerId;
        const icon = layer.type === 'image'
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
          : layer.type === 'sticker'
            ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M12 2l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 16.82 6.2 19.87l1.11-6.47-4.7-4.58 6.49-.94L12 2z"/></svg>`
            : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`;

        const label = BRAND_FIELD_META[layer.id]?.label || layer.label || layer.id || 'Layer';
        const typeLabel = layer.hidden ? 'Hidden' : layer.type === 'image' ? 'Image' : layer.type === 'sticker' ? 'Sticker' : layer.type === 'text' ? 'Text' : 'Layer';

        return `
          <div class="layer-list-item ${isSelected ? 'active' : ''} ${layer.hidden ? 'is-hidden' : ''}" data-layer-id="${escapeHtml(layer.id)}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: ${isSelected ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${isSelected ? 'transparent' : 'var(--border-subtle)'}; border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-fast); opacity: ${layer.hidden && !isSelected ? '0.58' : '1'};">
            <div style="display: flex; align-items: center; gap: var(--space-sm); color: ${isSelected ? 'var(--text-on-gradient)' : 'var(--text-primary)'}; font-family: var(--font-heading); font-size: var(--fs-sm); font-weight: 600;">
              ${icon}
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${escapeHtml(label)}</span>
            </div>
            <span style="font-size: var(--fs-xs); color: ${isSelected ? 'var(--text-on-gradient)' : 'var(--text-tertiary)'}; font-weight: 500; opacity: 0.85;">${escapeHtml(typeLabel)}</span>
          </div>
        `;
      }).join('') + `</div>`;
  }

  function setControlDisplay(id, visible) {
    const el = document.getElementById(id);
    if (el) el.style.display = visible ? 'flex' : 'none';
  }

  function preferredTabForLayer(layer) {
    if (!layer) return 'layers';
    if (layer.type === 'text') return 'text';
    if (isBrandLayer(layer)) return 'brand';
    if (layer.type === 'sticker') return 'stickers';
    if (layer.type === 'image') return 'photo';
    return 'layers';
  }

  function normalizeAdjustments(source = {}) {
    return ADJUSTMENT_CONTROLS.reduce((next, control) => {
      next[control.key] = Number(source[control.key] || 0);
      return next;
    }, {});
  }

  function photoEditTarget(create = true) {
    const selected = getSelectedLayer();
    if (selected?.type === 'image') {
      ensureImageDefaults(selected);
      selected.adjustments = normalizeAdjustments(selected.adjustments);
      selected.filterPreset = selected.filterPreset || 'original';
      return selected;
    }

    if (!currentDesign) return null;
    if (create && !currentDesign.photoStyle) currentDesign.photoStyle = {};
    const target = currentDesign.photoStyle || {};
    target.adjustments = normalizeAdjustments(target.adjustments);
    target.filterPreset = target.filterPreset || 'original';
    if (create) currentDesign.photoStyle = target;
    return target;
  }

  function rotationEditTarget(create = true) {
    const selected = getSelectedLayer();
    if (selected?.type === 'image') {
      ensureImageDefaults(selected);
      return selected;
    }

    if (!currentDesign || !currentTemplate()?.path) return null;
    if (create && !currentDesign.photoStyle) currentDesign.photoStyle = {};
    return currentDesign.photoStyle || null;
  }

  function renderOptionRail(container, items, activeValue, attrName, disabled = false) {
    if (!container) return;
    container.innerHTML = items.map((item) => quickChip(item.label, {
      [`data-${attrName}`]: item.value ?? item.action ?? item.label,
      'data-index': item.index,
      disabled
    }, [
      item.value === activeValue || item.action === activeValue || item.active ? 'active' : '',
      disabled ? 'muted' : ''
    ])).join('');
  }

  function wheelSnapValue(value, config = ROTATION_WHEEL) {
    const step = config.step || 1;
    const snapped = Math.round(Number(value || 0) / step) * step;
    return clampUnit(snapped, config.min, config.max);
  }

  function triggerLightHaptic(value = null) {
    const now = performance.now();
    if (value !== null && value === lastWheelHapticValue) return;
    if (now - lastWheelHapticAt < 34) return;

    lastWheelHapticAt = now;
    lastWheelHapticValue = value;

    try {
      const haptics = window.Capacitor?.Plugins?.Haptics;
      if (haptics?.impact) {
        haptics.impact({ style: 'LIGHT' }).catch?.(() => {});
        return;
      }
    } catch {}

    const activation = navigator.userActivation;
    const canUseVibrate = !activation || activation.isActive || activation.hasBeenActive;
    if (navigator.vibrate && canUseVibrate) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  }

  function renderWheelPicker(container, config = ROTATION_WHEEL) {
    if (!container || container.dataset.wheelRendered === 'true') return;

    const ticks = [];
    for (let value = config.min; value <= config.max; value += config.step) {
      const snapped = wheelSnapValue(value, config);
      const isMajor = snapped % config.majorEvery === 0;
      ticks.push(`
        <span class="wheel-tick ${isMajor ? 'major' : ''} ${snapped === 0 ? 'zero' : ''}"
          data-wheel-value="${snapped}"
          aria-hidden="true">
          ${isMajor ? `<span class="wheel-tick-label">${snapped}</span>` : ''}
        </span>
      `);
    }

    container.innerHTML = `<div class="wheel-track">${ticks.join('')}</div>`;
    container.dataset.wheelRendered = 'true';
    container.tabIndex = 0;
    container.setAttribute('role', 'slider');
    container.setAttribute('aria-valuemin', String(config.min));
    container.setAttribute('aria-valuemax', String(config.max));
    container.setAttribute('aria-valuenow', '0');
    container.setAttribute('aria-valuetext', '0 degrees');
  }

  function closestWheelValue(container) {
    const ticks = Array.from(container?.querySelectorAll('[data-wheel-value]') || []);
    if (!container || !ticks.length || !container.clientWidth) return 0;

    const center = container.scrollLeft + container.clientWidth / 2;
    let closest = ticks[0];
    let closestDistance = Infinity;

    ticks.forEach((tick) => {
      const tickCenter = tick.offsetLeft + tick.offsetWidth / 2;
      const distance = Math.abs(tickCenter - center);
      if (distance < closestDistance) {
        closest = tick;
        closestDistance = distance;
      }
    });

    return Number(closest.dataset.wheelValue || 0);
  }

  function setWheelPickerValue(container, value, options = {}) {
    if (!container) return;
    const config = container._wheelConfig || ROTATION_WHEEL;
    const next = wheelSnapValue(value, config);
    const tick = container.querySelector(`[data-wheel-value="${next}"]`);
    if (!tick) return;
    if (!container.clientWidth) {
      container.setAttribute('aria-valuenow', String(next));
      container.setAttribute('aria-valuetext', `${next} degrees`);
      return;
    }

    const state = container._wheelState || {};
    if (options.silent !== false) {
      state.programmatic = true;
      window.clearTimeout(state.programmaticTimer);
      state.programmaticTimer = window.setTimeout(() => {
        state.programmatic = false;
      }, options.smooth ? 420 : 80);
    }
    container._wheelState = state;

    const left = tick.offsetLeft + tick.offsetWidth / 2 - container.clientWidth / 2;
    container.scrollTo({
      left: Math.max(0, left),
      behavior: options.smooth ? 'smooth' : 'auto'
    });
    container.setAttribute('aria-valuenow', String(next));
    container.setAttribute('aria-valuetext', `${next} degrees`);
  }

  function commitWheelValue(container, value, onCommit) {
    const next = wheelSnapValue(value, container._wheelConfig || ROTATION_WHEEL);
    const state = container._wheelState || {};
    state.value = next;
    container._wheelState = state;
    setWheelPickerValue(container, next, { smooth: true, silent: false });
    if (onCommit) onCommit(next);
    state.userActive = false;
    state.historyCaptured = false;
    container._wheelState = state;
  }

  function bindWheelPicker(container, onChange, onCommit, config = ROTATION_WHEEL) {
    if (!container || container.dataset.wheelBound === 'true') return;

    container._wheelConfig = config;
    container._wheelState = {
      value: 0,
      userActive: false,
      historyCaptured: false,
      programmatic: false,
      commitTimer: null,
      programmaticTimer: null
    };

    const markUserActive = () => {
      const state = container._wheelState;
      state.userActive = true;
      state.programmatic = false;
      window.clearTimeout(state.programmaticTimer);
      container._wheelState = state;
    };

    const handleScroll = () => {
      const state = container._wheelState || {};
      const value = closestWheelValue(container);
      container.setAttribute('aria-valuenow', String(value));
      container.setAttribute('aria-valuetext', `${value} degrees`);

      if (state.value !== value) {
        state.value = value;
        if (state.userActive && !state.programmatic) {
          triggerLightHaptic(value);
          onChange?.(value, state);
        }
      }

      if (state.userActive && !state.programmatic) {
        window.clearTimeout(state.commitTimer);
        state.commitTimer = window.setTimeout(() => {
          commitWheelValue(container, value, onCommit);
        }, 130);
      }

      container._wheelState = state;
    };

    container.addEventListener('pointerdown', markUserActive);
    container.addEventListener('touchstart', markUserActive, { passive: true });
    container.addEventListener('wheel', markUserActive, { passive: true });
    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('keydown', (event) => {
      const keyMap = {
        ArrowLeft: -1,
        ArrowDown: -1,
        ArrowRight: 1,
        ArrowUp: 1,
        PageDown: -5,
        PageUp: 5
      };
      if (!(event.key in keyMap)) return;
      event.preventDefault();
      markUserActive();
      const state = container._wheelState || {};
      const current = Number.isFinite(state.value) ? state.value : closestWheelValue(container);
      const next = wheelSnapValue(current + keyMap[event.key], config);
      state.value = next;
      state.userActive = true;
      state.programmatic = false;
      container._wheelState = state;
      setWheelPickerValue(container, next, { smooth: true, silent: false });
      triggerLightHaptic(next);
      onChange?.(next, state);
      commitWheelValue(container, next, onCommit);
    });

    container.dataset.wheelBound = 'true';
  }

  function syncRotationWheel() {
    const container = document.getElementById('rotationWheel');
    const valueOutput = document.getElementById('rotationWheelValue');
    const resetButton = document.getElementById('btnResetRotation');
    if (!container) return;

    renderWheelPicker(container, ROTATION_WHEEL);
    bindWheelPicker(container, handleRotationWheelChange, handleRotationWheelCommit, ROTATION_WHEEL);

    const target = rotationEditTarget(false);
    const canRotate = Boolean(target);
    const value = canRotate ? wheelSnapValue(target.rotation || 0, ROTATION_WHEEL) : 0;
    const state = container._wheelState || {};

    container.classList.toggle('disabled', !canRotate);
    container.setAttribute('aria-disabled', canRotate ? 'false' : 'true');
    if (resetButton) resetButton.disabled = !canRotate || value === 0;
    if (valueOutput) {
      valueOutput.value = `${value}°`;
      valueOutput.textContent = `${value}°`;
    }

    if (!state.userActive) {
      requestAnimationFrame(() => setWheelPickerValue(container, value, { silent: true }));
    }
  }

  function syncTextToolControls() {
    const layer = getSelectedLayer();
    const isText = layer?.type === 'text';
    const fontRail = document.getElementById('textFontRail');
    const styleRail = document.getElementById('textStyleRail');
    const colorRail = document.getElementById('textColorRail');

    if (fontRail) {
      fontRail.innerHTML = TEXT_FONT_PRESETS.map((preset, index) => quickChip(preset.label, {
        'data-text-font': String(index),
        disabled: !isText
      }, [
        isText && layer.fontFamily === preset.family && String(layer.weight || '') === String(preset.weight) ? 'active' : '',
        !isText ? 'muted' : ''
      ])).join('');
    }

    if (styleRail) {
      styleRail.innerHTML = TEXT_STYLE_ACTIONS.map((item) => quickChip(item.label, {
        'data-text-style': item.action,
        'data-text-value': item.value,
        disabled: !isText
      }, [
        isText && (
          (item.action === 'background' && layer.textBackground) ||
          (item.action === 'shadow' && Number(layer.shadowBlur || 0) > 0) ||
          (item.action === 'outline' && Number(layer.outlineWidth || 0) > 0) ||
          (item.action === 'align' && layer.align === item.value)
        ) ? 'active' : '',
        !isText ? 'muted' : ''
      ])).join('');
    }

    if (colorRail) {
      colorRail.innerHTML = QUICK_TEXT_COLORS.map((color) => quickChip(color.label, {
        'data-text-color': color.value,
        style: `--quick-swatch:${color.value}`,
        disabled: !isText
      }, [
        'swatch',
        isText && colorToHex(layer.color).toLowerCase() === color.value.toLowerCase() ? 'active' : '',
        !isText ? 'muted' : ''
      ])).join('');
    }
  }

  function hasAIText() {
    return typeof AIText !== 'undefined' &&
      AIText &&
      typeof AIText.generateSuggestions === 'function';
  }

  function createSuggestedTextLayer() {
    if (!currentDesign) return null;

    const layer = {
      id: newLayerId('ai_text'),
      label: 'Suggested Text',
      type: 'text',
      text: '',
      x: 0.5,
      y: 0.34,
      maxWidth: 0.78,
      fontSize: 44,
      weight: '800',
      fontFamily: '"Outfit", "Arial", sans-serif',
      color: '#FFFFFF',
      align: 'center',
      baseline: 'middle',
      shadowBlur: 12,
      editable: true,
      userAdded: true
    };

    currentDesign.layers.push(layer);
    selectedLayerId = layer.id;
    return layer;
  }

  function aiTextTarget(create = false) {
    const selected = getSelectedLayer();
    if (selected?.type === 'text') return selected;

    const textLayers = getEditableLayers().filter(layer => layer.type === 'text');
    const preferred = textLayers.find(layer => !isBrandLayer(layer)) || textLayers[0] || null;
    if (preferred) {
      if (create) selectedLayerId = preferred.id;
      return preferred;
    }

    return create ? createSuggestedTextLayer() : null;
  }

  function renderAITextSuggestions(items = aiTextSuggestions) {
    const container = document.getElementById('aiTextSuggestions');
    if (!container) return;

    aiTextSuggestions = Array.isArray(items) ? items : [];
    container.innerHTML = aiTextSuggestions.map((item, index) => `
      <button class="ai-text-suggestion" type="button" data-ai-text-index="${index}">
        <small>${escapeHtml(item.label || 'Text')}</small>
        <span>${escapeHtml(item.text || '')}</span>
      </button>
    `).join('');
  }

  function syncAITextControls() {
    const button = document.getElementById('btnGenerateTextSuggestions');
    const panel = document.getElementById('aiTextPanel');
    const available = Boolean(currentDesign && hasAIText());

    if (button) button.disabled = !available;
    if (panel) panel.classList.toggle('muted', !available);
    if (!available) renderAITextSuggestions([]);
  }

  function handleGenerateTextSuggestions() {
    if (!currentDesign || !hasAIText()) {
      showToast('Text suggestions are unavailable', 'error');
      return;
    }

    const suggestions = AIText.generateSuggestions({
      template: currentTemplate(),
      profile: ProfileManager.getProfile() || {},
      design: currentDesign,
      selectedLayer: getSelectedLayer()
    });

    renderAITextSuggestions(suggestions);
    if (!suggestions.length) {
      showToast('No text suggestions available for this card', 'info');
    }
  }

  function handleAITextSuggestionClick(e) {
    const button = e.target.closest('[data-ai-text-index]');
    if (!button || !currentDesign) return;

    const suggestion = aiTextSuggestions[Number(button.dataset.aiTextIndex)];
    if (!suggestion?.text) return;

    pushEditorHistory();
    const layer = aiTextTarget(true);
    if (!layer) {
      showToast('Add a text layer first', 'info');
      return;
    }

    layer.text = suggestion.text;
    layer.role = null;
    layer.prefix = '';
    layer.userDetached = true;
    selectedLayerId = layer.id;
    setEditorTab('text');
    renderAITextSuggestions(aiTextSuggestions);
    markDesignChanged();
  }

  function hasStickerLibrary() {
    return typeof StickerLibrary !== 'undefined' &&
      StickerLibrary &&
      typeof StickerLibrary.search === 'function' &&
      typeof StickerLibrary.createLayer === 'function';
  }

  function stickerSvgDataUrl(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg || '')}`;
  }

  function stickerPreviewMarkup(sticker) {
    if (!sticker) return '';
    if (sticker.kind === 'emoji') {
      return `<span class="sticker-preview-emoji" aria-hidden="true">${escapeHtml(sticker.glyph || '')}</span>`;
    }

    if (sticker.svg) {
      return `<img class="sticker-preview-img" src="${escapeHtml(stickerSvgDataUrl(sticker.svg))}" alt="" loading="lazy">`;
    }

    return `<span class="sticker-preview-emoji" aria-hidden="true">+</span>`;
  }

  function renderStickerPickerCategories() {
    const tabs = document.getElementById('stickerCategoryTabs');
    if (!tabs || !hasStickerLibrary()) return;

    tabs.innerHTML = StickerLibrary.getCategories().map((category) => {
      const count = StickerLibrary.search({ category: category.id, query: stickerSearchQuery }).length;
      return `
        <button class="sticker-category-tab ${category.id === currentStickerCategory ? 'active' : ''}"
          type="button"
          data-sticker-category="${escapeHtml(category.id)}">
          ${escapeHtml(category.label)}
          <span>${escapeHtml(formatCount(count))}</span>
        </button>
      `;
    }).join('');
  }

  function renderStickerPickerGrid() {
    const grid = document.getElementById('stickerGrid');
    if (!grid) return;

    if (!hasStickerLibrary()) {
      grid.innerHTML = '<div class="sticker-empty-state">Sticker library could not load.</div>';
      return;
    }

    const items = StickerLibrary.search({
      category: currentStickerCategory,
      query: stickerSearchQuery
    });

    if (!items.length) {
      grid.innerHTML = '<div class="sticker-empty-state">No stickers matched your search.</div>';
      return;
    }

    grid.innerHTML = items.map((sticker) => `
      <button class="sticker-grid-item"
        type="button"
        data-sticker-id="${escapeHtml(sticker.id)}"
        aria-label="Add ${escapeHtml(sticker.label)} sticker">
        <span class="sticker-preview-box">${stickerPreviewMarkup(sticker)}</span>
        <span class="sticker-grid-label">${escapeHtml(sticker.label)}</span>
      </button>
    `).join('');
  }

  function syncStickerPicker() {
    renderStickerPickerCategories();
    renderStickerPickerGrid();
  }

  function showStickerPicker() {
    const overlay = document.getElementById('stickerPickerOverlay');
    const search = document.getElementById('stickerPickerSearch');
    if (!overlay) return;

    currentStickerCategory = currentStickerCategory || 'featured';
    stickerSearchQuery = search?.value.trim() || '';
    syncStickerPicker();
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    setTimeout(() => search?.focus(), 80);
  }

  function hideStickerPicker() {
    const overlay = document.getElementById('stickerPickerOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function handleStickerCategoryClick(e) {
    const button = e.target.closest('[data-sticker-category]');
    if (!button) return;
    currentStickerCategory = button.dataset.stickerCategory || 'featured';
    syncStickerPicker();
  }

  function handleStickerPickerSearch(e) {
    stickerSearchQuery = e.target.value.trim();
    syncStickerPicker();
  }

  function addStickerToPoster(stickerId) {
    if (!currentDesign || !hasStickerLibrary()) return false;
    const stickerCount = (currentDesign.layers || []).filter(layer => layer.type === 'sticker').length;
    const offset = Math.min(0.1, stickerCount * 0.025);
    const layer = StickerLibrary.createLayer(stickerId, {
      id: newLayerId('sticker'),
      x: 0.38 + offset,
      y: 0.38 + offset
    });
    if (!layer) return false;

    pushEditorHistory();
    currentDesign.layers.push(layer);
    selectedLayerId = layer.id;
    setEditorTab('stickers');
    revealEditorSheet();
    markDesignChanged();
    showToast(`${layer.label} sticker added`, 'success');
    return true;
  }

  function handleStickerGridClick(e) {
    const button = e.target.closest('[data-sticker-id]');
    if (!button) return;
    if (addStickerToPoster(button.dataset.stickerId)) {
      hideStickerPicker();
    }
  }

  function handleStickerGridKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const button = e.target.closest('[data-sticker-id]');
    if (!button) return;
    e.preventDefault();
    if (addStickerToPoster(button.dataset.stickerId)) {
      hideStickerPicker();
    }
  }

  function syncStickerControls() {
    const rail = document.getElementById('stickerRail');
    if (!rail) return;

    if (!hasStickerLibrary()) {
      rail.innerHTML = '<div class="text-secondary text-center" style="padding: 10px;">Sticker library unavailable</div>';
      return;
    }

    rail.innerHTML = QUICK_STICKER_IDS
      .map(id => StickerLibrary.getById(id))
      .filter(Boolean)
      .map(sticker => `
        <button class="sticker-quick-card" type="button" data-sticker-id="${escapeHtml(sticker.id)}">
          <span class="sticker-preview-box">${stickerPreviewMarkup(sticker)}</span>
          <span>${escapeHtml(sticker.label)}</span>
        </button>
      `).join('');
  }

  function syncPhotoToolControls() {
    const selected = getSelectedLayer();
    const isImage = selected?.type === 'image';
    const target = photoEditTarget(false);
    const activeFilter = target?.filterPreset || 'original';
    const filterRail = document.getElementById('photoFilterRail');
    const adjustStack = document.getElementById('adjustControlStack');
    const cropFitRail = document.getElementById('cropFitRail');
    const cropMaskRail = document.getElementById('cropMaskRail');
    const spaceInput = document.getElementById('inputLayerSpace');
    const cropZoomInput = document.getElementById('inputLayerCropZoom');

    if (filterRail) {
      filterRail.innerHTML = PHOTO_FILTERS.map((filter) => quickChip(filter.label, {
        'data-photo-filter': filter.value
      }, [filter.value === activeFilter ? 'active' : ''])).join('');
    }

    if (adjustStack) {
      const adjustments = normalizeAdjustments(target?.adjustments);
      adjustStack.innerHTML = ADJUSTMENT_CONTROLS.map((control) => `
        <label class="range-control adjust-control">
          <span>${escapeHtml(control.label)}</span>
          <input type="range"
            data-adjust-key="${escapeHtml(control.key)}"
            min="${control.min}"
            max="${control.max}"
            step="1"
            value="${adjustments[control.key]}">
        </label>
      `).join('');
    }

    if (cropFitRail) {
      renderOptionRail(cropFitRail, CROP_FITS, selected?.fit || 'cover', 'crop-fit', !isImage);
    }

    if (cropMaskRail) {
      renderOptionRail(cropMaskRail, CROP_MASKS, selected?.mask || selected?.shape || 'rounded', 'crop-mask', !isImage);
    }

    if (spaceInput) {
      spaceInput.disabled = !isImage;
      spaceInput.value = isImage ? Math.round((selected.padding || 0) * 100) : 0;
    }

    if (cropZoomInput) {
      cropZoomInput.disabled = !isImage;
      cropZoomInput.value = isImage ? Math.round((selected.cropZoom || 1) * 100) : 100;
    }

    syncRotationWheel();
  }

  function syncLayerControls() {
    const layer = getSelectedLayer();
    const controls = document.getElementById('layerControls');
    const textControl = document.getElementById('layerTextControl');
    const imageControl = document.getElementById('layerImageControl');
    const colorControl = document.getElementById('inputLayerColor')?.closest('.color-control');
    const textInput = document.getElementById('inputLayerText');
    const imageInput = document.getElementById('inputLayerImage');
    const colorInput = document.getElementById('inputLayerColor');
    const fillButton = document.getElementById('btnFillSlot');
    const deleteButton = document.getElementById('btnDeleteLayer');

    const duplicateButton = document.getElementById('btnDuplicateLayer');
    const fontSizeControl = document.getElementById('layerFontSizeControl');
    const opacityControls = document.querySelectorAll('[data-layer-opacity-control]');
    const fontSizeInput = document.getElementById('inputLayerFontSize');
    const opacityInputs = document.querySelectorAll('[data-layer-opacity-input]');
    const moveUpButton = document.getElementById('btnMoveLayerUp');
    const moveDownButton = document.getElementById('btnMoveLayerDown');

    if (!layer) {
      if (controls) controls.hidden = false;
      if (textControl) textControl.style.display = 'none';
      if (imageControl) imageControl.style.display = 'none';
      if (colorControl) colorControl.style.display = 'none';
      if (fontSizeControl) fontSizeControl.style.display = 'none';
      opacityControls.forEach(control => { control.style.display = 'none'; });
      if (textInput) textInput.disabled = true;
      if (imageInput) imageInput.disabled = true;
      if (fillButton) fillButton.disabled = true;
      if (deleteButton) deleteButton.disabled = true;
      if (duplicateButton) duplicateButton.disabled = true;
      opacityInputs.forEach(input => { input.disabled = true; });
      if (moveUpButton) moveUpButton.disabled = true;
      if (moveDownButton) moveDownButton.disabled = true;
      syncTextToolControls();
      syncAITextControls();
      syncStickerControls();
      syncPhotoToolControls();
      return;
    }

    const isText = layer.type === 'text';
    const isImage = layer.type === 'image';
    const isSticker = layer.type === 'sticker';
    if (isImage) ensureImageDefaults(layer);

    if (controls) controls.hidden = false;
    if (textControl) textControl.style.display = isText ? 'block' : 'none';
    if (imageControl) imageControl.style.display = isImage ? 'block' : 'none';
    if (colorControl) colorControl.style.display = isText ? 'flex' : 'none';
    if (fontSizeControl) fontSizeControl.style.display = isText ? 'flex' : 'none';
    opacityControls.forEach(control => { control.style.display = 'flex'; });
    setControlDisplay('layerSpaceControl', isImage);
    setControlDisplay('layerCropZoomControl', isImage);

    if (textInput) textInput.disabled = !isText;
    if (imageInput) imageInput.disabled = !isImage;
    if (colorInput) colorInput.disabled = !isText;
    if (fillButton) fillButton.disabled = !isImage;
    if (deleteButton) deleteButton.disabled = !canDeleteLayer(layer);
    if (duplicateButton) duplicateButton.disabled = false;
    opacityInputs.forEach(input => { input.disabled = false; });

    const layers = currentDesign?.layers || [];
    const index = layers.findIndex(l => l.id === layer.id);
    if (moveUpButton) moveUpButton.disabled = index < 0 || index === layers.length - 1;
    if (moveDownButton) moveDownButton.disabled = index <= 0;

    if (isText) {
      if (textInput) textInput.value = layerDisplayText(layer);
      if (colorInput) colorInput.value = colorToHex(layer.color);
      if (fontSizeInput) fontSizeInput.value = layer.fontSize || 34;
    } else if (isImage || isSticker) {
      if (textInput) textInput.value = '';
    }

    opacityInputs.forEach((input) => {
      input.value = Math.round((layer.opacity !== undefined ? layer.opacity : 1) * 100);
    });

    syncTextToolControls();
    syncAITextControls();
    syncStickerControls();
    syncPhotoToolControls();
  }

  function syncAnimationControls() {
    const container = document.getElementById('animationControls');
    const template = currentTemplate();
    if (!container) return;

    if (!template?.isVideoInvite || !currentDesign) {
      container.hidden = true;
      container.style.display = 'none';
      syncEditorTabs();
      return;
    }

    const animation = ensureDesignAnimation();
    container.hidden = false;
    container.style.display = '';
    document.getElementById('selectAnimationPreset').value = animation.preset || 'cinematic';
    document.getElementById('inputAnimationIntensity').value = Math.round((animation.intensity || 1) * 100);
    document.getElementById('inputAnimationSpeed').value = Math.round((animation.speed || 1) * 100);
    syncEditorTabs();
  }

  function handleBrandPresetClick(e) {
    const button = e.target.closest('[data-brand-preset]');
    if (!button) return;
    pushEditorHistory();
    applyBrandPreset(button.dataset.brandPreset);
  }

  function handleBrandPresetChange(e) {
    pushEditorHistory();
    applyBrandPreset(e.target.value);
  }

  function handleBrandInput(e) {
    const layer = getSelectedLayer();
    if (!layer || !isBrandLayer(layer)) return;

    const value = e.target.value;
    pushEditorHistory(e.target.type === 'range' || e.target.type === 'color');
    if (e.target.id === 'inputBrandColor' && layer.type === 'text') {
      layer.color = value;
    }

    if (e.target.id === 'selectBrandLogoShape' && layer.type === 'image') {
      ensureImageDefaults(layer);
      layer.mask = value;
      layer.shape = value;
    }

    markDesignChanged();
  }

  function handleBrandResetText() {
    const layer = getSelectedLayer();
    if (!layer || layer.type !== 'text' || !isBrandLayer(layer)) return;

    const meta = BRAND_FIELD_META[layer.id];
    if (!meta?.role) return;

    const profile = ProfileManager.getProfile() || {};
    pushEditorHistory();
    layer.role = meta.role;
    layer.prefix = meta.prefix || '';
    layer.text = profile[meta.role] || '';
    layer.userDetached = false;

    if (currentDesign?.brand?.show && layer.id !== 'business_name' && !profile[meta.role]) {
      currentDesign.brand.show[layer.id] = false;
      layer.hidden = true;
    }

    markDesignChanged();
  }

  function handleTextFontClick(e) {
    const button = e.target.closest('[data-text-font]');
    const layer = getSelectedLayer();
    if (!button || !layer || layer.type !== 'text') return;

    const preset = TEXT_FONT_PRESETS[Number(button.dataset.textFont)];
    if (!preset) return;
    pushEditorHistory();
    layer.fontFamily = preset.family;
    layer.weight = preset.weight;
    markDesignChanged();
  }

  function handleTextStyleClick(e) {
    const button = e.target.closest('[data-text-style]');
    const layer = getSelectedLayer();
    if (!button || !layer || layer.type !== 'text') return;

    const action = button.dataset.textStyle;
    const value = button.dataset.textValue;
    pushEditorHistory();

    if (action === 'background') {
      layer.textBackground = layer.textBackground ? null : 'rgba(17, 24, 39, 0.74)';
      layer.textPadding = layer.textBackground ? 0.018 : 0;
    }

    if (action === 'shadow') {
      layer.shadowBlur = Number(layer.shadowBlur || 0) > 0 ? 0 : 12;
      layer.shadowColor = layer.shadowBlur ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)';
    }

    if (action === 'outline') {
      layer.outlineWidth = Number(layer.outlineWidth || 0) > 0 ? 0 : 5;
      layer.outlineColor = layer.outlineWidth ? 'rgba(0,0,0,0.62)' : null;
    }

    if (action === 'align' && value) {
      layer.align = value;
    }

    markDesignChanged();
  }

  function handleTextColorClick(e) {
    const button = e.target.closest('[data-text-color]');
    const layer = getSelectedLayer();
    if (!button || !layer || layer.type !== 'text') return;

    pushEditorHistory();
    layer.color = button.dataset.textColor;
    markDesignChanged();
  }

  function handleStickerClick(e) {
    const button = e.target.closest('[data-sticker-id]');
    if (!button) return;
    addStickerToPoster(button.dataset.stickerId);
  }

  function handlePhotoFilterClick(e) {
    const button = e.target.closest('[data-photo-filter]');
    if (!button || !currentDesign) return;

    const target = photoEditTarget(true);
    if (!target) return;
    pushEditorHistory();
    target.filterPreset = button.dataset.photoFilter || 'original';
    markDesignChanged();
  }

  function handleAdjustmentInput(e) {
    const input = e.target.closest('[data-adjust-key]');
    if (!input || !currentDesign) return;

    const target = photoEditTarget(true);
    if (!target) return;
    pushEditorHistory(true);
    target.adjustments = normalizeAdjustments(target.adjustments);
    target.adjustments[input.dataset.adjustKey] = Number(input.value || 0);
    markDesignChanged(false);
  }

  function handleCropFitClick(e) {
    const button = e.target.closest('[data-crop-fit]');
    const layer = getSelectedLayer();
    if (!button || !layer || layer.type !== 'image') return;

    pushEditorHistory();
    ensureImageDefaults(layer);
    layer.fit = button.dataset.cropFit;
    markDesignChanged();
  }

  function handleCropMaskClick(e) {
    const button = e.target.closest('[data-crop-mask]');
    const layer = getSelectedLayer();
    if (!button || !layer || layer.type !== 'image') return;

    pushEditorHistory();
    ensureImageDefaults(layer);
    layer.mask = button.dataset.cropMask;
    layer.shape = button.dataset.cropMask;
    markDesignChanged();
  }

  function handleRotationWheelChange(value, state = {}) {
    const target = rotationEditTarget(true);
    if (!target) return;

    if (!state.historyCaptured) {
      pushEditorHistory();
      state.historyCaptured = true;
    }

    target.rotation = wheelSnapValue(value, ROTATION_WHEEL);
    const output = document.getElementById('rotationWheelValue');
    if (output) {
      output.value = `${target.rotation}°`;
      output.textContent = `${target.rotation}°`;
    }
    const resetButton = document.getElementById('btnResetRotation');
    if (resetButton) resetButton.disabled = target.rotation === 0;

    markDesignChanged(false);
  }

  function handleRotationWheelCommit(value) {
    const target = rotationEditTarget(true);
    if (!target) return;

    target.rotation = wheelSnapValue(value, ROTATION_WHEEL);
    markDesignChanged();
  }

  function handleResetRotation() {
    const target = rotationEditTarget(true);
    if (!target) return;

    pushEditorHistory();
    target.rotation = 0;
    syncRotationWheel();
    markDesignChanged();
    triggerLightHaptic(0);
  }

  function clampUnit(value, min = 0, max = 1) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function getCanvasPointerPoint(e) {
    const canvas = document.getElementById('posterCanvas');
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
      x: clampUnit((e.clientX - rect.left) / rect.width),
      y: clampUnit((e.clientY - rect.top) / rect.height)
    };
  }

  function isPointInBounds(point, bounds, pad = 0.018) {
    if (!point || !bounds) return false;
    return point.x >= bounds.x - pad &&
      point.x <= bounds.x + bounds.width + pad &&
      point.y >= bounds.y - pad &&
      point.y <= bounds.y + bounds.height + pad;
  }

  function findEditableLayerAtPoint(point) {
    if (!currentDesign || !point || !CanvasEngine.getLayerBounds) return null;
    const profile = ProfileManager.getProfile() || {};
    const layers = (currentDesign.layers || [])
      .filter(layer => layer.editable && !layer.hidden)
      .slice()
      .reverse();

    for (const layer of layers) {
      const bounds = CanvasEngine.getLayerBounds(layer, profile);
      if (isPointInBounds(point, bounds)) return layer;
    }

    return null;
  }

  function moveLayerToPoint(layer, x, y) {
    if (!layer) return;
    if (layer.type === 'image' || layer.type === 'shape' || layer.type === 'sticker') {
      const profile = ProfileManager.getProfile() || {};
      const bounds = CanvasEngine.getLayerBounds?.(layer, profile);
      const maxX = Math.max(0, 1 - (bounds?.width || layer.width || 0.12));
      const maxY = Math.max(0, 1 - (bounds?.height || layer.height || layer.width || 0.12));
      layer.x = clampUnit(x, 0, maxX);
      layer.y = clampUnit(y, 0, maxY);
      return;
    }

    layer.x = clampUnit(x, 0.015, 0.985);
    layer.y = clampUnit(y, 0.015, 0.995);
  }

  function normalizeRotation(value) {
    let next = Number(value) || 0;
    while (next > 180) next -= 360;
    while (next < -180) next += 360;
    return Math.round(next * 10) / 10;
  }

  function distanceBetween(a, b) {
    return Math.hypot((b.x || 0) - (a.x || 0), (b.y || 0) - (a.y || 0));
  }

  function angleBetween(a, b) {
    return Math.atan2((b.y || 0) - (a.y || 0), (b.x || 0) - (a.x || 0));
  }

  function centerBetween(a, b) {
    return {
      x: ((a.x || 0) + (b.x || 0)) / 2,
      y: ((a.y || 0) + (b.y || 0)) / 2
    };
  }

  function activePointerList() {
    return Array.from(canvasDragState?.pointers?.values?.() || []);
  }

  function createLayerGestureSnapshot(layer) {
    return {
      x: layer.x || 0,
      y: layer.y || 0,
      width: layer.width || 0.12,
      height: layer.height || layer.width || 0.12,
      fontSize: layer.fontSize || 24,
      rotation: Number(layer.rotation || 0),
      cropX: layer.cropX ?? 0.5,
      cropY: layer.cropY ?? 0.5,
      cropZoom: layer.cropZoom ?? 1
    };
  }

  function startCanvasGesture(layer) {
    if (!layer || !canvasDragState?.pointers?.size) return;
    const points = activePointerList();
    const base = {
      layerId: layer.id,
      pointers: canvasDragState.pointers,
      snapshot: createLayerGestureSnapshot(layer),
      moved: canvasDragState.moved || false,
      historyCaptured: canvasDragState.historyCaptured || false
    };

    if (currentEditorTab === 'crop' && layer.type === 'image') {
      ensureImageDefaults(layer);
      if (points.length >= 2) {
        const first = points[0];
        const second = points[1];
        canvasDragState = {
          ...base,
          mode: 'crop',
          startCenter: centerBetween(first, second),
          startDistance: Math.max(0.001, distanceBetween(first, second))
        };
        return;
      }

      canvasDragState = {
        ...base,
        mode: 'crop',
        pointerId: points[0].id,
        startX: points[0].x,
        startY: points[0].y
      };
      return;
    }

    if (points.length >= 2) {
      const first = points[0];
      const second = points[1];
      canvasDragState = {
        ...base,
        mode: 'transform',
        startCenter: centerBetween(first, second),
        startDistance: Math.max(0.001, distanceBetween(first, second)),
        startAngle: angleBetween(first, second)
      };
      return;
    }

    canvasDragState = {
      ...base,
      mode: 'move',
      pointerId: points[0].id,
      startX: points[0].x,
      startY: points[0].y
    };
  }

  function startViewportGesture() {
    if (!canvasDragState?.pointers?.size) return;
    const points = activePointerList();
    const base = {
      mode: 'viewport',
      layerId: null,
      pointers: canvasDragState.pointers,
      moved: canvasDragState.moved || false,
      startZoom: canvasZoom
    };

    if (points.length >= 2) {
      const first = points[0];
      const second = points[1];
      canvasDragState = {
        ...base,
        startDistance: Math.max(0.001, distanceBetween(first, second)),
        startCenter: centerBetween(first, second)
      };
      return;
    }

    canvasDragState = {
      ...base,
      startX: points[0].x,
      startY: points[0].y
    };
  }

  function scaleLayerFromGesture(layer, snapshot, scale) {
    const nextScale = clampUnit(scale, 0.18, 5);
    if (layer.type === 'image' || layer.type === 'shape' || layer.type === 'sticker') {
      const ratio = (snapshot.height || snapshot.width || 0.12) / (snapshot.width || 0.12);
      const nextWidth = clampUnit(snapshot.width * nextScale, 0.04, 0.92);
      const nextHeight = clampUnit(nextWidth * ratio, 0.04, 0.92);
      layer.width = nextWidth;
      layer.height = nextHeight;
      return;
    }

    if (layer.type === 'text') {
      layer.fontSize = Math.round(clampUnit(snapshot.fontSize * nextScale, 10, 150));
    }
  }

  function captureGestureHistory() {
    if (!canvasDragState?.historyCaptured) {
      pushEditorHistory();
      canvasDragState.historyCaptured = true;
    }
  }

  function applyCanvasGesture() {
    if (!canvasDragState) return false;

    const points = activePointerList();
    if (canvasDragState.mode === 'viewport') {
      if (points.length >= 2) {
        if (!canvasDragState.startDistance) {
          startViewportGesture();
          return false;
        }
        const scale = distanceBetween(points[0], points[1]) / canvasDragState.startDistance;
        canvasZoom = clampUnit(canvasDragState.startZoom * scale, 1, 3);
        applyCanvasZoom(false);
        canvasDragState.moved = true;
      }
      return false;
    }

    const layer = getLayerById(canvasDragState.layerId);
    if (!layer || !points.length) return false;

    if (points.length >= 2 && canvasDragState.mode !== 'transform' && canvasDragState.mode !== 'crop') {
      startCanvasGesture(layer);
      return false;
    }

    if (points.length === 1 && canvasDragState.mode !== 'move' && canvasDragState.mode !== 'crop') {
      startCanvasGesture(layer);
      return false;
    }

    if (canvasDragState.mode === 'transform' && points.length >= 2) {
      const first = points[0];
      const second = points[1];
      const center = centerBetween(first, second);
      const scale = distanceBetween(first, second) / canvasDragState.startDistance;
      const rotationDelta = (angleBetween(first, second) - canvasDragState.startAngle) * 180 / Math.PI;
      const snapshot = canvasDragState.snapshot;

      captureGestureHistory();
      const deltaX = center.x - canvasDragState.startCenter.x;
      const deltaY = center.y - canvasDragState.startCenter.y;
      layer.x = snapshot.x + deltaX;
      layer.y = snapshot.y + deltaY;
      scaleLayerFromGesture(layer, snapshot, scale);
      if (layer.type === 'image' || layer.type === 'shape' || layer.type === 'sticker') {
        layer.x -= ((layer.width || snapshot.width) - snapshot.width) / 2;
        layer.y -= ((layer.height || snapshot.height) - snapshot.height) / 2;
      }
      layer.rotation = normalizeRotation(snapshot.rotation + rotationDelta);
      moveLayerToPoint(layer, layer.x, layer.y);
      canvasDragState.moved = true;
      return true;
    }

    if (canvasDragState.mode === 'crop' && layer.type === 'image') {
      ensureImageDefaults(layer);
      const snapshot = canvasDragState.snapshot;
      captureGestureHistory();

      if (points.length >= 2 && canvasDragState.startDistance) {
        const first = points[0];
        const second = points[1];
        const center = centerBetween(first, second);
        const scale = distanceBetween(first, second) / canvasDragState.startDistance;
        layer.cropZoom = clampUnit(snapshot.cropZoom * scale, 1, 4);
        layer.cropX = clampUnit(snapshot.cropX - (center.x - canvasDragState.startCenter.x) * 1.05, 0, 1);
        layer.cropY = clampUnit(snapshot.cropY - (center.y - canvasDragState.startCenter.y) * 1.05, 0, 1);
      } else if (points.length === 1) {
        const point = points[0];
        layer.cropX = clampUnit(snapshot.cropX - (point.x - canvasDragState.startX) * 1.15, 0, 1);
        layer.cropY = clampUnit(snapshot.cropY - (point.y - canvasDragState.startY) * 1.15, 0, 1);
      }

      canvasDragState.moved = true;
      return true;
    }

    if (canvasDragState.mode === 'move' && points.length === 1) {
      const point = points[0];
      const snapshot = canvasDragState.snapshot;
      captureGestureHistory();

      let nextX = snapshot.x + (point.x - canvasDragState.startX);
      let nextY = snapshot.y + (point.y - canvasDragState.startY);

      const guidelines = { vLines: [], hLines: [] };
      const snapThreshold = 0.015; // 1.5% threshold

      // Temporarily position layer to measure bounds
      layer.x = nextX;
      layer.y = nextY;

      const profile = ProfileManager.getProfile() || {};
      const bounds = CanvasEngine.getLayerBounds(layer, profile);

      if (bounds) {
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;

        // 1. Canvas Center Snapping
        if (Math.abs(centerX - 0.5) < snapThreshold) {
          nextX += 0.5 - centerX;
          guidelines.vLines.push(0.5);
        }
        if (Math.abs(centerY - 0.5) < snapThreshold) {
          nextY += 0.5 - centerY;
          guidelines.hLines.push(0.5);
        }

        // 2. Align to other layers
        const otherLayers = (currentDesign.layers || []).filter(l => l.id !== layer.id && !l.hidden);
        for (const other of otherLayers) {
          const oBounds = CanvasEngine.getLayerBounds(other, profile);
          if (!oBounds) continue;

          const oCenterX = oBounds.x + oBounds.width / 2;
          const oCenterY = oBounds.y + oBounds.height / 2;

          // Center-to-center horizontal
          if (Math.abs(centerX - oCenterX) < snapThreshold) {
            nextX += oCenterX - centerX;
            guidelines.vLines.push(oCenterX);
          }
          // Center-to-center vertical
          if (Math.abs(centerY - oCenterY) < snapThreshold) {
            nextY += oCenterY - centerY;
            guidelines.hLines.push(oCenterY);
          }

          // Left edges
          if (Math.abs(bounds.x - oBounds.x) < snapThreshold) {
            nextX += oBounds.x - bounds.x;
            guidelines.vLines.push(oBounds.x);
          }
          // Right edges
          if (Math.abs((bounds.x + bounds.width) - (oBounds.x + oBounds.width)) < snapThreshold) {
            nextX += (oBounds.x + oBounds.width) - (bounds.x + bounds.width);
            guidelines.vLines.push(oBounds.x + oBounds.width);
          }
        }
      }

      moveLayerToPoint(layer, nextX, nextY);

      // Update guidelines on design to render them
      if (guidelines.vLines.length > 0 || guidelines.hLines.length > 0) {
        currentDesign.guidelines = guidelines;
        if (!canvasDragState.snapped) {
          triggerLightHaptic(12);
          canvasDragState.snapped = true;
        }
      } else {
        delete currentDesign.guidelines;
        canvasDragState.snapped = false;
      }

      canvasDragState.moved = true;
      return true;
    }

    return false;
  }

  function handleCanvasDoubleTap(layer) {
    setEditorTab('text');
    revealEditorSheet();
    setTimeout(() => {
      const input = document.getElementById('inputLayerText');
      if (input) {
        input.focus();
        input.select();
      }
    }, 150);
  }

  function updateCanvasZoom(zoomDelta) {
    canvasZoom = Math.max(1, Math.min(3, canvasZoom + zoomDelta));
    applyCanvasZoom();
  }

  function resetCanvasZoom() {
    canvasZoom = 1;
    applyCanvasZoom();
  }

  function applyCanvasZoom(animate = true) {
    const canvas = document.getElementById('posterCanvas');
    if (!canvas) return;

    canvas.style.transform = `scale(${canvasZoom})`;
    canvas.style.transformOrigin = 'center center';
    canvas.style.transition = animate ? 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

    const btnReset = document.getElementById('btnZoomReset');
    if (btnReset) btnReset.textContent = `${Math.round(canvasZoom * 100)}%`;

    syncCanvasSelectionOverlay();
  }

  function handleCanvasPointerDown(e) {
    if (currentScreen !== 'editor' || !currentDesign) return;
    hideDragDeleteZone();
    const point = getCanvasPointerPoint(e);

    if (!point) return;

    if (canvasDragState?.mode === 'viewport') {
      canvasDragState.pointers.set(e.pointerId, { id: e.pointerId, x: point.x, y: point.y });
      startViewportGesture();
      e.preventDefault();
      return;
    }

    const hitLayer = findEditableLayerAtPoint(point);
    const layer = canvasDragState?.pointers?.size
      ? getLayerById(canvasDragState.layerId)
      : hitLayer;

    if (!layer) {
      const pointers = canvasDragState?.pointers || new Map();
      pointers.set(e.pointerId, { id: e.pointerId, x: point.x, y: point.y });
      canvasDragState = {
        mode: 'viewport',
        layerId: null,
        pointers,
        moved: false,
        startZoom: canvasZoom
      };
      startViewportGesture();
      syncCanvasSelectionOverlay();
      e.preventDefault();
      return;
    }

    const now = Date.now();
    const isDoubleTap = now - lastCanvasTapAt < 300;
    lastCanvasTapAt = now;

    if (isDoubleTap && layer.type === 'text') {
      handleCanvasDoubleTap(layer);
    }

    selectedLayerId = layer.id;
    if (!(currentEditorTab === 'crop' && layer.type === 'image')) {
      setEditorTab(preferredTabForLayer(layer));
    }
    renderLayerPills();
    syncLayerControls();
    syncBrandControls();

    const pointers = canvasDragState?.pointers || new Map();
    pointers.set(e.pointerId, { id: e.pointerId, x: point.x, y: point.y });
    canvasDragState = {
      layerId: layer.id,
      pointers,
      moved: canvasDragState?.moved || false
    };
    startCanvasGesture(layer);

    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
  }

  function handleCanvasPointerMove(e) {
    const point = getCanvasPointerPoint(e);
    if (!canvasDragState || !canvasDragState.pointers?.has(e.pointerId) || !point) return;
    canvasDragState.pointers.set(e.pointerId, { id: e.pointerId, x: point.x, y: point.y });

    if (applyCanvasGesture()) {
      markDesignChanged(false);
      syncDragDeleteZone(e);
    }
    e.preventDefault();
  }

  function handleCanvasPointerUp(e) {
    if (!canvasDragState || !canvasDragState.pointers?.has(e.pointerId)) return;

    if (canvasDragState.mode === 'viewport') {
      const moved = canvasDragState.moved;
      canvasDragState.pointers.delete(e.pointerId);
      if (canvasDragState.pointers.size) {
        startViewportGesture();
      } else {
        canvasDragState = null;
      }
      if (moved) {
        syncCanvasSelectionOverlay();
        e.preventDefault();
      }
      return;
    }

    const moved = canvasDragState.moved;
    const layer = getLayerById(canvasDragState.layerId);
    const shouldDelete = moved && canDragDeleteLayer(layer) && (dragDeleteActive || isPointerOverDeleteZone(e));
    canvasDragState.pointers.delete(e.pointerId);
    if (canvasDragState.pointers.size) {
      const layer = getLayerById(canvasDragState.layerId);
      if (layer) startCanvasGesture(layer);
    } else {
      canvasDragState = null;
      if (currentDesign) {
        delete currentDesign.guidelines;
      }
    }

    hideDragDeleteZone();

    if (shouldDelete && layer) {
      deleteLayerFromPoster(layer, { captureHistory: false });
      triggerLightHaptic(40);
      e.preventDefault();
      return;
    }

    if (moved) {
      markDesignChanged();
    } else {
      revealEditorSheet();
      syncEditorTabs();
      syncLayerControls();
      syncBrandControls();
      syncCanvasSelectionOverlay();
    }
  }

  function syncCanvasSelectionOverlay() {
    const box = document.getElementById('canvasSelectionBox');
    const canvas = document.getElementById('posterCanvas');
    const wrapper = document.getElementById('canvasWrapper');
    const layer = getSelectedLayer();

    if (!box || !canvas || !wrapper || currentScreen !== 'editor' || !layer || layer.hidden || !CanvasEngine.getLayerBounds) {
      if (box) box.hidden = true;
      return;
    }

    const profile = ProfileManager.getProfile() || {};
    const bounds = CanvasEngine.getLayerBounds(layer, profile);
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
      box.hidden = true;
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const left = canvasRect.left - wrapperRect.left + bounds.x * canvasRect.width;
    const top = canvasRect.top - wrapperRect.top + bounds.y * canvasRect.height;

    box.hidden = false;
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
    box.style.width = `${bounds.width * canvasRect.width}px`;
    box.style.height = `${bounds.height * canvasRect.height}px`;
    box.style.transform = `rotate(${Number(layer.rotation || 0)}deg)`;
  }

  function handleAddTextLayer() {
    if (!currentDesign) return;

    pushEditorHistory();
    const layer = {
      id: newLayerId('custom_text'),
      label: `Text ${getEditableLayers().filter(item => item.type === 'text' && item.userAdded).length + 1}`,
      type: 'text',
      text: 'Add your text',
      x: 0.5,
      y: 0.5,
      maxWidth: 0.78,
      fontSize: 34,
      weight: '700',
      fontFamily: '"Outfit", "Arial", sans-serif',
      color: '#FFFFFF',
      align: 'center',
      baseline: 'middle',
      editable: true,
      userAdded: true
    };

    currentDesign.layers.push(layer);
    selectedLayerId = layer.id;
    setEditorTab('text');
    revealEditorSheet();
    markDesignChanged();
  }

  function handleAddImageLayer() {
    if (!currentDesign) return;

    pushEditorHistory();
    const layer = {
      id: newLayerId('custom_image'),
      label: `Image ${getEditableLayers().filter(item => item.type === 'image' && item.userAdded).length + 1}`,
      type: 'image',
      x: 0.28,
      y: 0.32,
      width: 0.44,
      height: 0.34,
      mask: 'rounded',
      shape: 'rounded',
      fit: 'cover',
      cropX: 0.5,
      cropY: 0.5,
      cropZoom: 1,
      padding: 0.01,
      frameColor: 'rgba(255,255,255,0.72)',
      backgroundColor: 'rgba(255,255,255,0.10)',
      placeholderLabel: 'Image',
      editable: true,
      userAdded: true
    };

    currentDesign.layers.push(layer);
    selectedLayerId = layer.id;
    setEditorTab('photo');
    revealEditorSheet();
    markDesignChanged();
    requestAnimationFrame(() => document.getElementById('inputLayerImage')?.click());
  }

  function handleFillSelectedSlot() {
    const layer = getSelectedLayer();
    if (!layer || layer.type !== 'image') return;
    document.getElementById('inputLayerImage')?.click();
  }

  function handleDeleteLayer() {
    const layer = getSelectedLayer();
    if (!layer || !currentDesign) return;
    deleteLayerFromPoster(layer);
  }

  async function renderEditorPoster() {
    if (!currentTemplateId || !currentDesign) return;

    const profile = ProfileManager.getProfile();
    if (!profile) return;

    const renderId = ++editorRenderId;
    DownloadManager.setActiveDesign(currentDesign);

    try {
      await CanvasEngine.renderPoster(currentTemplateId, profile, {
        withWatermark: false,
        design: currentDesign
      });
      if (renderId === editorRenderId) {
        refreshVideoPreview();
        syncCanvasSelectionOverlay();
      }
    } catch (e) {
      if (renderId === editorRenderId) {
        console.error('Error rendering poster:', e);
        showToast('Error rendering poster', 'error');
      }
    }
  }

  function handleLayerInput(e) {
    const layer = getSelectedLayer();
    if (!layer || !currentDesign) return;

    const value = e.target.value;
    pushEditorHistory(e.target.type === 'range' || e.target.type === 'color');
    if (e.target.id === 'inputLayerText' && layer.type === 'text') {
      layer.text = value;
      layer.role = null;
      layer.prefix = '';
      layer.userDetached = true;
    }

    if (e.target.id === 'inputLayerSpace' && layer.type === 'image') {
      ensureImageDefaults(layer);
      layer.padding = Number(value) / 100;
    }

    if (e.target.id === 'inputLayerCropZoom' && layer.type === 'image') {
      ensureImageDefaults(layer);
      layer.cropZoom = Number(value) / 100;
    }

    if (e.target.id === 'inputLayerColor' && layer.type === 'text') {
      layer.color = value;
    }

    if (e.target.id === 'inputLayerFontSize' && layer.type === 'text') {
      layer.fontSize = Number(value);
    }

    if (e.target.matches('[data-layer-opacity-input]')) {
      layer.opacity = Number(value) / 100;
    }

    markDesignChanged();
  }

  function handleAnimationInput(e) {
    const animation = ensureDesignAnimation();
    if (!animation || !currentDesign) return;

    pushEditorHistory(e.target.type === 'range');
    if (e.target.id === 'selectAnimationPreset') {
      animation.preset = e.target.value;
    }

    if (e.target.id === 'inputAnimationIntensity') {
      animation.intensity = Number(e.target.value) / 100;
    }

    if (e.target.id === 'inputAnimationSpeed') {
      animation.speed = Number(e.target.value) / 100;
    }

    currentDesign.updatedAt = Date.now();
    DownloadManager.setActiveDesign(currentDesign);
    refreshVideoPreview();
  }

  function handleLayerImageUpload(e) {
    const layer = getSelectedLayer();
    const file = e.target.files?.[0];
    if (!layer || layer.type !== 'image' || !file) return;

    ProfileManager.readFileAsDataURL(file)
      .then(dataURL => {
        pushEditorHistory();
        ensureImageDefaults(layer);
        layer.src = dataURL;
        layer.role = null;
        showToast('Image added to card', 'success');
        markDesignChanged();
      })
      .catch(err => showToast(err.message, 'error'))
      .finally(() => {
        e.target.value = '';
      });
  }

  async function handleSaveDesign() {
    if (!currentTemplateId || !currentDesign) return;

    const template = TemplateRegistry.getById(currentTemplateId);
    const existingRecord = currentSavedDesignId ? getSavedDesignById(currentSavedDesignId) : null;
    const now = Date.now();

    currentDesign.templateId = currentTemplateId;
    currentDesign.title = getDesignTitle(currentDesign, template);
    currentDesign.updatedAt = now;

    await renderEditorPoster();

    const record = {
      id: existingRecord?.id || currentSavedDesignId || currentDesign.id || `saved_${now}`,
      templateId: currentTemplateId,
      title: currentDesign.title,
      createdAt: existingRecord?.createdAt || currentDesign.createdAt || now,
      updatedAt: now,
      thumbnail: captureCurrentThumbnail(),
      design: CanvasEngine.cloneDesign(currentDesign)
    };

    const saved = saveDesignRecord(record);
    if (!saved) {
      showToast('Could not save design. Storage may be full.', 'error');
      return;
    }

    currentSavedDesignId = record.id;
    currentDesign.id = record.id;
    hasUnsavedChanges = false;
    renderCategoryPills();
    showToast('Saved to My Designs', 'success');
  }

  async function openEditor(templateId, savedId = null, options = {}) {
    navigateTo('editor');
    hasUnsavedChanges = false;
    resetCanvasZoom();

    const template = TemplateRegistry.getById(templateId);
    const profile = ProfileManager.getProfile();

    if (!template || !profile) {
      showToast('Error loading template', 'error');
      return;
    }

    const savedRecord = savedId ? getSavedDesignById(savedId) : null;
    currentDesign = savedRecord?.design
      ? CanvasEngine.cloneDesign(savedRecord.design)
      : CanvasEngine.createDefaultDesign(templateId, profile, {
        aspectRatio: options.aspectRatio || pendingCustomAspectRatio || '1:1'
      });

    currentDesign.aspectRatio = normalizeAspectRatio(currentDesign.aspectRatio || options.aspectRatio || '1:1');
    pendingCustomAspectRatio = null;

    setEditorCanvasAspect(currentDesign.aspectRatio);

    (currentDesign.layers || []).forEach(ensureImageDefaults);
    ensureDesignAnimation();
    ensureBrandState(profile);
    if (!savedRecord) {
      applyProfileBrandDefaultsToCurrentDesign(false, false);
    }
    currentSavedDesignId = savedRecord?.id || null;
    selectedLayerId = getLayerById('business_name')?.id || getEditableLayers()[0]?.id || null;
    if (getSelectedLayer()?.hidden) selectedLayerId = firstVisibleEditableLayerId();
    currentEditorTab = 'brand';
    setEditorSheetState('collapsed');
    DownloadManager.setActiveDesign(currentDesign);
    resetEditorHistory();

    document.getElementById('editorTemplateName').textContent = visibleTemplateTitle(template, currentDesign.title || template.name);
    document.getElementById('editorTemplateCategory').textContent = (template.categoryLabel || template.category).replace('_', ' ').toUpperCase();

    const badge = document.getElementById('editorBadge');
    if (template.isVideoInvite) {
      badge.className = 'template-card-badge badge-video';
      badge.textContent = 'VIDEO';
    } else if (template.isPhotoTemplate) {
      badge.className = 'template-card-badge badge-photo';
      badge.textContent = 'PHOTO';
    } else if (template.isPremium) {
      badge.className = 'template-card-badge badge-premium';
      badge.textContent = 'PREMIUM';
    } else {
      badge.className = 'template-card-badge badge-free';
      badge.textContent = 'FREE';
    }

    const btnHD = document.getElementById('btnDownloadHD');
    const btnVideo = document.getElementById('btnDownloadVideo');
    const btnGif = document.getElementById('btnDownloadAnimatedImage');
    btnHD.textContent = 'Download HD Poster';
    btnHD.className = 'btn btn-primary btn-block btn-lg';
    btnVideo.style.display = template.isVideoInvite ? 'flex' : 'none';
    btnGif.style.display = template.isVideoInvite ? 'flex' : 'none';

    renderLayerPills();
    syncLayerControls();
    syncBrandControls();
    syncAnimationControls();
    syncEditorTabs();
    syncExportControls();
    renderAITextSuggestions([]);
    const batchStatus = document.getElementById('batchExportStatus');
    if (batchStatus) batchStatus.textContent = '';
    await renderEditorPoster();
  }

  function clampExportQuality(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0.92;
    return Math.max(0.5, Math.min(1, number));
  }

  function getExportOptions() {
    const format = document.getElementById('selectExportFormat')?.value || exportOptions.format || 'png';
    const sizePreset = document.getElementById('selectExportSize')?.value || exportOptions.sizePreset || 'original';
    const qualityValue = Number(document.getElementById('inputExportQuality')?.value || exportOptions.quality * 100);

    exportOptions = {
      format: EXPORT_FORMAT_LABELS[format] ? format : 'png',
      quality: clampExportQuality(qualityValue / 100),
      sizePreset: EXPORT_SIZE_LABELS[sizePreset] ? sizePreset : 'original'
    };

    return { ...exportOptions };
  }

  function syncExportControls() {
    const formatSelect = document.getElementById('selectExportFormat');
    const sizeSelect = document.getElementById('selectExportSize');
    const qualityInput = document.getElementById('inputExportQuality');
    const qualityValue = document.getElementById('exportQualityValue');
    const qualityControl = document.getElementById('exportQualityControl');
    const summary = document.getElementById('exportSummary');

    if (formatSelect && formatSelect.value !== exportOptions.format) {
      formatSelect.value = exportOptions.format;
    }
    if (sizeSelect && sizeSelect.value !== exportOptions.sizePreset) {
      sizeSelect.value = exportOptions.sizePreset;
    }
    if (qualityInput) {
      qualityInput.value = Math.round(exportOptions.quality * 100);
      qualityInput.disabled = exportOptions.format === 'png';
    }
    if (qualityValue) {
      qualityValue.value = `${Math.round(exportOptions.quality * 100)}%`;
      qualityValue.textContent = `${Math.round(exportOptions.quality * 100)}%`;
    }
    if (qualityControl) {
      qualityControl.classList.toggle('is-disabled', exportOptions.format === 'png');
    }
    if (summary) {
      const qualityLabel = exportOptions.format === 'png'
        ? ''
        : ` / ${Math.round(exportOptions.quality * 100)}%`;
      summary.textContent = `${EXPORT_FORMAT_LABELS[exportOptions.format]} / ${EXPORT_SIZE_LABELS[exportOptions.sizePreset]}${qualityLabel}`;
    }
  }

  function handleExportOptionInput() {
    getExportOptions();
    syncExportControls();
  }

  // =======================================
  // DOWNLOAD & SHARE
  // =======================================

  async function handleHDDownload() {
    if (!currentTemplateId) return;

    const profile = ProfileManager.getProfile();
    const options = getExportOptions();
    showToast(`Downloading ${EXPORT_FORMAT_LABELS[options.format]} poster...`, 'info', 2000);
    DownloadManager.setActiveDesign(currentDesign);

    const success = await DownloadManager.downloadPoster(
      currentTemplateId,
      profile.shopName,
      false,
      options
    );

    if (success) {
      showToast('Poster downloaded', 'success');
      DownloadManager.showConfetti();
    } else {
      showToast('Download failed. Please try again.', 'error');
    }
  }

  async function handleShareWhatsApp() {
    if (!currentTemplateId) return;

    showToast('Preparing to share...', 'info', 2000);
    DownloadManager.setActiveDesign(currentDesign);
    await DownloadManager.shareToWhatsApp(currentTemplateId, getExportOptions());
  }

  async function handleBatchExportDesigns() {
    const records = getSavedDesigns();
    const status = document.getElementById('batchExportStatus');
    const button = document.getElementById('btnBatchExportDesigns');

    if (!records.length) {
      showToast('No saved designs to export', 'info');
      return;
    }

    const options = getExportOptions();
    if (status) status.textContent = `Preparing ${records.length} saved design${records.length === 1 ? '' : 's'}...`;
    if (button) button.disabled = true;
    showToast('Preparing batch export...', 'info', 2500);

    try {
      const result = await DownloadManager.downloadSavedDesignsBatch(records, options, {
        onProgress: ({ index, total, title }) => {
          if (status) status.textContent = `Exporting ${index}/${total}: ${title}`;
        }
      });

      if (result?.success) {
        if (status) status.textContent = `Batch ready: ${result.count} designs`;
        showToast('Saved designs exported as ZIP', 'success');
        DownloadManager.showConfetti();
      } else {
        if (status) status.textContent = '';
        showToast(result?.reason === 'empty' ? 'No saved designs to export' : 'Batch export failed', 'error');
      }
    } catch (e) {
      console.error('Batch export failed:', e);
      if (status) status.textContent = '';
      showToast('Batch export failed. Please try again.', 'error');
    } finally {
      if (button) button.disabled = false;
      DownloadManager.setActiveDesign(currentDesign);
      await renderEditorPoster();
    }
  }

  async function handleVideoInvite() {
    if (!currentTemplateId || !currentDesign) return;

    const template = TemplateRegistry.getById(currentTemplateId);
    if (!template?.isVideoInvite) return;

    if (!window.VideoManager?.isSupported?.()) {
      showToast('Video export is not supported on this device browser yet.', 'error');
      return;
    }

    const profile = ProfileManager.getProfile();
    if (!profile) return;
    const displayName = ProfileManager.getDisplayName(profile) || profile.shopName;

    showToast('Preparing video invite...', 'info', 2500);
    try {
      const result = await VideoManager.exportInvite(currentTemplateId, currentDesign, {
        withWatermark: false,
        durationMs: 6000
      });

      const shared = await VideoManager.shareOrDownload(result.blob, {
        filename: result.filename,
        title: `${template.name} - ${displayName}`,
        text: `Invitation from ${displayName}`
      });

      showToast(shared ? 'Video invite ready to share' : 'Video invite downloaded', 'success');
    } catch (e) {
      console.error('Video invite failed:', e);
      showToast('Video invite failed. Please try again.', 'error');
    } finally {
      await renderEditorPoster();
    }
  }

  async function handleAnimatedImageInvite() {
    if (!currentTemplateId || !currentDesign) return;

    const template = TemplateRegistry.getById(currentTemplateId);
    if (!template?.isVideoInvite) return;

    if (!window.VideoManager?.isAnimatedImageSupported?.()) {
      showToast('Animated image export is not supported on this device browser yet.', 'error');
      return;
    }

    const profile = ProfileManager.getProfile();
    if (!profile) return;
    const displayName = ProfileManager.getDisplayName(profile) || profile.shopName;

    showToast('Preparing animated GIF...', 'info', 2500);
    try {
      const result = await VideoManager.exportAnimatedImage(currentTemplateId, currentDesign, {
        withWatermark: false,
        durationMs: 2600,
        frames: 16,
        size: 540
      });

      const shared = await VideoManager.shareOrDownload(result.blob, {
        filename: result.filename,
        title: `${template.name} - ${displayName}`,
        text: `Animated invitation from ${displayName}`,
        dialogTitle: 'Share animated invite'
      });

      showToast(shared ? 'Animated GIF ready to share' : 'Animated GIF downloaded', 'success');
    } catch (e) {
      console.error('Animated GIF export failed:', e);
      showToast('Animated GIF failed. Please try a smaller design or video export.', 'error');
    } finally {
      await renderEditorPoster();
    }
  }

  // =======================================
  // INIT
  // =======================================

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    navigateTo,
    showToast,
    init
  };
})();
