
angular.module('app', ["ngRoute","ngDialog"])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.otherwise({redirectTo: "/"});
	}]);