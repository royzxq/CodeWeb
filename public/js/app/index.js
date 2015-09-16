
(function () {
	angular.module('app').controller('ListController', ListController);
	ListController.$inject = ['$http'];

	function ListController($http){
		var vm = this;
		console.log(__dirname);
		$http.get('/js/items.json')
		.then(function(response){
			vm.probList = response.data;
		});
	}
}());