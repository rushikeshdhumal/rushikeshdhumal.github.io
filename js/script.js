// Portfolio Website JavaScript
// Author: Rushikesh Dhumal

'use strict';

// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.themeText = document.getElementById('theme-text');
        this.init();
    }

    init() {
        this.loadTheme();
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            html.removeAttribute('data-theme');
            this.themeIcon.className = 'fas fa-moon';
            this.themeText.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        } else {
            html.setAttribute('data-theme', 'dark');
            this.themeIcon.className = 'fas fa-sun';
            this.themeText.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.themeIcon.className = 'fas fa-sun';
            this.themeText.textContent = 'Light Mode';
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navCenter = document.getElementById('nav-center');
        this.projectsLink = document.getElementById('projects-link');
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
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
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
        if (demo) {
            const isVisible = demo.style.display !== 'none';
            demo.style.display = isVisible ? 'none' : 'block';
            
            // Update button text
            const button = document.querySelector(`[data-demo="${demoId}"]`);
            if (button) {
                const icon = button.querySelector('i');
                const text = button.querySelector('span') || button.childNodes[button.childNodes.length - 1];
                
                if (isVisible) {
                    icon.className = 'fas fa-play';
                    if (text) text.textContent = ' Live Demo';
                } else {
                    icon.className = 'fas fa-pause';
                    if (text) text.textContent = ' Hide Demo';
                }
            }
        }
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

        // Preload critical resources
        this.preloadResources();
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

    preloadResources() {
        // Preload critical fonts or images if needed
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'preload';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        fontAwesome.as = 'style';
        document.head.appendChild(fontAwesome);
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