const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const topbar = document.querySelector('.topbar');
const navbar = document.querySelector('.navbar');
let lastScrollPosition = 0;

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
  document.body.classList.toggle("menu-open");
});

// Scroll behavior for header
window.addEventListener('scroll', () => {
  if (document.body.classList.contains("menu-open")) return;
  
  const currentScrollPosition = window.scrollY;
  
  // At top of page
  if (currentScrollPosition < 10) {
    document.body.classList.add('at-top');
    document.body.classList.remove('scrolled-down', 'scrolled-up');
    return;
  } else {
    document.body.classList.remove('at-top');
  }

  // Scroll direction detection
  if (currentScrollPosition > lastScrollPosition) {
    // Scrolling down
    document.body.classList.add('scrolled-down');
    document.body.classList.remove('scrolled-up');
  } else {
    // Scrolling up
    document.body.classList.add('scrolled-up');
    document.body.classList.remove('scrolled-down');
  }
  
  lastScrollPosition = currentScrollPosition;
});