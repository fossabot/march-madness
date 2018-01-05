require('./assets/styles/main.scss');

const logo = require('./assets/images/domo.png');

const images = document.querySelectorAll('.logo');
images.forEach(img => img.setAttribute('src', logo));
