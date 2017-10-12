// Keeping track of time elapsed
var then = null;

// Handle keyboard controls
var keysDown = {};

var onKeydown = function(e){
	keysDown[e.keyCode] = true;
};

var onKeyup = function(e){
	delete keysDown[e.keyCode];
};

// The main game loop
var loop = function(game) {
	var now = Date.now();
	var delta = now - then;

	game.update(delta / 1000);
	game.render();

	then = now;

	var nextFrame = loop.bind(null, game);

	// Request to do this again ASAP
	requestAnimationFrame(nextFrame);
};

var start = function(game){
	addEventListener("keydown", onKeydown, false);
	addEventListener("keyup", onKeyup, false);

	var startGame = function(){
		if(game.setup !== undefined){
			game.setup();
		}

		loop(game);
	};

	loadImages(game.images).then(startGame);
};
