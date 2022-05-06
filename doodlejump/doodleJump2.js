var doodlerSize = 70;
var doodlerX;
var doodlerY;
var doodlerVelocity;
var doodlerXSpeed = 2;
var platformWidth = 58;
var platformHeight = 8;
var numOfPlatforms = 5;
var platformList = [];
var platYChange = 0;
var gameStarted;
var score = 0;
var highScore = 0;
var doodlerLeftImg;
var doodlerRightImg;
var platformImg;
var backgroundImg;

// ===========================
//  Preload the Image Sprites
// ===========================


function preload() {
  backgroundImg = loadImage("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Graph-paper.svg/1024px-Graph-paper.svg.png");
  platformImg = loadImage("https://raw.githubusercontent.com/JasonMize/coding-league-assets/master/doodle-jump-platform.png");
  doodlerLeftImg = loadImage("../images/djc2left.png");
  doodlerRightImg = loadImage("../images/djc2right.png");
}

// ===========================
//  Controllers
// ===========================
function setup() {
  let canvas = createCanvas(277, 500);
  canvas.parent('gameContain');
  frameRate(60);
  gameStarted = false;
}

function draw() {
  background(247, 239, 231);
  image(backgroundImg, 0, 0, 277, 500);
  if(gameStarted == true) {
    //Set up and draw the game
    drawPlatforms();
    drawDoodler();
    checkCollision();
    moveDoodler();
    moveScreen();
  } else {
    // Start menu
    fill(0);
    textSize(30);
    text("Start", 105, 87);
    textSize(17);
    text("Score: " + score, 3, 22);
    textSize(15);
    text("High Score: " + highScore, 169, 22);
  }
}

function moveScreen() {
  if(doodlerY < 207) {
    platYChange = 3;
    doodlerVelocity += 0.12;
  } else {
    platYChange = 0;
  }
}

// Start Game
function mousePressed() {
  if(gameStarted == false) {
    score = 0;
    setupPlatforms();
    doodlerY = 350;
    doodlerX = platformList[platformList.length - 1].xPos + 10;
    doodlerVelocity = 0.10;
    gameStarted = true;
  }
}

// ===========================
//  Doodler
// ===========================
function drawDoodler() {
  fill(204, 200, 52);
  image(doodlerLeftImg, doodlerX, doodlerY, doodlerSize, 142);
}

function moveDoodler() {
  // doodler falls with gravity
  doodlerVelocity += 0.5;
  doodlerY += doodlerVelocity;

  if (keyIsDown(LEFT_ARROW)) {
    doodlerX -= doodlerXSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    doodlerX += doodlerXSpeed;
  }
}

// ===========================
//  Platforms
// ===========================
function setupPlatforms() {
  for(var i=0; i < numOfPlatforms; i++) {
    var platGap = height / numOfPlatforms;
    var newPlatformYPosition = i * platGap;
    var plat = new Platform(newPlatformYPosition);
    platformList.push(plat);
  }
}

function drawPlatforms() {
  fill(106, 186, 40);
  platformList.forEach(function(plat) {
    // move all platforms down
    plat.yPos += platYChange;
    image(platformImg, plat.xPos, plat.yPos, plat.width, plat.height);

    if(plat.yPos > 500) {
      score++;
      platformList.pop();
      var newPlat = new Platform(0);
      platformList.unshift(newPlat); // add to front
    }
  });
}

function Platform(newPlatformYPosition) {
  this.xPos = random(10, 207);
  this.yPos = newPlatformYPosition;
  this.width = platformWidth;
  this.height = platformHeight;
}

// ===========================
//  Collisions
// ===========================
function checkCollision() {
  platformList.forEach(function(plat) {
    if(
      doodlerX < plat.xPos + plat.width &&
      doodlerX + doodlerSize > plat.xPos &&
      doodlerY + doodlerSize < plat.yPos + plat.height &&
      doodlerY + doodlerSize > plat.yPos &&
      doodlerVelocity > 0
    ) {
      doodlerVelocity = -5;
    }
  });
  
  if(doodlerY > height) {
    if(score > highScore) {
      highScore = score;
    }
    gameStarted = false;
    platformList = [];
  }
  
  // screen wraps from left to right
  if(doodlerX < -doodlerSize) {
    doodlerX = width;
  } else if(doodlerX > width) {
    doodlerX = -doodlerSize;
  }
}