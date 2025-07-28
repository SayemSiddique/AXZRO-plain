// AXZRO - Navigation JavaScript
// Handles mobile navigation, sticky nav, and navigation interactions

document.addEventListener('DOMContentLoaded', function() {
    initMobileNavigation();
    initStickyNavigation();
    initActiveNavLinks();
    initNavigationEffects();
    
    console.log('Navigation system initialized');
});

// === MOBILE NAVIGATION ===
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        
        // Update ARIA attributes for accessibility
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        navMenu.setAttribute('aria-hidden', !isExpanded);
    });
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            hamburger.setAttribute('aria-expanded', false);
            navMenu.setAttribute('aria-hidden', true);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            hamburger.setAttribute('aria-expanded', false);
            navMenu.setAttribute('aria-hidden', true);
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            hamburger.setAttribute('aria-expanded', false);
            navMenu.setAttribute('aria-hidden', true);
            hamburger.focus(); // Return focus to hamburger button
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Reset mobile menu state on desktop
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            hamburger.setAttribute('aria-expanded', false);
            navMenu.setAttribute('aria-hidden', false);
        }
    });
}

// === STICKY NAVIGATION ===
function initStickyNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional - can be enabled)
        // if (scrollY > lastScrollY && scrollY > 100) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestNavbarUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestNavbarUpdate);
}

// === ACTIVE NAVIGATION LINKS ===
function initActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], .hero');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    // Create a map of href to nav link
    const linkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            linkMap.set(href.substring(1), link);
        } else if (href) {
            // For page links, check if current page matches
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const linkPage = href.split('/').pop();
            
            if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        }
    });
    
    // Intersection Observer for section-based active links
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const sectionId = entry.target.id;
            const link = linkMap.get(sectionId);
            
            if (entry.isIntersecting && link) {
                // Remove active class from all links
                navLinks.forEach(navLink => {
                    if (navLink.getAttribute('href').startsWith('#')) {
                        navLink.classList.remove('active');
                    }
                });
                
                // Add active class to current link
                link.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe sections
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
}

// === NAVIGATION EFFECTS ===
function initNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add hover effects and click analytics
    navLinks.forEach(link => {
        // Smooth hover effect
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
        
        // Click tracking
        link.addEventListener('click', (e) => {
            const linkText = link.textContent.trim();
            const linkHref = link.getAttribute('href');
            
            // Log navigation click
            console.log('Navigation clicked:', {
                text: linkText,
                href: linkHref,
                timestamp: new Date().toISOString()
            });
            
            // Add click animation
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = '';
            }, 150);
        });
    });
    
    // Logo click effect
    const logo = document.querySelector('.logo a');
    if (logo) {
        logo.addEventListener('click', () => {
            console.log('Logo clicked');
            
            // Add subtle animation
            logo.style.transform = 'scale(0.95)';
            setTimeout(() => {
                logo.style.transform = '';
            }, 150);
        });
    }
}

// === NAVIGATION KEYBOARD SUPPORT ===
function initKeyboardNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Handle Tab navigation in mobile menu
        if (e.key === 'Tab') {
            const navMenu = document.getElementById('nav-menu');
            
            if (navMenu && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const currentLink = document.activeElement;
            const currentIndex = Array.from(navLinks).indexOf(currentLink);
            
            if (currentIndex !== -1) {
                e.preventDefault();
                
                let nextIndex;
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : navLinks.length - 1;
                } else {
                    nextIndex = currentIndex < navLinks.length - 1 ? currentIndex + 1 : 0;
                }
                
                navLinks[nextIndex].focus();
            }
        }
        
        // Enter or Space to activate hamburger
        if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === hamburger) {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// === BREADCRUMB NAVIGATION ===
function initBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageNames = {
        'index.html': 'Home',
        'about.html': 'About',
        'services.html': 'Services',
        'academy.html': 'Academy',
        'contact.html': 'Contact'
    };
    
    const pageName = pageNames[currentPage] || 'Page';
    
    // Create breadcrumb structure
    const breadcrumbHTML = `
        <nav aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
                <li><a href="index.html">Home</a></li>
                ${pageName !== 'Home' ? `<li aria-current="page">${pageName}</li>` : ''}
            </ol>
        </nav>
    `;
    
    breadcrumbContainer.innerHTML = breadcrumbHTML;
}

// === SEARCH FUNCTIONALITY ===
function initSiteSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                performSearch(query);
            } else if (searchResults) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
            }
        }, 300);
    });
    
    function performSearch(query) {
        // Simple client-side search
        const searchableContent = [
            { title: 'Web Development', url: 'services.html#web-dev', content: 'Custom websites and applications' },
            { title: 'Cybersecurity', url: 'services.html#cybersecurity', content: 'Security audits and protection' },
            { title: 'Tech Academy', url: 'academy.html', content: 'Training and education courses' },
            { title: 'About Us', url: 'about.html', content: 'Company mission and vision' },
            { title: 'Contact', url: 'contact.html', content: 'Get in touch with our team' }
        ];
        
        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.content.toLowerCase().includes(query.toLowerCase())
        );
        
        displaySearchResults(results, query);
    }
    
    function displaySearchResults(results, query) {
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = `<p>No results found for "${query}"</p>`;
        } else {
            const resultsHTML = results.map(result => `
                <div class="search-result">
                    <h4><a href="${result.url}">${result.title}</a></h4>
                    <p>${result.content}</p>
                </div>
            `).join('');
            
            searchResults.innerHTML = resultsHTML;
        }
        
        searchResults.style.display = 'block';
    }
}

// Initialize keyboard navigation and other features
document.addEventListener('DOMContentLoaded', () => {
    initKeyboardNavigation();
    initBreadcrumbs();
    initSiteSearch();
});

// === ACCESSIBILITY ANNOUNCEMENTS ===
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Export functions for use in other scripts
window.AXZRO = window.AXZRO || {};
window.AXZRO.navigation = {
    announceToScreenReader,
    initMobileNavigation,
    initStickyNavigation,
    initActiveNavLinks
};
