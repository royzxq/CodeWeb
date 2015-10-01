
angular.module('app', ["ngRoute","ngDialog","xeditable"])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.otherwise({redirectTo: "/"});
	}]);

