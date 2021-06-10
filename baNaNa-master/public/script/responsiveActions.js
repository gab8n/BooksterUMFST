const burgerMenu = document.querySelector(".burger-menu");
const navBar = document.querySelector(".nav-bar");

burgerMenu.addEventListener('click', () => navBar.classList.toggle("hidden-nav"));