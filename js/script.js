// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initFormValidation();
    initInteractiveElements();
});

// Navigation Toggle Functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling for Internal Links
function initSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Este campo es obligatorio.';
        isValid = false;
    }
    // Email validation
    else if (fieldType === 'email' && value && !isValidEmail(value)) {
        errorMessage = 'Por favor, ingrese un email válido.';
        isValid = false;
    }
    // URL validation
    else if (fieldType === 'url' && value && !isValidURL(value)) {
        errorMessage = 'Por favor, ingrese una URL válida.';
        isValid = false;
    }
    // Minimum length validation
    else if (field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        if (value.length < minLength) {
            errorMessage = `Este campo debe tener al menos ${minLength} caracteres.`;
            isValid = false;
        }
    }

    if (!isValid) {
        showError(field, errorMessage);
    }

    return isValid;
}

// Show error message
function showError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// Clear error message
function clearError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// URL validation helper
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Interactive Elements
function initInteractiveElements() {
    // Button click animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
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
    });

    // Card hover effects
    const cards = document.querySelectorAll('.session-card, .about-card, .content-card, .gallery-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Progress tracking (if on session pages)
    trackProgress();
}

// Progress Tracking
function trackProgress() {
    const currentPage = window.location.pathname.split('/').pop();
    const sessionPages = ['sesion1.html', 'sesion2.html', 'sesion3.html', 'sesion4.html'];
    
    if (sessionPages.includes(currentPage)) {
        // Mark current session as visited
        const visitedSessions = JSON.parse(localStorage.getItem('visitedSessions') || '[]');
        if (!visitedSessions.includes(currentPage)) {
            visitedSessions.push(currentPage);
            localStorage.setItem('visitedSessions', JSON.stringify(visitedSessions));
        }
        
        // Update progress indicator if it exists
        updateProgressIndicator(visitedSessions);
    }
}

// Update Progress Indicator
function updateProgressIndicator(visitedSessions) {
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
        const totalSessions = 4;
        const completedSessions = visitedSessions.length;
        const progressPercentage = (completedSessions / totalSessions) * 100;
        
        const progressBar = progressIndicator.querySelector('.progress-bar');
        const progressText = progressIndicator.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = progressPercentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `Progreso: ${completedSessions}/${totalSessions} sesiones completadas`;
        }
    }
}

// Download tracking
function trackDownload(fileName) {
    console.log(`Descarga iniciada: ${fileName}`);
    // Here you could send analytics data to track resource downloads
}

// External link tracking
function trackExternalLink(url) {
    console.log(`Enlace externo visitado: ${url}`);
    // Here you could send analytics data to track external link clicks
}

// Add download tracking to download links
document.addEventListener('click', function(e) {
    const target = e.target;
    
    // Track downloads
    if (target.matches('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]')) {
        const fileName = target.href.split('/').pop();
        trackDownload(fileName);
    }
    
    // Track external links
    if (target.matches('a[href^="http"]:not([href*="' + window.location.hostname + '"])')) {
        trackExternalLink(target.href);
    }
});

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27AE60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Form submission handler
function handleFormSubmission(form, successMessage = 'Formulario enviado correctamente') {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Here you would typically send the data to a server
    console.log('Form data:', data);
    
    // Show success message
    showNotification(successMessage, 'success');
    
    // Reset form
    form.reset();
    
    // Clear any error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Accessibility improvements
function improveAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Saltar al contenido principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10001;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

function safeQuerySelectorAll(selector) {
    try {
        return document.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Elements not found: ${selector}`);
        return [];
    }
}

// Export functions for potential use in other scripts
window.ScratchEducativo = {
    showNotification,
    handleFormSubmission,
    trackDownload,
    trackExternalLink,
    validateForm,
    validateField
};
