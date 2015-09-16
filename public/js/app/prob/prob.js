(function(){
	angular.module('app').controller('ProbController', ProbController);

	ProbController.$inject = ['$routeParams','$location'];

	function ProbController($routeParams,$location){
		return $location.url($routeParams.probLink);
	}
}());