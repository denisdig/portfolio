const navbar = document.querySelector('.header-nav');
const hamburger = document.querySelector('.hamburger');
const links = document.querySelector('.header-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) { 
    navbar.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  } else {
    navbar.style.backgroundColor = "transparent"; 
  }
});


hamburger.addEventListener('click', () => {
  links.classList.toggle('show');
});