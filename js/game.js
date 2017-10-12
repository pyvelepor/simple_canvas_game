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
var main = function(update, render) {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	var advanceGame = main.bind(null, update, render);

	// Request to do this again ASAP
	requestAnimationFrame(advanceGame);
};

var start = function(update, render){
	addEventListener("keydown", onKeydown, false);
	addEventListener("keyup", onKeyup, false);

	main(update, render);
};
