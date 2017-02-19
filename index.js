angular.module('app',[])
.controller("MainCtrl", ['$scope', '$filter', 'fetchGitHubUser', function($scope, $filter, fetchGitHubUser){
	function initVariables(){
		$scope.newUser = {};
		$scope.users = [];
		// $scope.filter = {};
	}
	function initFunctions(){
		$scope.addUser = function(user){
			fetchGitHubUser(user, function(response){
				console.log(response);
				if(response && response.status=== 200 && response.data){
					$scope.newUser.login = "";
					$scope.newUser.key = "";
					var user = response.data;
					var allUsers = $scope.users;
					allUsers[allUsers.length] = {
						"id" : user.id,
						"name" : user.name || user.login,
						"followers" : user.followers,
						"location" : user.location || 'Not Known',
						"profile" : user.html_url,
						"image" : user.avatar_url
					}
				}
				if(response && response.status === 404){
					alert("User not found");
				}
			})
		}
		$scope.goToProfile = function(index){
			window.open($scope.users[index].profile, "_blank");
		}
		$scope.changeFilter = function(filter, reverse){
			$scope.newUser.key = filter;
			$scope.users = $filter('orderBy')($scope.users, filter, reverse);
		}
		$scope.removeUser = function(index, e){
			e.stopPropagation();
			// e.cancelBubble = true;
			$scope.users.splice(index, 1);
		}
	}
	initVariables();
	initFunctions();
}])
.factory('fetchGitHubUser', ['$http', function($http){
	return function(requestObj, callBack){
		var url = "https://api.github.com/users/" + requestObj.login;
		$http.get(url, {})
		.then(function(response){
			callBack(response);
		},
		function(response){
			callBack(response);
		})
	}
}]);