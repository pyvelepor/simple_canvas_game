// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed: 125
};

var monstersCaught = 0;
var oldDistance = null;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	var xDisplacement = monster.x - hero.x;
  var yDisplacement = monster.y = hero.y;

  // reset the distance between monster and hero
  oldDistance = Math.sqrt(xDisplacement ** 2 + yDisplacement ** 2);

  //Reset the monsters velocity
  monster.vx = 0;
  monster.vy = 0;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	var xDisplacement = monster.x - hero.x;
	var yDisplacement = monster.y - hero.y;
	var newDistance = Math.sqrt(xDisplacement ** 2 + yDisplacement ** 2);
	
	if(newDistance < oldDistance){
	  //adjust velocity to monsters max speed
	  var vx = xDisplacement / newDistance * monster.speed;
	  var vy = yDisplacement / newDistance * monster.speed;

    var xSteering = vx - monster.vx;
    var ySteering = vy - monster.vy;

    monster.vx += xSteering;
    monster.vy += ySteering;

    monster.x += monster.vx * modifier;
    monster.y += monster.vy * modifier;
	}

	else{
	  monster.vx = 0;
	  monster.vy = 0;
	}

	oldDistance = newDistance;

	if(hero.x < 30){
		hero.x = 30;
	}

	if(hero.x > 451){
		hero.x = 451;
	}

	if(hero.y < 30){
		hero.y = 30;
	}

	if(hero.y > 415){
		hero.y = 415;
	}

	if(monster.x < 32){
    monster.x = 32;
	}

	if(monster.x > canvas.width - 64){
	  monster.x = canvas.width - 64;
	}

	if(monster.y < 32){
	  monster.y = 32;
	}

	if(monster.y > canvas.height - 64){
	  monster.y = canvas.height - 64;
	}
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
