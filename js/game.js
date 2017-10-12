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
var loopGame = function(update, render) {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	var nextFrame = loopGame.bind(null, update, render);

	// Request to do this again ASAP
	requestAnimationFrame(nextFrame);
};

var start = function(update, render){
	addEventListener("keydown", onKeydown, false);
	addEventListener("keyup", onKeyup, false);

	loopGame(update, render);
};
