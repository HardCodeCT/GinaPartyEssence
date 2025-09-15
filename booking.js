// Sample data for different dish categories
const dishData = {
    local: [
        { name: "Jollof Rice", location: "Nigerian Cuisine", price: "$15", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Egusi Soup", location: "West African", price: "$18", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Suya", location: "Street Food", price: "$12", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Pounded Yam", location: "Traditional", price: "$20", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Akara", location: "Breakfast", price: "$8", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Moi Moi", location: "Steamed Beans", price: "$10", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Pepper Soup", location: "Spicy Broth", price: "$16", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Ofada Rice", location: "Local Rice", price: "$22", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Boli & Groundnut", location: "Roasted Plantain", price: "$7", image: "https://testing-e9428.web.app/images/localdish.jpg" }
    ],
    corporate: [
        { name: "Grilled Chicken", location: "Premium Cut", price: "$25", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Beef Wellington", location: "Executive", price: "$45", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Salmon Teriyaki", location: "Asian Fusion", price: "$35", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Caesar Salad", location: "Fresh Garden", price: "$18", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Lobster Bisque", location: "Seafood Special", price: "$28", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Wagyu Steak", location: "Premium Beef", price: "$65", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Truffle Pasta", location: "Italian Classic", price: "$32", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Duck Confit", location: "French Cuisine", price: "$38", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Tuna Tartare", location: "Raw Delicacy", price: "$24", image: "https://testing-e9428.web.app/images/localdish.jpg" }
    ],
    intercontinental: [
        { name: "Pad Thai", location: "Thai Cuisine", price: "$16", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Sushi Platter", location: "Japanese", price: "$42", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Paella Valenciana", location: "Spanish", price: "$36", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Butter Chicken", location: "Indian Curry", price: "$19", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Ramen Bowl", location: "Japanese Noodles", price: "$14", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Fish & Chips", location: "British Classic", price: "$17", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Tacos Al Pastor", location: "Mexican Street", price: "$13", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Coq au Vin", location: "French Bistro", price: "$29", image: "https://testing-e9428.web.app/images/localdish.jpg" },
        { name: "Peking Duck", location: "Chinese Roast", price: "$33", image: "https://testing-e9428.web.app/images/localdish.jpg" }
    ]
};

const featuredDishes = [
    { name: "Chef's Special", location: "Signature Dish", price: "$55", image: "https://testing-e9428.web.app/images/localdish.jpg" },
    { name: "Today's Catch", location: "Fresh Seafood", price: "$40", image: "https://testing-e9428.web.app/images/localdish.jpg" },
    { name: "Fusion Delight", location: "Creative Cuisine", price: "$30", image: "https://testing-e9428.web.app/images/localdish.jpg" },
    { name: "Comfort Classic", location: "Home Style", price: "$22", image: "https://testing-e9428.web.app/images/localdish.jpg" }
];

function createDishCard(dish) {
    return `
        <div class="card-wrapper">
            <div class="card">
                <div class="card-image-wrapper">
                    <img src="${dish.image}" alt="${dish.name}">
                </div>
                <div class="card-info">
                    <div class="card-text big" style="color:white;">${dish.name}</div>
                    <div class="card-text small">Starts from: <span class="card-price">${dish.price}</span></div>
                </div>
                <button class="boook-btn" data-name="${dish.name}" data-price="${dish.price}">Book</button>
            </div>
        </div>
    `;
}


function createSwiper(categoryName, dishes) {
    const slides = [];
    // Create 3 slides with 3 dishes each
    for (let i = 0; i < 3; i++) {
        const slideStart = i * 3;
        const slideEnd = slideStart + 3;
        const slideDishes = dishes.slice(slideStart, slideEnd);
        slides.push(`
            <div class="swiper-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
                ${slideDishes.map(dish => createDishCard(dish)).join('')}
            </div>
        `);
    }
    return `
        <div class="dish-category">
            <h2 class="category-header">${categoryName}</h2>
            <div class="swiper-container" data-category="${categoryName.toLowerCase().replace(' ', '')}">
                <div class="swiper-wrapper">
                    ${slides.join('')}
                </div>
                <div class="swiper-pagination">
                    <div class="swiper-pagination-bullet active" data-slide="0"></div>
                    <div class="swiper-pagination-bullet" data-slide="1"></div>
                    <div class="swiper-pagination-bullet" data-slide="2"></div>
                </div>
            </div>
        </div>
    `;
}

function initializeSwiper(container) {
    const slides = container.querySelectorAll('.swiper-slide');
    const bullets = container.querySelectorAll('.swiper-pagination-bullet');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        if (index === currentSlide) return;

        const outgoingSlide = slides[currentSlide];
        const incomingSlide = slides[index];

        // Bring incoming to front
        incomingSlide.style.zIndex = 10;

        // Start fading in incoming
        incomingSlide.classList.add('active');

        // Start fading out outgoing
        outgoingSlide.classList.remove('active');

        // Update bullets
        bullets[currentSlide].classList.remove('active');
        bullets[index].classList.add('active');

        // After transition, reset z-index
        setTimeout(() => {
            incomingSlide.style.zIndex = '';
        }, 1000); // match transition time

        currentSlide = index;
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % 3;
            showSlide(nextSlide);
        }, 8000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Manual navigation
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', () => {
            if (index !== currentSlide) {
                stopAutoSlide();
                showSlide(index);
                // Restart auto-slide after manual interaction
                setTimeout(startAutoSlide, 6000);
            }
        });
    });

    // Pause auto-slide on hover
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    // Start auto-slide
    startAutoSlide();
}

function populateMainContent() {
    const mainLeft = document.querySelector('.app-main-left');
    mainLeft.innerHTML = `
        ${createSwiper('Local Dishes', dishData.local)}
        ${createSwiper('Corporate Dishes', dishData.corporate)}
        ${createSwiper('Intercontinental Dishes', dishData.intercontinental)}
    `;
    // Initialize swipers
    document.querySelectorAll('.swiper-container').forEach(initializeSwiper);
}

function populateFeaturedDishes() {
    const featuredContainer = document.getElementById('featured-dishes');
    featuredContainer.innerHTML = featuredDishes.map(dish => `
        <div class="card-wrapper">
            <a class="card" onclick="openModal('${dish.name}')">
                <div class="card-image-wrapper">
                    <img src="${dish.image}" alt="${dish.name}">
                </div>
                <div class="card-info">
                    <div class="card-text big">${dish.name}</div>
                    <div class="card-text small">${dish.location}</div>
                    <div class="card-text small"> Starts from: <span class="card-price">${dish.price}</span> </div>
                </div>
            </a>
        </div>
    `).join('');
}

function openModal(dishName) {
    alert(`Opening details for: ${dishName}`);
    // Here you would typically open a modal or navigate to a detail page
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    populateMainContent();
    populateFeaturedDishes();
});