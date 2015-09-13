app.config(function($stateProvider) {
	$stateProvider.state('scoreboard', {
		url: '/records',
		templateUrl: '/components/score/scoreboard.html',
		controller: 'ScoreboardCtrl',
		resolve: {
			records: function(ScoreFactory) {
				return ScoreFactory.getRecords();
			}
		}
	})
})