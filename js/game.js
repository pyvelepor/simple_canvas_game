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

var load = function(game){
	return loadImages(game.images).then(() => {
		return game;
	});
};

var setup = function(game){
	if(game.setup !== undefined){
		game.setup();
	}
};

var start = function(game){
	load(game).then(game => {
		addEventListener("keydown", onKeydown, false);
		addEventListener("keyup", onKeyup, false);
		setup(game);
		loop(game);
	});
};
