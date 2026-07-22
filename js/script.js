// Portfolio Website JavaScript
// Author: Rushikesh Dhumal

'use strict';

// Theme Management
// Dark is the CSS default; an explicit OS "light" preference or a saved
// choice overrides it via the data-theme attribute. The toggle swaps an
// inline SVG (sun/moon) and persists the choice in localStorage.
class ThemeManager {
    constructor() {
        this.root = document.documentElement;
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.themeText = document.getElementById('theme-text');
        this.SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>';
        this.MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>';
        this.init();
    }

    // The theme actually being displayed right now.
    effectiveTheme() {
        const attr = this.root.getAttribute('data-theme');
        if (attr) return attr;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    init() {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') {
            this.root.setAttribute('data-theme', saved);
        }
        this.paint(this.effectiveTheme());
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const next = this.effectiveTheme() === 'dark' ? 'light' : 'dark';
        this.root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        this.paint(next);
    }

    // Show the icon/label for the theme you'd switch TO.
    paint(theme) {
        if (this.themeIcon) this.themeIcon.innerHTML = theme === 'dark' ? this.SUN : this.MOON;
        if (this.themeText) this.themeText.textContent = theme === 'dark' ? 'light' : 'dark';
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navCenter = document.getElementById('nav-center');
        this.projectsLink = document.getElementById('projects-link');
        this.openProjectsBtns = document.querySelectorAll('[data-open-projects="true"]');
        this.backToMainBtn = document.getElementById('back-to-main');
        this.init();
    }

    init() {
        // Mobile menu toggle
        this.mobileMenuBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Projects navigation
        this.projectsLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showProjectsPage();
        });

        this.openProjectsBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.showProjectsPage();
            });
        });

        this.backToMainBtn?.addEventListener('click', () => {
            this.showMainContent();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                this.closeMobileMenu();
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') { this.closeMobileMenu(); return; }
                const target = document.querySelector(targetId);

                if (target) {
                    // Check if we're on projects page and need to go back to main content
                    const projectsPage = document.getElementById('projects-page');
                    const mainContent = document.getElementById('main-content');
                    
                    if (projectsPage && mainContent && 
                        projectsPage.style.display !== 'none' && 
                        targetId !== '#projects') {
                        
                        // First show main content
                        mainContent.style.display = 'block';
                        projectsPage.style.display = 'none';
                        window.scrollTo(0, 0);
                        
                        // Then scroll to target after a brief delay to ensure content is visible
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 100);
                    } else {
                        // Normal scroll behavior
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
                this.closeMobileMenu();
            });
        });

        // Active navigation highlight
        window.addEventListener('scroll', () => this.updateActiveNavigation());
    }

    toggleMobileMenu() {
        this.navCenter?.classList.toggle('show');
    }

    closeMobileMenu() {
        this.navCenter?.classList.remove('show');
    }

    showProjectsPage() {
        const mainContent = document.getElementById('main-content');
        const projectsPage = document.getElementById('projects-page');
        
        if (mainContent && projectsPage) {
            mainContent.style.display = 'none';
            projectsPage.style.display = 'block';
            window.scrollTo(0, 0);
        }
        this.closeMobileMenu();
    }

    showMainContent() {
        const mainContent = document.getElementById('main-content');
        const projectsPage = document.getElementById('projects-page');
        
        if (mainContent && projectsPage) {
            mainContent.style.display = 'block';
            projectsPage.style.display = 'none';
            window.scrollTo(0, 0);
        }
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Projects Demo Management
class ProjectsManager {
    constructor() {
        this.init();
    }

    init() {
        // Project demo toggle buttons
        document.querySelectorAll('.project-link[data-demo]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const demoId = button.getAttribute('data-demo');
                this.toggleDemo(demoId);
            });
        });
    }

    toggleDemo(demoId) {
        const demo = document.getElementById(demoId);
        if (!demo) return;

        const isVisible = demo.style.display !== 'none';
        demo.style.display = isVisible ? 'none' : 'block';

        // Flip only the trailing text label; the inline SVG icon stays put.
        const button = document.querySelector(`[data-demo="${demoId}"]`);
        if (!button) return;
        button.setAttribute('aria-expanded', String(!isVisible));

        const labelNode = button.childNodes[button.childNodes.length - 1];
        if (labelNode && labelNode.nodeType === Node.TEXT_NODE) {
            if (!button.dataset.label) button.dataset.label = labelNode.textContent;
            labelNode.textContent = isVisible ? button.dataset.label : ' Hide';
        }
    }
}

