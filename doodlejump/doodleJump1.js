var doodlerSize = 70;
var doodlerX;
var doodlerY;
var doodlerVelocity;
var doodlerXSpeed = 4;
var platformWidth = 58;
var aWidth = 70;
var platformHeight = 7;
var aHeight = 50;
var numOfPlatforms = 7;
var numA = 1;
var platformList = [];
var aList = [];
var platYChange = 0;
var aYChange = 0;
var gameStarted;
var score = 0;
var highScore = 0;
var doodlerLeftImg;
var doodlerRightImg;
var platformImg;
var backgroundImg;
var img;
var spaceF;
var alien1;
var alien2;
var alien3;
var alien4;
var h = 0;
var anum = 2;
var ran= 0;
// ===========================
//  Preload the Image Sprites
// ===========================


function preload() {
  backgroundImg = loadImage("../images/spaceb.png");
  platformImg = loadImage("https://raw.githubusercontent.com/JasonMize/coding-league-assets/master/doodle-jump-platform.png");
  doodlerLeftImg = loadImage("../images/djc1left.png");
  doodlerRightImg = loadImage("../images/djc1right.png");
  spaceF = loadFont('../images/SpaceSurf.ttf');
  alien1 = loadImage('../images/alien1.png');
  alien2 = loadImage('../images/alien2.png');
  alien3 = loadImage('../images/alien3.png');
  alien4 = loadImage('../images/alien4.png');
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
  h += 1;
  background(247, 239, 231);
  image(backgroundImg, 0, 0, 277, 500);
  if(gameStarted == true) {
    //Set up and draw the game
    drawPlatforms();
    drawDoodler();
    checkCollision();
    moveDoodler();
    moveScreen();
    drawAlien();
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
    text("Use LEFT & RIGHT arrow keys to move", 10, 100);
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
    aYChange = 3;
  } else {
    platYChange = 0;
    aYchange = 3;
  }
}

// Start Game
function mousePressed() {
  if(gameStarted == false) {
    score = 0;
    setupPlatforms();
    setUpAlien();
    img = doodlerLeftImg;
    doodlerY = 260;
    doodlerX = platformList[platformList.length - 1].xPos + 10;
    doodlerVelocity = 0.1;
    gameStarted = true;
  }
}

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


function setUpAlien() {
  for(var i=0; i < numA; i++) {
    var aGap = aHeight / numA;
    var newAlienYPosition = i * aGap / 2;
    var al = new Alien(newAlienYPosition);
    aList.push(al);
  }
}

function drawAlien() {
  aList.forEach(function(al) {
    // move all platforms down
    al.yPos += aYChange;
    if (h % 180 == 0) {
       anum = Math.floor(Math.random() * 4);
    }
    if (anum == 0) {
      image(alien1, al.xPos, al.yPos, al.width, al.height);
    }
    else if (anum == 1) {
      image(alien2, al.xPos, al.yPos, al.width, al.height);
    }
    else if (anum == 2) {
      image(alien3, al.xPos, al.yPos, al.width, al.height);
    }
    else{
      image(alien4, al.xPos, al.yPos, al.width, al.height);
    }

    if(al.yPos > 500) {
      aList.pop();
      var newAl = new Alien(0);
      aList.unshift(newAl); // add to front
    }
  });
}


function Alien(newAlienYPosition) {
  ran = random(0, 2);
  if (ran == 0){
    this.xPos = random(0, 100);
  }
  else {
    this.xPos = random(200, 300);
  }
  this.yPos = newAlienYPosition;
  this.width = aWidth;
  this.height = aHeight;
}

function Platform(newPlatformYPosition) {
  this.xPos = random(10, 260);
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
      doodlerY + doodlerSize > plat.yPos
    ) {
      doodlerVelocity = -8;
    }
  });
  aList.forEach(function(al) {
    if(
      doodlerX < al.xPos + al.width &&
      doodlerX + doodlerSize > al.xPos &&
      doodlerY + doodlerSize < al.yPos + al.height &&
      doodlerY + doodlerSize > al.yPos
    ) {
      gameStarted = false;
      platformList = [];
      aList = [];
    }
  });
  if(doodlerY > height) {
    if(score > highScore) {
      highScore = score;
    }
    gameStarted = false;
    platformList = [];
    aList = [];
  }
  
  // screen wraps from left to right
  if(doodlerX < -doodlerSize) {
    doodlerX = width;
  } else if(doodlerX > width) {
    doodlerX = -doodlerSize;
  }
}
