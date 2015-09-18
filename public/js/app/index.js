
(function () {
	'use strict';
	angular.module('app').controller('ListController', ListController);
	ListController.$inject = ['$http','$window','ngDialog','$scope'];

	function ListController($http,$window,ngDialog,$scope){
		var vm = this;
		$http.get('/js/leetcode.json')
		.then(function(leet){
			$http.get('/js/lintcode.json').then(function(lint){
				angular.merge(lint.data,leet.data);
				vm.probList = lint.data;
				console.log(vm.probList.length);
			})
			
		});
		
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