/**
 * Flor Mellow – Valentine's Popup (Ultra Elegant)
 * Handwritten font, minimal design, premium aesthetic
 */

(function() {
  'use strict';
  
  if (window.__florVdayPopupInit) return;
  window.__florVdayPopupInit = true;
  
  const CONFIG = {
    images: {
      desktop: 'assets/campaigns/valentines-2026/popup-desktop.jpg',
      mobile: 'assets/campaigns/valentines-2026/popup-mobile.jpg'
    },
    whatsappUrl: 'https://wa.me/40XXXXXXXXXX?text=Salut%20Flor%20Mellow!%20Vreau%20s%C4%83%20comand%20din%20colec%C8%9Bia%20Valentine%E2%80%99s%202026.',
    collectionUrl: 'catalog.html#valentines-2026',
    delayMs: 600,
    mobileBreakpoint: 768
  };
  
  let popupElement = null;
  let eventHandlers = {};
  
  function isMobile() {
    return window.innerWidth < CONFIG.mobileBreakpoint;
  }
  
  function getCurrentImage() {
    return isMobile() ? CONFIG.images.mobile : CONFIG.images.desktop;
  }
  
  function setBodyScroll(locked) {
    document.body.classList.toggle('vday-no-scroll', locked);
  }
  
  function getWhatsAppIcon() {
    return `
      <svg class="vday-icon-whatsapp" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
      </svg>
    `;
  }
  
  function buildPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'vday-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'vday-title');
    
    overlay.innerHTML = `
      <div class="vday-modal" role="document">
        <div class="vday-image-container">
          <img 
            class="vday-image" 
            src="${getCurrentImage()}" 
            alt="Colecția Valentine's 2026"
            loading="eager"
          />
          
          <div class="vday-content">
            <div class="vday-text-block">
              <h2 id="vday-title" class="vday-title">Valentine's</h2>
              <p class="vday-subtitle">vine după colț</p>
              <div class="vday-divider"></div>
              <p class="vday-tag">Colecție limitată • Comandă rapid</p>
            </div>
            
            <div class="vday-buttons">
              <a 
                href="${CONFIG.whatsappUrl}" 
                class="vday-btn vday-btn--whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Comandă pe WhatsApp"
              >
                ${getWhatsAppIcon()}
                <span>Comandă pe WhatsApp</span>
              </a>
              <a 
                href="${CONFIG.collectionUrl}" 
                class="vday-btn vday-btn--primary"
                aria-label="Vezi colecția Valentine's"
              >
                Vezi colecția
              </a>
            </div>
          </div>
        </div>
        
        <button 
          class="vday-close" 
          type="button" 
          aria-label="Închide popup"
          data-vday-close
        >×</button>
      </div>
    `;
    
    return overlay;
  }
  
  function updateImage() {
    if (!popupElement) return;
    
    const img = popupElement.querySelector('.vday-image');
    if (img) {
      const newSrc = getCurrentImage();
      if (img.src.indexOf(newSrc) === -1) {
        img.src = newSrc;
      }
    }
  }
  
  function closePopup() {
    if (!popupElement) return;
    
    popupElement.classList.remove('is-visible');
    setBodyScroll(false);
    
    if (eventHandlers.handleClick) {
      document.removeEventListener('click', eventHandlers.handleClick, true);
    }
    if (eventHandlers.handleKeydown) {
      document.removeEventListener('keydown', eventHandlers.handleKeydown);
    }
    if (eventHandlers.handleResize) {
      window.removeEventListener('resize', eventHandlers.handleResize);
    }
    
    setTimeout(() => {
      if (popupElement && popupElement.parentNode) {
        popupElement.parentNode.removeChild(popupElement);
      }
      popupElement = null;
      eventHandlers = {};
    }, 400);
  }
  
  function handleClick(event) {
    if (event.target.closest('[data-vday-close]')) {
      event.preventDefault();
      closePopup();
      return;
    }
    
    if (!event.target.closest('.vday-modal')) {
      closePopup();
    }
  }
  
  function handleKeydown(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      closePopup();
    }
  }
  
  function handleResize() {
    updateImage();
  }
  
  function openPopup() {
    if (popupElement) return;
    
    popupElement = buildPopup();
    document.body.appendChild(popupElement);
    
    setBodyScroll(true);
    
    eventHandlers.handleClick = handleClick;
    eventHandlers.handleKeydown = handleKeydown;
    eventHandlers.handleResize = handleResize;
    
    document.addEventListener('click', eventHandlers.handleClick, true);
    document.addEventListener('keydown', eventHandlers.handleKeydown);
    window.addEventListener('resize', eventHandlers.handleResize);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (popupElement) {
          popupElement.classList.add('is-visible');
        }
      });
    });
  }
  
  function init() {
    document.querySelectorAll('.vday-overlay').forEach(el => el.remove());
    
    setTimeout(() => {
      openPopup();
    }, CONFIG.delayMs);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.florVdayPopupClose = closePopup;
  
})();