angular.module('main', [])

.directive('paintangular', function() {
	
	return {
		restrict: 'E',
		replace: true,
		scope: {},

		controller: ['$scope', function($scope) {
			$scope.color = 'black'; // default stroke color
			$scope.tools = 'pencil';
			$scope.size = 2;

			$scope.setColor = function(c) {
				$scope.color = c;
				console.log(c);
			}

			$scope.setTool = function(t) {
				$scope.tool = t;
				console.log(t);
			}

			$scope.chooseSize = function(s) {
				$scope.size = s;
				console.log(s);
			}			
		}],

		templateUrl: "template.html"
    	
	}
})

