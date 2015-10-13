
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
		vm.tag = false;
		vm.related = false;
		vm.showTags = true;

		vm.tagSet = {};
		vm.tagContent = {};
		vm.sortedTags = [];
		vm.selectTags = [];

		$http.get('/probs')
			.then(function(response){
				vm.data = response.data;
				if (Object.keys(vm.tagSet).length === 0) {
					for (var i = 0; i < vm.data.length; i++) {
						for(var j = 0; j < vm.data[i].tags.length; j++){
							if(vm.data[i].tags[j] in vm.tagSet){
								vm.tagSet[vm.data[i].tags[j]] += 1;
							}
							else{
								vm.tagSet[vm.data[i].tags[j]] = 1;
								vm.tagContent[vm.data[i].tags[j]] = [];
							}
						}
					}
					delete vm.tagSet['LintCode Copyright'];
					for(var tag in vm.tagSet){
						for(var i = 0 ; i < vm.data.length; i++){
							// console.log(vm.data[i].tags);
							var tagList = vm.data[i].tags;
							if (tagList.indexOf(tag) >= 0) {
								vm.tagContent[tag].push(vm.data[i]);
							}
						}
						vm.sortedTags.push([tag, vm.tagSet[tag]]);
						if (vm.tagSet[tag] >= 15) {
							vm.selectTags.push([tag,vm.tagSet[tag]]);
						}
					}
					vm.sortedTags.sort(function(a,b){return b[1]-a[1];});
					vm.selectTags.sort(function(a,b){return b[1] - a[1];});
				}			
				vm.probListArray =  chunk(vm.data, parseInt(vm.select));
				vm.probList = vm.probListArray[vm.page];
			})

		$http.get('/users/getUser')
			.then(function(response){
				// console.log(response.data);
				vm.user = response.data;
			})
		
		vm.goto = function(url){
			$window.open(url);
		}
		
		vm.selectProb = function(prob){
			vm.prob = prob;
			vm.prob.contents = []
			for (var i = 0 ; i < vm.prob.content.length; i++){
				vm.prob.contents[i] = $sce.trustAsHtml(vm.prob.content[i])
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
			if (predicate === 'difficulty') {
				vm.reverse = (vm.predicate === vm.sortDifficulty ? !vm.reverse: false);
				vm.predicate = vm.sortDifficulty;
			}
			else if (predicate === 'finish'){
				vm.reverse = (vm.predicate === vm.sortFinish ? !vm.reverse: false);
				vm.predicate = vm.sortFinish;
			}
			else{
				vm.reverse = (vm.predicate === predicate) ? !vm.reverse : false;
				vm.predicate = predicate;
			}
		}

		vm.goNextPage = function(){
			if(vm.page < vm.probListArray.length-1){
				vm.page += 1;
			}
			vm.probList = vm.probListArray[vm.page];
		}

		vm.goPreviousPage = function(){
			vm.page -= 1;
			if(vm.page < 0){
				vm.page = 0;
			}
			vm.probList = vm.probListArray[vm.page];
		}

		vm.rePage = function(data){
			vm.probListArray =  chunk(data, parseInt(vm.select));
			vm.page = 0;
			vm.probList = vm.probListArray[vm.page];
		}

		vm.marked = function(){
			vm.user.questions[vm.prob.title].status = !vm.user.questions[vm.prob.title].status;
			$http.post('/users/mark',{user: vm.user, prob: vm.user.questions}).then(function(err){
				if (err) {
					vm.user.questions[vm.prob.title].status = !vm.user.questions[vm.prob.title].status;
				}
				
			});
		}

		vm.showTag = function(){
			vm.tag = !vm.tag;
		}

		vm.showRelated = function(){
			vm.related = !vm.related;
		}
		
		vm.readMore = function(){
			vm.showTags = !vm.showTags;
		}

		vm.displayByTag = function(tagTitle){
			vm.rePage(vm.tagContent[tagTitle]);
		}

		vm.sortDifficulty = function(prob){
			if (prob.difficulty === 'Easy') {
				return 1;
			}
			else if(prob.difficulty === 'Medium'){
				return 2;
			}
			else{
				return 3;
			}
		}

		vm.sortFinish = function(prob){
			if (vm.user.questions[prob.title].status === true ) {
				return 1;
			}
			else{
				return 2;
			}
		}

		$scope.$watch("vm.user.questions[vm.prob.title].note",function(newVal, oldVal){
			if (newVal !== oldVal) {
				// console.log(newVal);
				vm.user.questions[vm.prob.title].note = newVal;
				$http.post('/users/mark',{user: vm.user, prob: vm.user.questions}).then(function(err){
				});
			}
		});
	}
}());