app.factory('ScoreFactory', function($http) {
	return {
		score: 0,
		highestPower: 2,

		addRecord: function(record) {
			return $http.post('/api/records/', record)
			.then(function(response) {
				return response.data;
			})
		},

		getRecords: function() {
			return $http.get('/api/records/')
			.then(function(response) {
				return response.data;
			})
		},

		getRecordsByName: function(name) {
			return $http.get('/api/records/'+name)
			.then(function(response) {
				return response.data;
			})
		},
	};
});