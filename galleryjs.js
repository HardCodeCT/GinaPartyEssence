// Gallery lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryImages = document.querySelectorAll('.photo-grid img');
  
  let currentImageIndex = 0;
  const images = Array.from(galleryImages);
  
  // Open lightbox when image is clicked
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentImageIndex = index;
      updateLightboxImage();
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });
  
  // Close lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
  });
  
  // Navigate to previous image
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  });
  
  // Navigate to next image
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
  });
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
      } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
      }
    }
  });
  
  // Update lightbox image
  function updateLightboxImage() {
    const imgSrc = images[currentImageIndex].src;
    const imgAlt = images[currentImageIndex].alt;
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
  }
});