(function(){
	angular.module('app').config(config);

	config.$inject = ["$routeProvider"];
	function config($routeProvider){
		$routeProvider
		.when('/',{
			templateUrl: '/js/app/index.html',
			controller: 'ListController',
			controllerAs: 'vm'
		});
	}
}());