const buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = []; //Store game pattern
var userClickedPattern = []; // to store what user press
var isGameStarted = false; // to check if game has been started or not
var level = 0; // to keep track of level

// Generating next sequence with help of random function and pushing it to game pattern
function nextSequence() {
  userClickedPattern = [];
  var randomNumber = Math.round(Math.random() * 3);
  var randomChosenColour = buttonColors[randomNumber];
  gamePattern.push(randomChosenColour);
  playSound(randomChosenColour);
  $("#" + randomChosenColour)
    .fadeOut(100)
    .fadeIn(100);
  level += 1;
  $("#level-title").text("Level " + level);
}

// playing sound with file name
function playSound(name) {
  var audio = new Audio("./sounds/" + name + ".mp3");
  var play = audio.play();
  if (play !== undefined) {
    play.then((_) => {}).catch((error) => {});
  }
}

// animating on press
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

// Checking if answer is Correct by comparing last element of game pattern and user pressed
function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    startOver();
  }
}

// Starting over game
function startOver() {
  isGameStarted = false;
  level = 0;
  gamePattern = [];
}

// On Click btn playing sound and increasing data
$(".btn").click(function () {
  var userChosenColour = this.id;
  playSound(userChosenColour);
  animatePress(userChosenColour);
  userClickedPattern.push(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

// starting game when key is pressed
$(document).on("keyup", () => {
  if (!isGameStarted) nextSequence();
  isGameStarted = true;
});
