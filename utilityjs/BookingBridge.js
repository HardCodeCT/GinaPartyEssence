// BookingBridge.js - Fixed Data Transfer System with Better Persistence
// Include this script in both booking.html and checkout.html

window.BookingBridge = (function() {
    // Storage key for persistence - using localStorage instead of sessionStorage
    const STORAGE_KEY = 'pendingBookings';
    
    // Private storage for booking data
    let bookingStorage = {
        pendingItems: [],
        processed: false
    };
    
    // Load data from window storage or localStorage fallback
    function loadStorageData() {
        try {
            // First try to get from window storage (for same-session navigation)
            if (window.__bookingData && !window.__bookingData.processed) {
                bookingStorage = window.__bookingData;
                console.log('Loaded from window storage:', bookingStorage);
                return;
            }
            
            // Fallback to localStorage for better persistence (survives page refresh)
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (!parsed.processed) {
                    bookingStorage = parsed;
                    console.log('Loaded from localStorage:', bookingStorage);
                    return;
                }
            }
        } catch (error) {
            console.error('Error loading storage data:', error);
        }
        
        console.log('No valid stored data found, using empty storage');
    }
    
    // Save data to both window and localStorage
    function saveStorageData() {
        try {
            // Save to window for immediate access
            window.__bookingData = { ...bookingStorage };
            
            // Save to localStorage for page navigation persistence (survives refresh)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingStorage));
            
            console.log('Saved booking data:', bookingStorage);
        } catch (error) {
            console.error('Error saving storage data:', error);
        }
    }
    
    // Helper function to update cart count display
    function updateCartDisplay() {
        const cartCount = bookingStorage.pendingItems.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count elements
        const cartCountElements = document.querySelectorAll('.cart-count, [data-cart-count]');
        cartCountElements.forEach(el => el.textContent = cartCount);
        
        // Update proceed to checkout button
        const proceedBtn = document.querySelector('[data-proceed-checkout], .proceed-checkout-btn');
        if (proceedBtn) {
            if (cartCount > 0) {
                proceedBtn.style.display = 'block';
                proceedBtn.disabled = false;
            } else {
                proceedBtn.style.display = 'none';
                proceedBtn.disabled = true;
            }
        }
        
        console.log('Updated cart display, total items:', cartCount);
    }
    
    return {
        // Add item to booking queue (now stacks items)
        addBooking: function(dishData) {
            console.log('BookingBridge.addBooking called with:', dishData);
            
            const productId = dishData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            // Check if item already exists in pending items
            const existingIndex = bookingStorage.pendingItems.findIndex(item => item.productId === productId);
            
            if (existingIndex !== -1) {
                // Item exists, increase quantity
                bookingStorage.pendingItems[existingIndex].quantity += (dishData.quantity || 1);
                console.log('Updated existing item quantity:', bookingStorage.pendingItems[existingIndex]);
            } else {
                // New item, add to array
                const booking = {
                    id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    productId: productId,
                    name: dishData.name,
                    price: dishData.price, // Keep original price format
                    image: dishData.image,
                    location: dishData.location || '',
                    quantity: dishData.quantity || 1,
                    timestamp: Date.now()
                };
                
                bookingStorage.pendingItems.push(booking);
                console.log('Added new booking:', booking);
            }
            
            // Save to storage
            saveStorageData();
            
            // Update any UI elements that show cart count
            updateCartDisplay();
            
            const resultItem = bookingStorage.pendingItems[existingIndex] || bookingStorage.pendingItems[bookingStorage.pendingItems.length - 1];
            console.log('BookingBridge.addBooking result:', resultItem);
            return resultItem;
        },
        
        // Get all pending bookings
        getPendingBookings: function() {
            // Always load fresh data first
            loadStorageData();
            console.log('getPendingBookings returning:', bookingStorage.pendingItems);
            return bookingStorage.pendingItems;
        },
        
        // Process bookings with cart instance (called from checkout page)
        processBookings: function(cartInstance) {
            const pendingItems = this.getPendingBookings();
            let processedCount = 0;
            
            console.log('processBookings called with:', pendingItems.length, 'items');
            
            if (pendingItems.length > 0 && cartInstance && !bookingStorage.processed) {
                pendingItems.forEach(booking => {
                    try {
                        cartInstance.addItem(
                            booking.productId,
                            booking.name,
                            booking.price,
                            booking.image,
                            booking.quantity
                        );
                        processedCount++;
                        console.log('Processed booking:', booking.name);
                    } catch (error) {
                        console.error('Error processing booking:', error, booking);
                    }
                });
                
                // Mark as processed to prevent duplicate additions
                bookingStorage.processed = true;
                saveStorageData();
                
                console.log('Marked bookings as processed');
            } else {
                console.log('No items to process or already processed');
            }
            
            return processedCount;
        },
        
        // Remove specific item from pending bookings
        removeBooking: function(productId) {
            const index = bookingStorage.pendingItems.findIndex(item => item.productId === productId);
            if (index !== -1) {
                const removed = bookingStorage.pendingItems.splice(index, 1)[0];
                saveStorageData();
                updateCartDisplay();
                console.log('Removed booking:', removed);
                return true;
            }
            return false;
        },
        
        // Update quantity of specific item
        updateBookingQuantity: function(productId, newQuantity) {
            const item = bookingStorage.pendingItems.find(item => item.productId === productId);
            if (item) {
                if (newQuantity <= 0) {
                    this.removeBooking(productId);
                } else {
                    item.quantity = newQuantity;
                    saveStorageData();
                    updateCartDisplay();
                }
                console.log('Updated booking quantity:', productId, newQuantity);
                return true;
            }
            return false;
        },
        
        // Clear all bookings
        clearBookings: function() {
            bookingStorage = {
                pendingItems: [],
                processed: false
            };
            saveStorageData();
            updateCartDisplay();
            console.log('Cleared all bookings');
        },
        
        // Check if there are pending bookings
        hasPendingBookings: function() {
            loadStorageData(); // Always load fresh data
            const hasPending = bookingStorage.pendingItems.length > 0 && !bookingStorage.processed;
            console.log('hasPendingBookings:', hasPending, 'items:', bookingStorage.pendingItems.length, 'processed:', bookingStorage.processed);
            return hasPending;
        },
        
        // Get booking summary
        getBookingSummary: function() {
            const items = this.getPendingBookings();
            const summary = {
                count: items.length,
                totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
                items: items,
                totalValue: items.reduce((sum, item) => {
                    let price = item.price;
                    if (typeof price === 'string') {
                        price = parseFloat(price.replace(/[$₦,]/g, '')) || 0;
                    }
                    return sum + (price * item.quantity);
                }, 0)
            };
            console.log('Booking summary:', summary);
            return summary;
        },
        
        // Reset processed flag (for debugging)
        resetProcessedFlag: function() {
            loadStorageData();
            bookingStorage.processed = false;
            saveStorageData();
            console.log('Reset processed flag');
        },
        
        // Debug function to show current state
        debugState: function() {
            loadStorageData();
            console.log('=== BookingBridge Debug State ===');
            console.log('Storage:', bookingStorage);
            console.log('Window storage:', window.__bookingData);
            console.log('LocalStorage:', localStorage.getItem(STORAGE_KEY));
            console.log('Has pending:', this.hasPendingBookings());
            console.log('Summary:', this.getBookingSummary());
            console.log('===============================');
            return bookingStorage;
        },
        
        // Initialize - load existing data
        init: function() {
            console.log('BookingBridge.init() called');
            loadStorageData();
            updateCartDisplay();
            console.log('BookingBridge initialized with:', bookingStorage.pendingItems.length, 'items');
        }
    };
})();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.BookingBridge.init();
        });
    } else {
        window.BookingBridge.init();
    }
    
    // Make debug function available globally
    window.debugBookingBridge = function() {
        return window.BookingBridge.debugState();
    };
    
    console.log('BookingBridge loaded. Run debugBookingBridge() to see current state.');
}