var app = angular.module('Game', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider, $httpProvider) {
  // remove '#' from urls
	$locationProvider.html5Mode(true);
  // invalid routes redirect to the root
	$urlRouterProvider.otherwise('/');
  // strip trailing slash off all $http requests (except for '/')
  var trailingSlash = /.\/$/;
  $httpProvider.interceptors.push(function(){
    return {
     request: function(config) {
      if (trailingSlash.test(config.url)) config.url = config.url.slice(0, -1);
      return config;
     }
    };
  });
});

