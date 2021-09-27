var diceNumber1 = Math.floor(Math.random() * 6) + 1;
var diceNumber2 = Math.floor(Math.random() * 6) + 1;

var winner = "Draw!";
if (diceNumber1 > diceNumber2) {
  winner = "🚩 Player1 Wins!";
} else if (diceNumber1 < diceNumber2) {
  winner = "Player2 Wins! 🚩";
}

var h1 = document.querySelector("h1");
h1.innerHTML = winner;

var img1 = document.querySelector(".img1");
img1.src = "./images/dice" + diceNumber1 + ".png";
var img2 = document.querySelector(".img2");
img2.src = "./images/dice" + diceNumber2 + ".png";
