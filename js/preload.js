var Preload = function(game){};

Preload.prototype = {

	preload: function(){
	    this.game.load.image('blue', 'assets/app academy.png');
	    this.game.load.image('green', 'assets/dev bootcamp.png');
	    this.game.load.image('red', 'assets/maker school.png');
	    this.game.load.image('yellow', 'assets/hack reactor.png');
	    this.game.load.spritesheet('coinflip', 'assets/coinflip.png', 128, 128);
	    this.game.load.audio('chaching', ['assets/chaching.mp3', 'assets/chaching.ogg']);
	    this.game.load.audio('bgm', 'assets/money.mp3');
      this.game.load.image("gametitle", "assets/sprites/gametitle.png");
      this.game.load.image("gridedition", "assets/sprites/gridedition.png");
      this.game.load.image("playbutton", "assets/sprites/playbutton.png");
      this.game.load.image("menubutton", "assets/sprites/menubutton.png");
      this.game.load.image("resetgame", "assets/sprites/resetgame.png");
      this.game.load.image("thankyou", "assets/sprites/thankyou.png");
	},

	create: function(){
		this.game.state.start("GameTitle");
	}
};
