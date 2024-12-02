const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const trash = document.getElementById("trash");
const icon = document.getElementById("icon");
const money = document.getElementById("money");

function jump() {
  if (dino.classList != "jump") {
    dino.classList.add("jump");

    setTimeout(function () {
      dino.classList.remove("jump");
    }, 500);
  }
}

let isAlive = setInterval(function () {
  // get current dino Y position
  let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
  let iconX = parseInt(window.getComputedStyle(icon).getPropertyValue("left"));
  let moneyX = parseInt(window.getComputedStyle(money).getPropertyValue("left"));
  // get current cactus X position
  let cactusLeft = parseInt(
    window.getComputedStyle(cactus).getPropertyValue("left")
  );
  let trashLeft = parseInt(
    window.getComputedStyle(trash).getPropertyValue("left")
  );

  // detect collision
  if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
    // collision
    gameOver();

  }
  else if (trashLeft < 50 && trashLeft > 0 && dinoTop >= 140) {
    gameOver();
  }
  else if (iconX >= moneyX-1){
    winGame();
  }
}, 10);



function startGame(){
    document.getElementById("cactus").style.display = "box";
    document.getElementById("trash").style.display = "box";
    document.getElementById("icon").style.display = "box";
    document.getElementById("dino").style.opacity = "100%";
    document.getElementById("sIntro").style.display = "none";
    document.getElementById("cactus").style.animationPlayState = "running";
    document.getElementById("trash").style.animationPlayState = "running";
    document.getElementById("icon").style.animationPlayState = "running";
}

function gameOver() {
    document.getElementById("cactus").style.animationPlayState = "paused";
    document.getElementById("trash").style.animationPlayState = "paused";
    document.getElementById("icon").style.animationPlayState = "paused";
    document.getElementById("gover").style.display = "block";
    window.onmessage = function(e) {
        var searchReq = e.data;
        document.getElementById("mP").innerHTML = searchReq;
    };
}

function winGame() {
    document.getElementById("cactus").style.animationPlayState = "paused";
    document.getElementById("trash").style.animationPlayState = "paused";
    document.getElementById("icon").style.animationPlayState = "paused";
    document.getElementById("cactus").style.animation = "none";
    document.getElementById("trash").style.animation = "none";
    document.getElementById("win").style.display = "block";
}

function restartGame() {
    document.getElementById("gover").style.display = "none";
    document.getElementById("win").style.display = "none";
    document.getElementById("cactus").style.animation = "none";
    document.getElementById("trash").style.animation = "none";
    document.getElementById("icon").style.animation = "none";
    setTimeout(function() {
        document.getElementById("cactus").style.animation = "";
        document.getElementById("trash").style.animation = "";
        document.getElementById("icon").style.animation = "";
        startGame();
    }, 10);
}

document.addEventListener("keydown", function (event) {
  jump();
});
window.addEventListener('message', function(dataPassed) {
    var searchReq = dataPassed.data;
    document.getElementById("mP").innerHTML = searchReq;
 })