var doodlerSize = 70;
var doodlerX;
var doodlerY;
var doodlerVelocity;
var doodlerXSpeed = 4;
var platformWidth = 58;
var platformHeight = 7;
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
var img;
var spaceF;

// ===========================
//  Preload the Image Sprites
// ===========================


function preload() {
  backgroundImg = loadImage("../images/spaceb.png");
  platformImg = loadImage("https://raw.githubusercontent.com/JasonMize/coding-league-assets/master/doodle-jump-platform.png");
  doodlerLeftImg = loadImage("../images/djc1left.png");
  doodlerRightImg = loadImage("../images/djc1right.png");
  spaceF = loadFont('../images/SpaceSurf.ttf');
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
    fill('#AAF0D1');
    textFont(spaceF);
    textSize(25);
    text("CLICK TO START", 20, 200);
    textFont("Space Mono");
    textSize(17);
    text("SCORE: " + score, 3, 22);
    textSize(12);
    text("HIGH SCORE: " + highScore, 160, 22);
    fill('#e5e4e2');
    text("Use LEFT & RIGHT arrow keys to move", 10, 280);
    fill("#ff6961");
    textSize(20);
    text("Avoid being hit", 50, 330);
    textSize(18);
    text("by the videos to escape", 15, 360);
    textSize(23);
    text("the Youtube Rabbit", 15, 390);
    textSize(38)
    text("Hole", 80, 430);
  }
}

function moveScreen() {
  if(doodlerY < 250) {
    platYChange = 3;
    doodlerVelocity += 0.25;
  } else {
    platYChange = 0;
  }
}

// Start Game
function mousePressed() {
  if(gameStarted == false) {
    score = 0;
    setupPlatforms();
    img = doodlerLeftImg;
    doodlerY = 260;
    doodlerX = platformList[platformList.length - 1].xPos + 10;
    doodlerVelocity = 0.1;
    gameStarted = true;
  }
}
50
// ===========================
//  Doodler
// ===========================
function drawDoodler() {
  fill(204, 200, 52);
  image(img, doodlerX, doodlerY, doodlerSize, doodlerSize);
}

function moveDoodler() {
  // doodler falls with gravity
  doodlerVelocity += 0.2;
  doodlerY += doodlerVelocity;

  if (keyIsDown(LEFT_ARROW)) {
    doodlerX -= doodlerXSpeed;
    img = doodlerLeftImg;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    doodlerX += doodlerXSpeed;
    img = doodlerRightImg;
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
      doodlerVelocity = -8;
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
