'use strict';

// Mobile nav js
let navBtn = document.querySelector('.page-header__nav-btn');
let mainNav = document.querySelector('.main-nav');

navBtn.addEventListener('click', toggleNav);
mainNav.addEventListener('click', toggleNav);

function toggleNav(evt) {
    navBtn.classList.toggle('page-header__nav-btn--opened');
    mainNav.classList.toggle('main-nav--show');
}

// Game field on start js
let playBtn = document.querySelector('.game__start-btn');
let overlay = document.querySelector('.overlay');
let registerModal = document.querySelector('.modal-register');
let closeModal = document.querySelector('.modal-register__close-btn');

let registerForm = document.querySelector('.modal-register__form');
let registerSendBtn = document.querySelector('.modal-register__send-btn');

let gameField = document.querySelector('.game__field');
let gameStrtBtn = document.querySelector('.game__start-btn');
let gameOptions = document.querySelector('.game__options');

if (localStorage.getItem('nickName') && localStorage.getItem('userId')) { //Local storage check
  gameField.classList.add('game__field--gaming');
  gameStrtBtn.classList.add('custom-btn--hide');
  gameOptions.classList.add('game-options--show');
} else {
  playBtn.addEventListener('click', toggleModal);
  overlay.addEventListener('click', toggleModal);
  closeModal.addEventListener('click', toggleModal);

  function toggleModal(evt) {
    evt.preventDefault();

    overlay.classList.toggle('overlay--show');
    registerModal.classList.toggle('modal-register--show');
  }

  registerForm.addEventListener('submit', evt => {
    evt.preventDefault();
  });

  registerSendBtn.addEventListener('submit', evt => {
    evt.preventDefault();
  });
}
