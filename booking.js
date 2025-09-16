// booking-static.js - Interactions Only

class SwiperController {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.swiper-slide');
        this.bullets = container.querySelectorAll('.swiper-pagination-bullet');
        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoSlideTimer = null;
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.startAutoSlide();
        console.log(`Swiper initialized with ${this.slides.length} slides`);
    }
    
    startAutoSlide() {
        this.autoSlideTimer = setInterval(() => {
            const nextSlide = (this.currentSlide + 1) % this.slides.length;
            this.showSlide(nextSlide);
        }, 10000);
    }
    
    resetAutoSlide() {
        clearInterval(this.autoSlideTimer);
        this.startAutoSlide();
    }
    
    attachEventListeners() {
        // Pagination bullets
        this.bullets.forEach((bullet, index) => {
            bullet.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showSlide(index);
                this.resetAutoSlide(); // Reset timer on manual interaction
            });
            
            // Hover effects
            bullet.addEventListener('mouseenter', () => {
                if (!bullet.classList.contains('active')) {
                    bullet.classList.add('hover');
                }
            });
            
            bullet.addEventListener('mouseleave', () => {
                bullet.classList.remove('hover');
            });
        });
        
        // Touch/swipe support
        this.addSwipeSupport();
    }
    
    showSlide(index) {
        if (index === this.currentSlide || this.isTransitioning || index < 0 || index >= this.slides.length) {
            return;
        }
        
        this.isTransitioning = true;
        
        // Remove active states
        this.slides[this.currentSlide].classList.remove('active');
        this.bullets[this.currentSlide].classList.remove('active');
        
        // Add active states
        this.slides[index].classList.add('active');
        this.bullets[index].classList.add('active');
        
        this.currentSlide = index;
        
        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }
    
    addSwipeSupport() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            // If vertical movement is greater, it's a scroll
            if (Math.abs(currentY - startY) > Math.abs(currentX - startX)) {
                isDragging = false;
                return;
            }
            
            // Prevent default horizontal scrolling
            e.preventDefault();
        }, { passive: false });
        
        this.container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const minSwipeDistance = 50;
            
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    const nextSlide = (this.currentSlide + 1) % this.slides.length;
                    this.showSlide(nextSlide);
                } else {
                    // Swipe right - previous slide
                    const prevSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
                    this.showSlide(prevSlide);
                }
                this.resetAutoSlide(); // Reset timer on swipe
            }
            
            isDragging = false;
        }, { passive: true });
    }
}

class BookingManager {
    constructor() {
        this.setupGlobalBookingHandler();
        this.initializeProceedToCheckout();
    }
    
    setupGlobalBookingHandler() {
        console.log('Setting up global booking handler...');
        
        document.addEventListener('click', (e) => {
            const bookButton = e.target.closest('.boook-btn');
            if (!bookButton) return;
            
            // Prevent multiple clicks
            if (bookButton.disabled || bookButton.dataset.processing === 'true') {
                return;
            }
            
            bookButton.dataset.processing = 'true';
            bookButton.disabled = true;
            
            const dishData = {
                name: bookButton.getAttribute('data-name'),
                price: bookButton.getAttribute('data-price'),
                location: bookButton.getAttribute('data-location'),
                image: bookButton.getAttribute('data-image'),
                quantity: 1
            };
            
            this.processBooking(bookButton, dishData);
        });
    }
    
