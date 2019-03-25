'use strict';

let url = 'http://127.0.0.1:8087';
let currentRecordsDiff = 'hard';

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
let levelBtns = document.querySelectorAll('.levels__btn');

// localStorage.setItem("nickName", "Igor");
// localStorage.setItem("userId", "1231231231234");
// localStorage.setItem("unlockedLvls", "3");

if (localStorage.getItem('nickName') && localStorage.getItem('userId') && localStorage.getItem('unlockedLvls')) { //Local storage check
	showGameField();
  openLevels();
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

  registerSendBtn.addEventListener('click', evt => {
    evt.preventDefault();

    let registerNick = document.querySelector("#loginNickname").value;

		if (registerNick.length < 5 || registerNick.length > 12) {
      alert('Ник от 5 до 12 символов ник должен быть');
      return;
    }

    let postNickUrl = `${url}/?nickName=${registerNick}`;
    fetch(postNickUrl, {method:'POST'})
		.then(res => {
			res.json()
				.then(res => {
          if (res.isSuccess) {
            localStorage.setItem("nickName", registerNick);
            localStorage.setItem("userId", res.data);
            localStorage.setItem("unlockedLvls", "1");
          } else {
            alert('Такой пользователь уже существует!')
          }
				})
		})
		//?! Отправить запрос POST
		//?! Callback если запрос не получился
		//?! Callback ecли получился запрос
  });
}

// FillTableRecords
fillRecords(currentRecordsDiff, localStorage.getItem('nickName'));

function showGameField() {
	gameField.classList.add('game__field--gaming');
  gameStrtBtn.classList.add('custom-btn--hide');
  gameOptions.classList.add('game-options--show');
}

function openLevels() {
  if (localStorage.getItem("unlockedLvls")) {
    let unlockedLvls = +localStorage.getItem("unlockedLvls");

    if (unlockedLvls > levelBtns.length) {
      unlockedLvls = levelBtns.length;
    }

    for (let i = 0; i < unlockedLvls; i++) {
      levelBtns[i].disabled = false;
    }
  }
}

function fillRecords(difficult, nickName) {
	let recordsUrl = `${url}/?difficult=${difficult}&nickName=${nickName}`;
	fetch(recordsUrl)
		.then(res => {
			res.json()
				.then(res => {
					if (res.isSuccess) {
						let records = res.data;
            let recordsTable = document.querySelector('.records__table');

            if (recordsTable.querySelector('tbody')) {
              recordsTable.querySelector('tbody').remove();

              let tableBody = document.createElement('tbody');
              recordsTable.appendChild(tableBody);

              recordsTable = document.querySelector('.records__table tbody');
            }

						for (let i = 0; i < records.length; i++) {
              let tableRow = document.createElement('tr');

              if (records[i].nickName === localStorage.nickName) {
                tableRow.classList.add('records__me')
              }

              let recordNumber = document.createElement('td');
              recordNumber.textContent = (records[i].rank) ? records[i].rank : i + 1;

              let recordNick = document.createElement('td');
              recordNick.textContent = records[i].nickName;

              let recordDate = document.createElement('td');
              recordDate.textContent = records[i].date;

              let recordScore = document.createElement('td');
              recordScore.textContent = records[i].score;

              tableRow.appendChild(recordNumber);
              tableRow.appendChild(recordNick);
              tableRow.appendChild(recordDate);
              tableRow.appendChild(recordScore);

              recordsTable.appendChild(tableRow);
						}
					} else {
						console.error('Cannot load records');
					}
				})
		})
}
