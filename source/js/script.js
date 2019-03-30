'use strict';

//Global variables
let url = 'https://cut-chrysanthemum.glitch.me';
let currentTableDiff = 'hard';
let currentGameLvl;
let gamingFruits = [];
let gamingDiff = '';
let score;
let maxLvl = 10;

let intervalTimer;
let isListenerFruit = false;
let isTimerOn = false;
let fruitCatchTime;
let catchTimeDiff;
let randomFruit;

//Gaming difficulties options
let easyfruitCatchTime = [7, 6, 5, 4, 3, 3, 2.9, 2.8, 2.7, 2.6];
let easyLvlTime = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

let mediumfruitCatchTime = [6, 5, 4, 4, 3.8, 3.5, 3, 2.8, 2.5, 2];
let mediumLvlTime = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65];

let hardfruitCatchTime = [5, 4, 3, 3, 2.3, 2.1, 2, 1.4, 1.2, 1];
let hardLvlTime = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

// Global dom elements
let playBtn = document.querySelector('.game__start-btn');
let registerModal = document.querySelector('.modal-register');
let closeModal = document.querySelector('#closeReg');
let registerForm = document.querySelector('.modal-register__form');
let registerSendBtn = document.querySelector('.modal-register__send-btn');

let overlay = document.querySelector('.overlay');

let gameField = document.querySelector('.game__field');
let gameOptions = document.querySelector('.game__options');
let gameOptionsStrt = document.querySelector('.game-options__start-btn');

let levelBtns = document.querySelectorAll('.levels__btn');

let selfScore = document.querySelector('.game__self-score');
let gameCatchTimer = document.querySelector('.game__catch-timer');
let gameLvlTimer = document.querySelector('.game__lvl-timer');
let gamingMandarin = document.querySelector('.game__fruit--mandarin');
let gamingLemon = document.querySelector('.game__fruit--lemon');
let gamingWatermelon = document.querySelector('.game__fruit--watermelon');

let modalWinner = document.querySelector('.game__winner-modal');
let modalWinnerDesc = document.querySelector('.game-options__desc--winner');
let modalWinnerScore = document.querySelector('.game-options__score--winner');
let modalWinnerContinue = document.querySelector('.game-options__continue-btn');
let modalWinnerEnd = document.querySelector('.game-options__end-btn--winner');

let modalLooser = document.querySelector('.game__looser-modal');
let modalLooserScore = document.querySelector('.game-options__score--looser');
let modalLooserClose = document.querySelector('.game-options__end-btn--looser');

let errorModal = document.querySelector('.modal-error');
let errModalClose = document.querySelector('#closeError');
let errorMessage = document.querySelector('#errorMessage');

// Get records table
fillRecords();

//Records table switch difficult
let switchTableBtns = document.querySelectorAll('.records__difficult');

for (let i = 0; i < switchTableBtns.length; i++) {
  switchTableBtns[i].addEventListener('click', switchTableDiff);
}

function switchTableDiff(evt) {
  evt.preventDefault();

  if (evt.target.classList.contains('records__difficult--hard')) {
		for (let i = 0; i < switchTableBtns.length; i++) {
			switchTableBtns[i].classList.remove('records__difficult--hard');
			switchTableBtns[i].classList.add('records__difficult--easy');
			switchTableBtns[i].textContent = '(Легкий)';
		}

		currentTableDiff = 'easy';
  } else if (evt.target.classList.contains('records__difficult--medium')) {
		for (let i = 0; i < switchTableBtns.length; i++) {
			switchTableBtns[i].classList.remove('records__difficult--medium');
			switchTableBtns[i].classList.add('records__difficult--hard');
			switchTableBtns[i].textContent = '(Тяжелый)';
		}

		currentTableDiff = 'hard';
  } else if (evt.target.classList.contains('records__difficult--easy')) {
		for (let i = 0; i < switchTableBtns.length; i++) {
			switchTableBtns[i].classList.remove('records__difficult--easy');
			switchTableBtns[i].classList.add('records__difficult--medium');
			switchTableBtns[i].textContent = '(Средний)';
		}

		currentTableDiff = 'medium';
  }

  fillRecords();
}

