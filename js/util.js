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
			// return Promise.resolve();
		});

		requests.push(request);
	});

	return Promise.all(requests);
}

function normalize(x, y){
  magnitude = Math.sqrt(x ** 2 + y ** 2);

  return {
    x: x / magnitude,
    y: y / magnitude,
  };
}
// Cross-browser support for requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
