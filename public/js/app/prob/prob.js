(function(){
	angular.module('app').controller('ProbController', ProbController);

	ProbController.$inject = ['$routeParams','$http'];

	function ProbController($routeParams){
		vm = this;
	}
}());