(function(){
	angular.module('app').config(config);

	config.$inject = ["$routeProvider"];
	function config($routeProvider){
		$routeProvider
		.when('/:probLink',{
			templateUrl: '/js/app/prob/prob.html',
			controller: 'ProbController',
			controllerAs: 'vm'
		})
		.when('/',{
			templateUrl: '/js/app/index.html',
			controller: 'ListController',
			controllerAs: 'vm'
		});
	}
}());