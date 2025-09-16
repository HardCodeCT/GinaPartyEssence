// Complete checkout.js with integrated booking processing - Fixed for BookingBridge with localStorage

class ShoppingCart {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.checkEmptyCart(); // Initialize empty cart state
    }

    attachEventListeners() {
        const cartTbody = document.getElementById('cart-tbody');
        
        // Event delegation for quantity buttons and remove buttons
        cartTbody.addEventListener('click', (e) => {
            if (e.target.classList.contains('qty-btn')) {
                this.handleQuantityChange(e.target);
            } else if (e.target.classList.contains('remove')) {
                this.handleRemoveItem(e.target);
            }
        });

        // Update cart button
        document.getElementById('update-cart').addEventListener('click', () => {
            this.updateCart();
        });
    }

    handleQuantityChange(button) {
        const row = button.closest('tr');
        const qtyDisplay = row.querySelector('.qty-display');
        const action = button.getAttribute('data-action');
        let currentQty = parseInt(qtyDisplay.textContent);

        if (action === 'increase') {
            currentQty++;
        } else if (action === 'decrease' && currentQty > 1) {
            currentQty--;
        }

        qtyDisplay.textContent = currentQty;
        this.updateRowTotal(row);
        this.updateTotals();
    }

    handleRemoveItem(removeButton) {
        const row = removeButton.closest('tr');
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            row.remove();
            this.updateTotals();
            this.checkEmptyCart();
        }
    }

    updateRowTotal(row) {
        const price = parseFloat(row.getAttribute('data-price'));
        const quantity = parseInt(row.querySelector('.qty-display').textContent);
        const total = price * quantity;
        
        const totalCell = row.querySelector('.item-total');
        const removeSpan = totalCell.querySelector('.remove');
        totalCell.innerHTML = `₦${total.toLocaleString()}.00 `;
        totalCell.appendChild(removeSpan);
    }

    updateTotals() {
        const rows = document.querySelectorAll('#cart-tbody tr[data-product-id]');
        let subtotal = 0;

        rows.forEach(row => {
            const price = parseFloat(row.getAttribute('data-price'));
            const quantity = parseInt(row.querySelector('.qty-display').textContent);
            subtotal += price * quantity;
        });

        document.getElementById('subtotal-amount').textContent = `₦${subtotal.toLocaleString()}.00`;
        document.getElementById('total-amount').textContent = `₦${subtotal.toLocaleString()}.00`;
    }

    updateCart() {
        // This method can be used to sync with server or perform additional updates
        this.updateTotals();
        showNotification('Cart updated successfully!');
    }

    checkEmptyCart() {
        const tbody = document.getElementById('cart-tbody');
        const productRows = tbody.querySelectorAll('tr[data-product-id]');
        
        if (productRows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-cart">
                        Your cart is empty. <a href="booking.html" style="color: #0073e6;">Continue shopping</a>
                    </td>
                </tr>
            `;
            
            // Hide cart actions and totals when cart is empty
            const cartActions = document.querySelector('.cart-actions');
            const cartTotals = document.querySelector('.cart-totals');
            const checkoutBtn = document.querySelector('.btn-red');
            
            if (cartActions) cartActions.style.display = 'none';
            if (cartTotals) cartTotals.style.display = 'none';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
        } else {
            // Show cart elements when cart has items
            const cartActions = document.querySelector('.cart-actions');
            const cartTotals = document.querySelector('.cart-totals');
            const checkoutBtn = document.querySelector('.btn-red');
            
            if (cartActions) cartActions.style.display = 'flex';
            if (cartTotals) cartTotals.style.display = 'block';
            if (checkoutBtn) checkoutBtn.style.display = 'block';
        }
    }

    // Method to add new items to cart - FIXED to handle BookingBridge data correctly
    addItem(productId, name, price, imageUrl, quantity = 1) {
        console.log('Cart addItem called with:', { productId, name, price, imageUrl, quantity });
        
        const tbody = document.getElementById('cart-tbody');
        
        // Remove empty cart message if it exists
        const emptyMessage = tbody.querySelector('.empty-cart');
        if (emptyMessage) {
            emptyMessage.parentElement.remove();
        }
        
        // Convert price to number if it's a string with $ symbol
        let numericPrice = price;
        if (typeof price === 'string') {
            numericPrice = parseFloat(price.replace(/[$₦,]/g, ''));
        }
        
        // Ensure we have a valid price
        if (isNaN(numericPrice) || numericPrice <= 0) {
            console.warn('Invalid price for item:', name, price);
            numericPrice = 0;
        }
        
        // Check if item already exists
        const existingRow = tbody.querySelector(`tr[data-product-id="${productId}"]`);
        if (existingRow) {
            const qtyDisplay = existingRow.querySelector('.qty-display');
            const newQty = parseInt(qtyDisplay.textContent) + quantity;
            qtyDisplay.textContent = newQty;
            this.updateRowTotal(existingRow);
            console.log('Updated existing item quantity to:', newQty);
        } else {
            // Create new row
            const newRow = document.createElement('tr');
            newRow.setAttribute('data-product-id', productId);
            newRow.setAttribute('data-price', numericPrice);
            
            newRow.innerHTML = `
                <td class="product-info">
                    <img src="${imageUrl}" alt="Product" style="width: 60px; height: 60px; object-fit: cover;">
                    <a href="#" style="text-decoration: none; color: white;">${name}</a>
                </td>
                <td class="flash">₦${numericPrice.toLocaleString()}.00</td>
                <td>
                    <div class="quantity">
                        <button class="qty-btn" data-action="decrease" style="padding: 5px 10px; margin: 0 2px;">-</button>
                        <span class="qty-display" style="padding: 0 10px;">${quantity}</span>
                        <button class="qty-btn" data-action="increase" style="padding: 5px 10px; margin: 0 2px;">+</button>
                    </div>
                </td>
                <td class="item-total">₦${(numericPrice * quantity).toLocaleString()}.00 <span class="remove" style="cursor: pointer; color: red; margin-left: 10px; font-weight: bold;">×</span></td>
            `;
            
            tbody.appendChild(newRow);
            console.log('Added new item to cart:', name);
        }
        
        this.checkEmptyCart(); // This will show the cart elements
        this.updateTotals();
        
        return true; // Return success indicator
    }

    // Method to get cart data
    getCartData() {
        const rows = document.querySelectorAll('#cart-tbody tr[data-product-id]');
        const cartData = [];
        
        rows.forEach(row => {
            cartData.push({
                productId: row.getAttribute('data-product-id'),
                quantity: parseInt(row.querySelector('.qty-display').textContent),
                price: parseFloat(row.getAttribute('data-price'))
            });
        });
        
        return cartData;
    }

    // Method to clear entire cart
    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            const tbody = document.getElementById('cart-tbody');
            tbody.innerHTML = '';
            this.checkEmptyCart();
            this.updateTotals();
        }
    }
}

// Demo functions for testing
function addSampleProduct1() {
    if (window.cart) {
        window.cart.addItem('1', "Doctor's Best Fully Active Methylcobalamin B12, 1,500 Mcg, 60 Veggie Caps", 25000, 'https://i.postimg.cc/4N7N6rL2/vitamin.png');
    }
}

function addSampleProduct2() {
    if (window.cart) {
        window.cart.addItem('2', 'Optimum Nutrition Gold Standard Whey Protein Powder', 35000, 'https://via.placeholder.com/60x60/0073e6/ffffff?text=Protein');
    }
}

function addSampleProduct3() {
    if (window.cart) {
        window.cart.addItem('3', 'Nordic Naturals Ultimate Omega Fish Oil', 15000, 'https://via.placeholder.com/60x60/28a745/ffffff?text=Fish+Oil');
    }
}

// FIXED: Function to process pending bookings from booking page - aligned with localStorage
function processBookedItems() {
    console.log('=== processBookedItems called ===');
    
    // Check if BookingBridge is available
    if (!window.BookingBridge) {
        console.log('BookingBridge not available, checking again in 500ms...');
        setTimeout(processBookedItems, 500);
        return;
    }
    
    console.log('BookingBridge available, checking for pending bookings...');
    
    // Initialize BookingBridge first to load data from localStorage
    try {
        window.BookingBridge.init();
    } catch (error) {
        console.error('Error initializing BookingBridge:', error);
    }
    
    // Debug current state
    const debugState = window.BookingBridge.debugState();
    
    if (window.BookingBridge.hasPendingBookings()) {
        console.log('Found pending bookings to process');
        
        // Get pending bookings directly
        const pendingItems = window.BookingBridge.getPendingBookings();
        console.log('Pending items to process:', pendingItems);
        
        if (pendingItems.length > 0 && window.cart) {
            let processedCount = 0;
            let processedItems = [];
            
            pendingItems.forEach((booking, index) => {
                try {
                    // Convert price properly - handle both $ and ₦ symbols
                    let price = booking.price;
                    if (typeof price === 'string') {
                        price = parseFloat(price.replace(/[$₦,]/g, '')) || 0;
                    }
                    
                    console.log(`Processing booking ${index + 1}:`, booking.name, 'Price:', price);
                    
                    // Add item to cart
                    const success = window.cart.addItem(
                        booking.productId,
                        booking.name,
                        price,
                        booking.image || 'https://testing-e9428.web.app/images/localdish.jpg', // fallback image
                        booking.quantity || 1
                    );
                    
                    if (success) {
                        processedCount++;
                        processedItems.push(`${booking.name} (x${booking.quantity})`);
                        console.log('Successfully added to cart:', booking.name);
                    }
                } catch (error) {
                    console.error('Error adding item to cart:', error, booking);
                }
            });
            
            if (processedCount > 0) {
                // Mark bookings as processed in BookingBridge
                try {
                    console.log('Marking bookings as processed...');
                    window.BookingBridge.processBookings(window.cart);
                    
                    const successMessage = `Successfully processed ${processedCount} booked items: ${processedItems.join(', ')}`;
                    console.log(successMessage);
                    
                    // Show notification
                    showNotification(`${processedCount} items added to your cart from booking`);
                    
                    // Log final state
                    console.log('Final BookingBridge state:', window.BookingBridge.debugState());
                } catch (error) {
                    console.error('Error marking as processed:', error);
                }
            } else {
                console.warn('No items were successfully processed');
            }
        } else {
            console.log('No valid cart or pending items found');
        }
    } else {
        console.log('No pending bookings found or already processed');
        
        // Debug why no bookings were found
        const items = window.BookingBridge.getPendingBookings();
        console.log('Available items:', items);
        console.log('Items length:', items.length);
        
        if (items.length > 0) {
            console.log('Items exist but hasPendingBookings returned false - might be marked as processed');
            console.log('Try running: window.BookingBridge.resetProcessedFlag() and then debugProcessBookings()');
        }
    }
    
    console.log('=== processBookedItems completed ===');
}

// Enhanced notification function - no alerts, better UX
function showNotification(message, type = 'success') {
    console.log('Notification:', message);
    
    // Try to find existing notification area
    let notificationArea = document.querySelector('.notification-area, [data-notification]');
    
    if (!notificationArea) {
        // Create notification area if it doesn't exist
        notificationArea = document.createElement('div');
        notificationArea.className = 'notification-area';
        notificationArea.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notificationArea);
    }
    
    notificationArea.textContent = message;
    notificationArea.style.display = 'block';
    
    // Animate in
    setTimeout(() => {
        notificationArea.style.opacity = '1';
        notificationArea.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        notificationArea.style.opacity = '0';
        notificationArea.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notificationArea.parentNode) {
                notificationArea.parentNode.removeChild(notificationArea);
            }
        }, 300);
    }, 4000);
}

// Function to manually trigger booking processing (for debugging)
function debugProcessBookings() {
    console.log('=== DEBUG: Manual booking processing ===');
    console.log('BookingBridge available:', !!window.BookingBridge);
    console.log('Cart available:', !!window.cart);
    
    if (window.BookingBridge) {
        const debugState = window.BookingBridge.debugState();
        console.log('Current state:', debugState);
        console.log('Pending bookings:', window.BookingBridge.getPendingBookings());
        console.log('Has pending:', window.BookingBridge.hasPendingBookings());
        console.log('Summary:', window.BookingBridge.getBookingSummary());
    }
    
    if (window.cart) {
        console.log('Current cart data:', window.cart.getCartData());
    }
    
    console.log('Attempting to process bookings...');
    processBookedItems();
}

// Function to reset booking processed flag (for debugging)
function resetAndProcess() {
    if (window.BookingBridge) {
        console.log('Resetting processed flag...');
        window.BookingBridge.resetProcessedFlag();
        setTimeout(() => {
            processBookedItems();
        }, 100);
    } else {
        console.log('BookingBridge not available');
    }
}

// Enhanced initialization with better timing and debugging
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Checkout page DOMContentLoaded ===');
    
    // Initialize cart first
    try {
        window.cart = new ShoppingCart();
        console.log('Cart initialized successfully:', !!window.cart);
    } catch (error) {
        console.error('Error initializing cart:', error);
    }
    
    // Wait for scripts to load, then process bookings with multiple attempts
    let attempts = 0;
    const maxAttempts = 5;
    
    function attemptProcessBookings() {
        attempts++;
        console.log(`Processing attempt ${attempts}/${maxAttempts}`);
        
        if (window.BookingBridge) {
            console.log('BookingBridge found, processing bookings...');
            processBookedItems();
        } else if (attempts < maxAttempts) {
            console.log(`BookingBridge not ready, retrying in ${attempts * 200}ms...`);
            setTimeout(attemptProcessBookings, attempts * 200);
        } else {
            console.log('Max attempts reached. BookingBridge may not be loaded.');
        }
    }
    
    // Start processing attempts after a short delay
    setTimeout(attemptProcessBookings, 100);
    
    // Make debug functions available globally
    window.debugProcessBookings = debugProcessBookings;
    window.resetAndProcess = resetAndProcess;
    window.addSampleProduct1 = addSampleProduct1;
    window.addSampleProduct2 = addSampleProduct2;
    window.addSampleProduct3 = addSampleProduct3;
    
    console.log('Available debug functions:');
    console.log('- debugProcessBookings() - Debug booking processing');
    console.log('- resetAndProcess() - Reset and reprocess bookings');
    console.log('- addSampleProduct1/2/3() - Add test products');
});

// Backup processing on window load
window.addEventListener('load', function() {
    console.log('=== Window loaded - backup booking processing ===');
    setTimeout(() => {
        if (window.BookingBridge && window.cart) {
            console.log('Backup processing attempt...');
            processBookedItems();
        }
    }, 200);
});

// Handle page visibility changes - reprocess if page becomes visible and BookingBridge is available
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.BookingBridge && window.cart) {
        console.log('Page became visible, checking for new bookings...');
        setTimeout(processBookedItems, 300);
    }

});
