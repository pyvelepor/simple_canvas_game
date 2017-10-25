var MonsterHunter = class {
  // Create the canvas
  constructor(){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    //info for loading images
    //name needed later for assigning to an image to the correct variable
    this.images = {
      background : 'images/background.png',
      hero : 'images/hero.png',
    	monster : 'images/monster.png'
    };

    // Game objects
    var hero = {
    	x: null,
    	y: null,
    	speed: 256, // movement in pixels per second
    };

    var monster = {
    	x: null,
    	y: null,
      vx: 0,
      vy: 0,
      maxSpeed: 125,
    };

    var monstersCaught = 0;

    // Reset the game when the player catches a monster
    var reset = function () {
    	hero.x = canvas.width / 2;
    	hero.y = canvas.height / 2;

    	// Throw the monster somewhere on the screen randomly
    	monster.x = 32 + (Math.random() * (canvas.width - 64));
    	monster.y = 32 + (Math.random() * (canvas.height - 64));

      monster.vx = 0;
      monster.vy = 0;
    };

    // Update game objects
    this.update = function(timeElapsed) {
      var moving = false;

      if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * timeElapsed;
        moving = true;
      }
      if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * timeElapsed;
        moving = true;
      }
      if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * timeElapsed;
        moving = true;
      }
      if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * timeElapsed;
        moving = true;
      }

      var dx = monster.x - hero.x;
      var dy = monster.y - hero.y;

      var desiredVelocity = normalize(dx, dy);
      var steeringVx = (desiredVelocity.x * monster.maxSpeed) - monster.vx;
      var steeringVy = (desiredVelocity.y * monster.maxSpeed) - monster.vy;

      if(moving){
        monster.vx += steeringVx;
        monster.vy += steeringVy;

        monster.x += monster.vx * timeElapsed;
        monster.y += monster.vy * timeElapsed;
      }

      else{
        monster.vx = 0;
        monster.vy = 0;
      }

      monster.x += 256 * timeElapsed;

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
    this.render = function() {
      var backgroundImage = this.images.background;
      var heroImage = this.images.hero;
      var monsterImage = this.images.monster;

      // Images
      ctx.drawImage(backgroundImage, 0, 0);
      ctx.drawImage(heroImage, hero.x, hero.y);
      ctx.drawImage(monsterImage, monster.x, monster.y);

      // Score
      ctx.fillStyle = "rgb(250, 250, 250)";
      ctx.font = "24px Helvetica";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
    };

    this.setup = function(){
      canvas.width = 512;
      canvas.height = 480;
      document.body.appendChild(canvas);
      reset();
    };
  }
};

// Let's play this game!
start(new MonsterHunter());