// Project Description Management
class ProjectDescriptionManager {
    constructor() {
        this.maxLength = 430;
        this.init();
    }

    init() {
        document.querySelectorAll('.project-showcase > p').forEach((paragraph) => {
            const textLength = paragraph.textContent.trim().length;
            paragraph.classList.add('project-description');

            // If project is marked featured, leave expanded
            const container = paragraph.closest('.project-showcase');
            const isFeatured = container && container.classList.contains('featured');

            if (!isFeatured && textLength > this.maxLength) {
                paragraph.classList.add('collapsed');
                this.addToggleButton(paragraph);
            }
        });
    }

    addToggleButton(paragraph) {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'project-summary-toggle';
        toggle.textContent = 'Show more';

        toggle.addEventListener('click', () => {
            const isCollapsed = paragraph.classList.toggle('collapsed');
            toggle.textContent = isCollapsed ? 'Show more' : 'Show less';
        });

        paragraph.insertAdjacentElement('afterend', toggle);
    }
}

// Project Category Filtering (Projects page)
// Chips carry data-filter; cards carry data-category. "all" shows everything.
class ProjectFilterManager {
    constructor() {
        this.chips = Array.from(document.querySelectorAll('.filter-chip'));
        this.cards = Array.from(document.querySelectorAll('.project-showcase[data-category]'));
        this.count = document.getElementById('filter-count');
        if (this.chips.length && this.cards.length) this.init();
    }

    init() {
        this.chips.forEach((chip) => {
            chip.addEventListener('click', () => this.apply(chip.getAttribute('data-filter'), chip));
        });
    }

    apply(filter, activeChip) {
        this.chips.forEach((c) => c.setAttribute('aria-pressed', c === activeChip ? 'true' : 'false'));

        let shown = 0;
        this.cards.forEach((card) => {
            const match = filter === 'all' || card.getAttribute('data-category') === filter;
            card.classList.toggle('is-hidden', !match);
            if (match) shown++;
        });

        if (this.count) this.count.textContent = `showing ${shown} of ${this.cards.length}`;
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            this.observer.observe(el);
        });
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page Load Time: ${loadTime}ms`);
                
                // Log performance metrics (optional - can be sent to analytics)
                if (loadTime > 3000) {
                    console.warn('Page load time is over 3 seconds');
                }
            }
        });
    }
}

// Main Application Class
class PortfolioApp {
    constructor() {
        this.themeManager = null;
        this.navigationManager = null;
        this.projectsManager = null;
        this.projectDescriptionManager = null;
        this.projectFilterManager = null;
        this.scrollAnimations = null;
        this.performanceMonitor = null;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.projectsManager = new ProjectsManager();
            this.projectDescriptionManager = new ProjectDescriptionManager();
            this.projectFilterManager = new ProjectFilterManager();
            this.scrollAnimations = new ScrollAnimations();
            this.performanceMonitor = new PerformanceMonitor();

            // Add custom event listeners
            this.addCustomEventListeners();

            console.log('Portfolio website initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio website:', error);
        }
    }

    addCustomEventListeners() {
        // Handle window resize for responsive behavior
        const debouncedResize = Utils.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', debouncedResize);

        // Handle scroll events with throttling
        const throttledScroll = Utils.throttle(() => {
            this.handleScroll();
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledScroll);
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.navigationManager?.closeMobileMenu();
        }
    }

    handleScroll() {
        // Add any scroll-based functionality here
        // Currently handled by NavigationManager
    }

    destroy() {
        // Cleanup method for removing event listeners if needed
        this.scrollAnimations?.destroy();
        console.log('Portfolio website cleanup completed');
    }
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// Initialize the application
const portfolioApp = new PortfolioApp();

// Expose app to global scope for debugging (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.portfolioApp = portfolioApp;
}