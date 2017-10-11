// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//info for loading images
//name needed later for assigning to an image to the correct variable
var images = {
	background : 'images/background.png',
  hero : 'images/hero.png',
	monster : 'images/monster.png'
};

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

// Keeping track of time elapsed
var then = null;

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
	var bgImage = images.background;
	var heroImage = images.hero;
	var monsterImage = images.monster;

	ctx.drawImage(bgImage, 0, 0);
	ctx.drawImage(heroImage, hero.x, hero.y);
	ctx.drawImage(monsterImage, monster.x, monster.y);

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

//load an image using a Promise
function loadImage(source){
  var executor = (resolve, reject) => {
    var image = new Image();

    image.onload  = function(){
      resolve(image);
    };

    image.onerror = function(){
			reject(1);
		};

    image.src = source;
  };

  return new Promise(executor);
}

function loadImages(images){
	var requests = [];

	Object.entries(images).forEach(([name, source]) => {
		var request = loadImage(source).then(image => {
			images[name] = image;
			return Promise.resolve();
		});

		requests.push(request);
	});

	return Promise.all(requests);
}

loadImages(images).then(() => {
	// Let's play this game!
	then = Date.now();
	reset();
	main();
});
