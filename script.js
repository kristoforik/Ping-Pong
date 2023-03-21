/**
 * Canvas and Context
 */
const canvas = document.getElementById("container");
const context = canvas.getContext("2d");
sessionStorage.setItem("winner", "None");

function rules() {
  alert("The game is till 20 points\nGood luck!");
}
setTimeout(1000);

/**
 * Objects
 */
const ball = {
  radius: 8,
  positionX: canvas.width / 2 + 8,
  positionY: canvas.height / 2 + 8,
  velocityX: 2.8,
  velocityY: 2.8,
  color: "#E6BD37",
};

const leftPlayer = {
  height: 100,
  width: 10,
  positionX: 10,
  positionY: canvas.height / 2 - 100 / 2,
  color: "#660104",
  player: "left",
  speed: 2,
};

const rightPlayer = {
  height: 100,
  width: 10,
  positionX: canvas.width - 20,
  positionY: canvas.height / 2 - 100 / 2,
  color: "#006622",
  player: "right",
  speed: 2,
};

/**
 * Game
 */
const game = {
  leftScore: 0,
  rightScore: 0,
  turn: 0,
  topScore: 20,
  speedIncreaseHit: 3,
};

const keyPressed = {
  W: false,
  S: false,
  Up: false,
  Down: false,
};

let activated = true;
let hits = 0;

/**
 * Update and Draw
 */
function drawLeftPlayer() {
  context.beginPath();
  context.fillStyle = leftPlayer.color;
  context.rect(
    leftPlayer.positionX,
    leftPlayer.positionY,
    leftPlayer.width,
    leftPlayer.height
  );
  context.fill();
  context.closePath();
}

function drawRightPlayer() {
  context.beginPath();
  context.fillStyle = rightPlayer.color;
  context.rect(
    rightPlayer.positionX,
    rightPlayer.positionY,
    rightPlayer.width,
    rightPlayer.height
  );
  context.fill();
  context.closePath();
}

function drawBall() {
  context.beginPath();
  context.fillStyle = ball.color;
  context.arc(ball.positionX, ball.positionY, ball.radius, 0, Math.PI * 2);
  context.fill();
  context.closePath();
}

function drawNet() {
  context.beginPath();
  context.setLineDash([20, 15]);
  context.moveTo(canvas.width / 2, canvas.height);
  context.lineTo(canvas.width / 2, -canvas.height);
  context.lineWidth = 5;
  context.strokeStyle = "white";
  context.stroke();
  context.closePath();
}

function drawAll() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawLeftPlayer();
  drawRightPlayer();
  drawBall();
  drawNet();
}

function resetBall() {
  ball.positionX = canvas.width / 2 + 8;
  ball.positionY = canvas.height / 2 + 8;

  let velocityX = ball.velocityX;
  let velocityY = ball.velocityY;

  ball.velocityX = 0;
  ball.velocityY = 0;

  setTimeout(() => {
    ball.velocityX = -velocityX;
    ball.velocityY = -velocityY;
  }, 1000);
}

function collisionTimeLag() {
  activated = false;
  console.log("Deactivated Collision");
  setTimeout(() => {
    activated = true;
    console.log("Ready For Collision");
  }, 50);
}

function setScore() {
  if (ball.positionX > canvas.width - rightPlayer.width) {
    game.leftScore++;
    aiGoal();
    AiScoreMessage();
    resetBall();
  } else if (ball.positionX < rightPlayer.width) {
    game.rightScore++;
    userGoal();
    playerScoreMessage();
    resetBall();
  }

  function aiGoal() {
    let x = document.getElementById("box");
    // x.style.border = "3px solid red";
    x.style.boxShadow = "0px 0px 25px red";
    // window.alert("Ai got a point");
  }
  function userGoal() {
    let x = document.getElementById("box");
    // x.style.border = "3px solid green";
    x.style.boxShadow = "0px 0px 25px green";
    // window.alert("Player got a point");
  }

  function AiScoreMessage() {
    let x = document.getElementById("score-message");
    x.textContent = "Ai scored";
    x.style.color = "red";
    x.style.textShadow = "10px 10px 15px red";
  }
  function playerScoreMessage() {
    let x = document.getElementById("score-message");
    x.textContent = "Player scored";
    x.style.color = "green";
    x.style.textShadow = "10px 10px 15px green";
  }

  document.getElementsByClassName("left")[0].textContent = game.leftScore;
  document.getElementsByClassName("right")[0].textContent = game.rightScore;
}

