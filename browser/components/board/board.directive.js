app.directive('board', function($document) {
	return {
		restrict: 'E',
		templateUrl: '/components/board/board.html',
		controller: 'BoardCtrl',
		link: function(scope, element, attrs) {
			$document.bind('keydown', 
				function(e) {
				if (e.which == 37) {
					scope.move('left');
					e.preventDefault();
				}
				else if (e.which == 38) {
					scope.move('up');
					e.preventDefault();
				}
				else if (e.which == 39) {
					scope.move('right');
					e.preventDefault();
				}
				else if (e.which == 40) {
					scope.move('down');
					e.preventDefault();
				}
			});
		}
	}
});