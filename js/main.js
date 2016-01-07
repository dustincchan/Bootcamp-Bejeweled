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
    me.initTiles();
  },

  initTiles: function () {
  	for (var i = 0; i < me.tileGrid.length; i++) {
  		for (var j = 0; j < me.tileGrid.length; j++) {
  			var tile = me.addTile(i, j);
  			me.tileGrid[i][j] = tile;
  		}
  	}
  },

	addTile: function(x, y){
	 
	    var me = this;	 
	    var tileToAdd = me.tileTypes[me.random.integerInRange(0, me.tileTypes.length - 1)]; 
	 
	    var tile = me.tiles.create((x * me.tileWidth) + me.tileWidth / 2, 0, tileToAdd);
	 
	    me.game.add.tween(tile).to({y:y*me.tileHeight+(me.tileHeight/2)}, 500, Phaser.Easing.Linear.In, true)
	 
	    tile.anchor.setTo(0.5, 0.5);
	 
	    tile.inputEnabled = true;
	 
	    tile.tileType = tileToAdd;
	 
	    tile.events.onInputDown.add(me.tileDown, me);
	 
	    return tile;
	 
	},

	tileDown: function (tile, pointer) {
		var me = this;
		if (me.canMove) {
			me.activeTile1 = tile;
			me.startPosX = (tile.x - me.tileWidth/2) / me.tileWidth;
			me.startPosY = (tile.y - me.tileWidth/2) / me.tileHeight;
		}
	},

	update: function() {
		var me = this;

		if (me.activeTile1 && !me.activeTile2) {
			var hoverX = me.game.input.x;
			var hoverY = me.game.input.y;

			var hoverPosX = Math.floor(hoverX/me.tileWidth);
			var hoverPosY = Math.floor(hoverY/me.tileHeight);

			var difX = (hoverPosX - me.startPosX);
			var difY = (hoverPosY - me.startPosY);

			if(!(hoverPosY > me.tileGrid[0].length - 1 || hoverPosY < 0) && !(hoverPosX > me.tileGrid.length - 1 || hoverPosX < 0)) {
				if((Math.abs(difY) == 1 && difX == 0) || (Math.abs(difX) == 1 && difY == 0)) {
					me.canMove = false;
					me.activeTile2 = me.tileGrid[hoverPosX][hoverPosY];
					me.swapTiles();
					me.game.time.events.add(500, function () {
						me.checkMath();
					});
				}
			}
		}
	},

	swapTiles: function(){
	 
	    var me = this;
	 
	    if(me.activeTile1 && me.activeTile2){
	 
	        var tile1Pos = {x:(me.activeTile1.x - me.tileWidth / 2) / me.tileWidth, y:(me.activeTile1.y - me.tileHeight / 2) / me.tileHeight};
	        var tile2Pos = {x:(me.activeTile2.x - me.tileWidth / 2) / me.tileWidth, y:(me.activeTile2.y - me.tileHeight / 2) / me.tileHeight};
	 
	        me.tileGrid[tile1Pos.x][tile1Pos.y] = me.activeTile2;
	        me.tileGrid[tile2Pos.x][tile2Pos.y] = me.activeTile1;
	 
	        me.game.add.tween(me.activeTile1).to({x:tile2Pos.x * me.tileWidth + (me.tileWidth/2), y:tile2Pos.y * me.tileHeight + (me.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);
	        me.game.add.tween(me.activeTile2).to({x:tile1Pos.x * me.tileWidth + (me.tileWidth/2), y:tile1Pos.y * me.tileHeight + (me.tileHeight/2)}, 200, Phaser.Easing.Linear.In, true);
	 
	        me.activeTile1 = me.tileGrid[tile1Pos.x][tile1Pos.y];
	        me.activeTile2 = me.tileGrid[tile2Pos.x][tile2Pos.y];
	 
	    }
	 
	},
