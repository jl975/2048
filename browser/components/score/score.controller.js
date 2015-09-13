app.controller('ScoreCtrl', ['$scope', 'ScoreFactory', function($scope, ScoreFactory) {
	$scope.score = ScoreFactory;

	$scope.saveRecord = function() {
		ScoreFactory.addRecord($scope.score.score, $scope.score.highestPower)
		.then(function() {
			
		})
	};

}])