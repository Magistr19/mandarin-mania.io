'use strict';


// Play btn js
let playBtn = document.querySelector('.game__start-btn');
let overlay = document.querySelector('.overlay');
let registerModal = document.querySelector('.modal-register');
let closeModal = document.querySelector('.modal-register__close-btn');


playBtn.addEventListener('click', toggleModal);
overlay.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);

function toggleModal(evt) {
  evt.preventdefault;

  overlay.classList.toggle('overlay--show');
  registerModal.classList.toggle('modal-register--show');
}

// Mobile nav js
let navBtn = document.querySelector('.nav-btn');
let mainNav = document.querySelector('.main-nav');

navBtn.addEventListener('click', function(evt) {
  evt.preventDefault;

  navBtn.classList.toggle('nav-btn--opened');
  mainNav.classList.toggle('main-nav--show');
});
