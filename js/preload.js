var Preload = function(game){};

Preload.prototype = {

	preload: function(){
	    this.game.load.image('blue', 'assets/gemBlue.png');
	    this.game.load.image('green', 'assets/gemGreen.png');
	    this.game.load.image('red', 'assets/gemRed.png');
	    this.game.load.image('yellow', 'assets/gemYellow.png');
	    this.game.load.spritesheet('explosions', 'assets/atomic explosion.png', 96, 96);
	},

	create: function(){
		this.game.state.start("Main");
	}
};
