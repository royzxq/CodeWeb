
(function () {
	angular.module('app').controller('ListController', ListController);
	ListController.$inject = ['$http', '$location','$window'];

	function ListController($http, $location,$window){
		var vm = this;
		$http.get('/js/items.json')
		.then(function(response){
			vm.probList = response.data;
		});
		
		vm.goto = function(url){
			console.log(url);
			$window.location.href=url;
		}
	}
}());