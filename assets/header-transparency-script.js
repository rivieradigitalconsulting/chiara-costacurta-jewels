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
    const headerElement = document.querySelector('[data-transparent-enabled]');
    const headerMain = document.querySelector('.js-header-main');

    if (!headerElement || !headerMain) return;

    const transparentEnabled = headerElement.getAttribute('data-transparent-enabled') === 'true';
    const transparentTextColor = headerElement.getAttribute('data-transparent-text-color') || 'light';
    const logoLink = document.querySelector('.js-logo-to-invert');
    const textColorClass = TEXT_COLOR_CLASS_PREFIX + transparentTextColor;

    if (!transparentEnabled) return;

    function applyTransparency() {
      headerMain.classList.add(TRANSPARENT_CLASS, textColorClass);
      if (logoLink && isMobile() && transparentTextColor === 'light') {
        logoLink.classList.add('inverted');
      }
    }

    function removeTransparency() {
      headerMain.classList.remove(TRANSPARENT_CLASS, textColorClass);
      if (logoLink) logoLink.classList.remove('inverted');
    }

    updateTransparency = function () {
      if (isMobile() && window.scrollY <= SCROLL_THRESHOLD) {
        applyTransparency();
      } else {
        removeTransparency();
      }
    };

    updateTransparency();

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