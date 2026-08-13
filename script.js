// ================================
// DOM Elements
// ================================
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.testimonial-btn.prev');
const nextBtn = document.querySelector('.testimonial-btn.next');
const dots = document.querySelectorAll('.dot');

// ================================
// Mobile Navigation
// ================================
function toggleNav() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function closeNav() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

navToggle.addEventListener('click', toggleNav);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeNav();
    });
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        closeNav();
    }
});

// ================================
// Header Scroll Effect
// ================================
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (currentScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleScroll);

// ================================
// Active Navigation Link
// ================================
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ================================
// Counter Animation
// ================================
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// Intersection Observer for counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    counterObserver.observe(heroStats);
}

// ================================
// Testimonials Slider
// ================================
let currentSlide = 0;
const totalSlides = testimonialCards.length;

function updateSlider() {
    testimonialCards.forEach((card, index) => {
        card.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto-slide
let autoSlide = setInterval(nextSlide, 5000);

// Pause on hover
const slider = document.querySelector('.testimonials-slider');
if (slider) {
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });
}

// Touch support for slider
let touchStartX = 0;
let touchEndX = 0;

if (slider) {
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// ================================
// Form Handling
// ================================
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }
    
    input.value = value;
}

// Phone input formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        formatPhone(e.target);
    });
}

// Set minimum date for date input
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.specialty || !data.date || !data.time) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.classList.add('loading');
        
        setTimeout(() => {
            contactForm.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Agendamento Solicitado!</h3>
                    <p>Recebemos sua solicitação. Entraremos em contato em breve para confirmar seu agendamento.</p>
                </div>
            `;
            showNotification('Agendamento enviado com sucesso!', 'success');
        }, 1500);
    });
}

// Newsletter form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        const submitBtn = newsletterForm.querySelector('button');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            newsletterForm.innerHTML = `
                <div class="form-success" style="padding: 20px;">
                    <i class="fas fa-check-circle" style="font-size: 32px; margin-bottom: 12px;"></i>
                    <p style="font-size: 14px;">Inscrito com sucesso!</p>
                </div>
            `;
            showNotification('Inscrição realizada com sucesso!', 'success');
        }, 1000);
    });
}

// ================================
// Notification System
// ================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#198754' : type === 'error' ? '#dc3545' : '#0dcaf0'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        max-width: 400px;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ================================
// Scroll Animations
// ================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .doctor-card, .contact-card, .feature');
    
    elements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

initScrollAnimations();

// ================================
// Smooth Scroll for Anchor Links
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#' || targetId === '') {
            return;
        }
        
        e.preventDefault();
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================
// Preload Critical Resources
// ================================
function preloadResources() {
    const links = document.querySelectorAll('link[rel="preload"]');
    links.forEach(link => {
        if (link.href) {
            const img = new Image();
            img.src = link.href;
        }
    });
}

preloadResources();

// ================================
// Keyboard Navigation Support
// ================================
document.addEventListener('keydown', (e) => {
    // Close mobile nav on Escape
    if (e.key === 'Escape') {
        closeNav();
    }
    
    // Testimonials slider keyboard navigation
    if (document.activeElement.closest('.testimonials-slider')) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
});

// ================================
// Performance Optimization
// ================================
// Throttle scroll events
let ticking = false;

function throttleScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            updateActiveLink();
            ticking = false;
        });
        ticking = true;
    }
}

window.removeEventListener('scroll', handleScroll);
window.removeEventListener('scroll', updateActiveLink);
window.addEventListener('scroll', throttleScroll, { passive: true });

// ================================
// Initialize
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup
    handleScroll();
    updateActiveLink();
    updateSlider();
    
    // Log for debugging
    console.log('Clínica Saúde Premium - Website initialized successfully');
});
