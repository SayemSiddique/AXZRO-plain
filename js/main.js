// AXZRO - Main JavaScript
// Handles animations, scroll effects, and interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initScrollAnimations();
    initTestimonialCarousel();
    initSmoothScroll();
    initScrollIndicator();
    initParallaxEffects();
    initButtonEffects();
    
    console.log('AXZRO website initialized successfully');
});

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for children
                const children = entry.target.querySelectorAll('.fade-in-up, .service-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .service-card');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// === TESTIMONIAL CAROUSEL ===
function initTestimonialCarousel() {
    const wrapper = document.getElementById('testimonial-wrapper');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!wrapper || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Auto-play carousel
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            nextSlide();
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            prevSlide();
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoPlayInterval);
            currentSlide = index;
            showSlide(currentSlide);
            autoPlayInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // Pause on hover
    wrapper.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    wrapper.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearInterval(autoPlayInterval);
            prevSlide();
            autoPlayInterval = setInterval(nextSlide, 5000);
        } else if (e.key === 'ArrowRight') {
            clearInterval(autoPlayInterval);
            nextSlide();
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === SCROLL INDICATOR ===
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.getElementById('services-preview');
            if (servicesSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = servicesSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
        
        // Hide scroll indicator when user scrolls past hero
        window.addEventListener('scroll', () => {
            const heroHeight = document.querySelector('.hero').offsetHeight;
            const scrolled = window.pageYOffset;
            
            if (scrolled > heroHeight * 0.5) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
}

// === PARALLAX EFFECTS ===
function initParallaxEffects() {
    const animatedBg = document.querySelector('.animated-bg');
    
    if (animatedBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            animatedBg.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Parallax for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = (scrolled * 0.1) * (index + 1);
            
            if (window.innerWidth > 768) { // Only on desktop
                card.style.transform = `translateY(${rate}px)`;
            }
        });
    });
}

// === BUTTON EFFECTS ===
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add press effect
        button.classList.add('btn-press');
    });
}

// === UTILITY FUNCTIONS ===

// Throttle function for performance
function throttle(func, wait) {
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

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// === PERFORMANCE OPTIMIZATIONS ===

// Lazy load images when they come into view
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// === ACCESSIBILITY ENHANCEMENTS ===

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    // Focus management for modals and interactive elements
    if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        const openElements = document.querySelectorAll('.modal.active, .dropdown.active');
        openElements.forEach(el => el.classList.remove('active'));
    }
    
    // Skip to main content
    if (e.key === 'Tab' && e.target.classList.contains('skip-link')) {
        e.preventDefault();
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent) {
            mainContent.focus();
        }
    }
});

// === ERROR HANDLING ===

// Global error handler
window.addEventListener('error', (e) => {
    console.error('AXZRO Website Error:', e.error);
    // You could send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

// === ANALYTICS & TRACKING ===

// Track button clicks
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn, .service-link, .nav-link')) {
        const elementText = e.target.textContent.trim();
        const elementHref = e.target.href || '';
        
        // Log for analytics (replace with your analytics service)
        console.log('Button clicked:', {
            text: elementText,
            href: elementHref,
            timestamp: new Date().toISOString()
        });
    }
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', throttle(() => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Log scroll milestones
        if (scrollDepth >= 25 && maxScrollDepth < 25) {
            console.log('Scroll milestone: 25%');
        } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
            console.log('Scroll milestone: 50%');
        } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
            console.log('Scroll milestone: 75%');
        } else if (scrollDepth >= 90 && maxScrollDepth < 90) {
            console.log('Scroll milestone: 90%');
        }
    }
}, 250));

// === CSS STYLING FOR RIPPLE EFFECT ===
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
