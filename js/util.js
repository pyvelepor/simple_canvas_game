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

var Vector = class Vector{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
};

function displacement(point1, point2){
  return new Vector(point1.x - point2.x, point1.y - point2.y);
}

function magnitude(u){
  return Math.sqrt(u.x ** 2 + u.y ** 2);
}

function normalize(u){
  var magnitude_ = magnitude(u);
  var x = u.x / magnitude_;
  var y = u.y / magnitude_;

  return new Vector(x, y);
}
// Cross-browser support for requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