// Mobile nav js
let navBtn = document.querySelector('.page-header__nav-btn');
let mainNav = document.querySelector('.main-nav');

navBtn.addEventListener('click', toggleNav);
mainNav.addEventListener('click', toggleNav);

function toggleNav(evt) {
    navBtn.classList.toggle('page-header__nav-btn--opened');
    mainNav.classList.toggle('main-nav--show');
}

//Overlay js
overlay.addEventListener('click', overlayCloseModals);

function overlayCloseModals(evt) {
  evt.preventDefault();

  registerModal.classList.remove('modal-register--show');
  errorModal.classList.remove('modal-error--show');
  overlay.classList.remove('overlay--show');
}

//Modal error
errModalClose.addEventListener('click', closeErrModal);

function closeErrModal(evt) {
  evt.preventDefault();

  errorModal.classList.remove('modal-error--show');
  overlay.classList.remove('overlay--show');
}

//Modal winner
modalWinnerContinue.addEventListener('click', evt => {
  evt.preventDefault();

  modalWinner.classList.remove('game-options--winner-show');
  strtGame();
});

modalWinnerEnd.addEventListener('click', evt => {
  evt.preventDefault();

  let isSure = confirm('Вы уверены что хотите закончить игру?');

  if (isSure == false) {
    return;
  }

  modalWinner.classList.remove('game-options--winner-show');
  showGameOptions();
});

//Modal looser
modalLooserClose.addEventListener('click', evt => {
  evt.preventDefault();

  modalLooser.classList.remove('game-options--looser-show');
  showGameOptions();
});

// Game field on start js
if (localStorage.getItem('nickName') && localStorage.getItem('userId') && localStorage.getItem('unlockedLvls')) { //Local storage check
	showGameOptions();
  openStorageLevels();
  currentGameLvl = +localStorage.getItem('unlockedLvls');
  setCurrentLvlBtn();
} else {
  playBtn.addEventListener('click', toggleModal);
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
      hideModal();
      showErrorModal('Ник от 5 до 12 символов должен быть');
      return;
    }

    let postNick = {};
    postNick.nickName = registerNick;

    let objStringify = JSON.stringify(postNick);

    fetch(url,
    {
      method:'POST',
      body: objStringify
    })
		  .then(res => {
			res.json()
				.then(res => {
          if (res.isSuccess) {
            localStorage.setItem("nickName", registerNick);
            localStorage.setItem("userId", "" + res.data);
            localStorage.setItem("unlockedLvls", "1");

            currentGameLvl = 1;

            hideModal();
            showGameOptions();
            openStorageLevels();
            setCurrentLvlBtn();
          } else {
            hideModal();
            showErrorModal('Такой пользователь уже существует!');
          }
				})
		})
  });
}

//Game field options
gameOptionsStrt.addEventListener('click', evt => {
	evt.preventDefault();

	gamingFruits = [];
	gamingDiff = '';
	score = 0;

  let fruits = gameOptions.querySelectorAll('.game-options__fruits-list input');
  let difficulties = gameOptions.querySelectorAll('.game-options__difficult-list input');

	for (let i = 0; i < fruits.length; i++) {
		if (fruits[i].checked) {
			gamingFruits.push(fruits[i].getAttribute('data-fruit'));
		}
  }

  if (gamingFruits.length === 0) {
    showErrorModal('Укажите хотя бы один фрукт!');
    return;
  }

  for (let i = 0; i < difficulties.length; i++) {
    if (difficulties[i].checked) {
      gamingDiff = difficulties[i].value;
      break;
    }
  }


  gameOptions.classList.remove('game-options--show');

  strtGame();
});


function showGameOptions() {
	gameField.classList.add('game__field--gaming');
  playBtn.classList.add('custom-btn--hide');
  gameOptions.classList.add('game-options--show');
}

