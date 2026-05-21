(function () {
  'use strict';

  const MOBILE_BREAKPOINT = 1099;
  const SCROLL_THRESHOLD = 100;
  const TRANSPARENT_CLASS = 'is-transparent';
  const TEXT_COLOR_CLASS_PREFIX = 'has-transparent-text-';

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  let updateTransparency = null;

  function init() {
    const headerMain = document.querySelector('.js-header-main');
    if (!headerMain) return;

    const transparentEnabled = headerMain.getAttribute('data-transparent-enabled') === 'true';
    const transparentTextColor = headerMain.getAttribute('data-transparent-text-color') || 'light';
    const textColorClass = TEXT_COLOR_CLASS_PREFIX + transparentTextColor;

    if (!transparentEnabled) return;

    // On mobile: toggle transparency based on scroll position.
    // On desktop: always remove — the minified script handles inversion there.
    updateTransparency = function () {
      if (isMobile() && window.scrollY <= SCROLL_THRESHOLD) {
        headerMain.classList.add(TRANSPARENT_CLASS, textColorClass);
      } else {
        headerMain.classList.remove(TRANSPARENT_CLASS, textColorClass);
      }
    };

    window.addEventListener('scroll', updateTransparency, { passive: true });
    window.addEventListener('resize', updateTransparency, { passive: true });
  }

  function cleanup() {
    if (updateTransparency) {
      window.removeEventListener('scroll', updateTransparency);
      window.removeEventListener('resize', updateTransparency);
      updateTransparency = null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', init);
  document.addEventListener('shopify:section:unload', cleanup);
})();