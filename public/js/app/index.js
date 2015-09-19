
(function () {
	'use strict';
	angular.module('app').controller('ListController', ListController);
	ListController.$inject = ['$http','$window','ngDialog','$scope'];

	function ListController($http,$window,ngDialog,$scope){
		var vm = this;
		$http.get('/probs')
		.then(function(response){
			vm.probList = response.data;
		})
		
		vm.goto = function(url){
			console.log(url);
			$window.location.href=url;
		}
		
		// vm.getContent = function(title){
		// 	$location.url('/:title');
		// }
		
		vm.selectProb = function(prob){
			vm.prob = prob;
			ngDialog.open({
				template:'probContent.html',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		}
		
		vm.cancel = function(){
			ngDialog.close();
		};
	}
}());