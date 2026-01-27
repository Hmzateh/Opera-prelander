/* ==========================================
   OPERA GX PRELANDER - MAIN.JS
   Simple & Robust Version
   ========================================== */

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION - VARIABLES CENTRALISÉES
    // ==========================================
    const LOGO_URL = "https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/logo/gx/opera-gx__logo--white.160608602ec9.svg";
    const CTA_URL = "https://www.opera.com/gx";
    const CTA_TEXT = "Download NOW";
    const BRAND_NAME = "Opera GX";
    const PAGE_VARIANT = "A";
    const SCROLL_THRESHOLD = 35; // Pourcentage pour afficher sticky bar

    // ==========================================
    // TRACKING PARAMETERS
    // ==========================================
    function getTrackingParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            clickid: params.get('clickid') || '',
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_content: params.get('utm_content') || '',
            utm_term: params.get('utm_term') || ''
        };
    }

    function buildCTAUrl() {
        const tracking = getTrackingParams();
        const url = new URL(CTA_URL);
        
        // Append tracking params sans casser les params existants
        Object.keys(tracking).forEach(key => {
            if (tracking[key]) {
                url.searchParams.set(key, tracking[key]);
            }
        });
        
        return url.toString();
    }

    // ==========================================
    // DATALAYER - ANALYTICS
    // ==========================================
    window.dataLayer = window.dataLayer || [];

    function trackClick() {
        const tracking = getTrackingParams();
        window.dataLayer.push({
            event: 'prelander_click',
            clickid: tracking.clickid,
            utm_source: tracking.utm_source,
            page_variant: PAGE_VARIANT
        });
    }

    // ==========================================
    // INJECTION DYNAMIQUE
    // ==========================================
    function injectLogo() {
        const logoWrapper = document.querySelector('.logo-wrapper');
        if (logoWrapper) {
            // Remplacer le SVG par une image
            logoWrapper.innerHTML = `<img src="${LOGO_URL}" alt="${BRAND_NAME} Logo" class="logo">`;
        }
    }

    function injectBrandName() {
        // Mettre à jour le title
        document.title = document.title.replace(/Opera GX/g, BRAND_NAME);
        
        // Mettre à jour les meta descriptions si nécessaire
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = metaDesc.content.replace(/Opera GX/g, BRAND_NAME);
        }
    }

    function injectCTALinks() {
        const ctaUrl = buildCTAUrl();
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(btn => {
            btn.href = ctaUrl;
            // Mettre à jour le texte (garder l'icône SVG si présente)
            const svg = btn.querySelector('svg');
            btn.textContent = CTA_TEXT;
            if (svg) {
                btn.appendChild(svg);
            }
            
            // Event listener pour tracking
            btn.addEventListener('click', trackClick);
        });
    }

    // ==========================================
    // STICKY BAR - SCROLL INTENT
    // ==========================================
    function createStickyBar() {
        const stickyBar = document.createElement('div');
        stickyBar.id = 'sticky-cta-bar';
        stickyBar.innerHTML = `
            <div class="sticky-content">
                <span class="sticky-text">🎮 ${BRAND_NAME} — Boost your FPS for FREE</span>
                <a href="${buildCTAUrl()}" class="sticky-cta" target="_blank" rel="noopener">${CTA_TEXT}</a>
            </div>
        `;
        document.body.appendChild(stickyBar);

        // Event listener pour tracking
        const stickyCta = stickyBar.querySelector('.sticky-cta');
        stickyCta.addEventListener('click', trackClick);

        return stickyBar;
    }

    function injectStickyStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #sticky-cta-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, rgba(13, 18, 36, 0.98), rgba(26, 10, 31, 0.98));
                border-top: 2px solid #ff2d55;
                padding: 12px 20px;
                z-index: 9999;
                transform: translateY(100%);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 -10px 40px rgba(255, 45, 85, 0.3);
            }
            
            #sticky-cta-bar.visible {
                transform: translateY(0);
            }
            
            #sticky-cta-bar .sticky-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            
            #sticky-cta-bar .sticky-text {
                color: #a8b2d1;
                font-size: 0.95rem;
                font-weight: 500;
            }
            
            #sticky-cta-bar .sticky-cta {
                display: inline-block;
                padding: 10px 28px;
                font-family: 'Orbitron', sans-serif;
                font-size: 0.9rem;
                font-weight: 700;
                color: #fff;
                text-decoration: none;
                text-transform: uppercase;
                letter-spacing: 1px;
                background: linear-gradient(135deg, #ff2d55, #ff0844);
                border-radius: 6px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(255, 45, 85, 0.4);
            }
            
            #sticky-cta-bar .sticky-cta:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 30px rgba(255, 45, 85, 0.6);
            }
            
            @media (max-width: 640px) {
                #sticky-cta-bar .sticky-content {
                    flex-direction: column;
                    gap: 10px;
                    text-align: center;
                }
                
                #sticky-cta-bar .sticky-text {
                    font-size: 0.85rem;
                }
                
                #sticky-cta-bar .sticky-cta {
                    width: 100%;
                    max-width: 280px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function initScrollIntent() {
        injectStickyStyles();
        const stickyBar = createStickyBar();
        let isVisible = false;

        function checkScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            if (scrollPercent >= SCROLL_THRESHOLD && !isVisible) {
                stickyBar.classList.add('visible');
                isVisible = true;
            } else if (scrollPercent < SCROLL_THRESHOLD && isVisible) {
                stickyBar.classList.remove('visible');
                isVisible = false;
            }
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
    }

    // ==========================================
    // INITIALISATION
    // ==========================================
    function init() {
        // Injection dynamique
        injectLogo();
        injectBrandName();
        injectCTALinks();
        
        // Scroll intent sticky bar
        initScrollIntent();

        // Log pour debug
        console.log('🎮 Prelander initialized', {
            brand: BRAND_NAME,
            variant: PAGE_VARIANT,
            tracking: getTrackingParams()
        });
    }

    // Démarrer quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
