(function () {
  var nav = document.querySelector('nav');
  var navButton = document.querySelector('.nav__button');

  navButton.addEventListener('click', function () {
    if (nav.className.indexOf('nav--open') > -1) {
      nav.classList.remove('nav--open');
    } else {
      nav.classList.add('nav--open');
    }
  });
}());
