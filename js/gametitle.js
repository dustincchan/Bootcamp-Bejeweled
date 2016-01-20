var GameTitle = function(game){};

GameTitle.prototype = {

	create: function(){
		this.game.stage.backgroundColor = "#333"
		var title = game.add.sprite(game.width / 2, 60, "gametitle");
		title.scale.setTo(0.8, 0.8);
		title.anchor.set(0.5); 
		var grid = game.add.sprite(game.width / 2, 130, "gridedition");
		grid.scale.setTo(0.5, 0.5);
		grid.anchor.set(0.5);
		var playButton = game.add.button(game.width / 2, game.height / 2 + 50, "playbutton", function(){this.startGame()}.bind(this));
		playButton.anchor.set(0.5);

		var style = { font: "20px Arial", fill: "#ffffff", align: "center" };
		var text = game.add.text(game.world.centerX, game.height - 50, "(Click and drag to swap and match logos)", style);
		text.anchor.set(0.5);

	},

	startGame: function(){
		this.game.state.start("Main");
	}

}