    processBooking(bookButton, dishData) {
        console.log('Processing booking for:', dishData);
        
        // Visual feedback
        const originalText = bookButton.innerHTML;
        const originalBg = bookButton.style.backgroundColor;
        
        // Add processing state via CSS class
        bookButton.classList.add('booking-processing');
        bookButton.innerHTML = '<span>Adding...</span>';
        
        // Add to booking system
        if (window.BookingBridge) {
            try {
                const result = window.BookingBridge.addBooking(dishData);
                console.log('Successfully added to BookingBridge:', result);
                
                // Success feedback
                bookButton.classList.remove('booking-processing');
                bookButton.classList.add('booking-success');
                bookButton.innerHTML = '<span>Added!</span>';
                
                // Reset after feedback
                setTimeout(() => {
                    bookButton.innerHTML = originalText;
                    bookButton.classList.remove('booking-success');
                    this.resetButton(bookButton);
                }, 1500);
                
            } catch (error) {
                console.error('Error adding to BookingBridge:', error);
                
                // Error feedback
                bookButton.classList.remove('booking-processing');
                bookButton.classList.add('booking-error');
                bookButton.innerHTML = '<span>Error!</span>';
                
                setTimeout(() => {
                    bookButton.innerHTML = originalText;
                    bookButton.classList.remove('booking-error');
                    this.resetButton(bookButton);
                }, 2000);
            }
        } else {
            console.warn('BookingBridge not available');
            alert('Booking system not ready. Please refresh the page.');
            
            bookButton.innerHTML = originalText;
            bookButton.classList.remove('booking-processing');
            this.resetButton(bookButton);
        }
    }
    
    resetButton(button) {
        button.dataset.processing = 'false';
        button.disabled = false;
    }
    
    initializeProceedToCheckout() {
        document.addEventListener('click', (e) => {
            const checkoutButton = e.target.closest('[data-proceed-checkout], .proceed-checkout-btn, .checkout-btn');
            if (!checkoutButton && !e.target.textContent.toLowerCase().includes('proceed to checkout')) {
                return;
            }
            
            const targetButton = checkoutButton || e.target;
            
            // Prevent multiple clicks
            if (targetButton.dataset.processing === 'true') return;
            targetButton.dataset.processing = 'true';
            
            console.log('Proceed to checkout clicked');
            
            try {
                if (window.BookingBridge && window.BookingBridge.hasPendingBookings()) {
                    targetButton.classList.add('loading');
                    setTimeout(() => {
                        window.location.href = 'checkout.html';
                    }, 200);
                } else {
                    console.log('No pending bookings or BookingBridge not available');
                    alert('No items in cart. Please add items before proceeding to checkout.');
                    targetButton.dataset.processing = 'false';
                }
            } catch (error) {
                console.error('Error proceeding to checkout:', error);
                targetButton.dataset.processing = 'false';
                targetButton.classList.remove('loading');
            }
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Prevent multiple initializations
    if (window.bookingStaticInitialized) {
        console.log('App already initialized, skipping...');
        return;
    }
    
    window.bookingStaticInitialized = true;
    console.log('Initializing static booking app...');
    
    try {
        // Initialize all swiper containers
        const swiperContainers = document.querySelectorAll('.swiper-container');
        console.log(`Found ${swiperContainers.length} swiper containers`);
        
        swiperContainers.forEach((container, index) => {
            console.log(`Initializing swiper ${index + 1}`);
            new SwiperController(container);
        });
        
        // Initialize booking manager
        new BookingManager();
        
        // Initialize BookingBridge if available
        if (window.BookingBridge && typeof window.BookingBridge.init === 'function') {
            console.log('BookingBridge found, initializing...');
            window.BookingBridge.init();
        } else {
            console.warn('BookingBridge not found. Make sure BookingBridge.js is loaded first.');
        }
        
        console.log('Static booking app initialization complete');
        
    } catch (error) {
        console.error('Error during app initialization:', error);
        window.bookingStaticInitialized = false;
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
});

// Debug helper
window.debugBookingStatic = function() {
    console.log('=== STATIC BOOKING DEBUG INFO ===');
    console.log('BookingBridge available:', !!window.BookingBridge);
    console.log('Book buttons found:', document.querySelectorAll('.book-btn').length);
    console.log('Swiper containers found:', document.querySelectorAll('.swiper-container').length);
    console.log('Pagination bullets found:', document.querySelectorAll('.swiper-pagination-bullet').length);
    console.log('Active slides:', document.querySelectorAll('.swiper-slide.active').length);
    console.log('===============================');
};