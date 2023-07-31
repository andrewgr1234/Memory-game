const cardsContainer = document.getElementById("cards");
const card = document.getElementsByClassName("card");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let scoreBoard = document.getElementById("score");
let mode = "normal";

scoreBoard.textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    console.log(cards);
    shuffleCards();
    genCards();
  });

function shuffleCards() {
  let currIndex = cards.length;
  let randomIndex;
  let tempValue;

  while (currIndex > 0) {
    randomIndex = Math.floor(Math.random() * currIndex);
    currIndex -= 1;

    tempValue = cards[currIndex];
    cards[currIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
    tempValue = cards[currIndex];
    cards[currIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
    tempValue = cards[currIndex];
    cards[currIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
    tempValue = cards[currIndex];
    cards[currIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
    tempValue = cards[currIndex];
    cards[currIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
  }
}

function initGame() {
  shuffleCards();
  unlockboard();
  genCards();
  stopConfetti();
  score = 0;
  scoreBoard.textContent = score;
}

function setMode(newMode) {
  mode = newMode;
  initGame();
}

function genCards() {
  let rows, columns, size;
  let pairs = 0;
  let selectedCards = [];
  const maxPairs = 27;

  if (mode === "normal") {
    pairs = 9;
    rows = 3;
    columns = 6;
    size = 210;
  } else if (mode === "hard") {
    pairs = 12;
    rows = 5;
    columns = 8;
    size = 180;
  } else if (mode === "extreme") {
    pairs = 27;
    rows = 5;
    columns = 10;
    size = 150;
  }
  while (selectedCards.length < pairs && selectedCards.length < maxPairs) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    const card = cards[randomIndex];
    if (!selectedCards.includes(card)) {
      selectedCards.push(card);
    }
  }

  const pairsArray = selectedCards.concat(selectedCards);

  cardsContainer.style.gridTemplateRows = `repeat(${rows}, 210px)`;
  cardsContainer.style.gridTemplateColumns = `repeat(${columns}, ${size}px)`;

  cardsContainer.innerHTML = "";

  for (let i = 0; i < pairsArray.length; i++) {
    const card = pairsArray[i];
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
        `;
    cardsContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
    cardElement.addEventListener("touchstart", flipCard);
  }
}

function flipCard() {
  if (lockBoard) {
    return;
  }
  if (this === firstCard) {
    return;
  }

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  ifMatching();
}

function ifMatching() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    disableCards();
  } else unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("touchstart", flipCard);
  score++;
  scoreBoard.textContent = score;
  if (score === 9) {
    startConfetti();
  }
  unlockboard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockboard();
  }, 1000);
}

function unlockboard() {
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function restart() {
  shuffleCards();
  unlockboard();
  genCards();
  stopConfetti();
  initGame();
  score = 0;
  scoreBoard.textContent = score;
  cardsContainer.innerHTML = "";
}
