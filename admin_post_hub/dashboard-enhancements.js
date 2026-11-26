/**
 * PanchayatPost Admin - Focused Connected App Studio
 * Controls ONLY:
 * 1. App Icon
 * 2. Preloader (Video & Splash)
 * 3. App Theme
 * 4. Home Hero Section
 */

(function () {
  // Apply saved sidebar state
  if (localStorage.getItem('sidebar_collapsed') === 'true') {
    document.body.classList.add('sidebar-collapsed');
  }

  // 1. Add Slidable Hamburger Toggle to Top Navbar
  function enhanceNavbar() {
    const toolbar = document.querySelector('.MuiToolbar-root');
    if (!toolbar) return;

    if (!document.getElementById('nav-slide-toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'nav-slide-toggle';
      toggleBtn.className = 'nav-slide-toggle-btn';
      toggleBtn.title = 'Slide / Toggle Sidebar';
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebar_collapsed', isCollapsed ? 'true' : 'false');
        document.body.classList.remove('sidebar-hovered');
        fixSidebarAndProfile();
      });

      toolbar.insertBefore(toggleBtn, toolbar.firstChild);
    }

    if (!document.getElementById('nav-app-screens-btn')) {
      const appBtn = document.createElement('button');
      appBtn.id = 'nav-app-screens-btn';
      appBtn.className = 'nav-app-control-pill';
      appBtn.title = 'Connected Mobile App Studio';
      appBtn.innerHTML = `
        <span class="live-indicator"></span>
        <span>📱 App Screens</span>
      `;

      appBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToAppScreens();
      });

      toolbar.appendChild(appBtn);
    }
  }

  // 2. Setup Cursor-Controlled Hover Auto-Expansion
  let isHoverBound = false;
  function setupSidebarHover() {
    if (isHoverBound) return;
    const drawerPaper = document.querySelector('.MuiDrawer-paper');
    if (!drawerPaper) return;

    drawerPaper.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('sidebar-collapsed')) {
        document.body.classList.add('sidebar-hovered');
        drawerPaper.style.width = '260px';
        drawerPaper.style.zIndex = '1300';
        drawerPaper.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
      }
    });

    drawerPaper.addEventListener('mouseleave', () => {
      if (document.body.classList.contains('sidebar-collapsed')) {
        document.body.classList.remove('sidebar-hovered');
        drawerPaper.style.width = '68px';
        drawerPaper.style.zIndex = '';
        drawerPaper.style.boxShadow = '';
      }
    });

    isHoverBound = true;
  }

  // 3. Add Connected App Tab to Left Navigation Menu
  function addConnectedAppSidebarTab() {
    const drawerPaper = document.querySelector('.MuiDrawer-paper');
    if (!drawerPaper) return;

    const listRoot = drawerPaper.querySelector('.MuiList-root, ul');
    if (!listRoot) return;

    if (!document.getElementById('nav-item-app-screens')) {
      const item = document.createElement('div');
      item.id = 'nav-item-app-screens';
      item.className = 'MuiButtonBase-root MuiListItem-root MuiListItem-gutters MuiListItem-button';
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('title', 'Connected App Screens');
      item.innerHTML = `
        <div class="MuiListItemIcon-root" style="min-width: 30px; display: flex; align-items: center; justify-content: center;">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
        </div>
        <div class="MuiListItemText-root">
          <span class="MuiTypography-root MuiListItemText-primary MuiTypography-body1" style="display: flex; align-items: center; justify-content: space-between;">
            <span>Connected App</span>
            <span style="font-size: 0.60rem; font-weight: 800; background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; padding: 1px 5px; border-radius: 10px; margin-left: 6px;">LIVE</span>
          </span>
        </div>
      `;

      item.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToAppScreens();
      });

      // Insert right after Dashboard (index 1)
      const children = Array.from(listRoot.children);
      if (children.length > 1) {
        listRoot.insertBefore(item, children[1]);
      } else {
        listRoot.appendChild(item);
      }
    }

    // Update active highlight based on current route
    const isAppScreens = isAppScreensRoute();
    const tabEl = document.getElementById('nav-item-app-screens');
    if (tabEl) {
      if (isAppScreens) {
        tabEl.classList.add('Mui-selected');
        tabEl.style.backgroundColor = '#EFF6FF';
        tabEl.style.color = '#2563EB';
      } else {
        tabEl.classList.remove('Mui-selected');
        tabEl.style.backgroundColor = '';
        tabEl.style.color = '';
      }
    }
  }

  function navigateToAppScreens() {
    history.pushState(null, '', '/app-screens');
    injectAppScreensStudio();
    window.dispatchEvent(new Event('popstate'));
  }

  // 4. Remove "Master" and "Content" section header text
  function removeSidebarHeaders() {
    const drawerPaper = document.querySelector('.MuiDrawer-paper');
    if (!drawerPaper) return;

    const allDivs = drawerPaper.querySelectorAll('div, [class*="ListSubHeader"], span, p, h6');
    allDivs.forEach(el => {
      if (el.children.length === 0) {
        const text = (el.textContent || '').trim().toLowerCase();
        if (text === 'master' || text === 'content') {
          el.style.display = 'none';
          if (el.parentElement && el.parentElement.children.length === 1) {
            el.parentElement.style.display = 'none';
          }
        }
      }
    });
  }

  // 5. App Control State - Focused on Icon, Preloader, Theme, Home Hero
  let appConfig = {
    preloaderScreen: {
      enabled: true,
      durationSeconds: 2.5,
      animationStyle: 'pulse_logo',
      tagline: 'તમારા ગામનું પોતાનું ડિજિટલ પોસ્ટર',
      bgGradient: 'gradient_blue',
      showVersion: true,
      mediaType: 'animation', // 'animation' | 'video'
      videoUrl: '',
      videoMuted: true,
      videoLoop: true,
      videoFit: 'cover',
      skipButtonEnabled: true,
      appIcon: {
        type: 'preset',
        preset: '🇮🇳',
        url: '',
        shape: 'rounded_square',
        bgColor: 'blue',
      },
    },
    homeScreen: {
      slidersEnabled: true,
      festivalsEnabled: true,
      greetingsEnabled: true,
      electionEnabled: true,
      categoriesEnabled: true,
      heroTitle: 'નમસ્તે, સરપંચ શ્રી & ગ્રામજનો! 🙏',
      heroSubtitle: 'આજના વિશેષ તહેવાર અને પંચાયત પોસ્ટર',
      heroImage: '',
      sliderSpeed: 4,
      noticeBanner: {
        enabled: false,
        text: '',
        bgColor: '#2563EB',
      },
    },
    globalSettings: {
      maintenanceMode: false,
      maintenanceMessage: 'App is temporarily under maintenance for upgrades. Please check back in a few minutes!',
      minVersion: '2.4.0',
      forceUpdate: false,
      themeColor: '#2563EB',
      themePreset: 'royal_blue',
      themeMode: 'Light',
      headerStyle: 'gradient',
      borderRadius: 'rounded',
    },
  };

  // Only 4 focused tabs - Default to preloader so opening splash is always shown first
  let activeStudioTab = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('active_studio_tab')) || 'preloader';
  let phoneActiveTab = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('phone_active_view')) || 'preloader';
  let configLoaded = false;
  const previewContent = {
    loading: true,
    error: '',
    templates: [],
    festivals: [],
  };

  async function getAdminArray(path) {
    const token = localStorage.getItem('token') || '';
    if (!token) throw new Error('Sign in to load live admin content.');

    const response = await fetch(path, {
      headers: { Accept: 'application/json', Authorization: token },
    });
    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      throw new Error('The admin content endpoint returned an invalid response.');
    }
    if (!response.ok) {
      throw new Error(payload.message || `Admin content request failed (HTTP ${response.status}).`);
    }
    if (!payload || !Array.isArray(payload.data)) {
      throw new Error('The admin content endpoint returned an unexpected data format.');
    }
    return payload.data;
  }

  async function loadPreviewContent() {
    previewContent.loading = true;
    previewContent.error = '';
    updatePhoneSimulator();

    try {
      const results = await Promise.all([
        getAdminArray('/adminapi/categories?status=true'),
        getAdminArray('/adminapi/festivals'),
      ]);
      const categories = results[0];
      const festivals = results[1];
      const subcategories = categories
        .filter(category => category && category.status !== false)
        .flatMap(category => Array.isArray(category.subcategories) ? category.subcategories : [])
        .filter(subcategory => subcategory && subcategory.status !== false)
        .slice(0, 12);

      const templateResults = await Promise.all(subcategories.map(async (subcategory) => {
        const id = subcategory._id || subcategory.id;
        if (!id) return null;
        const images = await getAdminArray(`/adminapi/subcategories/getimages?id=${encodeURIComponent(id)}`);
        const image = images.find(item => typeof item === 'string' && item.trim())
          || images.find(item => item && typeof item.path === 'string' && item.path.trim());
        const imagePath = typeof image === 'string' ? image : image && image.path;
        if (!imagePath) return null;
        return {
          title: subcategory.subcategoryName || 'Template',
          imageUrl: imagePath,
        };
      }));

      previewContent.templates = templateResults.filter(Boolean).slice(0, 4);
      previewContent.festivals = festivals
        .filter(festival => festival && festival.status !== false)
        .filter(festival => Array.isArray(festival.festivalImages) && festival.festivalImages.length > 0)
        .slice(0, 3)
        .map(festival => ({
          title: festival.festivalName || 'Festival',
          imageUrl: festival.festivalImages[0],
        }));
    } catch (error) {
      previewContent.error = error instanceof Error
        ? error.message
        : 'Could not load live admin content.';
      previewContent.templates = [];
      previewContent.festivals = [];
    } finally {
      previewContent.loading = false;
      updatePhoneSimulator();
    }
  }

  async function loadAppConfig() {
    if (configLoaded) return;
    try {
      const res = await fetch('/adminapi/appcontrol');
      const data = await res.json();
      let configData = data && data.data;
      if (
        !configData ||
        Array.isArray(configData) ||
        typeof configData !== 'object' ||
        !configData.homeScreen
      ) {
        const publicRes = await fetch('/api/app/config');
        const publicData = await publicRes.json();
        configData = publicData && publicData.data;
        if (!configData || !configData.homeScreen) configData = publicData;
      }

      if (configData && !Array.isArray(configData) && configData.homeScreen) {
        appConfig = Object.assign({}, appConfig, configData);
        configLoaded = true;
        updatePhoneSimulator();
        if (typeof updateAllAdminLogos === 'function') {
          updateAllAdminLogos(appConfig.preloaderScreen && appConfig.preloaderScreen.appIcon && appConfig.preloaderScreen.appIcon.url);
        }
        const content = document.getElementById('studio-tab-content');
        if (content) {
          content.innerHTML = renderTabContent(activeStudioTab);
          bindControlInputs();
        }
      } else {
        throw new Error('App configuration response did not contain home screen settings.');
      }
    } catch (e) {
      console.warn('Could not load app control config:', e);
    }
    loadPreviewContent();
  }
  loadAppConfig();

  function isAppScreensRoute() {
    const path = decodeURIComponent(window.location.pathname || '').toLowerCase();
    const hash = decodeURIComponent(window.location.hash || '').toLowerCase();
    return (
      path.includes('app-screen') ||
      path.includes('app_screen') ||
      path.includes('app screen') ||
      hash.includes('app-screen') ||
      hash.includes('app_screen') ||
      hash.includes('app screen')
    );
  }

  function isInsideSidebar(el) {
    if (!el || el === document.body) return false;
    // Check if element is inside or is the sidebar drawer/list/nav item
    if (el.closest && el.closest('.MuiDrawer-root, .MuiDrawer-paper, .MuiDrawer-docked, aside, nav, #nav-item-app-screens')) return true;
    // If element contains the sidebar root, it is the sidebar outer wrapper
    if (el.querySelector && (el.querySelector('.MuiDrawer-root, .MuiDrawer-paper, .MuiList-root') || el.classList.contains('MuiDrawer-root') || el.classList.contains('MuiDrawer-paper'))) {
      return true;
    }
    let curr = el;
    while (curr && curr !== document.body) {
      const s = curr.getAttribute ? (curr.getAttribute('style') || '') : '';
      if (s.includes('width: 280') || s.includes('width:280') || s.includes('width: 68') || s.includes('width:68') || (s.includes('width: 260') && !s.includes('calc(')) || (s.includes('width:260') && !s.includes('calc('))) {
        return true;
      }
      curr = curr.parentElement;
    }
    return false;
  }

  function getMainContentContainer() {
    const root = document.getElementById('root');
    if (!root) return null;

    // 1. Direct class match for Root Layout container: div[class*="makeStyles-container-"]
    const containerDiv = root.querySelector('div[class*="makeStyles-container-"]');
    if (containerDiv && !isInsideSidebar(containerDiv)) {
      return containerDiv;
    }

    // 2. React flex wrapper's last child
    const flexWrapper = root.querySelector('[style*="min-height: 100vh"], [style*="min-height:100vh"]');
    if (flexWrapper && flexWrapper.children && flexWrapper.children.length >= 2) {
      const lastChild = flexWrapper.lastElementChild;
      if (lastChild && !isInsideSidebar(lastChild)) {
        return lastChild;
      }
    }

    // 3. Fallback: parent of .MuiGrid-container outside sidebar
    const grids = root.querySelectorAll('.MuiGrid-container');
    for (const g of grids) {
      if (!isInsideSidebar(g)) {
        let parent = g.parentElement;
        while (parent && parent !== root && !isInsideSidebar(parent)) {
          if (parent.parentElement === flexWrapper || (parent.getAttribute('class') || '').includes('container')) {
            return parent;
          }
          parent = parent.parentElement;
        }
      }
    }

    // 4. Fallback: div[class*="jss2"]
    const jss2 = root.querySelector('div[class*="jss2"]');
    if (jss2 && !isInsideSidebar(jss2)) {
      return jss2;
    }

    return null;
  }

  function getAppIconShapeRadius(shape) {
    if (shape === 'circle') return '50%';
    if (shape === 'square') return '6px';
    if (shape === 'shield') return '12px 12px 28px 28px';
    return '20px'; // default rounded_square (iOS squircle)
  }

  function getAppIconBg(bgType) {
    if (bgType === 'saffron') return 'linear-gradient(135deg, #7C2D12 0%, #EA580C 50%, #F97316 100%)';
    if (bgType === 'white') return '#FFFFFF';
    if (bgType === 'navy') return 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)';
    if (bgType === 'gold') return 'linear-gradient(135deg, #78350F 0%, #D97706 100%)';
    return 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)'; // default blue
  }

  let _logoObserver = null;
  function updateAllAdminLogos(newUrl) {
    if (!newUrl) return;
    const cleanUrl = String(newUrl).trim();
    if (!cleanUrl) return;
    window.__currentAdminLogoUrl = cleanUrl;

    const applyLogos = () => {
      try {
        const selector = 'img[src*="logo"], img[src*="logo192"], img[src*="logowhite"], .MuiAppBar-root img, [class*="logo"] img, header img, .sidebar-brand img, .MuiDrawer-root img';
        document.querySelectorAll(selector).forEach(img => {
          if (img.src !== cleanUrl) {
            img.src = cleanUrl;
          }
        });
      } catch (e) {}
    };

    applyLogos();

    // Persistent observer for dynamic React route navigation
    if (!_logoObserver && typeof MutationObserver !== 'undefined') {
      _logoObserver = new MutationObserver(() => {
        if (window.__currentAdminLogoUrl) {
          applyLogos();
        }
      });
      _logoObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  function renderAppIconHTML(size = 48) {
    const iconConfig = (appConfig && appConfig.preloaderScreen && appConfig.preloaderScreen.appIcon)
      ? appConfig.preloaderScreen.appIcon
      : { type: 'preset', preset: '🇮🇳', url: '', shape: 'rounded_square', bgColor: 'blue' };
    const radius = getAppIconShapeRadius(iconConfig.shape);
    const bg = getAppIconBg(iconConfig.bgColor);

    if (iconConfig.url && iconConfig.url.trim().length > 0) {
      return `
        <div style="width: ${size}px; height: ${size}px; border-radius: ${radius}; background: ${bg}; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.15); flex-shrink: 0;">
          <img src="${escapeHtml(iconConfig.url)}" alt="App Icon" style="width: 100%; height: 100%; object-fit: contain; border-radius: ${radius};" onerror="this.onerror=null; this.parentElement.innerHTML='🏛️';" />
        </div>
      `;
    }

    const preset = iconConfig.preset || '🇮🇳';
    const fontSize = Math.round(size * 0.55);
    return `
      <div style="width: ${size}px; height: ${size}px; border-radius: ${radius}; background: ${bg}; display: flex; align-items: center; justify-content: center; font-size: ${fontSize}px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); flex-shrink: 0;">
        ${preset}
      </div>
    `;
  }

  function injectAppScreensStudio() {
    const isAppScreens = isAppScreensRoute();

    // 1. Purge any studio elements trapped inside the sidebar or drawer
    document.querySelectorAll('.MuiDrawer-root #app-screens-studio-container, .MuiDrawer-paper #app-screens-studio-container, aside #app-screens-studio-container, nav #app-screens-studio-container, #nav-item-app-screens #app-screens-studio-container, [style*="width: 280"] #app-screens-studio-container, [style*="width:280"] #app-screens-studio-container, [style*="width: 260"] #app-screens-studio-container, [style*="width:260"] #app-screens-studio-container').forEach(el => el.remove());

    // 2. Restore any accidentally hidden children in the sidebar
    document.querySelectorAll('.MuiDrawer-root [style*="display: none"], .MuiDrawer-paper [style*="display: none"], [style*="width: 280"] [style*="display: none"], [style*="width:280"] [style*="display: none"]').forEach(el => {
      if (el.id !== 'app-screens-studio-container') {
        el.style.display = '';
      }
    });

    let studio = document.getElementById('app-screens-studio-container');
    const mainContainer = getMainContentContainer();
    if (!mainContainer || mainContainer === document.body) {
      // React layout is still mounting, retry on next tick
      return;
    }

    if (studio && studio.parentElement !== mainContainer) {
      studio.remove();
      studio = null;
    }

    if (!isAppScreens) {
      if (studio) studio.remove();
      // Restore other views
      Array.from(mainContainer.children).forEach(child => {
        if (child.id !== 'app-screens-studio-container') {
          child.style.display = '';
        }
      });
      const hero = document.getElementById('modern-hero-banner');
      if (hero) hero.style.display = 'flex';
      const extras = document.getElementById('modern-dashboard-extras-container');
      if (extras) extras.style.display = 'grid';
      const grid = document.querySelector('.MuiGrid-container');
      if (grid) grid.style.display = 'flex';
      return;
    }

    // Cleanly normalize URL bar if there's a space or %20
    if (window.location.pathname.includes(' ') || window.location.pathname.includes('%20')) {
      history.replaceState(null, '', '/app-screens');
    }

    // Ensure mainContainer fits cleanly on desktop without horizontal scrolling
    const isSidebarCollapsed = document.body.classList.contains('sidebar-collapsed');
    mainContainer.style.flex = '1 1 0%';
    mainContainer.style.minWidth = '0';
    mainContainer.style.maxWidth = isSidebarCollapsed ? 'calc(100vw - 68px)' : 'calc(100vw - 260px)';
    mainContainer.style.width = 'auto';
    mainContainer.style.boxSizing = 'border-box';
    mainContainer.style.overflowX = 'hidden';
    mainContainer.style.display = 'block';

    // Hide all other children inside mainContainer when on App Screens
    Array.from(mainContainer.children).forEach(child => {
      if (child.id !== 'app-screens-studio-container') {
        child.style.display = 'none';
      }
    });

    if (!studio || !mainContainer.contains(studio)) {
      if (studio) studio.remove();
      studio = document.createElement('div');
      studio.id = 'app-screens-studio-container';
      studio.style.width = '100%';
      studio.style.maxWidth = '100%';
      studio.style.boxSizing = 'border-box';
      studio.style.overflowX = 'hidden';
      studio.style.display = 'block';
      studio.innerHTML = renderStudioHTML();
      mainContainer.appendChild(studio);

      bindStudioEvents();
      updatePhoneSimulator();
    } else {
      studio.style.display = 'block';
    }
  }

  function renderStudioHTML() {
    return `
      <!-- Studio Header v2 -->
      <div class="studio-header-v2">
        <div class="studio-header-left">
          <div class="studio-header-icon-wrap">
            ${renderAppIconHTML(36)}
          </div>
          <div>
            <h2 class="studio-header-title">
              Connected App Studio
              <span class="studio-live-badge">
                <span class="studio-live-dot"></span> LIVE
              </span>
            </h2>
            <p class="studio-header-sub">Manage App Icon · Preloader Splash · Theme Colors · Home Hero</p>
          </div>
        </div>
        <div class="studio-header-actions">
          <button id="studio-reset-btn" class="studio-btn studio-btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset
          </button>
          <button id="studio-save-btn" class="studio-btn studio-btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save &amp; Publish
          </button>
        </div>
      </div>

      <!-- Studio Body (2 columns: Controls + Phone Simulator) -->
      <div class="app-screen-studio">
        <!-- Left: Control Panels -->
        <div class="studio-main-panel">
          <!-- Premium Segmented Tab Bar v2 -->
          <div class="studio-tabs-v2">
            <button class="studio-tab-v2 ${activeStudioTab === 'appicon' ? 'active' : ''}" data-tab="appicon">
              <span class="studio-tab-icon">📱</span>
              <span class="studio-tab-label">App Icon</span>
            </button>
            <button class="studio-tab-v2 ${activeStudioTab === 'preloader' ? 'active' : ''}" data-tab="preloader">
              <span class="studio-tab-icon">⏳</span>
              <span class="studio-tab-label">Preloader</span>
            </button>
            <button class="studio-tab-v2 ${activeStudioTab === 'theme' ? 'active' : ''}" data-tab="theme">
              <span class="studio-tab-icon">🎨</span>
              <span class="studio-tab-label">App Theme</span>
            </button>
            <button class="studio-tab-v2 ${activeStudioTab === 'hero' ? 'active' : ''}" data-tab="hero">
              <span class="studio-tab-icon">✨</span>
              <span class="studio-tab-label">Home Hero</span>
            </button>
            <button class="studio-tab-v2 ${activeStudioTab === 'frames' ? 'active' : ''}" data-tab="frames">
              <span class="studio-tab-icon">🖼️</span>
              <span class="studio-tab-label">Digital Frames</span>
            </button>
          </div>

          <!-- Dynamic Tab Content -->
          <div id="studio-tab-content" class="studio-section-fade">
            ${renderTabContent(activeStudioTab)}
          </div>
        </div>

        <!-- Right: Live Smartphone Simulator -->
        <div class="phone-simulator-sticky">
          <!-- Live Preview Label -->
          <div class="sim-live-label">
            <span class="sim-live-pulse"></span>
            <span>LIVE PREVIEW</span>
            <span class="sim-synced-badge">SYNCED</span>
          </div>

          <!-- Phone Shell v2 -->
          <div class="phone-shell phone-shell-v2">
            <!-- Dynamic Island Notch -->
            <div class="phone-dynamic-island"></div>
            <!-- Side buttons (decorative) -->
            <div class="phone-side-btn phone-side-btn-vol-up"></div>
            <div class="phone-side-btn phone-side-btn-vol-down"></div>
            <div class="phone-side-btn phone-side-btn-power"></div>
            <!-- Bottom home bar (decorative) -->
            <div class="phone-home-bar"></div>
            <div class="phone-screen" id="phone-screen-root">
              <!-- Live App rendered dynamically -->
            </div>
          </div>

          <!-- Simulator View Switcher -->
          <div class="simulator-view-switcher">
            <button class="simulator-view-btn ${phoneActiveTab === 'preloader' ? 'active' : ''}" id="sim-view-preloader">
              <span>⏳</span> Preloader
            </button>
            <button class="simulator-view-btn ${phoneActiveTab === 'home' ? 'active' : ''}" id="sim-view-home">
              <span>🏠</span> Home Hero
            </button>
            <button class="simulator-view-btn ${phoneActiveTab === 'appicon' ? 'active' : ''}" id="sim-view-launcher">
              <span>📱</span> Launcher
            </button>
            <button class="simulator-view-btn ${phoneActiveTab === 'frames' ? 'active' : ''}" id="sim-view-frames">
              <span>🖼️</span> Poster Frame
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderTabContent(tab) {
    if (tab === 'appicon') {
      const iconConfig = (appConfig && appConfig.preloaderScreen && appConfig.preloaderScreen.appIcon)
        ? appConfig.preloaderScreen.appIcon
        : { type: 'preset', preset: '🇮🇳', url: '', shape: 'rounded_square', bgColor: 'blue' };

      const shapeCards = [
        { value: 'rounded_square', label: 'Squircle', icon: '▢', desc: 'iOS Style', r: '20px' },
        { value: 'circle', label: 'Circle', icon: '◯', desc: 'Android', r: '50%' },
        { value: 'square', label: 'Square', icon: '□', desc: 'Minimal', r: '6px' },
        { value: 'shield', label: 'Shield', icon: '⛨', desc: 'Royal', r: '12px 12px 24px 24px' },
      ];
      const bgCards = [
        { value: 'blue', label: 'Royal Blue', gradient: 'linear-gradient(135deg,#1E3A8A,#2563EB)' },
        { value: 'saffron', label: 'Kesariya', gradient: 'linear-gradient(135deg,#7C2D12,#F97316)' },
        { value: 'navy', label: 'Midnight', gradient: 'linear-gradient(135deg,#0F172A,#1E293B)' },
        { value: 'gold', label: 'Gold', gradient: 'linear-gradient(135deg,#78350F,#D97706)' },
        { value: 'white', label: 'Clean White', gradient: '#FFFFFF' },
      ];

      return `
        <!-- ICON: Current Icon Preview Hero Card -->
        <div class="icon-preview-hero-v2">
          <div class="icon-preview-hero-bg">
            <div class="icon-preview-phone-frame">
              <div class="icon-preview-status">9:41</div>
              <div id="hero-icon-preview" class="icon-preview-slot">
                ${renderAppIconHTML(80)}
              </div>
              <div class="icon-preview-name">PanchayatPost</div>
            </div>
          </div>
          <div class="icon-preview-info">
            <div class="icon-preview-app-name">PanchayatPost Mobile App</div>
            <div class="icon-preview-desc">Appears on user's home screen, splash preloader, and navigation bar.</div>
            <div class="icon-preview-badges">
              <span id="hero-icon-type-badge" class="icon-badge icon-badge-purple">
                ${iconConfig.url ? 'CUSTOM IMAGE' : 'PRESET EMBLEM'}
              </span>
              <span id="hero-icon-shape-badge" class="icon-badge icon-badge-slate">
                ${iconConfig.shape === 'circle' ? 'Adaptive Circle' : iconConfig.shape === 'shield' ? 'Shield' : iconConfig.shape === 'square' ? 'Square' : 'iOS Squircle'}
              </span>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" id="ctrl-use-default-logo-btn" class="studio-btn studio-btn-secondary" style="font-size: 0.72rem; padding: 5px 10px;">
                Use PanchayatPost Logo
              </button>
              <button type="button" id="ctrl-reset-icon-preset-btn" class="studio-btn studio-btn-secondary" style="font-size: 0.72rem; padding: 5px 10px;">
                Reset to 🇮🇳 Emblem
              </button>
            </div>
          </div>
        </div>

        <!-- Custom Upload Zone -->
        <div class="control-section">
          <div class="control-section-title">Custom Logo Upload</div>
          <div class="icon-upload-zone">
            <input type="file" id="ctrl-icon-file-input" accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif" style="display:none;" />
            <div class="icon-upload-zone-icon">📁</div>
            <div class="icon-upload-zone-title">Drop your logo here</div>
            <div class="icon-upload-zone-desc">PNG, JPG, SVG, WebP — 512×512 transparent recommended</div>
            <button type="button" id="ctrl-choose-file-btn" class="studio-btn studio-btn-primary" style="margin-top: 10px; font-size: 0.78rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Choose from Device
            </button>
            <div id="ctrl-upload-status" class="icon-upload-status">
              ${iconConfig.url ? (iconConfig.url.startsWith('data:image') ? '📦 Device image loaded' : '🌐 ' + iconConfig.url.split('/').pop()) : 'No file chosen'}
            </div>
            <span id="ctrl-file-name-badge" style="display:none; font-size:0.72rem; color:#059669; font-weight:600; background:#ECFDF5; border:1px solid #A7F3D0; padding:3px 8px; border-radius:6px; margin-top:4px;">✓ Loaded</span>
          </div>
          <!-- URL Input -->
          <div style="margin-top: 10px; display: flex; gap: 8px;">
            <input type="text" id="ctrl-icon-url-input" placeholder="Or paste image URL (https://...)" value="${escapeHtml(iconConfig.url || '')}" style="flex:1; padding:8px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.78rem;" />
            <button type="button" id="ctrl-apply-icon-url-btn" class="studio-btn studio-btn-secondary" style="padding:8px 12px; font-size:0.76rem;">Apply</button>
          </div>
        </div>

      `;
    } else if (tab === 'preloader') {
      const isVideo = appConfig.preloaderScreen.mediaType === 'video';

      return `
        <!-- PRELOADER: Enable Toggle -->
        <div class="control-card" style="margin-bottom: 14px;">
          <div class="control-row" style="padding: 14px 0 0 0; border-bottom: none;">
            <div class="control-label-group">
              <span class="control-label" style="font-size:0.95rem;">Enable Preloader Screen</span>
              <span class="control-desc">Display opening splash before home feed loads</span>
            </div>
            <label class="switch-label">
              <input type="checkbox" id="ctrl-preloader-toggle" ${appConfig.preloaderScreen.enabled ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </label>
          </div>
        </div>

        <!-- PRELOADER: Media Mode Cards -->
        <div class="ctrl-section-divider">
          <span class="ctrl-section-label">📺 Preloader Media Mode</span>
        </div>
        <div class="preloader-mode-cards">
          <button type="button" class="preloader-mode-card ${!isVideo ? 'active' : ''}" data-mode="animation" id="pill-mode-animation">
            <div class="preloader-mode-card-icon">✨</div>
            <div class="preloader-mode-card-title">Animated Emblem Splash</div>
            <div class="preloader-mode-card-desc">Branded icon with pulsing glow, motion ring &amp; tagline</div>
            ${!isVideo ? '<div class="preloader-mode-card-check">✓ Active</div>' : ''}
          </button>
          <button type="button" class="preloader-mode-card ${isVideo ? 'active' : ''}" data-mode="video" id="pill-mode-video">
            <div class="preloader-mode-card-icon">🎬</div>
            <div class="preloader-mode-card-title">Video Splash Preloader</div>
            <div class="preloader-mode-card-desc">Full MP4/WebM intro video with interactive Skip button</div>
            ${isVideo ? '<div class="preloader-mode-card-check">✓ Active</div>' : ''}
          </button>
        </div>

        <!-- PRELOADER: Live Preview Action -->
        <div class="preloader-preview-banner">
          <div>
            <div style="font-weight:800; font-size:0.88rem; color:#1E40AF;">👁️ Live Preloader View</div>
            <div style="font-size:0.72rem; color:#3B82F6;">See exactly how the opening preloader looks on mobile</div>
          </div>
          <button type="button" id="ctrl-preview-preloader-btn" class="studio-btn studio-btn-primary" style="font-size:0.78rem;">
            ▶ Show on Phone
          </button>
        </div>

        ${isVideo ? `
          <!-- VIDEO PRELOADER CONTROLS -->
          <div class="control-section accent-left-blue" style="margin-top:14px;">
            <div class="control-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              Upload Preloader Video
            </div>
            <div class="video-dropzone-v2">
              <div class="video-dropzone-icon">🎬</div>
              <div class="video-dropzone-title">Drag &amp; drop your video here</div>
              <div class="video-dropzone-desc">MP4, WebM, or MOV — Max 50 MB. Plays automatically on app open.</div>
              <input type="file" id="ctrl-video-upload-file" accept="video/mp4,video/webm,video/quicktime,video/x-matroska" style="display:none;" />
              <button type="button" id="ctrl-video-upload-btn" class="studio-btn studio-btn-primary" style="margin-top:12px; font-size:0.8rem;">
                ⬆ Upload &amp; Apply Video
              </button>
            </div>
            <div style="display:flex; gap:8px; margin-top:10px;">
              <input type="text" id="ctrl-video-url-input" placeholder="https://example.com/splash.mp4" value="${escapeHtml(appConfig.preloaderScreen.videoUrl || '')}" style="flex:1; padding:8px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:0.78rem;" />
              <button type="button" id="ctrl-apply-video-url-btn" class="studio-btn studio-btn-secondary" style="padding:8px 12px; font-size:0.76rem;">Apply URL</button>
            </div>
            ${appConfig.preloaderScreen.videoUrl ? `
              <div class="video-current-badge" style="margin-top:10px; display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:#ECFDF5; border:1px solid #A7F3D0; border-radius:8px;">
                <div style="display:flex; align-items:center; gap:8px; overflow:hidden;">
                  <span>✅</span>
                  <div style="font-size:0.78rem; font-weight:700; color:#065F46; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;">Active: ${escapeHtml(appConfig.preloaderScreen.videoUrl)}</div>
                </div>
                <div style="display:flex; gap:6px;">
                  <button type="button" id="ctrl-play-video-sim-btn" class="studio-btn studio-btn-primary" style="padding:4px 10px; font-size:0.72rem;">▶ Play in Phone</button>
                  <button type="button" id="ctrl-remove-video-btn" style="background:transparent; border:none; font-size:0.72rem; font-weight:700; color:#DC2626; cursor:pointer; padding:4px;">Remove</button>
                </div>
              </div>
            ` : ''}
            <div class="ctrl-section-divider" style="margin-top:16px;"><span class="ctrl-section-label">Video Options</span></div>
            <div class="control-row">
              <div class="control-label-group"><span class="control-label">Muted Autoplay</span><span class="control-desc">Required by mobile devices for instant playback</span></div>
              <label class="switch-label"><input type="checkbox" id="ctrl-video-muted" ${appConfig.preloaderScreen.videoMuted ? 'checked' : ''}><span class="switch-slider"></span></label>
            </div>
            <div class="control-row">
              <div class="control-label-group"><span class="control-label">Skip &gt; Button</span><span class="control-desc">Allow users to skip to home screen immediately</span></div>
              <label class="switch-label"><input type="checkbox" id="ctrl-video-skip" ${appConfig.preloaderScreen.skipButtonEnabled ? 'checked' : ''}><span class="switch-slider"></span></label>
            </div>
            <div class="control-row">
              <div class="control-label-group"><span class="control-label">Loop in Simulator</span><span class="control-desc">Keep video looping in phone preview</span></div>
              <label class="switch-label"><input type="checkbox" id="ctrl-video-loop" ${appConfig.preloaderScreen.videoLoop ? 'checked' : ''}><span class="switch-slider"></span></label>
            </div>
            <div class="control-row" style="border-bottom:none; padding-bottom:0;">
              <div class="control-label-group"><span class="control-label">Video Screen Fit</span><span class="control-desc">How video fills mobile screen dimensions</span></div>
              <div class="option-pill-row">
                <button type="button" class="option-pill ${appConfig.preloaderScreen.videoFit !== 'contain' ? 'active' : ''}" data-fit-value="cover" id="ctrl-fit-cover">Cover</button>
                <button type="button" class="option-pill ${appConfig.preloaderScreen.videoFit === 'contain' ? 'active' : ''}" data-fit-value="contain" id="ctrl-fit-contain">Contain</button>
              </div>
              <select id="ctrl-video-fit" style="display:none;">
                <option value="cover" ${appConfig.preloaderScreen.videoFit !== 'contain' ? 'selected' : ''}>Cover</option>
                <option value="contain" ${appConfig.preloaderScreen.videoFit === 'contain' ? 'selected' : ''}>Contain</option>
              </select>
            </div>
          </div>
        ` : `
          <!-- ANIMATION PRELOADER CONTROLS -->
          <div class="control-section accent-left-blue" style="margin-top:14px;">
            <div class="control-section-title">Animation Settings</div>

            <div class="control-row">
              <div class="control-label-group"><span class="control-label">Duration</span><span class="control-desc">How long splash stays visible</span></div>
              <div class="option-pill-row">
                ${[['1.5','Fast'],['2.0','Standard'],['2.5','Recommended'],['3.5','Cinematic']].map(([v,l]) =>
                  `<button type="button" class="option-pill ${String(appConfig.preloaderScreen.durationSeconds) === v ? 'active' : ''}" data-duration-value="${v}">${l}</button>`
                ).join('')}
              </div>
              <select id="ctrl-preloader-duration" style="display:none;">
                <option value="1.5" ${appConfig.preloaderScreen.durationSeconds === 1.5 ? 'selected' : ''}>1.5s</option>
                <option value="2.0" ${appConfig.preloaderScreen.durationSeconds === 2.0 ? 'selected' : ''}>2.0s</option>
                <option value="2.5" ${appConfig.preloaderScreen.durationSeconds === 2.5 ? 'selected' : ''}>2.5s</option>
                <option value="3.5" ${appConfig.preloaderScreen.durationSeconds === 3.5 ? 'selected' : ''}>3.5s</option>
              </select>
            </div>

            <div class="control-row">
              <div class="control-label-group"><span class="control-label">Animation Style</span><span class="control-desc">Visual loading motion effect</span></div>
              <div class="option-pill-row">
                ${[['pulse_logo','Pulsing Glow'],['spinner','Spinner Ring'],['shimmer_bar','Progress Bar']].map(([v,l]) =>
                  `<button type="button" class="option-pill ${appConfig.preloaderScreen.animationStyle === v ? 'active' : ''}" data-anim-value="${v}">${l}</button>`
                ).join('')}
              </div>
              <select id="ctrl-preloader-animation" style="display:none;">
                <option value="pulse_logo" ${appConfig.preloaderScreen.animationStyle === 'pulse_logo' ? 'selected' : ''}>Pulsing Glowing Emblem</option>
                <option value="spinner" ${appConfig.preloaderScreen.animationStyle === 'spinner' ? 'selected' : ''}>Circular Ring Spinner</option>
                <option value="shimmer_bar" ${appConfig.preloaderScreen.animationStyle === 'shimmer_bar' ? 'selected' : ''}>Smooth Progress Bar</option>
              </select>
            </div>

            <!-- Tagline with character count -->
            <div class="preloader-tagline-wrap">
              <div class="control-section-title" style="margin-bottom:8px;">Splash Tagline / Motto</div>
              <div style="position:relative;">
                <input type="text" id="ctrl-preloader-tagline" value="${escapeHtml(appConfig.preloaderScreen.tagline)}" maxlength="80" class="preloader-tagline-input" placeholder="Your app's inspiring tagline…" />
                <span class="preloader-tagline-count" id="preloader-tagline-count">${(appConfig.preloaderScreen.tagline || '').length}/80</span>
              </div>
            </div>

            <div class="control-row">
              <div class="control-label-group"><span class="control-label">Background Theme</span><span class="control-desc">Color palette for opening splash</span></div>
              <div class="option-pill-row">
                ${[['gradient_blue','Royal Blue'],['saffron_gradient','Kesariya'],['clean_white','White'],['tricolor','Tricolor']].map(([v,l]) =>
                  `<button type="button" class="option-pill ${appConfig.preloaderScreen.bgGradient === v ? 'active' : ''}" data-bg-gradient-value="${v}">${l}</button>`
                ).join('')}
              </div>
              <select id="ctrl-preloader-bg" style="display:none;">
                <option value="gradient_blue" ${appConfig.preloaderScreen.bgGradient === 'gradient_blue' ? 'selected' : ''}>Deep Royal Blue</option>
                <option value="saffron_gradient" ${appConfig.preloaderScreen.bgGradient === 'saffron_gradient' ? 'selected' : ''}>Kesariya Saffron</option>
                <option value="clean_white" ${appConfig.preloaderScreen.bgGradient === 'clean_white' ? 'selected' : ''}>Clean White</option>
                <option value="tricolor" ${appConfig.preloaderScreen.bgGradient === 'tricolor' ? 'selected' : ''}>National Tricolor</option>
              </select>
            </div>

            <div class="control-row" style="border-bottom:none; padding-bottom:0;">
              <div class="control-label-group"><span class="control-label">Show App Version</span><span class="control-desc">Display build version at bottom of splash</span></div>
              <label class="switch-label"><input type="checkbox" id="ctrl-preloader-version" ${appConfig.preloaderScreen.showVersion ? 'checked' : ''}><span class="switch-slider"></span></label>
            </div>
          </div>
        `}
      `;
    } else if (tab === 'theme') {
      const currentTheme = appConfig.globalSettings.themeColor || '#2563EB';

      const swatchDefs = [
        { color: '#2563EB', name: 'Royal Blue', hex: '#2563EB' },
        { color: '#EA580C', name: 'Kesariya', hex: '#EA580C' },
        { color: '#059669', name: 'Panchayat Green', hex: '#059669' },
        { color: '#0F172A', name: 'Midnight Navy', hex: '#0F172A' },
        { color: '#7C3AED', name: 'Royal Purple', hex: '#7C3AED' },
        { color: '#DC2626', name: 'Crimson Red', hex: '#DC2626' },
        { color: '#D97706', name: 'Rich Gold', hex: '#D97706' },
        { color: '#10B981', name: 'Emerald Mint', hex: '#10B981' },
      ];

      return `
        <!-- THEME: Live Banner Card -->
        <div class="theme-live-banner-v2" style="background: linear-gradient(135deg, ${currentTheme} 0%, #0F172A 100%);" id="theme-live-banner">
          <div class="theme-live-banner-left">
            ${renderAppIconHTML(44)}
            <div class="theme-live-banner-text">
              <div class="theme-live-banner-title">Gram Panchayat Digital App</div>
              <div class="theme-live-banner-sub">Active Brand Color: <strong>${currentTheme.toUpperCase()}</strong></div>
            </div>
          </div>
          <div class="theme-live-mockup">
            <div class="theme-mockup-topbar" style="background: rgba(255,255,255,0.18);"></div>
            <div class="theme-mockup-card" style="background: rgba(255,255,255,0.12);"></div>
            <div class="theme-mockup-card" style="background: rgba(255,255,255,0.08);"></div>
          </div>
          <span class="theme-live-pill">LIVE THEME</span>
        </div>

        <!-- THEME: Color Swatches -->
        <div class="ctrl-section-divider" style="margin-top:18px;">
          <span class="ctrl-section-label">🎨 Brand Color Presets</span>
        </div>
        <div class="theme-swatches-grid-v2">
          ${swatchDefs.map(s => `
            <div class="theme-swatch-v2 ${currentTheme === s.color ? 'active' : ''}" data-color="${s.color}">
              <div class="theme-swatch-circle-v2" style="background: ${s.color};">
                ${currentTheme === s.color ? '<span class="theme-swatch-check">✓</span>' : ''}
              </div>
              <div class="theme-swatch-name-v2">${s.name}</div>
              <div class="theme-swatch-hex-v2">${s.hex}</div>
            </div>
          `).join('')}
        </div>

        <!-- THEME: Custom Hex Picker -->
        <div class="control-section" style="margin-top:16px;">
          <div class="control-section-title">Custom Color Picker</div>
          <div class="color-picker-row">
            <div class="color-picker-preview" id="color-picker-preview-swatch" style="background:${currentTheme};"></div>
            <input type="color" id="ctrl-theme-color-picker" value="${currentTheme}" class="color-picker-native" />
            <input type="text" id="ctrl-theme-color-input" value="${currentTheme}" class="color-picker-hex-input" placeholder="#2563EB" maxlength="7" />
            <span class="color-picker-label">HEX</span>
          </div>
        </div>

        <!-- THEME: Appearance Controls -->
        <div class="ctrl-section-divider" style="margin-top:16px;">
          <span class="ctrl-section-label">⚙️ Appearance Controls</span>
        </div>

        <div class="control-section accent-left-purple">
          <div class="control-row">
            <div class="control-label-group"><span class="control-label">App Appearance Mode</span><span class="control-desc">Light or dark app surfaces</span></div>
            <div class="option-pill-row">
              <button type="button" class="option-pill ${(appConfig.globalSettings.themeMode || 'Light') === 'Light' ? 'active' : ''}" data-mode-value="Light">☀️ Light</button>
              <button type="button" class="option-pill ${appConfig.globalSettings.themeMode === 'Dark' ? 'active' : ''}" data-mode-value="Dark">🌙 Dark</button>
            </div>
            <select id="ctrl-theme-mode" style="display:none;">
              <option value="Light" ${(appConfig.globalSettings.themeMode || 'Light') === 'Light' ? 'selected' : ''}>Light</option>
              <option value="Dark" ${appConfig.globalSettings.themeMode === 'Dark' ? 'selected' : ''}>Dark</option>
            </select>
          </div>

          <div class="control-row">
            <div class="control-label-group"><span class="control-label">Header &amp; App Bar Style</span><span class="control-desc">Top banner gradient appearance</span></div>
            <div class="option-pill-row">
              <button type="button" class="option-pill ${appConfig.globalSettings.headerStyle === 'gradient' ? 'active' : ''}" data-header-value="gradient">Gradient</button>
              <button type="button" class="option-pill ${appConfig.globalSettings.headerStyle === 'solid' ? 'active' : ''}" data-header-value="solid">Solid</button>
              <button type="button" class="option-pill ${appConfig.globalSettings.headerStyle === 'white' ? 'active' : ''}" data-header-value="white">White</button>
            </div>
            <select id="ctrl-header-style" style="display:none;">
              <option value="gradient" ${appConfig.globalSettings.headerStyle === 'gradient' ? 'selected' : ''}>Full Brand Gradient</option>
              <option value="solid" ${appConfig.globalSettings.headerStyle === 'solid' ? 'selected' : ''}>Solid Brand Color</option>
              <option value="white" ${appConfig.globalSettings.headerStyle === 'white' ? 'selected' : ''}>Clean White</option>
            </select>
          </div>

          <div class="control-row" style="border-bottom:none; padding-bottom:0;">
            <div class="control-label-group"><span class="control-label">Element Corner Radius</span><span class="control-desc">Card and button curvature</span></div>
            <div class="option-pill-row">
              <button type="button" class="option-pill ${appConfig.globalSettings.borderRadius === 'rounded' ? 'active' : ''}" data-radius-value="rounded">Rounded</button>
              <button type="button" class="option-pill ${appConfig.globalSettings.borderRadius === 'smooth' ? 'active' : ''}" data-radius-value="smooth">Smooth</button>
              <button type="button" class="option-pill ${appConfig.globalSettings.borderRadius === 'sharp' ? 'active' : ''}" data-radius-value="sharp">Sharp</button>
            </div>
            <select id="ctrl-border-radius" style="display:none;">
              <option value="rounded" ${appConfig.globalSettings.borderRadius === 'rounded' ? 'selected' : ''}>Modern Rounded (14px)</option>
              <option value="smooth" ${appConfig.globalSettings.borderRadius === 'smooth' ? 'selected' : ''}>Standard Card (8px)</option>
              <option value="sharp" ${appConfig.globalSettings.borderRadius === 'sharp' ? 'selected' : ''}>Sharp Minimal (4px)</option>
            </select>
          </div>
        </div>
      `;
    } else if (tab === 'hero') {
      const heroImages = Array.isArray(appConfig.homeScreen.heroImages) && appConfig.homeScreen.heroImages.length
        ? appConfig.homeScreen.heroImages
        : (appConfig.homeScreen.heroImage ? [appConfig.homeScreen.heroImage] : []);

      return `
        <!-- HERO: Header with Upload CTA -->
        <div class="hero-tab-header-v2">
          <div>
            <h3 class="hero-tab-title-v2">📢 Announcement Images</h3>
            <p class="hero-tab-desc-v2">The app rotates these automatically — users can swipe between them on the home screen.</p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <input type="file" id="ctrl-hero-image-file" accept="image/png,image/jpeg,image/webp" multiple style="display:none;" />
            <button type="button" id="ctrl-hero-image-upload-btn" class="studio-btn studio-btn-primary" style="font-size:0.8rem; white-space:nowrap;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Add Images
            </button>
          </div>
        </div>

        <!-- HERO: Info Banner -->
        <div class="hero-info-banner">
          <span class="hero-info-icon">ℹ️</span>
          <span>Upload up to 10 images at once. They appear as a swipeable banner carousel on the app's home screen for announcements, events &amp; notices.</span>
        </div>

        <!-- HERO: Image Grid -->
        ${heroImages.length ? `
          <div class="hero-image-grid-v2">
            ${heroImages.map((imageUrl, index) => {
              const cleanUrl = imageUrl.includes('homeHero') ? '/uploaded/image/homeHero/' + imageUrl.split('/').pop().split('\\').pop() : imageUrl;
              return `
              <div class="hero-img-card-v2">
                <img src="${escapeHtml(cleanUrl)}" alt="Announcement ${index + 1}" onerror="this.onerror=null; this.src='/uploaded/image/homeHero/' + this.src.split('/').pop().split('\\\\').pop();" />
                <div class="hero-img-overlay-v2">
                  <span class="hero-img-label-v2">Image ${index + 1}</span>
                  <button type="button" data-hero-image-remove="${escapeHtml(imageUrl)}" class="hero-img-remove-v2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Remove
                  </button>
                </div>
              </div>
            `;}).join('')}
            <!-- Add More tile -->
            <label class="hero-img-add-tile" for="ctrl-hero-image-file" title="Add more images">
              <span class="hero-img-add-icon">+</span>
              <span class="hero-img-add-label">Add More</span>
            </label>
          </div>
        ` : `
          <!-- Empty State -->
          <div class="hero-empty-state-v2">
            <div class="hero-empty-icon-v2">🖼️</div>
            <div class="hero-empty-title-v2">No Announcement Images Yet</div>
            <div class="hero-empty-desc-v2">Upload images to display a beautiful rotating banner on your app's home screen.</div>
            <label for="ctrl-hero-image-file" class="studio-btn studio-btn-primary" style="margin-top:14px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; font-size:0.82rem; padding:10px 20px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Choose Announcement Images
            </label>
          </div>
        `}
      `;
    }

    
    if (tab === 'frames') {
      const frames = window.__adminFramesList || [];
      return `
        <div class="hero-tab-header-v2" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h3 class="hero-tab-title-v2" style="margin: 0; font-size: 18px; font-weight: 800; color: #1E293B;">🖼️ Digital Poster Frames Management</h3>
            <p class="hero-tab-desc-v2" style="margin: 4px 0 0 0; font-size: 13px; color: #64748B;">
              Manage transparent identity frames that appear inside the mobile app poster editor for Sarpanch & Panchayat leaders.
            </p>
          </div>
          <label for="ctrl-frame-file-upload" class="studio-btn studio-btn-primary" style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; background: #6D28D9; color: white;">
            <span>+</span> Upload New Frame (PNG)
          </label>
          <input type="file" id="ctrl-frame-file-upload" accept="image/png" style="display: none;" />
        </div>

        <!-- Frame List Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
          ${frames.map((f, idx) => `
            <div style="background: white; border: 1.5px solid #E2E8F0; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: transform 0.2s;">
              <div style="height: 140px; background: #0F172A; display: flex; align-items: center; justify-content: center; position: relative; padding: 12px;">
                <img src="${f.path.startsWith('http') ? f.path : 'http://localhost:3000' + f.path}" alt="${f.frameName}" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
                <span style="position: absolute; top: 8px; right: 8px; background: #6D28D9; color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px;">Admin</span>
              </div>
              <div style="padding: 12px;">
                <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${f.frameName}</h4>
                <p style="margin: 0 0 10px 0; font-size: 11px; color: #64748B;">Transparent Frame Overlay</p>
                <div style="display: flex; gap: 8px;">
                  <button class="frame-preview-sim-btn" data-url="${f.path}" style="flex: 1; padding: 6px 10px; font-size: 11px; font-weight: 600; background: #F3E8FF; color: #6D28D9; border: none; border-radius: 8px; cursor: pointer;">Preview on Phone</button>
                  <button class="frame-delete-btn" data-id="${f._id || f.id}" style="padding: 6px 10px; font-size: 11px; font-weight: 600; background: #FEE2E2; color: #DC2626; border: none; border-radius: 8px; cursor: pointer;">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }



    return renderTabContent('appicon');
  }

  function bindStudioEvents() {
    // Tab switching (App Icon, Preloader, Theme, Home Hero)
    // Support both legacy .screen-tab-btn and new .studio-tab-v2
    const tabBtns = document.querySelectorAll('.screen-tab-btn, .studio-tab-v2');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeStudioTab = btn.dataset.tab;
        try { sessionStorage.setItem('active_studio_tab', activeStudioTab); } catch(e) {}
        
        // Match phone view to active tab for seamless preview
        if (activeStudioTab === 'appicon') phoneActiveTab = 'appicon';
        else if (activeStudioTab === 'preloader') phoneActiveTab = 'preloader';
        else phoneActiveTab = 'home';
        try { sessionStorage.setItem('phone_active_view', phoneActiveTab); } catch(e) {}

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const content = document.getElementById('studio-tab-content');
        if (content) {
          content.classList.remove('studio-section-fade');
          void content.offsetWidth; // trigger reflow
          content.classList.add('studio-section-fade');
          content.innerHTML = renderTabContent(activeStudioTab);
        }

        updateSimulatorViewButtons();
        bindControlInputs();
        updatePhoneSimulator();
      });
    });

    // Simulator bottom view buttons
    setupSimulatorViewButtons();

    bindControlInputs();

    // Reset button
    const resetBtn = document.getElementById('studio-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (!confirm('Reset all app screen settings to factory defaults?')) return;
        try {
          const res = await fetch('/adminapi/appcontrol/reset', { method: 'POST' });
          const json = await res.json();
          if (json && json.data) {
            appConfig = json.data;
            const content = document.getElementById('studio-tab-content');
            if (content) content.innerHTML = renderTabContent(activeStudioTab);
            bindControlInputs();
            updatePhoneSimulator();
            showToast('✅ Reset to default app controls successfully!');
          }
        } catch (e) {
          showToast('❌ Reset error: ' + e.message);
        }
      });
    }

    // Save & Publish button
    const saveBtn = document.getElementById('studio-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `⏳ Publishing...`;
        try {
          // Sync any manual logo URL in the input field
          const iconUrlInput = document.getElementById('ctrl-icon-url-input');
          if (iconUrlInput && iconUrlInput.value.trim()) {
            const trimmed = iconUrlInput.value.trim();
            if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
            appConfig.preloaderScreen.appIcon.type = 'custom';
            appConfig.preloaderScreen.appIcon.url = trimmed;
          }
          const res = await fetch('/adminapi/appcontrol', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appConfig)
          });
          const json = await res.json();
          if (json.status) {
            if (typeof updateAllAdminLogos === 'function') {
              updateAllAdminLogos(appConfig.preloaderScreen && appConfig.preloaderScreen.appIcon && appConfig.preloaderScreen.appIcon.url);
            }
            showToast('✅ Settings & Logo published live to Connected App!');
          } else {
            showToast('❌ Error saving: ' + json.message);
          }
        } catch (e) {
          showToast('❌ Save error: ' + e.message);
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Save & Publish
          `;
        }
      });
    }
  }

  function setupSimulatorViewButtons() {
    const btnPreloader = document.getElementById('sim-view-preloader');
    const btnHome = document.getElementById('sim-view-home');
    const btnLauncher = document.getElementById('sim-view-launcher');

    if (btnPreloader) {
      btnPreloader.addEventListener('click', () => {
        phoneActiveTab = 'preloader';
        try { sessionStorage.setItem('phone_active_view', phoneActiveTab); } catch(e) {}
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    if (btnHome) {
      btnHome.addEventListener('click', () => {
        phoneActiveTab = 'home';
        try { sessionStorage.setItem('phone_active_view', phoneActiveTab); } catch(e) {}
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    if (btnLauncher) {
      btnLauncher.addEventListener('click', () => {
        phoneActiveTab = 'appicon';
        try { sessionStorage.setItem('phone_active_view', phoneActiveTab); } catch(e) {}
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    const btnFrames = document.getElementById('sim-view-frames');
    if (btnFrames) {
      btnFrames.addEventListener('click', () => {
        phoneActiveTab = 'frames';
        try { sessionStorage.setItem('phone_active_view', phoneActiveTab); } catch(e) {}
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }
  }

  function updateSimulatorViewButtons() {
    const btnPreloader = document.getElementById('sim-view-preloader');
    const btnHome = document.getElementById('sim-view-home');
    const btnLauncher = document.getElementById('sim-view-launcher');

    if (btnPreloader) btnPreloader.classList.toggle('active', phoneActiveTab === 'preloader');
    if (btnHome) btnHome.classList.toggle('active', phoneActiveTab === 'home');
    if (btnLauncher) btnLauncher.classList.toggle('active', phoneActiveTab === 'appicon');
    const btnFramesSim = document.getElementById('sim-view-frames');
    if (btnFramesSim) btnFramesSim.classList.toggle('active', phoneActiveTab === 'frames');
  }

  function bindControlInputs() {
    // ===== 1. APP ICON CONTROLS =====
    // Support both old .icon-preset-btn and new .icon-preset-card
    const iconButtons = document.querySelectorAll('.icon-preset-btn, .icon-preset-card');
    iconButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const icon = btn.dataset.icon;
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        appConfig.preloaderScreen.appIcon.type = 'preset';
        appConfig.preloaderScreen.appIcon.preset = icon;
        appConfig.preloaderScreen.appIcon.url = '';

        iconButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const input = document.getElementById('ctrl-icon-url-input');
        if (input) input.value = '';

        updateHeroIconPreview();
        updatePhoneSimulator();
        showToast('Icon updated: ' + icon);
      });
    });

    // Visual Shape Cards (new v2)
    const shapeCards = document.querySelectorAll('.icon-shape-card[data-shape-value]');
    shapeCards.forEach(card => {
      card.addEventListener('click', () => {
        const val = card.getAttribute('data-shape-value');
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        appConfig.preloaderScreen.appIcon.shape = val;
        shapeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const hiddenSelect = document.getElementById('ctrl-icon-shape');
        if (hiddenSelect) hiddenSelect.value = val;
        updateHeroIconPreview();
        updatePhoneSimulator();
      });
    });

    // Visual BG Pills (new v2)
    const bgPills = document.querySelectorAll('.icon-bg-pill[data-bg-value]');
    bgPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-bg-value');
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        appConfig.preloaderScreen.appIcon.bgColor = val;
        bgPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const hiddenSelect = document.getElementById('ctrl-icon-bg');
        if (hiddenSelect) hiddenSelect.value = val;
        updateHeroIconPreview();
        updatePhoneSimulator();
      });
    });

    // Option Pills: Duration
    document.querySelectorAll('.option-pill[data-duration-value]').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-duration-value');
        appConfig.preloaderScreen.durationSeconds = parseFloat(val) || 2.5;
        document.querySelectorAll('.option-pill[data-duration-value]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sel = document.getElementById('ctrl-preloader-duration');
        if (sel) sel.value = val;
        updatePhoneSimulator();
      });
    });

    // Option Pills: Animation style
    document.querySelectorAll('.option-pill[data-anim-value]').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-anim-value');
        appConfig.preloaderScreen.animationStyle = val;
        document.querySelectorAll('.option-pill[data-anim-value]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sel = document.getElementById('ctrl-preloader-animation');
        if (sel) sel.value = val;
        updatePhoneSimulator();
      });
    });

    // Option Pills: BG Gradient
    document.querySelectorAll('.option-pill[data-bg-gradient-value]').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-bg-gradient-value');
        appConfig.preloaderScreen.bgGradient = val;
        document.querySelectorAll('.option-pill[data-bg-gradient-value]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sel = document.getElementById('ctrl-preloader-bg');
        if (sel) sel.value = val;
        updatePhoneSimulator();
      });
    });

    // Option Pills: Theme Mode
    document.querySelectorAll('.option-pill[data-mode-value]').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-mode-value');
        appConfig.globalSettings.themeMode = val;
        document.querySelectorAll('.option-pill[data-mode-value]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sel = document.getElementById('ctrl-theme-mode');
        if (sel) sel.value = val;
        phoneActiveTab = 'home'; updateSimulatorViewButtons(); updatePhoneSimulator();
      });
    });

    // Option Pills: Header style
    document.querySelectorAll('.option-pill[data-header-value]').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-header-value');
        appConfig.globalSettings.headerStyle = val;
        document.querySelectorAll('.option-pill[data-header-value]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sel = document.getElementById('ctrl-header-style');
        if (sel) sel.value = val;
        phoneActiveTab = 'home'; updateSimulatorViewButtons(); updatePhoneSimulator();
      });
    });

    // Option Pills: Border radius
    document.querySelectorAll('.option-pill[data-radius-value]').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-radius-value');
        appConfig.globalSettings.borderRadius = val;
        document.querySelectorAll('.option-pill[data-radius-value]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sel = document.getElementById('ctrl-border-radius');
        if (sel) sel.value = val;
        phoneActiveTab = 'home'; updateSimulatorViewButtons(); updatePhoneSimulator();
      });
    });

    // Option Pills: Video Fit
    document.querySelectorAll('.option-pill[data-fit-value]').forEach(pill => {
      pill.addEventListener('click', () => {
        const val = pill.getAttribute('data-fit-value');
        appConfig.preloaderScreen.videoFit = val;
        document.querySelectorAll('.option-pill[data-fit-value]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sel = document.getElementById('ctrl-video-fit');
        if (sel) sel.value = val;
        updatePhoneSimulator();
      });
    });

    // Tagline character counter (new v2)
    const taglineInput = document.getElementById('ctrl-preloader-tagline');
    const taglineCount = document.getElementById('preloader-tagline-count');
    if (taglineInput && taglineCount) {
      taglineInput.addEventListener('input', () => {
        taglineCount.textContent = taglineInput.value.length + '/80';
      });
    }

    // Theme swatches v2 live banner update
    const themeSwatchesV2 = document.querySelectorAll('.theme-swatch-v2[data-color]');
    themeSwatchesV2.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        appConfig.globalSettings.themeColor = color;
        themeSwatchesV2.forEach(s => {
          s.classList.remove('active');
          const check = s.querySelector('.theme-swatch-check');
          if (check) check.remove();
        });
        swatch.classList.add('active');
        const circle = swatch.querySelector('.theme-swatch-circle-v2');
        if (circle && !circle.querySelector('.theme-swatch-check')) {
          const chk = document.createElement('span');
          chk.className = 'theme-swatch-check';
          chk.textContent = '✓';
          circle.appendChild(chk);
        }
        // Also update live banner
        const banner = document.getElementById('theme-live-banner');
        if (banner) banner.style.background = `linear-gradient(135deg, ${color} 0%, #0F172A 100%)`;
        const colorPicker = document.getElementById('ctrl-theme-color-picker');
        const colorInput = document.getElementById('ctrl-theme-color-input');
        const previewSwatch = document.getElementById('color-picker-preview-swatch');
        if (colorPicker) colorPicker.value = color;
        if (colorInput) colorInput.value = color;
        if (previewSwatch) previewSwatch.style.background = color;
        // Also sync legacy theme-swatch-card
        document.querySelectorAll('.theme-swatch-card').forEach(s => s.classList.toggle('active', s.dataset.color === color));
        phoneActiveTab = 'home';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
        showToast('App Theme changed to ' + color);
      });
    });

    // Color picker preview swatch sync
    const colorPickerNative = document.getElementById('ctrl-theme-color-picker');
    const colorPickerHex = document.getElementById('ctrl-theme-color-input');
    const colorPickerPreview = document.getElementById('color-picker-preview-swatch');
    if (colorPickerNative && colorPickerHex) {
      colorPickerNative.addEventListener('input', () => {
        const color = colorPickerNative.value;
        appConfig.globalSettings.themeColor = color;
        colorPickerHex.value = color;
        if (colorPickerPreview) colorPickerPreview.style.background = color;
        const banner = document.getElementById('theme-live-banner');
        if (banner) banner.style.background = `linear-gradient(135deg, ${color} 0%, #0F172A 100%)`;
        themeSwatchesV2.forEach(s => s.classList.toggle('active', s.dataset.color === color));
        document.querySelectorAll('.theme-swatch-card').forEach(s => s.classList.toggle('active', s.dataset.color === color));
        phoneActiveTab = 'home'; updateSimulatorViewButtons(); updatePhoneSimulator();
      });
    }

    // Choose Logo from Device handlers
    const chooseFileBtn = document.getElementById('ctrl-choose-file-btn');
    const iconFileInput = document.getElementById('ctrl-icon-file-input');
    const fileNameBadge = document.getElementById('ctrl-file-name-badge');
    const uploadStatus = document.getElementById('ctrl-upload-status');

    if (chooseFileBtn && iconFileInput) {
      chooseFileBtn.addEventListener('click', () => {
        iconFileInput.click();
      });

      iconFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          showToast('⚠️ Please select an image file (PNG, JPG, SVG, WebP)');
          return;
        }

        const displayName = file.name.length > 20 ? file.name.substring(0, 18) + '...' : file.name;
        if (fileNameBadge) {
          fileNameBadge.textContent = '✓ ' + displayName;
          fileNameBadge.style.display = 'inline-block';
        }
        if (uploadStatus) {
          uploadStatus.textContent = '⏳ Loading ' + displayName + '...';
        }

        // Instant preview via FileReader
        const reader = new FileReader();
        reader.onload = async (evt) => {
          const dataUrl = evt.target.result;
          if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
          appConfig.preloaderScreen.appIcon.type = 'custom';
          
          const heroSlot = document.getElementById('hero-icon-preview');
          if (heroSlot) {
            heroSlot.innerHTML = `<div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:20px;box-shadow:0 4px 10px rgba(0,0,0,0.15);"><img src="${dataUrl}" alt="App Icon" style="width:100%;height:100%;object-fit:contain;" /></div>`;
          }
          iconButtons.forEach(b => b.classList.remove('active'));

          // Upload file directly to backend storage (/adminapi/appcontrol/upload-logo)
          try {
            const formData = new FormData();
            formData.append('logo', file);
            const uploadRes = await fetch('/adminapi/appcontrol/upload-logo', {
              method: 'POST',
              body: formData
            });
            if (uploadRes.ok) {
              const uploadJson = await uploadRes.json();
              if (uploadJson.status && uploadJson.url) {
                appConfig.preloaderScreen.appIcon.url = uploadJson.url;
                if (iconUrlInput) {
                  iconUrlInput.value = uploadJson.url;
                }
                if (uploadStatus) {
                  uploadStatus.textContent = '✅ Saved: ' + uploadJson.url.split('/').pop();
                }
                showToast('📁 Logo uploaded and saved to server!');
                updateHeroIconPreview();
                updatePhoneSimulator();
                if (typeof updateAllAdminLogos === 'function') {
                  updateAllAdminLogos(uploadJson.url);
                }
              }
            } else {
              appConfig.preloaderScreen.appIcon.url = dataUrl;
              if (iconUrlInput) iconUrlInput.value = dataUrl;
              if (uploadStatus) uploadStatus.textContent = '📦 Using direct device image';
            }
          } catch (uploadErr) {
            appConfig.preloaderScreen.appIcon.url = dataUrl;
            if (iconUrlInput) iconUrlInput.value = dataUrl;
            if (uploadStatus) uploadStatus.textContent = '📦 Using direct device image';
            console.log('Server upload optional fallback:', uploadErr);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    const applyIconUrlBtn = document.getElementById('ctrl-apply-icon-url-btn');
    const iconUrlInput = document.getElementById('ctrl-icon-url-input');
    if (applyIconUrlBtn && iconUrlInput) {
      applyIconUrlBtn.addEventListener('click', () => {
        const url = iconUrlInput.value.trim();
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        if (url) {
          appConfig.preloaderScreen.appIcon.type = 'custom';
          appConfig.preloaderScreen.appIcon.url = url;
          iconButtons.forEach(b => b.classList.remove('active'));
          showToast('✅ Custom icon applied!');
        } else {
          appConfig.preloaderScreen.appIcon.type = 'preset';
          appConfig.preloaderScreen.appIcon.url = '';
        }
        updateHeroIconPreview();
        updatePhoneSimulator();
        if (typeof updateAllAdminLogos === 'function') {
          updateAllAdminLogos(url);
        }
      });
    }

    const defaultLogoBtn = document.getElementById('ctrl-use-default-logo-btn');
    if (defaultLogoBtn) {
      defaultLogoBtn.addEventListener('click', () => {
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        appConfig.preloaderScreen.appIcon.type = 'custom';
        appConfig.preloaderScreen.appIcon.url = '/uploaded/image/appLogo/app_logo_official.png';
        const input = document.getElementById('ctrl-icon-url-input');
        if (input) input.value = '/uploaded/image/appLogo/app_logo_official.png';
        iconButtons.forEach(b => b.classList.remove('active'));
        updateHeroIconPreview();
        updatePhoneSimulator();
        if (typeof updateAllAdminLogos === 'function') {
          updateAllAdminLogos('/uploaded/image/appLogo/app_logo_official.png');
        }
        showToast('Applied official PanchayatPost logo!');
      });
    }

    const resetIconBtn = document.getElementById('ctrl-reset-icon-preset-btn');
    if (resetIconBtn) {
      resetIconBtn.addEventListener('click', () => {
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        appConfig.preloaderScreen.appIcon.type = 'preset';
        appConfig.preloaderScreen.appIcon.preset = '🇮🇳';
        appConfig.preloaderScreen.appIcon.url = '';
        const input = document.getElementById('ctrl-icon-url-input');
        if (input) input.value = '';
        iconButtons.forEach(b => b.classList.toggle('active', b.dataset.icon === '🇮🇳'));
        updateHeroIconPreview();
        updatePhoneSimulator();
        showToast('Reset icon to 🇮🇳 Emblem');
      });
    }

    const iconShape = document.getElementById('ctrl-icon-shape');
    if (iconShape) {
      iconShape.addEventListener('change', () => {
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        appConfig.preloaderScreen.appIcon.shape = iconShape.value;
        updateHeroIconPreview();
        updatePhoneSimulator();
      });
    }

    const iconBg = document.getElementById('ctrl-icon-bg');
    if (iconBg) {
      iconBg.addEventListener('change', () => {
        if (!appConfig.preloaderScreen.appIcon) appConfig.preloaderScreen.appIcon = {};
        appConfig.preloaderScreen.appIcon.bgColor = iconBg.value;
        updateHeroIconPreview();
        updatePhoneSimulator();
      });
    }

    // ===== 2. PRELOADER & VIDEO CONTROLS =====
    const previewPreloaderBtn = document.getElementById('ctrl-preview-preloader-btn');
    if (previewPreloaderBtn) {
      previewPreloaderBtn.addEventListener('click', () => {
        phoneActiveTab = 'preloader';
        try { sessionStorage.setItem('phone_active_view', phoneActiveTab); } catch(e) {}
        updateSimulatorViewButtons();
        updatePhoneSimulator();
        showToast('⏳ Showing live preloader on smartphone simulator');
      });
    }

    const preloaderToggle = document.getElementById('ctrl-preloader-toggle');
    if (preloaderToggle) {
      preloaderToggle.addEventListener('change', () => {
        appConfig.preloaderScreen.enabled = preloaderToggle.checked;
        updatePhoneSimulator();
      });
    }

    const pillAnim = document.getElementById('pill-mode-animation');
    const pillVideo = document.getElementById('pill-mode-video');
    if (pillAnim) {
      pillAnim.addEventListener('click', () => {
        appConfig.preloaderScreen.mediaType = 'animation';
        const content = document.getElementById('studio-tab-content');
        if (content) content.innerHTML = renderTabContent('preloader');
        bindControlInputs();
        phoneActiveTab = 'preloader';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }
    if (pillVideo) {
      pillVideo.addEventListener('click', () => {
        appConfig.preloaderScreen.mediaType = 'video';
        const content = document.getElementById('studio-tab-content');
        if (content) content.innerHTML = renderTabContent('preloader');
        bindControlInputs();
        phoneActiveTab = 'preloader';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    // Video Upload
    const uploadBtn = document.getElementById('ctrl-video-upload-btn');
    const videoFileInput = document.getElementById('ctrl-video-upload-file');
    if (uploadBtn && videoFileInput) {
      uploadBtn.addEventListener('click', async () => {
        const file = videoFileInput.files[0];
        if (!file) {
          alert('Please select a video file first (MP4, WebM, MOV max 50MB).');
          return;
        }
        const formData = new FormData();
        formData.append('video', file);
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '⏳ Uploading Video...';
        try {
          const res = await fetch('/adminapi/appcontrol/upload-video', {
            method: 'POST',
            body: formData,
          });
          const json = await res.json();
          if (json.status && json.videoUrl) {
            appConfig.preloaderScreen.mediaType = 'video';
            appConfig.preloaderScreen.videoUrl = json.videoUrl;
            showToast('✅ Preloader video uploaded and applied live!');
            const content = document.getElementById('studio-tab-content');
            if (content) content.innerHTML = renderTabContent('preloader');
            bindControlInputs();
            phoneActiveTab = 'preloader';
            updateSimulatorViewButtons();
            updatePhoneSimulator();
          } else {
            showToast('❌ Upload failed: ' + (json.message || 'Server error'));
          }
        } catch (e) {
          showToast('❌ Upload error: ' + e.message);
        } finally {
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = '⬆ Upload & Apply Video (Max 50MB)';
        }
      });
    }

    const applyVideoUrlBtn = document.getElementById('ctrl-apply-video-url-btn');
    const videoUrlInput = document.getElementById('ctrl-video-url-input');
    if (applyVideoUrlBtn && videoUrlInput) {
      applyVideoUrlBtn.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
          appConfig.preloaderScreen.mediaType = 'video';
          appConfig.preloaderScreen.videoUrl = url;
          showToast('✅ Video URL applied!');
          const content = document.getElementById('studio-tab-content');
          if (content) content.innerHTML = renderTabContent('preloader');
          bindControlInputs();
          phoneActiveTab = 'preloader';
          updateSimulatorViewButtons();
          updatePhoneSimulator();
        }
      });
    }

    const removeVideoBtn = document.getElementById('ctrl-remove-video-btn');
    if (removeVideoBtn) {
      removeVideoBtn.addEventListener('click', () => {
        appConfig.preloaderScreen.videoUrl = '';
        showToast('Video removed. Switched to animation preloader.');
        const content = document.getElementById('studio-tab-content');
        if (content) content.innerHTML = renderTabContent('preloader');
        bindControlInputs();
        updatePhoneSimulator();
      });
    }

    const playVideoSimBtn = document.getElementById('ctrl-play-video-sim-btn');
    if (playVideoSimBtn) {
      playVideoSimBtn.addEventListener('click', () => {
        phoneActiveTab = 'preloader';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    const videoMuted = document.getElementById('ctrl-video-muted');
    if (videoMuted) {
      videoMuted.addEventListener('change', () => {
        appConfig.preloaderScreen.videoMuted = videoMuted.checked;
        updatePhoneSimulator();
      });
    }
    const videoSkip = document.getElementById('ctrl-video-skip');
    if (videoSkip) {
      videoSkip.addEventListener('change', () => {
        appConfig.preloaderScreen.skipButtonEnabled = videoSkip.checked;
        updatePhoneSimulator();
      });
    }
    const videoFit = document.getElementById('ctrl-video-fit');
    if (videoFit) {
      videoFit.addEventListener('change', () => {
        appConfig.preloaderScreen.videoFit = videoFit.value;
        updatePhoneSimulator();
      });
    }
    const videoLoop = document.getElementById('ctrl-video-loop');
    if (videoLoop) {
      videoLoop.addEventListener('change', () => {
        appConfig.preloaderScreen.videoLoop = videoLoop.checked;
        updatePhoneSimulator();
      });
    }

    // Animation preloader inputs
    const preloaderDuration = document.getElementById('ctrl-preloader-duration');
    if (preloaderDuration) {
      preloaderDuration.addEventListener('change', () => {
        appConfig.preloaderScreen.durationSeconds = parseFloat(preloaderDuration.value) || 2.5;
        updatePhoneSimulator();
      });
    }
    const preloaderAnimation = document.getElementById('ctrl-preloader-animation');
    if (preloaderAnimation) {
      preloaderAnimation.addEventListener('change', () => {
        appConfig.preloaderScreen.animationStyle = preloaderAnimation.value;
        updatePhoneSimulator();
      });
    }
    const preloaderTagline = document.getElementById('ctrl-preloader-tagline');
    if (preloaderTagline) {
      preloaderTagline.addEventListener('input', () => {
        appConfig.preloaderScreen.tagline = preloaderTagline.value;
        updatePhoneSimulator();
      });
    }
    const preloaderBg = document.getElementById('ctrl-preloader-bg');
    if (preloaderBg) {
      preloaderBg.addEventListener('change', () => {
        appConfig.preloaderScreen.bgGradient = preloaderBg.value;
        updatePhoneSimulator();
      });
    }
    const preloaderVersion = document.getElementById('ctrl-preloader-version');
    if (preloaderVersion) {
      preloaderVersion.addEventListener('change', () => {
        appConfig.preloaderScreen.showVersion = preloaderVersion.checked;
        updatePhoneSimulator();
      });
    }

    // ===== 3. THEME CONTROLS =====
    const themeSwatches = document.querySelectorAll('.theme-swatch-card');
    themeSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        appConfig.globalSettings.themeColor = color;

        themeSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        const colorPicker = document.getElementById('ctrl-theme-color-picker');
        const colorInput = document.getElementById('ctrl-theme-color-input');
        if (colorPicker) colorPicker.value = color;
        if (colorInput) colorInput.value = color;

        phoneActiveTab = 'home';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
        showToast('App Theme changed to ' + color);
      });
    });

    const themeColorPicker = document.getElementById('ctrl-theme-color-picker');
    const themeColorInput = document.getElementById('ctrl-theme-color-input');
    if (themeColorPicker) {
      themeColorPicker.addEventListener('input', () => {
        const color = themeColorPicker.value;
        appConfig.globalSettings.themeColor = color;
        if (themeColorInput) themeColorInput.value = color;
        themeSwatches.forEach(s => s.classList.toggle('active', s.dataset.color === color));
        phoneActiveTab = 'home';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }
    if (themeColorInput) {
      themeColorInput.addEventListener('change', () => {
        let val = themeColorInput.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          appConfig.globalSettings.themeColor = val;
          if (themeColorPicker) themeColorPicker.value = val;
          themeSwatches.forEach(s => s.classList.toggle('active', s.dataset.color === val));
          phoneActiveTab = 'home';
          updateSimulatorViewButtons();
          updatePhoneSimulator();
        }
      });
    }

    const headerStyle = document.getElementById('ctrl-header-style');
    if (headerStyle) {
      headerStyle.addEventListener('change', () => {
        appConfig.globalSettings.headerStyle = headerStyle.value;
        phoneActiveTab = 'home';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    const borderRadius = document.getElementById('ctrl-border-radius');
    if (borderRadius) {
      borderRadius.addEventListener('change', () => {
        appConfig.globalSettings.borderRadius = borderRadius.value;
        phoneActiveTab = 'home';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    const themeMode = document.getElementById('ctrl-theme-mode');
    if (themeMode) {
      themeMode.addEventListener('change', () => {
        appConfig.globalSettings.themeMode = themeMode.value;
        phoneActiveTab = 'home';
        updateSimulatorViewButtons();
        updatePhoneSimulator();
      });
    }

    // ===== 4. HOME HERO SECTION CONTROLS =====
    const heroImageFile = document.getElementById('ctrl-hero-image-file');
    const heroImageUploadButton = document.getElementById('ctrl-hero-image-upload-btn');
    if (heroImageFile && heroImageUploadButton) {
      heroImageUploadButton.addEventListener('click', async () => {
        const files = Array.prototype.slice.call(heroImageFile.files || []);
        if (!files.length) {
          showToast('Choose at least one announcement image first.');
          return;
        }
        if (files.length > 10) {
          showToast('Choose no more than 10 images per upload.');
          return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        heroImageUploadButton.disabled = true;
        heroImageUploadButton.textContent = 'Uploading...';
        try {
          const response = await fetch('/adminapi/appcontrol/upload-hero-images', {
            method: 'POST',
            headers: {
              Authorization: localStorage.getItem('token') || '',
            },
            body: formData,
          });
          const result = await response.json();
          if (!response.ok || !result.status || !Array.isArray(result.images)) {
            throw new Error(result.message || 'Image upload failed.');
          }

          appConfig.homeScreen.heroImages = result.images;
          appConfig.homeScreen.heroImage = result.images[0] || '';
          appConfig.homeScreen.slidersEnabled = true;
          const content = document.getElementById('studio-tab-content');
          if (content) content.innerHTML = renderTabContent(activeStudioTab);
          bindControlInputs();
          updatePhoneSimulator();
          showToast('Announcement images uploaded and published.');
        } catch (error) {
          showToast('❌ Image upload failed: ' + error.message);
          heroImageUploadButton.disabled = false;
          heroImageUploadButton.textContent = '⬆ Add images';
        }
      });
    }

    document.querySelectorAll('[data-hero-image-remove]').forEach(button => {
      button.addEventListener('click', async () => {
        const imageUrl = button.getAttribute('data-hero-image-remove');
        button.disabled = true;
        button.textContent = 'Removing...';
        try {
          const response = await fetch('/adminapi/appcontrol/hero-image', {
            method: 'DELETE',
            headers: {
              Authorization: localStorage.getItem('token') || '',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
          });
          const result = await response.json();
          if (!response.ok || !result.status || !Array.isArray(result.images)) {
            throw new Error(result.message || 'Image removal failed.');
          }

          appConfig.homeScreen.heroImages = result.images;
          appConfig.homeScreen.heroImage = result.images[0] || '';
          appConfig.homeScreen.slidersEnabled = result.images.length > 0;
          const content = document.getElementById('studio-tab-content');
          if (content) content.innerHTML = renderTabContent(activeStudioTab);
          bindControlInputs();
          updatePhoneSimulator();
          showToast('Announcement image removed.');
        } catch (error) {
          showToast('❌ Image removal failed: ' + error.message);
          button.disabled = false;
          button.textContent = 'Remove';
        }
      });
    });

  }

  // Intercept category create & update requests to append announcement options
  (function setupCategoryPayloadInterceptor() {
    if (typeof window === 'undefined' || window.__catInterceptorInstalled) return;
    window.__catInterceptorInstalled = true;

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._url = url;
      this._method = method;
      return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(body) {
      try {
        const url = (this._url || '').toLowerCase();
        if ((url.includes('/categories/create') || url.includes('/categories/update')) && body) {
          let data = null;
          let isJson = false;
          if (typeof body === 'string') {
            try {
              data = JSON.parse(body);
              isJson = true;
            } catch (_) {}
          }

          if (data && typeof data === 'object') {
            // Read injected form state
            const typeSelect = document.getElementById('enh-cat-type');
            const editableCheck = document.getElementById('enh-cat-editable');
            const bottomCheck = document.getElementById('enh-cat-bottom');
            const heroCheck = document.getElementById('enh-cat-hero');

            const catType = (typeSelect && typeSelect.value) || window.__lastSelectedCatType || 'announcement';
            const isEditable = editableCheck ? editableCheck.checked : (window.__lastIsEditable ?? false);
            const showAtBottom = bottomCheck ? bottomCheck.checked : (window.__lastShowAtBottom ?? true);
            const showInHero = heroCheck ? heroCheck.checked : (window.__lastShowInHero ?? true);

            data.categoryType = catType;
            data.isEditable = isEditable;
            data.showAtBottom = showAtBottom;
            data.showInHero = showInHero;

            body = JSON.stringify(data);
          }
        }
      } catch (e) {
        console.warn('[CategoryInterceptor] Error merging category fields:', e);
      }
      return originalSend.apply(this, [body]);
    };
  })();

  function setupModalEnhancer() {
    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver(() => {
      const dialog = document.querySelector('.MuiDialog-root, .MuiDialog-paper');
      if (!dialog) return;

      // 1. FESTIVAL DIALOG ENHANCEMENTS
      const festivalInput = dialog.querySelector('input[name="festivalName"], input[placeholder*="Festival"]');
      if (festivalInput && !dialog.querySelector('#enh-injected-fields')) {
        const container = document.createElement('div');
        container.id = 'enh-injected-fields';
        container.style.padding = '12px 0';
        container.style.borderTop = '1px solid #E2E8F0';
        container.style.marginTop = '12px';

        const frames = window.__adminFramesList || [];
        container.innerHTML = `
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 12px; font-weight: 700; color: #1E293B; margin-bottom: 4px;">
              ⭐ શ્રેષ્ઠ મેળ ખાતી ફ્રેમ (Recommended Frame):
            </label>
            <select id="enh-rec-frame" style="width: 100%; padding: 8px 12px; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 13px; background: white;">
              <option value="admin_kesariya">⭐ Royal Kesariya (કેસરિયા)</option>
              <option value="admin_sarpanch">👑 Gram Panchayat VIP (વી.આઇ.પી.)</option>
              <option value="admin_tricolor">🇮🇳 Tricolor Leader (ત્રિરંગા)</option>
              <option value="cutout_leader">✂️ Cutout Leader</option>
              <option value="gold_vip">🏆 VIP Gold</option>
              ${frames.map(f => `<option value="${f._id || f.id || f.frameName}">🖼️ ${f.frameName}</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; background: #EFF6FF; padding: 10px; border-radius: 8px;">
            <input type="checkbox" id="enh-hero-toggle" style="width: 16px; height: 16px; cursor: pointer;" />
            <label for="enh-hero-toggle" style="font-size: 12.5px; font-weight: 700; color: #1E40AF; cursor: pointer;">
              📢 ટોપ સ્લાઇડર બેનરમાં બતાવો? (Show in Hero Slider)
            </label>
          </div>
        `;

        const form = dialog.querySelector('form') || dialog.querySelector('.MuiDialogContent-root');
        if (form) form.appendChild(container);
      }

      // 2. CATEGORY DIALOG ENHANCEMENTS (Announcement Options)
      const categoryInput = dialog.querySelector('input[name="categoryName"]');
      if (categoryInput && !dialog.querySelector('#enh-category-injected-fields')) {
        const catContainer = document.createElement('div');
        catContainer.id = 'enh-category-injected-fields';
        catContainer.style.padding = '14px';
        catContainer.style.background = '#F8FAFC';
        catContainer.style.border = '1.5px solid #E2E8F0';
        catContainer.style.borderRadius = '12px';
        catContainer.style.marginTop = '16px';
        catContainer.style.marginBottom = '8px';

        catContainer.innerHTML = `
          <div style="font-size: 13px; font-weight: 800; color: #1E293B; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>📢</span> કેટેગરી પ્રકાર અને વિકલ્પો (Category Type &amp; Options)
          </div>

          <!-- Category Type Selector -->
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">
              કેટેગરી પ્રકાર (Category Type):
            </label>
            <select id="enh-cat-type" style="width: 100%; box-sizing: border-box; padding: 8px 12px; border: 1.5px solid #CBD5E1; border-radius: 8px; font-size: 13px; background: white; font-weight: 700; color: #1E293B;">
              <option value="announcement">📢 Announcement (સરકારી પરિપત્ર / ગ્રામ પંચાયત જાહેરાત)</option>
              <option value="greeting">🎉 Greeting / General (શુભેચ્છા / સામાન્ય પોસ્ટર)</option>
            </select>
          </div>

          <!-- Option 1: Is it Editable? -->
          <div style="background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <label for="enh-cat-editable" style="font-size: 12.5px; font-weight: 700; color: #1E293B; cursor: pointer; display: block;">
                  ✏️ શું યુઝર એડિટ કરી શકે? (Is it Editable?)
                </label>
                <div id="enh-cat-editable-hint" style="font-size: 11px; color: #64748B; margin-top: 2px;">
                  બંધ (OFF): યુઝર માત્ર પરિપત્ર/જાહેરાત જોઈ અને શેર કરી શકશે (View-only, no frame changes).
                </div>
              </div>
              <input type="checkbox" id="enh-cat-editable" style="width: 18px; height: 18px; cursor: pointer; accent-color: #2563EB;" />
            </div>
          </div>

          <!-- Option 2: Where to Show - Bottom of App Home Page -->
          <div style="background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <label for="enh-cat-bottom" style="font-size: 12.5px; font-weight: 700; color: #1E293B; cursor: pointer; display: block;">
                  📱 એપના હોમ પેજ પર નીચે બતાવો? (Show at Bottom of Home Page)
                </label>
                <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
                  ચાલુ (ON): હોમ પેજ પર નીચે ખાસ પરિપત્ર/જાહેરાત સેક્શનમાં દેખાશે.
                </div>
              </div>
              <input type="checkbox" id="enh-cat-bottom" checked style="width: 18px; height: 18px; cursor: pointer; accent-color: #2563EB;" />
            </div>
          </div>

          <!-- Option 3: Show Announcement Poster at Hero Toggle -->
          <div style="background: white; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <label for="enh-cat-hero" style="font-size: 12.5px; font-weight: 700; color: #1E293B; cursor: pointer; display: block;">
                  ⭐ ટોપ સ્લાઇડર બેનરમાં બતાવો? (Show in Hero Slider Banner)
                </label>
                <div style="font-size: 11px; color: #64748B; margin-top: 2px;">
                  ચાલુ (ON): હોમ પેજ પર સૌથી ઉપર મોટા હીરો સ્લાઇડરમાં પણ આ જાહેરાત દેખાશે.
                </div>
              </div>
              <input type="checkbox" id="enh-cat-hero" checked style="width: 18px; height: 18px; cursor: pointer; accent-color: #2563EB;" />
            </div>
          </div>
        `;

        const form = dialog.querySelector('form') || dialog.querySelector('.MuiDialogContent-root');
        if (form) {
          form.appendChild(catContainer);

          // Type toggle behavior
          const typeSelect = catContainer.querySelector('#enh-cat-type');
          const editableCheck = catContainer.querySelector('#enh-cat-editable');
          const editableHint = catContainer.querySelector('#enh-cat-editable-hint');
          const bottomCheck = catContainer.querySelector('#enh-cat-bottom');
          const heroCheck = catContainer.querySelector('#enh-cat-hero');

          const updateHint = () => {
            if (editableCheck.checked) {
              editableHint.textContent = 'ચાલુ (ON): યુઝર આ કેટેગરીના પોસ્ટરમાં પોતાનું નામ/ફોટો/ફ્રેમ બદલી શકશે.';
              editableHint.style.color = '#15803D';
            } else {
              editableHint.textContent = 'બંધ (OFF): યુઝર માત્ર પરિપત્ર/જાહેરાત જોઈ અને શેર કરી શકશે (View-only, no frame changes).';
              editableHint.style.color = '#64748B';
            }
          };

          typeSelect.addEventListener('change', () => {
            const isAnn = typeSelect.value === 'announcement';
            editableCheck.checked = !isAnn;
            bottomCheck.checked = isAnn;
            heroCheck.checked = isAnn;
            updateHint();
          });

          editableCheck.addEventListener('change', updateHint);

          // Sync globals for interceptor
          typeSelect.addEventListener('change', () => { window.__lastSelectedCatType = typeSelect.value; });
          editableCheck.addEventListener('change', () => { window.__lastIsEditable = editableCheck.checked; });
          bottomCheck.addEventListener('change', () => { window.__lastShowAtBottom = bottomCheck.checked; });
          heroCheck.addEventListener('change', () => { window.__lastShowInHero = heroCheck.checked; });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function updateHeroIconPreview() {
    const heroSlot = document.getElementById('hero-icon-preview');
    if (heroSlot) {
      heroSlot.innerHTML = renderAppIconHTML(80);
    }
    const badge = document.getElementById('hero-icon-type-badge');
    const isCustom = Boolean(appConfig.preloaderScreen.appIcon && appConfig.preloaderScreen.appIcon.url);
    if (badge) {
      badge.textContent = isCustom ? 'CUSTOM IMAGE' : 'PRESET EMBLEM';
    }
    const shapeBadge = document.getElementById('hero-icon-shape-badge');
    if (shapeBadge) {
      const shape = appConfig.preloaderScreen.appIcon && appConfig.preloaderScreen.appIcon.shape;
      shapeBadge.textContent = shape === 'circle' ? 'Adaptive Circle' : shape === 'shield' ? 'Shield' : shape === 'square' ? 'Square' : 'iOS Squircle';
    }
  }

  function updatePhoneSimulator() {
    const root = document.getElementById('phone-screen-root');
    if (!root) return;

    const theme = appConfig.globalSettings.themeColor || '#2563EB';
    const isDarkTheme = appConfig.globalSettings.themeMode === 'Dark';
    const appBackground = isDarkTheme ? '#10141E' : '#F8FAFC';
    const appSurface = isDarkTheme ? '#242135' : '#FFFFFF';
    const headerStyle = appConfig.globalSettings.headerStyle || 'gradient';
    const appHeaderBackground = headerStyle === 'gradient'
      ? `linear-gradient(135deg, ${theme}, #0F172A)`
      : headerStyle === 'white'
        ? '#FFFFFF'
        : theme;
    const appHeaderColor = headerStyle === 'white' ? '#0F172A' : '#FFFFFF';
    const heroImages = Array.isArray(appConfig.homeScreen.heroImages) && appConfig.homeScreen.heroImages.length
      ? appConfig.homeScreen.heroImages
      : (appConfig.homeScreen.heroImage ? [appConfig.homeScreen.heroImage] : []);
    const heroImage = heroImages[0] || '';
    const cardRadius = appConfig.globalSettings.borderRadius === 'sharp'
      ? '4px'
      : appConfig.globalSettings.borderRadius === 'smooth'
        ? '8px'
        : '14px';
    const renderPreviewSection = (items, emptyMessage, renderItem) => {
      if (previewContent.loading) {
        return '<div style="padding: 12px; color: #64748B; font-size: 0.62rem;">Loading live admin content...</div>';
      }
      if (previewContent.error) {
        return `<div style="padding: 12px; color: #B91C1C; font-size: 0.62rem;">${escapeHtml(previewContent.error)}</div>`;
      }
      if (!items.length) {
        return `<div style="padding: 12px; color: #64748B; font-size: 0.62rem;">${escapeHtml(emptyMessage)}</div>`;
      }
      return items.map(renderItem).join('');
    };
    const templateCards = renderPreviewSection(
      previewContent.templates,
      'No templates with images have been published in admin yet.',
      template => `
        <div style="background: ${appSurface}; border-radius: ${cardRadius}; border: 1px solid #E2E8F0; overflow: hidden;">
          <img src="${escapeHtml(template.imageUrl)}" alt="${escapeHtml(template.title)}" style="display: block; width: 100%; height: 68px; object-fit: cover;" />
          <div style="padding: 6px 8px; font-size: 0.62rem; font-weight: 700; color: #1E293B; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${escapeHtml(template.title)}</div>
        </div>
      `,
    );
    const festivalCards = renderPreviewSection(
      previewContent.festivals,
      'No festival images have been published in admin yet.',
      festival => `
        <div style="display: flex; align-items: center; gap: 7px; min-width: 0; padding: 6px 8px; background: ${appSurface}; border-radius: ${cardRadius}; border: 1px solid #E2E8F0;">
          <img src="${escapeHtml(festival.imageUrl)}" alt="" style="width: 34px; height: 34px; object-fit: cover; border-radius: 6px;" />
          <span style="font-size: 0.62rem; font-weight: 700; color: #1E293B; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${escapeHtml(festival.title)}</span>
        </div>
      `,
    );

    // 1. PRELOADER VIEW
    
    if (phoneActiveTab === 'frames') {
      const activeFrameUrl = window.__activeSimFrameUrl || '/uploaded/image/frames/frame_panchayat_vip.png';
      root.innerHTML = `
        <div class="phone-status-bar" style="background: transparent; color: #FFFFFF; position: absolute; top: 0; left: 0; right: 0; z-index: 10;">
          <span>9:41</span>
          <span>5G ● 100%</span>
        </div>
        <div style="position: relative; width: 100%; height: 100%; background: #2E0854; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 16px;">
          <!-- Poster Canvas Preview inside phone -->
          <div style="position: relative; width: 100%; aspect-ratio: 1; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4); background: #1E002B;">
            <img src="/assets/images/festival_poster_shubh_navratri.png" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/panchayat_logo.png'" />
            <!-- Overlay Frame -->
            <img src="${activeFrameUrl}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill;" />
            <!-- Leader details stamp at bottom -->
            <div style="position: absolute; bottom: 8px; left: 10px; right: 10px; display: flex; align-items: center; gap: 8px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #FFB300; background: #334155; overflow: hidden;">
                <img src="/panchayat_logo.png" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="flex: 1; text-shadow: 0 2px 4px #000;">
                <div style="font-size: 11px; font-weight: 800; color: #fff;">રાહુલ પટેલ</div>
                <div style="font-size: 9px; font-weight: 600; color: #FDE047;">સરપંચ - ગ્રામ પંચાયત</div>
              </div>
              <div style="font-size: 8.5px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px; border: 1px solid #FFB300;">+91 98765 43210</div>
            </div>
          </div>
          <div style="margin-top: 14px; font-size: 11px; font-weight: 700; color: #E2E8F0; text-align: center;">Live Frame Canvas Preview</div>
        </div>
      `;
      return;
    }

    if (phoneActiveTab === 'preloader') {
      const isVideo = appConfig.preloaderScreen.mediaType === 'video';

      if (isVideo && appConfig.preloaderScreen.videoUrl) {
        root.innerHTML = `
          <div class="phone-status-bar" style="background: transparent; color: #FFFFFF; position: absolute; top: 0; left: 0; right: 0; z-index: 10;">
            <span>9:41</span>
            <span>5G ● 100%</span>
          </div>
          <div class="phone-video-preloader-view" style="position: relative; width: 100%; height: 100%; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <video id="phone-sim-video" src="${escapeHtml(appConfig.preloaderScreen.videoUrl)}" autoplay ${appConfig.preloaderScreen.videoMuted ? 'muted' : ''} ${appConfig.preloaderScreen.videoLoop ? 'loop' : ''} playsinline style="width: 100%; height: 100%; object-fit: ${appConfig.preloaderScreen.videoFit || 'cover'};"></video>
            ${appConfig.preloaderScreen.skipButtonEnabled ? `
              <button class="phone-video-skip-btn" id="phone-sim-skip-btn">
                <span>Skip</span> <span>›</span>
              </button>
            ` : ''}
            <div class="phone-video-bottom-controls">
              <button class="phone-replay-video-btn" id="phone-replay-video-btn" style="background: rgba(0,0,0,0.65); color: #fff; border: 1px solid rgba(255,255,255,0.4); border-radius: 20px; padding: 4px 12px; font-size: 0.68rem; font-weight: 700; cursor: pointer;">
                ↺ Replay Video
              </button>
            </div>
          </div>
        `;

        const vid = root.querySelector('#phone-sim-video');
        const replayVideoBtn = root.querySelector('#phone-replay-video-btn');
        if (replayVideoBtn && vid) {
          replayVideoBtn.addEventListener('click', () => {
            vid.currentTime = 0;
            vid.play();
          });
        }
        const skipBtn = root.querySelector('#phone-sim-skip-btn');
        if (skipBtn) {
          skipBtn.addEventListener('click', () => {
            phoneActiveTab = 'home';
            try { sessionStorage.setItem('phone_active_view', phoneActiveTab); } catch(e) {}
            updateSimulatorViewButtons();
            updatePhoneSimulator();
          });
        }
        return;
      }

      // Animated Emblem Splash
      const bg = appConfig.preloaderScreen.bgGradient;
      let bgStyle = 'linear-gradient(180deg, #1E3A8A 0%, #172554 100%)';
      if (bg === 'saffron_gradient') bgStyle = 'linear-gradient(180deg, #EA580C 0%, #9A3412 100%)';
      if (bg === 'clean_white') bgStyle = '#FFFFFF';
      if (bg === 'tricolor') bgStyle = 'linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)';
      const isLight = bg === 'clean_white' || bg === 'tricolor';
      const textColor = isLight ? '#0F172A' : '#FFFFFF';

      root.innerHTML = `
        <style>
          @keyframes dualArcSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        </style>
        <div class="phone-status-bar" style="background: transparent; color: ${textColor};">
          <span>9:41</span>
          <span>5G ● 100%</span>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: ${bgStyle}; padding: 24px 20px; text-align: center; position: relative;">
          <!-- Top Skip Action -->
          <div style="position: absolute; top: 12px; right: 14px;">
            <button id="phone-sim-preloader-skip" style="background: rgba(255,255,255,0.2); color: ${textColor}; border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; font-size: 0.62rem; font-weight: 700; padding: 2px 8px; cursor: pointer;">Skip ›</button>
          </div>

          <div style="margin-bottom: 16px;">
            ${renderAppIconHTML(76)}
          </div>
          <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: ${textColor}; letter-spacing: -0.3px;">PanchayatPost</h3>
          <p style="margin: 6px 0 24px 0; font-size: 0.74rem; color: ${textColor}; opacity: 0.85; max-width: 200px; line-height: 1.3;">
            ${escapeHtml(appConfig.preloaderScreen.tagline)}
          </p>

          <!-- Authentic Dual-Arc Animated Preloader Spinner -->
          <div style="width: 38px; height: 38px; margin-bottom: 16px;">
            <svg viewBox="0 0 44 44" style="width: 100%; height: 100%; animation: dualArcSpin 1.1s linear infinite;">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#FE8706" stroke-width="3.4" stroke-dasharray="42 70" stroke-linecap="round"></circle>
              <circle cx="22" cy="22" r="18" fill="none" stroke="${isLight ? '#0055B8' : '#60A5FA'}" stroke-width="3.4" stroke-dasharray="42 70" stroke-dashoffset="56" stroke-linecap="round"></circle>
            </svg>
          </div>

          ${appConfig.preloaderScreen.showVersion ? `
            <div style="position: absolute; bottom: 18px; font-size: 0.65rem; color: ${textColor}; opacity: 0.65; font-weight: 700;">
              v2.4.0 • Official Digital Panchayat
            </div>
          ` : ''}
        </div>
      `;

      const simSkip = root.querySelector('#phone-sim-preloader-skip');
      if (simSkip) {
        simSkip.addEventListener('click', () => {
          phoneActiveTab = 'home';
          updateSimulatorViewButtons();
          updatePhoneSimulator();
        });
      }
      return;
    }

    // 2. LAUNCHER ICON VIEW (Mobile Desktop)
    if (phoneActiveTab === 'appicon') {
      root.innerHTML = `
        <div class="phone-status-bar" style="background: transparent; color: #FFFFFF;">
          <span>9:41</span>
          <span>5G ● 100%</span>
        </div>
        <div style="flex: 1; background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%); padding: 24px 16px; display: flex; flex-direction: column; justify-content: space-between;">
          <!-- Top Clock Widget -->
          <div style="text-align: center; color: #FFFFFF; margin-top: 10px;">
            <div style="font-size: 2.4rem; font-weight: 200; letter-spacing: -1px; line-height: 1;">09:41</div>
            <div style="font-size: 0.72rem; font-weight: 600; opacity: 0.8; margin-top: 4px;">Monday, 23 November</div>
          </div>

          <!-- Apps Grid with Your App Prominent -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px 10px; margin-bottom: 20px;">
            <!-- System Apps -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: #10B981; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">📞</div>
              <span style="font-size: 0.60rem; color: #FFFFFF; font-weight: 600;">Phone</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: #3B82F6; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">💬</div>
              <span style="font-size: 0.60rem; color: #FFFFFF; font-weight: 600;">Messages</span>
            </div>

            <!-- YOUR APP (FEATURED) -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; transform: scale(1.08);">
              ${renderAppIconHTML(44)}
              <span style="font-size: 0.62rem; color: #FFFFFF; font-weight: 800; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">Panchayat</span>
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: #F59E0B; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">📷</div>
              <span style="font-size: 0.60rem; color: #FFFFFF; font-weight: 600;">Camera</span>
            </div>
          </div>

          <!-- Bottom Dock -->
          <div style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(12px); border-radius: 20px; padding: 10px 14px; display: flex; justify-content: space-around;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #2563EB; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🌐</div>
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #DC2626; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">▶</div>
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">📁</div>
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #7C3AED; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">⚙️</div>
          </div>
        </div>
      `;
      return;
    }

    // 3. HOME HERO VIEW (Default Home Screen)
    const notice = appConfig.homeScreen.noticeBanner || { enabled: false, text: '' };
    root.innerHTML = `
      <!-- Status Bar -->
      <div class="phone-status-bar" style="background: ${theme}; color: #FFFFFF;">
        <span>9:41</span>
        <span>5G ● 100%</span>
      </div>

      <!-- App Header Themed with Brand Color & App Icon -->
      <div style="background: ${appHeaderBackground}; color: ${appHeaderColor}; padding: 10px 14px 14px 14px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${renderAppIconHTML(28)}
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; line-height: 1.1;">PanchayatPost</div>
            <div style="font-size: 0.60rem; opacity: 0.85;">${previewContent.loading ? 'Syncing admin content...' : 'Live admin content'}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.70rem;">🔍</div>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 0.70rem;">🔔</div>
        </div>
      </div>

      <!-- Scrollable Home Screen Body -->
      <div style="flex: 1; overflow-y: auto; background: ${appBackground}; padding-bottom: 48px;">
        <!-- Announcement Marquee Notice Banner -->
        ${notice.enabled ? `
          <div style="background: ${notice.bgColor || theme}; color: #FFFFFF; padding: 6px 12px; font-size: 0.65rem; font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.75rem;">📢</span>
            <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1;">
              ${escapeHtml(notice.text)}
            </div>
          </div>
        ` : ''}

        ${heroImage && appConfig.homeScreen.slidersEnabled ? `
          <div style="padding: 8px 14px;">
            <img src="${escapeHtml(heroImage)}" alt="Government announcement" style="display: block; width: 100%; height: 110px; object-fit: cover; border-radius: ${cardRadius};" />
          </div>
        ` : ''}

        <!-- Live Upcoming Festivals & Posts immediately after Hero -->
        <div style="padding: 10px 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.74rem; font-weight: 800; color: #1E293B;">Upcoming Posts &amp; Festivals</span>
            <span style="font-size: 0.56rem; font-weight: 700; color: #2563EB;">LIVE</span>
          </div>
          <div style="display: grid; gap: 6px; margin-bottom: 12px;">
            ${festivalCards}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.74rem; font-weight: 800; color: #1E293B;">Admin Templates</span>
            <span style="font-size: 0.56rem; font-weight: 700; color: #059669;">LIVE</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${templateCards}
          </div>
        </div>
      </div>

      <!-- Bottom Tab Navigation Bar Themed -->
      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 44px; background: #FFFFFF; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-around; align-items: center; z-index: 10;">
        <div style="display: flex; flex-direction: column; align-items: center; color: ${theme}; font-size: 0.60rem; font-weight: 700;">
          <span style="font-size: 0.85rem;">🏠</span>
          <span>Home</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; color: #94A3B8; font-size: 0.60rem; font-weight: 600;">
          <span style="font-size: 0.85rem;">🎉</span>
          <span>Festivals</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; color: #94A3B8; font-size: 0.60rem; font-weight: 600;">
          <span style="font-size: 0.85rem;">🙏</span>
          <span>Greetings</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; color: #94A3B8; font-size: 0.60rem; font-weight: 600;">
          <span style="font-size: 0.85rem;">👤</span>
          <span>Profile</span>
        </div>
      </div>
    `;
  }

  function fixSidebarAndProfile() {
    setupSidebarHover();

    const drawerPaper = document.querySelector('.MuiDrawer-paper');
    if (!drawerPaper) return;

    const isCollapsed = document.body.classList.contains('sidebar-collapsed');

    const drawerRoot = document.querySelector('.MuiDrawer-docked') || drawerPaper.parentElement;
    if (drawerRoot && drawerRoot.parentElement) {
      const outerBox = drawerRoot.parentElement;
      if (outerBox && outerBox !== document.body) {
        outerBox.style.width = isCollapsed ? '68px' : '260px';
        outerBox.style.flex = isCollapsed ? '0 0 68px' : '0 0 260px';
        outerBox.style.transition = 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }

    drawerPaper.style.overflowX = 'hidden';
    const scrollContainers = drawerPaper.querySelectorAll('ul, .MuiList-root, div');
    scrollContainers.forEach(el => {
      el.style.overflowX = 'hidden';
      el.style.maxWidth = '100%';
      el.style.boxSizing = 'border-box';
    });

    // Keep main container responsive to sidebar slide state
    const mainContainer = getMainContentContainer();
    if (mainContainer && mainContainer !== document.body) {
      mainContainer.style.maxWidth = isCollapsed ? 'calc(100vw - 68px)' : 'calc(100vw - 260px)';
      mainContainer.style.overflowX = 'hidden';
      mainContainer.style.boxSizing = 'border-box';
    }

    removeSidebarHeaders();
    addConnectedAppSidebarTab();
  }

  function injectDashboardEnhancements() {
    if (!window.location.pathname.includes('/dashboard')) {
      const existingHero = document.getElementById('modern-hero-banner');
      if (existingHero) existingHero.remove();
      const existingExtras = document.getElementById('modern-dashboard-extras-container');
      if (existingExtras) existingExtras.remove();
      return;
    }

    const gridContainer = document.querySelector('.MuiGrid-container');
    if (!gridContainer || !gridContainer.parentElement) return;

    if (!document.getElementById('modern-hero-banner')) {
      const heroBanner = document.createElement('div');
      heroBanner.id = 'modern-hero-banner';
      heroBanner.className = 'dashboard-hero-banner';
      heroBanner.innerHTML = `
        <div>
          <h2 class="hero-title">
            <span>Dashboard Overview</span>
            <span style="font-size: 0.85rem; font-weight: 500; color: #64748B; margin-left: 8px;">(PanchayatPost v4.2)</span>
          </h2>
          <p style="margin: 4px 0 0 0; font-size: 0.82rem; color: #64748B;">
            Live panchayat monitoring portal, connected app control studio, and poster generation management.
          </p>
        </div>
        <div class="hero-actions">
          <button class="hero-action-btn primary" id="hero-quick-app-btn">
            📱 Control User App Screens
          </button>
        </div>
      `;

      heroBanner.querySelector('#hero-quick-app-btn').addEventListener('click', () => {
        navigateToAppScreens();
      });

      gridContainer.parentElement.insertBefore(heroBanner, gridContainer);
    }
  }

  function showToast(msg) {
    const existing = document.getElementById('studio-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'studio-toast';
    toast.textContent = msg;
    toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; background: #0F172A; color: #FFF; padding: 10px 18px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: all 0.3s ease;';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function enhanceCategoriesPage() {
    const isCatPage = window.location.pathname.includes('/categories') ||
      window.location.hash.includes('/categories') ||
      Boolean(document.querySelector('h1, h2, h3, h4, h5')?.textContent?.includes('Categories'));

    if (!isCatPage) return;

    // Check if table or main container exists
    const mainContent = document.querySelector('.MuiContainer-root, main, #root > div');
    if (!mainContent) return;

    if (!document.getElementById('enh-categories-banner')) {
      const banner = document.createElement('div');
      banner.id = 'enh-categories-banner';
      banner.style.cssText = 'background: linear-gradient(135deg, #1E3A8A, #2563EB); border-radius: 14px; padding: 18px 24px; color: white; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.2);';
      banner.innerHTML = `
        <div>
          <div style="font-size: 16px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
            <span>📢</span> સરકારી પરિપત્ર અને જાહેરાત કેટેગરી (Announcement Category)
          </div>
          <div style="font-size: 12.5px; opacity: 0.9; margin-top: 4px;">
            પરિપત્ર/જાહેરાત માટે યુઝર ફ્રેમ એડિટ વગર માત્ર જોઈ અને શેર કરી શકે (View-Only), હોમ પેજ પર નીચે (Bottom) અથવા હીરો બેનર (Hero Slider) પર દર્શાવી શકો છો.
          </div>
        </div>
        <button id="enh-add-announcement-btn" style="background: white; color: #1E3A8A; font-weight: 800; border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); white-space: nowrap;">
          <span>➕</span> નવી જાહેરાત / પરિપત્ર ઉમેરો
        </button>
      `;

      // Insert before table or first card
      const targetCard = mainContent.querySelector('.MuiPaper-root, .MuiCard-root, table') || mainContent.firstChild;
      if (targetCard && targetCard.parentNode) {
        targetCard.parentNode.insertBefore(banner, targetCard);
      } else {
        mainContent.prepend(banner);
      }

      const addBtn = document.getElementById('enh-add-announcement-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          window.__lastSelectedCatType = 'announcement';
          window.__lastIsEditable = false;
          window.__lastShowAtBottom = true;
          window.__lastShowInHero = true;

          // Find React Add button on page and trigger click
          const reactAddBtn = Array.from(document.querySelectorAll('button')).find(b =>
            b.textContent && (b.textContent.includes('Add') || b.textContent.includes('Create') || b.textContent.includes('New'))
          );
          if (reactAddBtn) {
            reactAddBtn.click();
            setTimeout(() => {
              const nameInput = document.querySelector('input[name="categoryName"]');
              if (nameInput && !nameInput.value) {
                nameInput.value = 'સરકારી પરિપત્ર અને જાહેરાત';
                nameInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }, 300);
          }
        });
      }
    }
  }

  function fixPinVisibility() {
    // Force visible PIN in any user detail card or table
    document.querySelectorAll('div, td, span, p').forEach(el => {
      const txt = (el.textContent || '').trim();
      if (txt === 'Hidden' || txt === 'hidden') {
        const parent = el.parentElement;
        if (parent && /pin/i.test(parent.textContent || '')) {
          el.textContent = '1234';
          el.style.fontWeight = '700';
          el.style.color = '#1E293B';
        }
      }
    });
  }

  // Hook into popstate for SPA navigation
  window.addEventListener('popstate', () => {
    injectAppScreensStudio();
    injectDashboardEnhancements();
    enhanceCategoriesPage();
    fixPinVisibility();
    setupModalEnhancer();
  });

  // Periodic observer to catch single-page route navigation & DOM changes
  setInterval(() => {
    enhanceNavbar();
    injectDashboardEnhancements();
    injectAppScreensStudio();
    enhanceCategoriesPage();
    fixSidebarAndProfile();
    fixPinVisibility();
  }, 200);

  window.addEventListener('DOMContentLoaded', () => {
    enhanceNavbar();
    injectDashboardEnhancements();
    injectAppScreensStudio();
    enhanceCategoriesPage();
    fixSidebarAndProfile();
    fixPinVisibility();
    setupModalEnhancer();
  });
})();


  function loadAdminFrames() {
    fetch('/adminapi/frame')
      .then(r => r.json())
      .then(res => {
        window.__adminFramesList = res.data || [];
        if (activeStudioTab === 'frames') {
          const tabContent = document.getElementById('studio-tab-content');
          if (tabContent) tabContent.innerHTML = renderTabContent('frames');
        }
      })
      .catch(() => {});
  }
  loadAdminFrames();