function openStorageLevels() {
  if (localStorage.getItem("unlockedLvls")) {
    let unlockedLvls = +localStorage.getItem("unlockedLvls");

    if (unlockedLvls > maxLvl) {
      unlockedLvls = maxLvl;
    }

    for (let i = 0; i < unlockedLvls; i++) {
      levelBtns[i].disabled = false;
      levelBtns[i].addEventListener('click', lvlBtnListener);
    }
  }
}

function openLevel(numberLvl) {
  if (numberLvl > maxLvl) {
    numberLvl = maxLvl;
  }

  if (+localStorage.getItem('unlockedLvls') < numberLvl) {
    localStorage.setItem("unlockedLvls", "" + numberLvl)
  }

  if (levelBtns[numberLvl - 1].disabled) {
    levelBtns[numberLvl - 1].disabled = false;
    levelBtns[numberLvl - 1].addEventListener('click', lvlBtnListener);
  }
}

function setCurrentLvlBtn() {
  for (let i = 0; i < levelBtns.length; i++) {
    if (levelBtns[i].classList.contains('custom-btn-2--current')) {
      levelBtns[i].classList.remove('custom-btn-2--current');
    }
  }

  levelBtns[currentGameLvl - 1].classList.add('custom-btn-2--current');
}

function fillRecords() {
  let difficult = currentTableDiff;
  let nickName = localStorage.getItem('nickName')
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
            console.log(res.errorText);
					}
				})
		})
}

function hideModal() {
  overlay.classList.remove('overlay--show');
  registerModal.classList.remove('modal-register--show');
}

function lvlBtnListener(evt) {
  evt.preventDefault();

  currentGameLvl = +evt.target.textContent;

  if (isTimerOn === true) {
    clearInterval(intervalTimer);
    isTimerOn = false;
  }

  selfScore.classList.remove('game__self-score--show');
  gameCatchTimer.classList.remove('game__catch-timer--show');
  gameLvlTimer.classList.remove('game__lvl-timer--show');
  gamingMandarin.style.display = 'none';
  gamingLemon.style.display = 'none';
  gamingWatermelon.style.display = 'none';
  modalWinner.classList.remove('game-options--winner-show');
  modalLooser.classList.remove('game-options--looser-show');

  if (isListenerFruit === true) {
    gamingMandarin.removeEventListener('click', fruitListener);
    gamingLemon.removeEventListener('click', fruitListener);
    gamingWatermelon.removeEventListener('click', fruitListener);
    isListenerFruit = false;
  }

  showGameOptions();
  setCurrentLvlBtn();
}

function postRecord() {
  let objRecord = {};
  objRecord.score = score;
  objRecord.difficult = gamingDiff;
  objRecord.nickName = localStorage.getItem('nickName');
  objRecord.userId = +localStorage.getItem('userId');

  let date = new Date();
  date = formatDate(date);

  objRecord.date = date;

  let objStringify = JSON.stringify(objRecord);

  fetch(url, {
    method: 'POST',
    body: objStringify
  })
    .then(res => {
      res.json()
        .then(res => {
          if (res.isSuccess) {
						if (res.data === 'Result is updated') {
              fillRecords();
            }
					}
        })
    })
}

