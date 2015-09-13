app.controller('ScoreboardCtrl', function($scope, records, ScoreFactory) {

	var numScores = 10;

	function sortByScore() {
		records.sort(function(a,b) {
			return Number(b.score || 0) - Number(a.score || 0);
		})
	}

	$scope.retrieveRecords = function() {
		var output = [];
		for (var i=0; i<numScores; i++) {
			if (records[i]) output.push(records[i]);
		}
		return output;
	}

	sortByScore();
})