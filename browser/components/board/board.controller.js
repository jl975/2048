app.controller('BoardCtrl', ['$scope', '$compile', 'ScoreFactory', function($scope, $compile, ScoreFactory) {

	var cols = 4, rows = 4;

	var initialTiles = 2;
	var alive = true;

	$scope.cols = [];
	$scope.rows = [];
	for (var i=0; i<cols; i++) $scope.cols.push(i);
	for (var i=0; i<rows; i++) $scope.rows.push(i);

	var edges = [];
	for (var i=0; i<cols; i++) {
		for (var j=0; j<rows; j++) {
			if (i==0 || j==0 || i==cols-1 || j==rows-1) edges.push([i,j]);
		}
	}

	$scope.setup = function() {
		clearBoard();
		alive = true;
		var unoccupiedEdges = edges.slice();
		for (var i=0; i<initialTiles; i++) {
			var rn = Math.floor(Math.random() * unoccupiedEdges.length);
			$scope.addTile(getCoords(unoccupiedEdges.splice(rn,1)[0]), 2);
		}
	};

	function getCoords() {
		var i,j;
		if (arguments.length==1 && Array.isArray(arguments[0])) {
			i = arguments[0][0], j = arguments[0][1];
		}
		else if (arguments.length==2) {
			i = arguments[0], j = arguments[1];
		}
		return angular.element('#'+i+'-'+j);
	}

	function getTileAtCoords() {
		return getCoords.apply(null, arguments).find('tile');
	}

	// adds a tile of a specified value to a given cell dom element
	$scope.addTile = function(cell, value) {
		cell.find('tile').remove();
		var newTile = $compile('<tile style="display:none;"></tile>')($scope);
		cell.append(newTile).find('div').append('<span class="numtext">'+value+'</span>').addClass('num-'+value);
		cell.find('tile').show('fast', 'swing');
	};

	function getIdFromCoords(i, j) {
		return '#'+i+'-'+j;
	}

	function getTileFromId(id) {
		var coords = /\#(\d+)\-(\d+)/.exec(id);
		return getTileAtCoords(coords[1], coords[2]);
	}

	$scope.move = function(dir) {
		if (!alive) return;
		var moved = new Promise(function(resolve, reject) {
			var nextStep = {};
			if (dir == 'left' || dir == 'up') {
				for (var i=0; i<cols; i++) {
					for (var j=0; j<rows; j++) {
						if (getTileAtCoords(i,j).length) dir == 'left' ? calcNextSteps(-1,0) : calcNextSteps(0,-1);
					}
				}
			}
			else if (dir == 'right' || dir == 'down') {
				for (var i=cols-1; i>=0; i--) {
					for (var j=rows-1; j>=0; j--) {
						if (getTileAtCoords(i,j).length) dir == 'right' ? calcNextSteps(1,0) : calcNextSteps(0,1);
 					}
				}
			}

			function calcNextSteps(colInc, rowInc) {
				var newCol = i, newRow = j;
				var key = '#'+i+'-'+j;
				var currentValue = getValue($(key).find('tile'));
				if (!isOnBoard(i+colInc, j+rowInc)) nextStep[key] = [key, currentValue, 'stationary'];
				else {
					while (isOnBoard(newCol+colInc, newRow+rowInc) && !nextStep[getIdFromCoords(newCol+colInc, newRow+rowInc)]) {
						newCol += colInc;
						newRow += rowInc;
					}
					// if tile ends up next to another tile of the same value,
					// merge with that tile and double the tile's value
					var existingTile = nextStep[getIdFromCoords(newCol+colInc, newRow+rowInc)];
					if (existingTile && existingTile[2] != 'removed') {

						if (existingTile[2] != 'doubled' && getValue(getTileAtCoords(newCol+colInc,newRow+rowInc))==getValue(getTileAtCoords(i,j))) {
							existingTile[2] = 'removed';
							var points = parseInt(currentValue)*2;
							ScoreFactory.score += points;
							if (points > ScoreFactory.highestPower) ScoreFactory.highestPower = points;
							nextStep[key] = [existingTile[0], String(points), 'doubled'];
						}
						else {
							var existingTileFate = /\#(\d+)\-(\d+)/.exec(existingTile[0]);
							nextStep[key] = [getIdFromCoords(existingTileFate[1]-colInc, existingTileFate[2]-rowInc), currentValue, 'moved'];
						}
					}
					else {
						nextStep[key] = [getIdFromCoords(newCol, newRow), currentValue, 'moved'];
					}
					if (key == nextStep[key][0]) nextStep[key][2] = 'stationary';
				}
			}

			if (Object.keys(nextStep)
				.map(function(key) {return nextStep[key]})
				.every(function(value) {return value[2]=='stationary'})) return;


			// jquery animation stuff reliant on dom manipulation, cannot use angular QQ
			$('tile').each(function() {
				var coordsId = $(this).parent()[0].id;
				var col = parseInt(coordsId.split('-')[0]), row = parseInt(coordsId.split('-')[1]);

				var fate = nextStep['#'+col+'-'+row];
				var $destinationCell = $(fate[0]), newValue = fate[1], newState = fate[2];

				if (newState != 'stationary') {
					$(this).css({position: 'relative'})
					.animate({
						top: $destinationCell.offset().top - $(this).offset().top,
						left: $destinationCell.offset().left - $(this).offset().left,
					}, {
						complete: function() {
							if (newState == 'removed') $(this).remove();
							else {
								$destinationCell.find('tile').remove();
								$destinationCell.append($(this));
								$(this).css({position:'', left:'', top:''});
								$(this).find('div').removeClass('num-'+(newValue/2)).addClass('num-'+newValue);
								$(this).find('.numtext').addClass('digit'+(String(newValue).length)).text(newValue);
								$scope.$digest();	// apparently this is required to update the score
							}
							resolve();
						},
						duration: 200
					});
				}
			});
		});

		moved.then(function() {
			addRandomTile();
			if (!legalMovesRemaining()) setTimeout(gameOver, 300);
		});

	};


	function clearBoard() {
		$('tile').each(function() {$(this).remove()});
		ScoreFactory.score = 0;
	}
	function isOnBoard(i,j) {
		return i>=0 && j>=0 && i<cols && j<rows;
	}
	function getUnoccupiedCells() {
		var cells = [];
		for (var i=0; i<cols; i++) {
			for (var j=0; j<rows; j++) {
				if (!getTileAtCoords(i,j).length) cells.push([i,j]);
			}
		}
		return cells;
	}
	function addRandomTile() {
		var emptyCells = getUnoccupiedCells();
		var rn = Math.floor(Math.random() * emptyCells.length);
		var num = (Math.random()<.75) ? 2 : 4;
		if (num == 4 && ScoreFactory.highestPower == 2) ScoreFactory.highestPower = 4;
		$scope.addTile(getCoords(emptyCells[rn]), num);
	}
	function getValue(tile) {
		return tile.find('.numtext').text();
	}

	function legalMovesRemaining() {
		if (getUnoccupiedCells().length) return true;
		for (var i=0; i<cols; i++) {
			for (var j=0; j<rows; j++) {
				var dirs = [[1,0],[-1,0],[0,1],[0,-1]];
				for (var k=0; k<dirs.length; k++) {
					var adjTile = getTileAtCoords(i+dirs[k][0], j+dirs[k][1]);
					if (adjTile.length && getValue(adjTile) == getValue(getTileAtCoords(i,j)))
						return true;
				}
			}
		}
		return false;
	}

	function gameOver() {
		var name = prompt('Game over! Your score is ' + ScoreFactory.score +'.\nName: ');
		alive = false;
		$scope.saveRecord(name || '');
	}

	$scope.keyBindings = function(e) {
		if (e.which == 37) {
			scope.move('left');
			e.preventDefault();
			$(document).unbind();
		}
		else if (e.which == 38) {
			scope.move('up');
			e.preventDefault();
			$(document).unbind();
		}
		else if (e.which == 39) {
			scope.move('right');
			e.preventDefault();
			$(document).unbind();
		}
		else if (e.which == 40) {
			scope.move('down');
			e.preventDefault();
			$(document).unbind();
		}
	}

	$scope.saveRecord = function(name) {
		ScoreFactory.addRecord({
			name: name,
			highest: Number(ScoreFactory.highestPower),
			score: Number(ScoreFactory.score)
		})
		.then(function() {

		});
	}

}]);