function strtGame() {
  //Gaming preparation
  let lvlTime;

  selfScore.classList.add('game__self-score--show');
  gameCatchTimer.classList.add('game__catch-timer--show');
  gameLvlTimer.classList.add('game__lvl-timer--show');

  switch (gamingDiff) {
    case 'easy':
      fruitCatchTime = easyfruitCatchTime[currentGameLvl - 1];
      lvlTime = easyLvlTime[currentGameLvl - 1];
      break;
    case 'medium':
      fruitCatchTime = mediumfruitCatchTime[currentGameLvl - 1];
      lvlTime = mediumLvlTime[currentGameLvl - 1];
      break;
    case 'hard':
      fruitCatchTime = hardfruitCatchTime[currentGameLvl - 1];
      lvlTime = mediumLvlTime[currentGameLvl - 1];
      break;
  }

  gamingMandarin.addEventListener('click', fruitListener);
  gamingLemon.addEventListener('click', fruitListener);
  gamingWatermelon.addEventListener('click', fruitListener);
  isListenerFruit = true;

  selfScore.textContent = `Счет: ${score}`;

  //Gaming process
  console.log(`Вы щас на ${currentGameLvl} уровне, Уровень сложности: ${gamingDiff}, Очков ${score}, Время на поимку фрукта ${fruitCatchTime}, Время на уровень ${lvlTime}`);
  generateRdmFruit();
  catchTimeDiff = fruitCatchTime;
  let startTime = new Date().getTime();

  isTimerOn = true;
  intervalTimer = setInterval( () => {
    let currentTime = new Date().getTime();
    let diffTime = (currentTime - startTime)/1000;
    gameLvlTimer.textContent = `Продержитесь: ${(lvlTime - diffTime).toFixed(1)} сек`;

    catchTimeDiff -= 0.1;
    gameCatchTimer.textContent = `Время на поимку: ${(catchTimeDiff).toFixed(1)} сек`;

    if (diffTime >= lvlTime) {
      clearGameField();
      postRecord();
      showWinnerModal();
      if (currentGameLvl < maxLvl) {
          currentGameLvl++;
          openLevel(currentGameLvl);
          setCurrentLvlBtn();
      }
    }

    if (catchTimeDiff <= 0) {
      clearGameField();
      postRecord();
      showLooserModal();
    }
  }, 100);


  //Gaming functions
  function clearGameField() {
    clearInterval(intervalTimer);
    isTimerOn = false;
    gamingMandarin.removeEventListener('click', fruitListener);
    gamingLemon.removeEventListener('click', fruitListener);
    gamingWatermelon.removeEventListener('click', fruitListener);
    isListenerFruit = false;
    randomFruit.style.display = 'none';
    selfScore.classList.remove('game__self-score--show');
    gameCatchTimer.classList.remove('game__catch-timer--show');
    gameLvlTimer.classList.remove('game__lvl-timer--show');
  }
}

function showWinnerModal() {
  modalWinner.classList.add('game-options--winner-show');
  modalWinnerScore.textContent = `Ваш счет: ${score}`;

  if (currentGameLvl === maxLvl) {
    modalWinnerDesc.textContent = 'Вы прошли всю игру!';
    modalWinnerContinue.style.display = 'none';
  } else {
    modalWinnerDesc.textContent = 'Вы прошли уровень';
    modalWinnerContinue.style.display = 'block';
  }
}

function showLooserModal() {
  modalLooser.classList.add('game-options--looser-show');
  modalLooserScore.textContent = `Ваш счет: ${score}`;
}

function showErrorModal(message) {
  errorModal.classList.add('modal-error--show');
  overlay.classList.add('overlay--show');
  errorMessage.textContent = message;
}

function fruitListener(evt) {
  evt.preventDefault();

  score++;
  selfScore.textContent = `Счет: ${score}`;
  evt.target.style.display = 'none';
  catchTimeDiff = fruitCatchTime;
  generateRdmFruit();
}

function generateRdmFruit() {
  randomFruit = gamingFruits[getRandomInt(0, gamingFruits.length - 1)];

  switch (randomFruit) {
    case 'mandarin':
      randomFruit = gamingMandarin;
      break;
    case 'lemon':
      randomFruit = gamingLemon;
      break;
    case 'watermelon':
      randomFruit = gamingWatermelon;
      break;
  }

  randomFruit.style.display = 'block';
  randomFruit.style.left = `calc(${getRandomInt(0, gameField.offsetWidth - randomFruit.offsetWidth)}px)`;
  randomFruit.style.top = `calc(${getRandomInt(0, gameField.offsetHeight - randomFruit.offsetHeight)}px)`;
}

function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
