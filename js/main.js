var Main = function(game){

};

Main.prototype = {

	create: function() {
		var me = this;
		me.game.stage.backgroundColor = "#FFFFFF";
		me.tileTypes = ['blue', 'green', 'red', 'yellow'];
		me.chaching = me.game.add.audio('chaching');
		me.chaching.allowMultiple = true;
		me.score = 0;
		me.activeTile1 = null;
		me.activeTile2 = null;
		me.canMove = false;
		me.tileWidth = me.game.cache.getImage('blue').width/2;
		me.tileHeight = me.game.cache.getImage('blue').height/2;
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
    me.createScore();
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
				if((Math.abs(difY) === 1 && difX === 0) || (Math.abs(difX) === 1 && difY === 0)) {
					me.canMove = false;
					me.activeTile2 = me.tileGrid[hoverPosX][hoverPosY];
					me.swapTiles();
					me.game.time.events.add(500, function () {
						me.checkMatch();
					});
				}
			}
		}
	},

  initTiles: function () {
  	var me = this;
  	for (var i = 0; i < me.tileGrid.length; i++) {
  		for (var j = 0; j < me.tileGrid.length; j++) {
  			var tile = me.addTile(i, j);
  			me.tileGrid[i][j] = tile;
  		}
  	}

  	me.game.time.events.add(600, function () {
  		me.checkMatch();
  	});
  },

	addTile: function(x, y){
	 
	    var me = this;	 
	    //Randomly selects each tile before adding them to the grid
	    var tileToAdd = me.tileTypes[me.random.integerInRange(0, me.tileTypes.length - 1)]; 

	 		//Drops at the correct x position but initializes at the top of the screen
	    var tile = me.tiles.create((x * me.tileWidth) + me.tileWidth / 2, 0, tileToAdd);
	    tile.scale.setTo(0.5, 0.5);
	 		
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

	//Resets active tiles
	tileUp: function () {
		var me = this;
		me.activeTile1 = null;
		me.activeTile2 = null;
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

	checkMatch: function () {
		var me = this;
		var matches = me.getMatches(me.tileGrid);

		if (matches.length > 0) {
			me.removeTileGroup(matches);
			me.resetTile();
			me.fillTile();
			me.game.time.events.add(500, function () {
				me.tileUp();
			});
			me.game.time.events.add(600, function () {
				me.checkMatch();
			});
		}	else {
			//Else no match on tile swap, so the tiles animate to reset their position
			me.swapTiles();
			me.game.time.events.add(500, function (){
				me.tileUp();
				me.canMove = true;
			});
		}
	},


	getMatches: function (tileGrid) {
		var matches = [];
		var groups = [];

		for (var i = 0; i < tileGrid.length; i++) {
			var tempArr = tileGrid[i];
			groups = [];
			for (var j = 0; j < tempArr.length; j++) {
				if (j < tempArr.length - 2)
					if (tileGrid[i][j] && tileGrid[i][j + 1] && tileGrid[i][j + 2]) {

						//Finds a horizontal match
          	if (tileGrid[i][j].tileType === tileGrid[i][j+1].tileType && tileGrid[i][j+1].tileType === tileGrid[i][j+2].tileType) {
          		if (groups.length > 0) {
          			if (groups.indexOf(tileGrid[i][j]) === -1) {
          				matches.push(groups);
          				groups = [];
          			}
          		}
          		if (groups.indexOf(tileGrid[i][j]) === -1) {
          			groups.push(tileGrid[i][j]);
          		}
          		if (groups.indexOf(tileGrid[i][j+1]) === -1) {
          			groups.push(tileGrid[i][j+1]);
          		}
          		if (groups.indexOf(tileGrid[i][j+2]) === -1) {
          			groups.push(tileGrid[i][j+2]);
          		}
          	}
					}
			}
			if (groups.length > 0) matches.push(groups);
		}

		//Now for vertical matches
		for (var l = 0; l < tileGrid.length; l++) {
			var tempArr = tileGrid[l];
			groups = [];
			//Iterate through each gem in a column
			for (var k = 0; k < tempArr.length; k++) {
				if (k < tempArr.length - 2) 
					if (tileGrid[k][l] && tileGrid[k+1][l] && tileGrid[k+2][l]) {
						if (tileGrid[k][l].tileType === tileGrid[k+1][l].tileType && tileGrid[k+1][l].tileType === tileGrid[k+2][l].tileType) {
							if (groups.length > 0) {
								if (groups.indexOf(tileGrid[k][l]) === -1) {
									matches.push(groups);
									groups = [];
								}
							}
							if (groups.indexOf(tileGrid[k][l]) === -1) {
								groups.push(tileGrid[k][l]);
							}
							if (groups.indexOf(tileGrid[k+1][l]) === -1) {
								groups.push(tileGrid[k+1][l]);
							}
							if (groups.indexOf(tileGrid[k+2][l]) === -1) {
								groups.push(tileGrid[k+2][l]);
							}
						}
					}
			}
			if (groups.length > 0) matches.push(groups);
		}
		return matches;
	},

	removeTileGroup: function (matches) {
		var me = this;
		me.chaching.play();
		for (var i = 0; i < matches.length; i++) {
			var tempArr = matches[i];

			for (var j = 0; j < tempArr.length; j++) {
				var tile = tempArr[j];
				var tilePos = me.getTilePos(me.tileGrid, tile);

				// me.explosion = me.game.add.sprite(tilePos.x * me.tileWidth, tilePos.y * me.tileWidth, 'explosions');
				// me.explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 15, false);
				// me.explosion.animations.play('explode', 25, false, true);

				me.coinflip = me.game.add.sprite(tilePos.x * me.tileWidth - 20, tilePos.y * me.tileWidth - 20, 'coinflip');
				me.coinflip.animations.add('coinflip', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 24, false);
				me.coinflip.animations.play('coinflip', 65, false, true);

				me.tiles.remove(tile);
				me.incrementScore();

				if (tilePos.x != -1 && tilePos.y != -1) {
					me.tileGrid[tilePos.x][tilePos.y] = null;
				}
			}
		}
	},

	getTilePos: function (tileGrid, tile) {
		var me = this;
		var pos = {x: -1, y: -1};

		for (var i = 0; i < tileGrid.length; i++) {
			for (var j = 0; j < tileGrid[i].length; j++) {
				if (tile === tileGrid[i][j]) {
					pos.x = i;
					pos.y = j;
					break;
				}
			}
		}
		return pos;
	},

	debugMatches: function (matches) {
		var currentMatch;
		var translatedGrid = [];
		var temp = [];
		for (var i = 0; i < matches.length; i++) {
			currentMatch = matches[i];
			for (var j = 0; j < currentMatch.length; j++) {
				temp.push(this.getTilePos(matches[i][j]));
			}
			translatedGrid.push(temp);
			temp = [];
		}
		return translatedGrid;
	},

	debugTileGrid: function () {
		var tempGrid = [];
		this.tileGrid.forEach(function (tile) {
			var tempRow = [];
			tile.forEach(function (gem) {
				if (gem === null) {
					tempRow.push(" ")
				} else {
					tempRow.push(gem.key);
				}
			})
			tempGrid.push(tempRow);
			tempRow = [];
		})
		return tempGrid;
	},

	resetTile: function () {	
		var me = this;
		for (var i = 0; i < me.tileGrid.length; i++) {
			for (var j = me.tileGrid[i].length - 1; j > 0; j--) {

				//Fills a space if the one above it is not empty
				if(me.tileGrid[i][j] === null && me.tileGrid[i][j-1] != null) {
					var tempTile = me.tileGrid[i][j-1];
					me.tileGrid[i][j] = tempTile;
					me.tileGrid[i][j-1] = null;

					//Animation of tile dropping down
          me.game.add.tween(tempTile).to({y:(me.tileHeight*j)+(me.tileHeight/2)}, 700, Phaser.Easing.Linear.In, true);
          j = me.tileGrid[i].length;
				}
			}
		}
	},
	//Iterates through grid to find blank spaces and then adds new tiles within them
	fillTile: function () {
		var me = this;
		for (var i = 0; i < me.tileGrid.length; i++) {
			for (var j = 0; j < me.tileGrid.length; j++) {
				if (me.tileGrid[i][j] === null) {
					var tile = me.addTile(i, j);
					me.tileGrid[i][j] = tile;
				}
			}
		}
	},

	createScore: function(){
    var me = this;
    var scoreFont = "70px Helvetica";
 		
    me.scoreLabel = me.game.add.text((Math.floor(me.tileGrid[0].length / 2) * me.tileWidth), me.tileGrid.length * me.tileHeight, "Your debt: $0", {font: scoreFont, fill: "#333"}); 
    me.scoreLabel.anchor.setTo(0.5, 0);
    me.scoreLabel.align = 'center';
	},
	 
	incrementScore: function(){
	    var me = this;
	    me.score += 100;   
	    me.scoreLabel.text = "Your debt: $" + me.score;      
	},
};