function gameOver() {
  if (game.leftScore === game.topScore) {
    console.log("AI Wins");
    sessionStorage.setItem("winner", "AI");
    window.location.href = "winner.html";
    resetGame();
  } else if (game.rightScore === game.topScore) {
    console.log("Player Wins");
    sessionStorage.setItem("winner", "Player");
    window.location.href = "winner.html";
    resetGame();
  }
}

function resetGame() {
  game.leftScore = 0;
  game.rightScore = 0;
  ball.positionX = 0;
  ball.positionY = 0;
  updateDefault();
}

function updateKeyPresses() {
  if (leftPlayer.positionY > ball.positionY - leftPlayer.height / 2)
    leftPlayer.positionY -= leftPlayer.speed;
  else leftPlayer.positionY -= leftPlayer.speed / 6;

  if (leftPlayer.positionY < ball.positionY - leftPlayer.height / 2)
    leftPlayer.positionY += leftPlayer.speed;
  else leftPlayer.positionY += leftPlayer.speed / 6;

  if (keyPressed["Up"]) {
    if (rightPlayer.positionY > 0) {
      rightPlayer.positionY -= rightPlayer.speed;
    }
  }
  if (keyPressed["Down"]) {
    if (rightPlayer.positionY < canvas.height - rightPlayer.height) {
      rightPlayer.positionY += rightPlayer.speed;
    }
  }
}

function updateStates() {
  if (
    ball.positionY + ball.radius >= canvas.height ||
    ball.positionY - ball.radius <= 0
  ) {
    ball.velocityY = -ball.velocityY;
  }

  if (
    (ball.positionX + ball.radius >= canvas.width - rightPlayer.width &&
      ball.positionY >= rightPlayer.positionY &&
      ball.positionY <= rightPlayer.positionY + rightPlayer.height) ||
    (ball.positionX - ball.radius <= leftPlayer.width &&
      ball.positionY >= leftPlayer.positionY &&
      ball.positionY <= leftPlayer.positionY + leftPlayer.height)
  ) {
    if (activated) {
      hits++;
      ball.velocityX = -ball.velocityX;
      collisionTimeLag();
    }
  }

  setScore();
  gameOver();

  if (hits === game.speedIncreaseHit) {
    hits = 0;
    ball.velocityX += 0.15;
    ball.velocityY += 0.15;
    leftPlayer.speed += 0.1;
    rightPlayer.speed += 0.15;

    console.log(ball.velocityX, leftPlayer.speed);
  }

  ball.positionX += ball.velocityX;
  ball.positionY += ball.velocityY;
}

/**
 * Key Listeners
 */
document.addEventListener(
  "keydown",
  (event) => {
    var name = event.key;
    var code = event.code;

    if (code === "KeyS") {
      keyPressed["S"] = true;
    }
    if (code === "KeyW") {
      keyPressed["W"] = true;
    }
    if (code === "ArrowUp") {
      keyPressed["Up"] = true;
    }
    if (code === "ArrowDown") {
      keyPressed["Down"] = true;
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (event) => {
    var name = event.key;
    var code = event.code;

    if (code === "KeyS") {
      keyPressed["S"] = false;
    }
    if (code === "KeyW") {
      keyPressed["W"] = false;
    }
    if (code === "ArrowUp") {
      keyPressed["Up"] = false;
    }
    if (code === "ArrowDown") {
      keyPressed["Down"] = false;
    }
  },
  false
);

/**
 * Game Loop and Render
 */
function gameLoop() {
  updateKeyPresses();
  updateStates();
  drawAll();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

/**
 * Support
 */
function updateDefault() {
  canvas.width = Math.min(window.innerWidth * 0.6, 650);
  canvas.height = Math.min(window.innerHeight * 0.8, 450);

  ball.positionX = canvas.width / 2;
  ball.positionY = canvas.height / 2;

  leftPlayer.positionY = canvas.height / 2 - leftPlayer.height / 2;

  rightPlayer.positionX = canvas.width - (rightPlayer.width + 10);
  rightPlayer.positionY = canvas.height / 2 - rightPlayer.height / 2;
}

function resizeHandler() {
  if (window.innerWidth < 560) {
    document.getElementsByClassName("small-device")[0].style.display = "flex";
    document.getElementsByClassName("canvas-container")[0].style.display =
      "none";
  } else {
    document.getElementsByClassName("small-device")[0].style.display = "none";
    document.getElementsByClassName("canvas-container")[0].style.display =
      "flex";
  }

  updateDefault();
}

resizeHandler();
window.addEventListener("resize", () => {
  resizeHandler();
});
