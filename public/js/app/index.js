
(function () {
	'use strict';

	angular.module('app').controller('ListController', ListController);
	ListController.$inject = ['$http','$window','ngDialog','$scope','$sce'];

	

	function chunk(arr, size){
		var newArr = [];
		if (size === 0) {
			size = arr.length;
		}
		for (var i = 0; i < arr.length; i+=size) {
			newArr.push(arr.slice(i, i+size));
		}
		return newArr;
	}
	function ListController($http,$window,ngDialog,$scope,$sce){
		var vm = this;
		vm.page = 0;
		vm.select = 50;
		vm.options = [10,50,100,200];
		vm.predicate = 'title';
		vm.reverse = false;
		vm.note = "";

		$http.get('/probs')
		.then(function(response){
			vm.data = response.data;
			vm.probListArray =  chunk(vm.data, parseInt(vm.select));
			vm.probList = vm.probListArray[vm.page];
		})

		$http.get('/users/getUser')
		.then(function(response){
			// console.log(response.data);
			vm.user = response.data;
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
			vm.prob.contents = []
			for (var i = 0 ; i < vm.prob.content.length; i++){
				vm.prob.contents[i] = $sce.trustAsHtml(vm.prob.content[i])
				// vm.des.push(tmp)
			}
			// vm.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml(vm.prob.content)
			ngDialog.open({
				template:'probContent.html',
				className: 'ngdialog-theme-default',
				scope: $scope
			});
		}
		vm.cancel = function(){
			ngDialog.close();
		};
		
		vm.order = function(predicate){
			vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
			vm.predicate = predicate;
		}

		vm.goNextPage = function(){
			vm.page += 1;
			vm.page = vm.page % vm.probListArray.length;
			vm.probList = vm.probListArray[vm.page];
		}

		vm.goPreviousPage = function(){
			vm.page -= 1;
			vm.page = vm.page % vm.probListArray.length;
			if(vm.page < 0){
				vm.page += vm.probListArray.length;
			}
			vm.probList = vm.probListArray[vm.page];
		}

		vm.rePage = function(){
			
			vm.probListArray =  chunk(vm.data, parseInt(vm.select));
			vm.probList = vm.probListArray[vm.page];

		}

		vm.marked = function(){
			vm.user.questions[vm.prob.title].status = !vm.user.questions[vm.prob.title].status;
			$http.post('/users/mark',{user: vm.user, prob: vm.user.questions}).then(function(err){
			});
		}
		
		$scope.$watch("vm.note",function(newVal, oldVal){
			if (newVal !== oldVal) {
				// console.log(newVal);
				vm.user.questions[vm.prob.title].note = newVal;
				$http.post('/users/mark',{user: vm.user, prob: vm.user.questions}).then(function(err){
				});
			}
		});
	}
}());