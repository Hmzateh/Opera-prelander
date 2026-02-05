/* ==========================================
   OPERA GX PRELANDER - MAIN.JS
   ==========================================
   
   ⚡ CONFIGURATION RAPIDE ⚡
   ----------------------------------------
   Modifiez UNIQUEMENT les variables ci-dessous
   pour personnaliser votre prelander.
   ========================================== */

(function() {
    'use strict';

    // ==========================================
    // 🎯 CONFIGURATION PRINCIPALE
    // ==========================================
    
    const CONFIG = {
        
        // ──────────────────────────────────────
        // 📌 BRANDING
        // ──────────────────────────────────────
        BRAND_NAME: "Opera GX",
        LOGO_URL: "https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/logo/gx/opera-gx__logo--white.160608602ec9.svg",
        
        // ──────────────────────────────────────
        // 🔗 CTA (Call To Action)
        // ──────────────────────────────────────
        CTA_URL: "https://opera-gx.perfgames.com/",    // Lien de destination
        CTA_TEXT: "Download NOW",                      // Texte du bouton principal
        CTA_STICKY_TEXT: "Download NOW",              // Texte du bouton sticky bar
        
        // ──────────────────────────────────────
        // 📊 STICKY BAR
        // ──────────────────────────────────────
        STICKY_ENABLED: true,                          // Activer/Désactiver la sticky bar
        STICKY_MESSAGE: "🎮 Boost your FPS for FREE", // Message dans la sticky bar
        SCROLL_THRESHOLD: 35,                          // % scroll avant affichage sticky
        
        // ──────────────────────────────────────
        // 📈 TRACKING & ANALYTICS
        // ──────────────────────────────────────
        PAGE_VARIANT: "A",                             // Variante A/B test
        TRACK_CLICKS: true,                            // Activer tracking clicks
        
        // ──────────────────────────────────────
        // 🎨 TEXTES PERSONNALISABLES
        // ──────────────────────────────────────
        META_TITLE: "Opera GX - #1 Gaming Browser | Boost Your FPS For Free",
        META_DESCRIPTION: "Opera GX - The gaming browser that boosts your performance without upgrading your PC. Free, powerful, built for gamers."
    };

    // ==========================================
    // 🔧 CODE PRINCIPAL (NE PAS MODIFIER)
    // ==========================================

    // Extraction des paramètres de tracking
    function getTrackingParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            clickid: params.get('clickid') || '',
            utm_source: params.get('utm_source') || '',
            utm_medium: params.get('utm_medium') || '',
            utm_campaign: params.get('utm_campaign') || '',
            utm_content: params.get('utm_content') || '',
            utm_term: params.get('utm_term') || '',
            gclid: params.get('gclid') || '',
            fbclid: params.get('fbclid') || '',
            sub1: params.get('sub1') || '',
            sub2: params.get('sub2') || '',
            sub3: params.get('sub3') || '',
            sub4: params.get('sub4') || '',
            sub5: params.get('sub5') || ''
        };
    }

    // Construction de l'URL CTA avec tracking
    function buildCTAUrl() {
        const tracking = getTrackingParams();
        const url = new URL(CONFIG.CTA_URL);
        
        Object.keys(tracking).forEach(key => {
            if (tracking[key]) {
                url.searchParams.set(key, tracking[key]);
            }
        });
        
        return url.toString();
    }

    // DataLayer pour Analytics
    window.dataLayer = window.dataLayer || [];

    function trackClick(buttonType) {
        if (!CONFIG.TRACK_CLICKS) return;
        
        const tracking = getTrackingParams();
        window.dataLayer.push({
            event: 'prelander_click',
            button_type: buttonType,
            clickid: tracking.clickid,
            utm_source: tracking.utm_source,
            utm_campaign: tracking.utm_campaign,
            page_variant: CONFIG.PAGE_VARIANT,
            timestamp: new Date().toISOString()
        });
    }

    // Injection du logo
    function injectLogo() {
        const logoWrapper = document.querySelector('.logo-wrapper');
        if (logoWrapper) {
            logoWrapper.innerHTML = `<img src="${CONFIG.LOGO_URL}" alt="${CONFIG.BRAND_NAME} Logo" class="logo">`;
        }
    }

    // Mise à jour du branding
    function injectBrandName() {
        // Mise à jour du title
        document.title = CONFIG.META_TITLE;
        
        // Mise à jour de la meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = CONFIG.META_DESCRIPTION;
        }
    }

    // Injection des liens CTA
    function injectCTALinks() {
        const ctaUrl = buildCTAUrl();
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(btn => {
            btn.href = ctaUrl;
            
            // Conserver l'icône SVG
            const svg = btn.querySelector('svg');
            btn.textContent = CONFIG.CTA_TEXT;
            if (svg) {
                btn.appendChild(svg);
            }
            
            // Event listener pour tracking
            btn.addEventListener('click', () => trackClick('main_cta'));
        });
    }

    // Création de la Sticky Bar
    function createStickyBar() {
        if (!CONFIG.STICKY_ENABLED) return null;
        
        const stickyBar = document.createElement('div');
        stickyBar.id = 'sticky-cta-bar';
        stickyBar.innerHTML = `
            <div class="sticky-content">
                <span class="sticky-text">${CONFIG.STICKY_MESSAGE} – ${CONFIG.BRAND_NAME}</span>
                <a href="${buildCTAUrl()}" class="sticky-cta" target="_blank" rel="noopener">${CONFIG.CTA_STICKY_TEXT}</a>
            </div>
        `;
        document.body.appendChild(stickyBar);

        const stickyCta = stickyBar.querySelector('.sticky-cta');
        stickyCta.addEventListener('click', () => trackClick('sticky_cta'));

        return stickyBar;
    }

    // Styles pour la Sticky Bar
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

    // Gestion du scroll pour la Sticky Bar
    function initScrollIntent() {
        if (!CONFIG.STICKY_ENABLED) return;
        
        injectStickyStyles();
        const stickyBar = createStickyBar();
        if (!stickyBar) return;
        
        let isVisible = false;

        function checkScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            if (scrollPercent >= CONFIG.SCROLL_THRESHOLD && !isVisible) {
                stickyBar.classList.add('visible');
                isVisible = true;
            } else if (scrollPercent < CONFIG.SCROLL_THRESHOLD && isVisible) {
                stickyBar.classList.remove('visible');
                isVisible = false;
            }
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
    }

    // ==========================================
    // 🚀 INITIALISATION
    // ==========================================
    function init() {
        // Injection dynamique
        injectLogo();
        injectBrandName();
        injectCTALinks();
        
        // Sticky bar avec scroll intent
        initScrollIntent();

        // Log de débogage
        console.log('🎮 Prelander initialized', {
            brand: CONFIG.BRAND_NAME,
            variant: CONFIG.PAGE_VARIANT,
            cta_url: CONFIG.CTA_URL,
            tracking: getTrackingParams()
        });
    }

    // Démarrage
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
