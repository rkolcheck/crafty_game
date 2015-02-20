window.onload = function() {
	//start crafty
	Crafty.init(400, 320);
	// Crafty.canvas();

	//turn the sprite map into usable components
	Crafty.sprite(16, "sprite.png", {
		grass1: [0,0],
		grass2: [1,0],
		grass3: [2,0],
		grass4: [3,0],
		flower: [0,1],
		bush1:  [0,2],
		bush2:  [1,2],
		PlayerSprite: [0,3]
	});

	//method to randomy generate the map
	function generateWorld() {
		//generate the grass along the x-axis
		for(var i = 0; i < 25; i++) {
			//generate the grass along the y-axis
			for(var j = 0; j < 20; j++) {
				grassType = Math.floor(Crafty.math.randomNumber(1, 4));
				Crafty.e("2D, Canvas, grass"+grassType)
					.attr({x: i * 16, y: j * 16});

				//1/50 chance of drawing a flower and only within the bushes
				if (i > 0 && i < 24 && j > 0 && j < 19 && Math.floor(Crafty.math.randomNumber(0, 50)) > 48) {
					flower= Crafty.e("2D, DOM, flower, SpriteAnimation")
						flower.attr({x: i * 16, y: j * 16})
						flower.reel("wind", 0, 3, 1, 3)
						flower.bind("enterframe", function() {
								flower.animate("wind", 80);
						});
				}
			}
		}

		//create the bushes along the x-axis which will form the boundaries
		for(var i = 0; i < 25; i++) {
			Crafty.e("2D, Canvas, wall_top, bush" + Math.floor(Crafty.math.randomNumber(1, 2)))
				.attr({x: i * 16, y: 0, z: 2});
			Crafty.e("2D, DOM, wall_bottom, bush"+Math.floor(Crafty.math.randomNumber(1, 2)))
				.attr({x: i * 16, y: 304, z: 2});
		}

		//create the bushes along the y-axis
		//we need to start one more and one less to not overlap the previous bushes
		for(var i = 1; i < 19; i++) {
			Crafty.e("2D, DOM, wall_left, bush"+Math.floor(Crafty.math.randomNumber(1,2)))
				.attr({x: 0, y: i * 16, z: 2});
			Crafty.e("2D, Canvas, wall_right, bush"+Math.floor(Crafty.math.randomNumber(1,2)))
				.attr({x: 384, y: i * 16, z: 2});
		}
	}

	//the loading screen that will display while our assets load
	Crafty.scene("loading", function() {
		//load takes an array of assets and a callback when complete
		Crafty.load(["sprite.png"], function() {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});

		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({w: 100, h: 20, x: 150, y: 120})
			.text("Loading...")
			.css({"text-align": "center"});
	});

	//automatically play the loading scene
	Crafty.scene("loading");

	Crafty.scene("main", function() {
		generateWorld();

		Crafty.c('CustomControls', {
			__move: {left: false, right: false, up: false, down: false},
			_speed: 3,

			CustomControls: function(speed) {
				if(speed) this._speed = speed;
				var move = this.__move;

				this.bind('enterframe', function() {
					//move the player in a direction depending on the booleans
					//only move the player in one direction at a time (up/down/left/right)
					if(this.isDown("RIGHT_ARROW")) this.x += this._speed;
					else if(this.isDown("LEFT_ARROW")) this.x -= this._speed;
					else if(this.isDown("UP_ARROW")) this.y -= this._speed;
					else if(this.isDown("DOWN_ARROW")) this.y += this._speed;
				});

				return this;
			}
		});


		//create our player entity with some premade components
		player = Crafty.e("2D, DOM, SpriteAnimation, PlayerSprite");
			player.attr({x: 160, y: 144, z: 1});
			// Crafty.e("2D, DOM, SpriteAnimation, PlayerSprite").reel('PlayerRunning', DURATION_MS, fromX, fromY, frameCount/of row);
			player.reel("walkLeft", 20, 6, 3, 3);
			player.reel("walkRight", 20, 9, 3, 3);
			player.reel("walkUp", 20, 3, 3, 3);
			player.reel("walkDown", 20, 0, 3, 3);

  		player.bind('KeyDown', function(e) {
  			if(e.key == Crafty.keys.LEFT_ARROW) {
					player.x = player.x-4;
					player.animate("walkLeft", 5);
    		} else if (e.key == Crafty.keys.RIGHT_ARROW) {
    		  player.x = player.x+4;
    		  player.animate("walkRight", 5);
    		} else if (e.key == Crafty.keys.UP_ARROW) {
    		  player.y = player.y-4;
    		  player.animate("walkUp", 5);
    		} else if (e.key == Crafty.keys.DOWN_ARROW) {
    		  player.y = player.y+4;
    		  player.animate("walkDown", 5);
    		}
    		// if(e.key == Crafty.keys.LEFT_ARROW) {
    		//   if(!this.isPlaying("walk_left"))
						// this.stop().animate("walk_left", 10);
    		// } else if (e.key == Crafty.keys.RIGHT_ARROW) {
    		//   if(!this.isPlaying("walk_right"))
						// this.stop().animate("walk_right", 10);
    		// } else if (e.key == Crafty.keys.UP_ARROW) {
    		//   if(!this.isPlaying("walk_up"))
						// this.stop().animate("walk_up", 10);
   		 //  } else if (e.key == Crafty.keys.DOWN_ARROW) {
    		//   if(!this.isPlaying("walk_down"))
						// this.stop().animate("walk_down", 10);
    		// }
    	return this.reelPosition(0);
  });

			})
			// .collision()
			// .onHit("wall_left", function() {
			// 	this.x += this._speed;
			// 	this.stop();
			// }).onHit("wall_right", function() {
			// 	this.x -= this._speed;
			// 	this.stop();
			// }).onHit("wall_bottom", function() {
			// 	this.y -= this._speed;
			// 	this.stop();
			// }).onHit("wall_top", function() {
			// 	this.y += this._speed;
			// 	this.stop();
			// });
	Crafty.scene("main");
};
