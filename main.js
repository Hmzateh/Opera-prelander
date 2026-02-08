/* ==========================================
   OPERA GX PRELANDER - MAIN.JS
   ==========================================
   
   ⚡ CONFIGURATION RAPIDE ⚡
   ----------------------------------------
   Modifiez UNIQUEMENT cette section CONFIG
   pour personnaliser votre prelander.
   ========================================== */

(function() {
    'use strict';

    // ==========================================
    // 🎯 CONFIGURATION - MODIFIEZ ICI
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
        CTA_URL: "https://opera-gx.perfgames.com/",   // Lien de redirection
        CTA_TEXT: "Boost Your FPS Now",               // Texte du bouton principal
        CTA_STICKY_TEXT: "Download FREE",             // Texte du bouton sticky bar
        
        // ──────────────────────────────────────
        // 📊 STICKY BAR (barre en bas)
        // ──────────────────────────────────────
        STICKY_ENABLED: true,
        STICKY_MESSAGE: "🎮 Boost your FPS for FREE",
        SCROLL_THRESHOLD: 35,                          // % scroll avant affichage
        
        // ──────────────────────────────────────
        // 📈 TRACKING
        // ──────────────────────────────────────
        PAGE_VARIANT: "A",
        TRACK_CLICKS: true,
        
        // ──────────────────────────────────────
        // 🎨 META (SEO)
        // ──────────────────────────────────────
        META_TITLE: "Opera GX - #1 Gaming Browser | Boost Your FPS For Free",
        META_DESCRIPTION: "Opera GX - The gaming browser that boosts your performance without upgrading your PC. Free, powerful, built for gamers."
    };

    // ==========================================
    // 🔧 NE PAS MODIFIER EN DESSOUS
    // ==========================================

    // ──────────────────────────────────────
    // UTILITY FUNCTIONS
    // ──────────────────────────────────────
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        random(min, max) {
            return Math.random() * (max - min) + min;
        },
        generateId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    };

    // ──────────────────────────────────────
    // TRACKING PARAMETERS
    // ──────────────────────────────────────
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

    // ──────────────────────────────────────
    // DATALAYER & ANALYTICS
    // ──────────────────────────────────────
    window.dataLayer = window.dataLayer || [];
    
    const Tracking = {
        sessionId: utils.generateId(),
        startTime: Date.now(),

        trackEvent(eventName, data = {}) {
            if (!CONFIG.TRACK_CLICKS) return;
            
            const event = {
                event: eventName,
                session_id: this.sessionId,
                timestamp: new Date().toISOString(),
                page_url: window.location.href,
                page_variant: CONFIG.PAGE_VARIANT,
                ...data
            };

            window.dataLayer.push(event);
            console.log('📊 Event:', eventName, data);
        },

        trackClick(buttonType) {
            const tracking = getTrackingParams();
            this.trackEvent('cta_click', {
                button_type: buttonType,
                clickid: tracking.clickid,
                utm_source: tracking.utm_source,
                utm_campaign: tracking.utm_campaign
            });
        }
    };
    // Facebook Pixel - go2offer
    if (typeof fbq !== 'undefined') {
        fbq('track', 'go2offer');
    }

    // ──────────────────────────────────────
    // INJECTION DYNAMIQUE
    // ──────────────────────────────────────
    function injectLogo() {
        const logoWrapper = document.querySelector('.logo-wrapper');
        if (logoWrapper) {
            logoWrapper.innerHTML = `<img src="${CONFIG.LOGO_URL}" alt="${CONFIG.BRAND_NAME} Logo" class="logo">`;
        }
    }

    function injectMeta() {
        document.title = CONFIG.META_TITLE;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = CONFIG.META_DESCRIPTION;
        }
    }

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
            
            btn.addEventListener('click', () => Tracking.trackClick('main_cta'));
        });
    }

    // ──────────────────────────────────────
    // STICKY BAR
    // ──────────────────────────────────────
    function injectStickyStyles() {
        const style = document.createElement('style');
        style.id = 'sticky-bar-styles';
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
            #sticky-cta-bar.visible { transform: translateY(0); }
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
                #sticky-cta-bar .sticky-text { font-size: 0.85rem; }
                #sticky-cta-bar .sticky-cta { width: 100%; max-width: 280px; }
            }
        `;
        document.head.appendChild(style);
    }

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

        stickyBar.querySelector('.sticky-cta').addEventListener('click', () => Tracking.trackClick('sticky_cta'));
        return stickyBar;
    }

    function initStickyBar() {
        if (!CONFIG.STICKY_ENABLED) return;

        injectStickyStyles();
        const stickyBar = createStickyBar();
        if (!stickyBar) return;

        let isVisible = false;

        window.addEventListener('scroll', utils.debounce(() => {
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
        }, 16), { passive: true });
    }

    // ──────────────────────────────────────
    // CTA BUTTON EFFECTS
    // ──────────────────────────────────────
    function initCTAEffects() {
        const button = document.querySelector('.cta-button');
        if (!button) return;

        // Ripple effect
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 0; height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: translate(-50%, -50%);
                left: ${x}px; top: ${y}px;
                animation: ripple 0.6s ease-out forwards;
            `;
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        // Magnetic effect
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            button.style.transform = `translateY(-4px) scale(1.02) translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });

        // Add ripple animation
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `@keyframes ripple { to { width: 300px; height: 300px; opacity: 0; } }`;
            document.head.appendChild(style);
        }
    }

    // ──────────────────────────────────────
    // PARTICLE SYSTEM
    // ──────────────────────────────────────
    function initParticles() {
        const container = document.querySelector('.floating-particles');
        if (!container) return;

        const colors = ['#ff2d55', '#00f0ff', '#00ff88'];
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = utils.random(2, 6);
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${utils.random(0, 100)}%;
                background: ${color};
                box-shadow: 0 0 ${size * 3}px ${color};
                animation-duration: ${utils.random(10, 20)}s;
                animation-delay: ${utils.random(0, 10)}s;
            `;
            container.appendChild(particle);
        }
    }

    // ──────────────────────────────────────
    // SCROLL ANIMATIONS
    // ──────────────────────────────────────
    function initScrollAnimations() {
        // Reveal elements
        const revealElements = document.querySelectorAll('.feature-item, .trust-item, .partner-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });

        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed; top: 0; left: 0; height: 3px;
            background: linear-gradient(90deg, #ff2d55, #00f0ff);
            z-index: 9999; width: 0%;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
        });
    }

    // ──────────────────────────────────────
    // PERFORMANCE
    // ──────────────────────────────────────
    function initPerformance() {
        // Pause animations when hidden
        document.addEventListener('visibilitychange', () => {
            document.querySelectorAll('.particle').forEach(el => {
                el.style.animationPlayState = document.hidden ? 'paused' : 'running';
            });
        });

        // Prefetch CTA link
        const ctaLink = document.querySelector('.cta-button');
        if (ctaLink && ctaLink.href) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = ctaLink.href;
            document.head.appendChild(link);
        }
    }

    // ==========================================
    // 🚀 INITIALISATION
    // ==========================================
    function init() {
        // Injection dynamique depuis CONFIG
        injectLogo();
        injectMeta();
        injectCTALinks();
        
        // Features
        initStickyBar();
        initCTAEffects();
        initParticles();
        initScrollAnimations();
        initPerformance();

        // Expose tracking
        window.PrelanderTracking = Tracking;

        console.log('🎮 Prelander initialized', {
            brand: CONFIG.BRAND_NAME,
            cta_url: CONFIG.CTA_URL,
            cta_text: CONFIG.CTA_TEXT,
            variant: CONFIG.PAGE_VARIANT,
            tracking: getTrackingParams()
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
