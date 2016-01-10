var Preload = function(game){};

Preload.prototype = {

	preload: function(){
	    this.game.load.image('blue', 'assets/app academy.png');
	    this.game.load.image('green', 'assets/dev bootcamp.png');
	    this.game.load.image('red', 'assets/maker school.png');
	    this.game.load.image('yellow', 'assets/hack reactor.png');
	    this.game.load.spritesheet('explosions', 'assets/atomic explosion.png', 96, 96);
	    this.game.load.spritesheet('coinflip', 'assets/coinflip.png', 128, 128);
	    this.game.load.audio('chaching', ['assets/chaching.mp3', 'assets/chaching.ogg']);
	},

	create: function(){
		this.game.state.start("Main");
	}
};
