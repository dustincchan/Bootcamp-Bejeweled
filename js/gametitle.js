var GameTitle = function(game){};

GameTitle.prototype = {

	create: function(){

		this.game.stage.backgroundColor = "#333"
		var title = game.add.sprite(game.width / 2, 60, "gametitle");
		title.anchor.set(0.5); 
		var grid = game.add.sprite(game.width / 2, 130, "gridedition");
		grid.anchor.set(0.5);
		var playButton = game.add.button(game.width / 2, game.height / 2, "playbutton", function(){this.startGame()}.bind(this));
		playButton.anchor.set(0.5);
	},

	startGame: function(){
		this.game.state.start("Main");
	}

}