/* ==========================================
   OPERA GX PRELANDER - MAIN.JS
   Gaming Browser Landing Page Scripts
   ========================================== */

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        particles: {
            count: 15,
            colors: ['#ff2d55', '#00f0ff', '#00ff88'],
            minSize: 2,
            maxSize: 6
        },
        animations: {
            typingSpeed: 50,
            counterDuration: 2000,
            scrollThreshold: 100
        },
        tracking: {
            enabled: true,
            events: []
        }
    };

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    const utils = {
        // Debounce function for performance
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

        // Random number generator
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        // Check if element is in viewport
        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Get cookie value
        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        },

        // Set cookie
        setCookie(name, value, days = 30) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
        },

        // Generate unique ID
        generateId() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    };

    // ==========================================
    // ENHANCED PARTICLE SYSTEM
    // ==========================================
    const ParticleSystem = {
        container: null,
        particles: [],

        init() {
            this.container = document.querySelector('.floating-particles');
            if (!this.container) return;

            // Add more dynamic particles
            this.createParticles(CONFIG.particles.count);
            this.animate();
        },

        createParticles(count) {
            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle dynamic-particle';
                
                const size = utils.random(CONFIG.particles.minSize, CONFIG.particles.maxSize);
                const color = CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)];
                
                particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${utils.random(0, 100)}%;
                    background: ${color};
                    box-shadow: 0 0 ${size * 3}px ${color};
                    animation-duration: ${utils.random(10, 20)}s;
                    animation-delay: ${utils.random(0, 10)}s;
                `;
                
                this.container.appendChild(particle);
                this.particles.push(particle);
            }
        },

        animate() {
            // Mouse parallax effect for particles
            document.addEventListener('mousemove', utils.debounce((e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                this.particles.forEach((particle, index) => {
                    const speed = (index % 3 + 1) * 10;
                    const x = (mouseX - 0.5) * speed;
                    const y = (mouseY - 0.5) * speed;
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                });
            }, 16));
        }
    };

    // ==========================================
    // CTA BUTTON INTERACTIONS
    // ==========================================
    const CTAButton = {
        button: null,
        clickCount: 0,

        init() {
            this.button = document.querySelector('.cta-button');
            if (!this.button) return;

            this.addRippleEffect();
            this.addHoverSound();
            this.trackClicks();
            this.addMagneticEffect();
        },

        addRippleEffect() {
            this.button.addEventListener('click', (e) => {
                const rect = this.button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: translate(-50%, -50%);
                    left: ${x}px;
                    top: ${y}px;
                    animation: ripple 0.6s ease-out forwards;
                `;

                this.button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });

            // Add ripple animation to stylesheet
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            width: 300px;
                            height: 300px;
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        },

        addHoverSound() {
            // Optional: Add hover sound effect
            this.button.addEventListener('mouseenter', () => {
                // Subtle visual feedback
                this.button.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
        },

        addMagneticEffect() {
            this.button.addEventListener('mousemove', (e) => {
                const rect = this.button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.button.style.transform = `translateY(-4px) scale(1.02) translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            this.button.addEventListener('mouseleave', () => {
                this.button.style.transform = '';
            });
        },

        trackClicks() {
            this.button.addEventListener('click', (e) => {
                this.clickCount++;
                
                // Track conversion event
                Tracking.trackEvent('cta_click', {
                    click_count: this.clickCount,
                    timestamp: new Date().toISOString(),
                    button_text: this.button.textContent.trim()
                });

                // Add visual feedback
                this.button.classList.add('clicked');
                setTimeout(() => this.button.classList.remove('clicked'), 300);
            });
        }
    };

    // ==========================================
    // ANIMATED COUNTERS
    // ==========================================
    const AnimatedCounters = {
        counters: [],

        init() {
            // Create counters for stats
            this.setupStatCounters();
        },

        setupStatCounters() {
            const stats = document.querySelectorAll('.stat-value');
            
            stats.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('%') || text.includes('+')) {
                    this.animateOnScroll(stat, text);
                }
            });
        },

        animateOnScroll(element, finalText) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateValue(element, finalText);
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(element);
        },

        animateValue(element, finalText) {
            const number = parseInt(finalText.replace(/[^0-9]/g, ''));
            const suffix = finalText.replace(/[0-9]/g, '');
            const duration = CONFIG.animations.counterDuration;
            const steps = 60;
            const increment = number / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                step++;
                current = Math.min(Math.round(increment * step), number);
                element.textContent = current + suffix;

                if (step >= steps) {
                    clearInterval(timer);
                    element.textContent = finalText;
                }
            }, duration / steps);
        }
    };

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    const ScrollAnimations = {
        elements: [],

        init() {
            this.setupScrollReveal();
            this.setupParallax();
            this.setupProgressIndicator();
        },

        setupScrollReveal() {
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
        },

        setupParallax() {
            const visual = document.querySelector('.visual');
            if (!visual) return;

            window.addEventListener('scroll', utils.debounce(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                visual.style.transform = `translateY(${rate}px)`;
            }, 16));
        },

        setupProgressIndicator() {
            // Create scroll progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #ff2d55, #00f0ff);
                z-index: 9999;
                transition: width 0.1s ease;
                width: 0%;
            `;
            document.body.appendChild(progressBar);

            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                progressBar.style.width = `${progress}%`;
            });
        }
    };

    // ==========================================
    // TRACKING & ANALYTICS
    // ==========================================
    const Tracking = {
        sessionId: null,
        startTime: null,

        init() {
            this.sessionId = utils.generateId();
            this.startTime = Date.now();
            
            this.trackPageView();
            this.trackScrollDepth();
            this.trackTimeOnPage();
            this.trackExitIntent();
        },

        trackEvent(eventName, data = {}) {
            const event = {
                event: eventName,
                session_id: this.sessionId,
                timestamp: new Date().toISOString(),
                page_url: window.location.href,
                ...data
            };

            CONFIG.tracking.events.push(event);
            
            // Console log for debugging (replace with your tracking endpoint)
            console.log('📊 Event tracked:', event);

            // Send to analytics endpoint (uncomment and configure)
            // this.sendToEndpoint(event);
        },

        trackPageView() {
            this.trackEvent('page_view', {
                referrer: document.referrer,
                user_agent: navigator.userAgent,
                screen_size: `${window.innerWidth}x${window.innerHeight}`,
                device_type: this.getDeviceType()
            });
        },

        trackScrollDepth() {
            let maxScroll = 0;
            const milestones = [25, 50, 75, 100];
            const tracked = new Set();

            window.addEventListener('scroll', utils.debounce(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = Math.round((scrollTop / docHeight) * 100);

                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;

                    milestones.forEach(milestone => {
                        if (scrollPercent >= milestone && !tracked.has(milestone)) {
                            tracked.add(milestone);
                            this.trackEvent('scroll_depth', { depth: milestone });
                        }
                    });
                }
            }, 100));
        },

        trackTimeOnPage() {
            // Track time on page when user leaves
            window.addEventListener('beforeunload', () => {
                const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
                this.trackEvent('time_on_page', { seconds: timeSpent });
            });

            // Track engagement milestones
            const timeMillestones = [10, 30, 60, 120, 300];
            timeMillestones.forEach(seconds => {
                setTimeout(() => {
                    this.trackEvent('engagement_milestone', { seconds: seconds });
                }, seconds * 1000);
            });
        },

        trackExitIntent() {
            let exitIntentShown = false;

            document.addEventListener('mouseleave', (e) => {
                if (e.clientY < 10 && !exitIntentShown) {
                    exitIntentShown = true;
                    this.trackEvent('exit_intent', {
                        time_on_page: Math.round((Date.now() - this.startTime) / 1000)
                    });
                    
                    // Optional: Show exit intent popup
                    // this.showExitPopup();
                }
            });
        },

        getDeviceType() {
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return 'tablet';
            }
            if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                return 'mobile';
            }
            return 'desktop';
        },

        sendToEndpoint(event) {
            // Configure your tracking endpoint here
            const endpoint = 'YOUR_TRACKING_ENDPOINT';
            
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
                keepalive: true
            }).catch(err => console.error('Tracking error:', err));
        }
    };

    // ==========================================
    // PERFORMANCE OPTIMIZATIONS
    // ==========================================
    const Performance = {
        init() {
            this.lazyLoadImages();
            this.prefetchLinks();
            this.optimizeAnimations();
        },

        lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        },

        prefetchLinks() {
            const ctaLink = document.querySelector('.cta-button');
            if (ctaLink && ctaLink.href) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = ctaLink.href;
                document.head.appendChild(link);
            }
        },

        optimizeAnimations() {
            // Pause animations when tab is not visible
            document.addEventListener('visibilitychange', () => {
                const animatedElements = document.querySelectorAll('[class*="animation"], .particle');
                
                animatedElements.forEach(el => {
                    if (document.hidden) {
                        el.style.animationPlayState = 'paused';
                    } else {
                        el.style.animationPlayState = 'running';
                    }
                });
            });

            // Reduce motion for users who prefer it
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.querySelectorAll('*').forEach(el => {
                    el.style.animation = 'none';
                    el.style.transition = 'none';
                });
            }
        }
    };

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    const Accessibility = {
        init() {
            this.setupKeyboardNav();
            this.setupFocusStyles();
        },

        setupKeyboardNav() {
            document.addEventListener('keydown', (e) => {
                // Press Enter or Space on CTA to trigger click
                if ((e.key === 'Enter' || e.key === ' ') && document.activeElement.classList.contains('cta-button')) {
                    e.preventDefault();
                    document.activeElement.click();
                }
            });
        },

        setupFocusStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .cta-button:focus-visible {
                    outline: 3px solid #00f0ff;
                    outline-offset: 3px;
                }
                
                *:focus {
                    outline-color: #ff2d55;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // ==========================================
    // DYNAMIC CONTENT
    // ==========================================
    const DynamicContent = {
        init() {
            this.updateYear();
            this.personalizeContent();
        },

        updateYear() {
            const yearElements = document.querySelectorAll('[data-year]');
            const currentYear = new Date().getFullYear();
            yearElements.forEach(el => el.textContent = currentYear);
        },

        personalizeContent() {
            // Check for returning visitor
            const visitCount = parseInt(utils.getCookie('visit_count') || '0') + 1;
            utils.setCookie('visit_count', visitCount);

            if (visitCount > 1) {
                // Personalize for returning visitors
                const headline = document.querySelector('.headline');
                if (headline && visitCount > 3) {
                    // After 3+ visits, could show different messaging
                    console.log(`Welcome back! Visit #${visitCount}`);
                }
            }
        }
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initModules);
        } else {
            initModules();
        }
    }

    function initModules() {
        console.log('🎮 Opera GX Prelander initialized');
        
        // Initialize all modules
        ParticleSystem.init();
        CTAButton.init();
        AnimatedCounters.init();
        ScrollAnimations.init();
        Tracking.init();
        Performance.init();
        Accessibility.init();
        DynamicContent.init();

        // Expose tracking for external use
        window.PrelanderTracking = Tracking;
    }

    // Start the application
    init();

})();
