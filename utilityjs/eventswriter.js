const texts = {
  wedding: "Your wedding day is one of the most important days of your life, and the food should reflect that. Our wedding packages are fully customizable, ranging from elegant buffets to multi-course plated dinners. We work with you to create a menu that tells your unique love story and leaves a lasting impression on your guests.",
  corporate: "Impress your clients and motivate your team with our professional corporate catering services. We provide delicious and timely meals for business meetings, conferences, training seminars, and office parties. Our menus are designed to be both satisfying and easy to enjoy, allowing attendees to stay focused and productive.",
  social: "From birthday parties and anniversary celebrations to graduation ceremonies and bridal showers, we handle all the details so you can focus on celebrating with your loved ones. Our flexible menus can be tailored to fit any theme or dietary requirement, ensuring every guest feels catered to.",
  private: "Looking for something more intimate? We also offer catering for small, private events at your home or a chosen venue. Enjoy the luxury of restaurant-quality food in the comfort of your own space without the hassle of cooking and cleaning."
};

function typeText(element, text) {
  let i = 0;
  element.innerHTML = "";
  
  function type() {
    if (i < text.length) {
      element.innerHTML = text.slice(0, i + 1);
      i++;
      
      // Simple consistent timing - no random delays
      const speed = 45; // Fast and smooth
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const section = entry.target;
      const key = [...section.classList].find(cls => 
        ["wedding", "corporate", "social", "private"].includes(cls)
      );
      const p = section.querySelector("p");
      if (key && p && !p.dataset.typed) {
        typeText(p, texts[key]);
        p.dataset.typed = "true";
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".wedding-section").forEach(sec => observer.observe(sec));