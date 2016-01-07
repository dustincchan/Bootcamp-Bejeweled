var Main = function(game){

};

Main.prototype = {

	create: function() {
		var me = this;
		me.game.stage.backgroundColor = "34495f";
		me.tileTypes = ['blue', 'green', 'red', 'yellow'];
		me.score = 0;
		me.activeTile1 = null;
		me.activeTile2 = null;
		me.canMove = false;
		me.tileWidth = me.game.cache.getImage('blue').width;
		me.tileHeight = me.game.cache.getImage('blue').height;
		me.tiles = me.game.add.group();

		me.tileGrid = [
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null],
        [null, null, null, null, null, null]
    ];

    var seed = Date.now();
    me.random = new Phaser.RandomDataGenerator([seed]);
    	
  },

	update: function() {

	},

	gameOver: function(){
		this.game.state.start('GameOver');
	}

};
